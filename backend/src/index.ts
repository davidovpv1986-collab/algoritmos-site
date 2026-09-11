import { createApp } from "./app.js";
import { config } from "./config.js";
import { isMailConfigured } from "./lib/mailer.js";

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`algoritmos-backend слушает порт ${config.port}`);
  console.log(`CORS: ${config.allowedOrigins.join(", ")}`);
  if (isMailConfigured()) {
    console.log(`Почта: заявки уходят на ${config.mailTo} через ${config.smtp.host}`);
  } else {
    console.warn(
      "ВНИМАНИЕ: SMTP не настроен (SMTP_HOST/SMTP_USER/SMTP_PASS) — " +
        "заявки будут сохраняться в data/leads.jsonl",
    );
  }
});

/* Корректное завершение по сигналам платформы */
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    console.log(`\n${signal}: завершаю работу…`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5_000).unref();
  });
}
