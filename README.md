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
│               # → приём заявок, валидация, передача в Bitrix24
└── .github/    # CI: typecheck + сборка обоих пакетов
```

Фронтенд не зависит от рантайма Node.js и разворачивается на любом статическом
хостинге. Бэкенд — отдельный процесс с единственной зоной ответственности:
приём заявок с формы и их безопасная передача в CRM.

```
Браузер ──► frontend (статика, CDN/nginx)
            │
            └── POST /api/leads ──► backend (Express) ──► Bitrix24 webhook
```

## Быстрый старт

Нужен Node.js ≥ 18.18.

```bash
# 1. Backend
cd backend
cp .env.example .env        # вписать BITRIX_WEBHOOK_URL
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

**Backend** (`backend/.env`): `BITRIX_WEBHOOK_URL`, `PORT`, `FRONTEND_URL`.
**Frontend** (`frontend/.env.local`): `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_YM_ID`.

Секреты живут только на сервере: `.env*` в `.gitignore`, в репозитории — только шаблоны `.env.example`.

## Контакты

ООО «Алгоритмос» · Уфа, Республика Башкортостан
[info@algorithmos.ru](mailto:info@algorithmos.ru) · +7 (919) 152-18-62

© Алгоритмос. Все права защищены.
