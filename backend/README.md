# Backend — API сайта «Алгоритмос»

Отдельный API-сервис на Node.js + Express + TypeScript. Единственная задача —
безопасный приём заявок с формы сайта и их передача в Bitrix24.

## API

### `POST /api/leads`

Создаёт лид в Bitrix24.

```json
{
  "name": "Иван",
  "email": "ivan@company.ru",
  "message": "Нужен корпоративный портал",
  "utm_source": "google",
  "utm_campaign": "brand"
}
```

Ответы:

| Код | Ситуация |
| --- | --- |
| `200` | `{ ok: true, message }` — лид создан (или honeypot) |
| `400` | Ошибка валидации полей (Zod) |
| `403` | Источник запроса не разрешён (CORS) |
| `429` | Превышен лимит заявок с IP |
| `502` | Bitrix24 недоступен или вернул ошибку |
| `503` | Не настроен `BITRIX_WEBHOOK_URL` |

### `GET /api/health`

Health-check: `{ "status": "ok" }`.

## Защита

- **Zod-валидация** всех полей с ограничениями длины;
- **honeypot**-поле `company` против ботов (молчаливый ложный успех);
- **rate limit**: 10 заявок за 10 минут с одного IP;
- **CORS** только с адресов из `FRONTEND_URL`;
- **helmet** — безопасные HTTP-заголовки;
- тело запроса до 10 КБ; таймаут запроса к Bitrix24 — 10 с;
- адрес вебхука Bitrix24 существует только на сервере;
- ошибки наружу отдаются без внутренних деталей.

## Команды

```bash
npm run dev        # разработка с hot-reload (tsx watch)
npm run build      # компиляция TypeScript в dist/
npm start          # node dist/index.js
npm run typecheck  # проверка типов
```

## Переменные окружения (`.env`)

| Переменная | Назначение | По умолчанию |
| --- | --- | --- |
| `BITRIX_WEBHOOK_URL` | Вебхук Bitrix24 `crm.lead.add` | — (обязательна) |
| `PORT` | Порт API-сервера | `4000` |
| `FRONTEND_URL` | Разрешённые источники CORS (через запятую) | `http://localhost:9020` |

## Деплой

Любой Node.js ≥ 18.18 рантайм: VPS (`pm2 start dist/index.js`), Docker,
Timeweb Cloud, Amvera и т.п. Перед бэкендом рекомендуется reverse-proxy
(nginx) с TLS.

```
server {
  listen 443 ssl;
  server_name api.algorithmos.ru;
  location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_set_header X-Forwarded-For $remote_addr;
  }
}
```
