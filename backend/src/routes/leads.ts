import { Router } from "express";
import rateLimit from "express-rate-limit";

import { config } from "../config.js";
import { isSuspiciousTiming, leadSchema } from "../lib/lead-schema.js";
import {
  isMailConfigured,
  sendAutoReplyEmail,
  sendLeadEmail,
} from "../lib/mailer.js";
import { saveLeadToFile } from "../lib/leads-store.js";
import { redactEmail } from "../lib/sanitize.js";

const SUCCESS_MESSAGE =
  "Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.";

const leadLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message:
      "Слишком много заявок подряд. Попробуйте через несколько минут или позвоните нам.",
  },
});

export const leadsRouter = Router();

leadsRouter.post("/leads", leadLimiter, async (req, res) => {
  if (req.get("X-Requested-With") !== "XMLHttpRequest") {
    res.status(403).json({ ok: false, message: "Источник запроса не разрешён" });
    return;
  }

  const parsed = leadSchema.safeParse(req.body);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => issue.message)
      .join("\n");
    res.status(400).json({ ok: false, message });
    return;
  }

  const payload = parsed.data;

  if (payload.company && payload.company.trim().length > 0) {
    res.status(200).json({ ok: true, message: SUCCESS_MESSAGE });
    return;
  }

  if (isSuspiciousTiming(payload.startedAt)) {
    res.status(200).json({ ok: true, message: SUCCESS_MESSAGE });
    return;
  }

  const who = redactEmail(payload.email);

  if (!isMailConfigured()) {
    const file = await saveLeadToFile(payload);
    console.warn(`SMTP не настроен — заявка сохранена в ${file} (${who})`);
    res.status(200).json({ ok: true, message: SUCCESS_MESSAGE });
    return;
  }

  const result = await sendLeadEmail(payload);

  if (!result.ok) {
    const file = await saveLeadToFile(payload);
    console.error(
      `Письмо не ушло (${result.reason}) — заявка сохранена в ${file} (${who})`,
    );
  } else {
    console.log(`Заявка отправлена на ${config.mailTo} (${who})`);

    const autoReply = await sendAutoReplyEmail(payload);
    if (!autoReply.ok) {
      console.error(`Автоответ клиенту не ушёл (${who})`);
    }
  }

  res.status(200).json({ ok: true, message: SUCCESS_MESSAGE });
});
