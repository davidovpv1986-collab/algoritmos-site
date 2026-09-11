import "dotenv/config";

/** Список разрешённых источников для CORS. */
const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:9020")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const smtpPort = Number(process.env.SMTP_PORT ?? 465);

export const config = {
  port: Number(process.env.PORT ?? 4000),
  allowedOrigins,
  /** Лимит заявок с одного IP: 10 за 10 минут */
  rateLimit: { windowMs: 10 * 60 * 1000, max: 10 },
  smtp: {
    host: process.env.SMTP_HOST ?? "",
    port: smtpPort,
    /* 465 → SSL сразу, 587/25 → STARTTLS. Можно переопределить явно. */
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : smtpPort === 465,
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
  },
  /** Куда летят заявки */
  mailTo: process.env.MAIL_TO ?? "info@algorithmos.ru",
  /** От чьего имени отправляем (по умолчанию — SMTP_USER) */
  mailFrom: process.env.MAIL_FROM ?? process.env.SMTP_USER ?? "",
} as const;
