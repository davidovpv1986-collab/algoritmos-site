# Алгоритмос — официальный сайт

Монорепозиторий сайта российской ИТ-компании полного цикла «Алгоритмос».
**Результат через технологии.**

![Алгоритмос](frontend/public/og.png)

## Архитектура: фронтенд и бэкенд разделены

```
algoritmos-site/
├── frontend/   # Статический сайт: Next.js 15 (output: export), Tailwind, Three.js
│               # → собирается в чистый HTML/CSS/JS (frontend/out/)
├── backend/    # API-сервис: Node.js + Express + TypeScript
│               # → приём заявок, валидация, отправка на почту (SMTP)
├── deploy/     # nginx: TLS, HSTS, CSP, прокси API
└── .github/    # CI: typecheck + сборка + npm audit
```

Фронтенд не зависит от рантайма Node.js и разворачивается на любом статическом
хостинге. Бэкенд — отдельный процесс с единственной зоной ответственности:
приём заявок с формы и их безопасная отправка на почту компании.

```
Браузер ──► frontend (статика, CDN/nginx)
            │
            └── POST /api/leads ──► backend (Express) ──► SMTP ──► info@algorithmos.ru
                                        │
                                        └── резерв: data/leads.jsonl (если SMTP недоступен)
```

## Быстрый старт

Нужен Node.js ≥ 18.18.

```bash
# 1. Backend
cd backend
cp .env.example .env        # вписать SMTP_* (можно позже — заявки сохранятся в leads.jsonl)
npm install
npm run dev                 # http://localhost:4000

# 2. Frontend (в соседнем терминале)
cd frontend
cp .env.example .env.local  # NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev                 # http://localhost:9020
```

Production:

```bash
npm run build               # из корня: собирает оба пакета
# frontend/out/  → любой статический хостинг (nginx, GitHub Pages, S3, CDN)
# backend/dist/  → Node.js-сервер: npm run start:backend
```

## Пакеты

| Пакет | Стек | Документация |
| --- | --- | --- |
| [`frontend/`](frontend/README.md) | Next.js 15 · TypeScript · Tailwind · Three.js | Секции, SEO, 3D, аналитика |
| [`backend/`](backend/README.md) | Node.js · Express · TypeScript · Zod | API, переменные, безопасность |

## Переменные окружения

**Backend** (`backend/.env`): `SMTP_*`, `MAIL_TO`, `SITE_URL`, `PORT`, `HOST` (по умолчанию `127.0.0.1`), `TRUST_PROXY`, `FRONTEND_URL`.
**Frontend** (`frontend/.env.local`): `NEXT_PUBLIC_API_URL` (обязателен в production-сборке), `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_YM_ID`.

Секреты живут только на сервере: `.env*` в `.gitignore`, в репозитории — только шаблоны `.env.example`.

## Безопасность

- HTTPS + HSTS, CSP, `X-Frame-Options`, `nosniff`, `Permissions-Policy` — шаблоны в [`deploy/`](deploy/).
- Заявки: Zod, honeypot, антибот по времени заполнения, заголовок `X-Requested-With`, rate-limit, экранирование писем, без CR/LF в полях.
- Бэкенд слушает localhost; `X-Forwarded-For` учитывается только при `TRUST_PROXY=true`.
- Яндекс.Метрика — после согласия (152-ФЗ), без Webvisor. Шрифты со своего домена.
- Контакты по уязвимостям: [info@algorithmos.ru](mailto:info@algorithmos.ru) (RFC 9116: `/.well-known/security.txt`).

## Контакты

ООО «Алгоритмос» · Уфа, Республика Башкортостан
[info@algorithmos.ru](mailto:info@algorithmos.ru) · +7 (919) 152-18-62

© Алгоритмос. Все права защищены.
