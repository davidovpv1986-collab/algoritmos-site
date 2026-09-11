import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { config } from "./config.js";
import { leadsRouter } from "./routes/leads.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxy ? 1 : false);

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: { defaultSrc: ["'none'"] },
      },
      frameguard: { action: "deny" },
      referrerPolicy: { policy: "no-referrer" },
      hsts: { maxAge: 31_536_000, includeSubDomains: true },
    }),
  );

  app.use(
    rateLimit({
      windowMs: 60_000,
      max: 60,
      standardHeaders: true,
      legacyHeaders: false,
      message: { ok: false, message: "Слишком много запросов. Подождите минуту." },
    }),
  );

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || config.allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error("Not allowed by CORS"));
      },
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "X-Requested-With"],
      maxAge: 86_400,
    }),
  );

  app.use(express.json({ limit: "10kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", leadsRouter);

  app.use((_req, res) => {
    res.status(404).json({ ok: false, message: "Маршрут не найден" });
  });

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
      console.error("Unhandled error");
      res.status(500).json({ ok: false, message: "Внутренняя ошибка сервера" });
    },
  );

  return app;
}
