import { Router } from "express";
import rateLimit from "express-rate-limit";

import { config } from "../config.js";
import { leadSchema } from "../lib/lead-schema.js";
import { createBitrixLead } from "../lib/bitrix.js";

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
     не создавая лид и не раскрывая механику защиты. */
  if (payload.company && payload.company.trim().length > 0) {
    res.status(200).json({ ok: true, message: SUCCESS_MESSAGE });
    return;
  }

  if (!config.bitrixWebhookUrl) {
    console.error("BITRIX_WEBHOOK_URL is not configured");
    res.status(503).json({
      ok: false,
      message:
        "Сервис приёма заявок временно недоступен. Свяжитесь с нами по телефону или email.",
    });
    return;
  }

  const result = await createBitrixLead(payload, config.bitrixWebhookUrl);

  if (!result.ok) {
    res.status(502).json({
      ok: false,
      message: "Не удалось отправить заявку. Попробуйте позже или позвоните нам.",
    });
    return;
  }

  console.log(`Lead created in Bitrix24: #${result.leadId} (${payload.email})`);
  res.status(200).json({ ok: true, message: SUCCESS_MESSAGE });
});
