import { createApp } from "./app.js";
import { config } from "./config.js";

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`algoritmos-backend слушает порт ${config.port}`);
  console.log(`CORS: ${config.allowedOrigins.join(", ")}`);
  if (!config.bitrixWebhookUrl) {
    console.warn("ВНИМАНИЕ: BITRIX_WEBHOOK_URL не задан — заявки не будут создаваться в CRM");
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
