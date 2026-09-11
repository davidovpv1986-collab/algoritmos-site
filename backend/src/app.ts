import express from "express";
import cors from "cors";
import helmet from "helmet";

import { config } from "./config.js";
import { leadsRouter } from "./routes/leads.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  /* Безопасные HTTP-заголовки */
  app.use(helmet());

  /* CORS: принимаем запросы только с фронтенда */
  app.use(
    cors({
      origin(origin, callback) {
        // Запросы без Origin (curl, health-checks, server-to-server) пропускаем
        if (!origin || config.allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST"],
      maxAge: 86_400,
    }),
  );

  app.use(express.json({ limit: "10kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "algoritmos-backend" });
  });

  app.use("/api", leadsRouter);

  /* Неизвестные маршруты */
  app.use((_req, res) => {
    res.status(404).json({ ok: false, message: "Маршрут не найден" });
  });

  /* Централизованная обработка ошибок — без утечки внутренних деталей */
  app.use(
    (
      error: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      if (error.message === "Not allowed by CORS") {
        res.status(403).json({ ok: false, message: "Источник запроса не разрешён" });
        return;
      }
      console.error("Unhandled error:", error);
      res.status(500).json({ ok: false, message: "Внутренняя ошибка сервера" });
    },
  );

  return app;
}
