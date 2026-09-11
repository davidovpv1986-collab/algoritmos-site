import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* Полностью статический фронтенд: build → out/ (HTML/CSS/JS).
     Форма заявки обращается к отдельному backend API. */
  output: "export",
  /* Каждая страница — каталог с index.html: сайт работает на любом
     статическом хостинге (nginx, GitHub Pages, S3) без rewrite-правил. */
  trailingSlash: true,
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
