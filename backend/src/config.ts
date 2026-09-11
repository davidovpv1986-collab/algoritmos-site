import "dotenv/config";

/** Список разрешённых источников для CORS. */
const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:9020")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const config = {
  port: Number(process.env.PORT ?? 4000),
  bitrixWebhookUrl: process.env.BITRIX_WEBHOOK_URL ?? "",
  allowedOrigins,
  /** Лимит заявок с одного IP: 10 за 10 минут */
  rateLimit: { windowMs: 10 * 60 * 1000, max: 10 },
} as const;
