import type { NextConfig } from "next";

if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL обязателен для production-сборки. Иначе в бандл попадёт localhost.",
  );
}

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
