import { Router } from "express";
import rateLimit from "express-rate-limit";

import { config } from "../config.js";
import { leadSchema } from "../lib/lead-schema.js";
import {
  isMailConfigured,
  sendAutoReplyEmail,
  sendLeadEmail,
} from "../lib/mailer.js";
import { saveLeadToFile } from "../lib/leads-store.js";

const SUCCESS_MESSAGE =
  "Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.";

/** Защита от накрутки: не более 10 заявок за 10 минут с одного IP. */
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
  const parsed = leadSchema.safeParse(req.body);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => issue.message)
      .join("\n");
    res.status(400).json({ ok: false, message });
    return;
  }

  const payload = parsed.data;

  /* Honeypot: бот заполнил скрытое поле — отвечаем «успехом»,
     ничего не отправляя и не сохраняя. */
  if (payload.company && payload.company.trim().length > 0) {
    res.status(200).json({ ok: true, message: SUCCESS_MESSAGE });
    return;
  }

  /* SMTP ещё не настроен — складываем заявку в резервный файл,
     чтобы не потерять клиента до подключения почты. */
  if (!isMailConfigured()) {
    const file = await saveLeadToFile(payload);
    console.warn(`SMTP не настроен — заявка сохранена в ${file} (${payload.email})`);
    res.status(200).json({ ok: true, message: SUCCESS_MESSAGE });
    return;
  }

  const result = await sendLeadEmail(payload);

  if (!result.ok) {
    /* Почта недоступна — заявку всё равно сохраняем и не теряем лид,
       но громко логируем, чтобы администратор заметил сбой. */
    const file = await saveLeadToFile(payload);
    console.error(
      `Письмо не ушло (${result.reason}) — заявка сохранена в ${file} (${payload.email})`,
    );
  } else {
    console.log(`Заявка отправлена на ${config.mailTo} (${payload.email})`);

    /* Автоответ клиенту: подтверждение получения заявки.
       Его сбой не влияет на заявку — только логируем. */
    const autoReply = await sendAutoReplyEmail(payload);
    if (!autoReply.ok) {
      console.error(`Автоответ клиенту не ушёл (${payload.email})`);
    }
  }

  res.status(200).json({ ok: true, message: SUCCESS_MESSAGE });
});
