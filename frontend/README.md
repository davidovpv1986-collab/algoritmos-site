# Frontend — сайт «Алгоритмос»

Статический фронтенд на Next.js 15 (App Router, `output: "export"`).
Сборка производит чистый HTML/CSS/JS в `out/` — без Node.js-рантайма.

## Возможности

- **Интерактивный 3D-hero** на Three.js: стеклянный тор-узел, металлическое ядро,
  облако частиц, параллакс за указателем. Пауза в неактивной вкладке,
  сокращение движения при `prefers-reduced-motion`, CSS-постер при отсутствии WebGL.
- **11 посадочных страниц услуг** (`/services/[slug]/`) со статической генерацией,
  хлебными крошками и Schema.org-разметкой.
- **Форма заявки** обращается к backend API (`POST /api/leads`): клиентская
  валидация Zod, honeypot, UTM-метки, статусы отправки.
- **SEO**: метаданные, Open Graph, `sitemap.xml`, `robots.txt`, веб-манифест,
  JSON-LD (`Organization`, `Service`, `BreadcrumbList`).
- **Доступность (WCAG 2.2 AA)**: landmark-области, skip-link, видимый фокус,
  `aria-live` статусы формы.
- **Детали**: прогресс чтения, подсветка активного раздела, бегущая строка
  направлений, reveal-анимации, кнопка «наверх», страница 404.
- **Яндекс.Метрика** (опционально): цели `cta_click`, `form_open`,
  `lead_success`, `contacts_view`.

## Команды

```bash
npm run dev        # разработка на :9020
npm run build      # статический экспорт в out/
npm start          # предпросмотр out/ через serve
npm run typecheck  # проверка типов
```

## Переменные окружения (`.env.local`)

| Переменная | Назначение | По умолчанию |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Адрес backend API для формы | `http://localhost:4000` |
| `NEXT_PUBLIC_SITE_URL` | Базовый URL для canonical, sitemap, OG | `https://algorithmos.ru` |
| `NEXT_PUBLIC_YM_ID` | Счётчик Яндекс.Метрики | не задан |

> Переменные `NEXT_PUBLIC_*` вшиваются в бандл **на этапе сборки** —
> после изменения нужен повторный `npm run build`.

## Деплой

`out/` раздаётся любым статическим хостингом. Благодаря `trailingSlash`
каждая страница — каталог с `index.html`, rewrite-правила не нужны.

- **nginx**: готовый конфиг с TLS и заголовками безопасности — [`deploy/nginx-frontend.conf`](../deploy/nginx-frontend.conf)
- **GitHub Pages / Netlify / Vercel / S3+CDN** — из коробки.

## Структура

```
src/
├── app/
│   ├── page.tsx              # Главная (hero, услуги, подход, FAQ, контакты)
│   ├── services/[slug]/      # Детальные страницы 11 направлений (SSG)
│   ├── privacy/              # Политика конфиденциальности
│   ├── sitemap.ts robots.ts manifest.ts icon.svg
│   └── not-found.tsx         # Фирменная 404
├── components/
│   ├── layout/               # Header, Footer
│   ├── sections/             # Hero, About, Process, Services, WhyUs, Faq, Contacts
│   ├── three/                # 3D-сцена OrbitScene (ленивый импорт)
│   ├── ui/                   # Logo, Reveal, Marquee, BackToTop, ScrollProgress…
│   └── analytics/            # Яндекс.Метрика
├── data/                     # Контент: услуги, контакты, FAQ
└── lib/                      # API-клиент, аналитика
```
