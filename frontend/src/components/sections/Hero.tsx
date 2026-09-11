import Link from "next/link";

import OrbitSceneLazy from "@/components/three/OrbitSceneLazy";
import { siteConfig } from "@/data/site";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-deep pt-16 md:pt-20"
    >
      {/* Фон: мягкое свечение + модульная сетка */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 76% 42%, rgb(45 168 164 / 0.14), transparent 40%), linear-gradient(102deg, rgb(5 18 26) 0 42%, rgb(7 34 48) 42% 100%)",
        }}
      />
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 opacity-35" />
      <div
        aria-hidden="true"
        className="absolute -bottom-[22%] -right-[10%] -z-10 h-[44%] w-[70%] rounded-full bg-aqua/15 blur-[90px]"
      />

      {/* 3D-сцена */}
      <div className="absolute bottom-auto right-[-30%] top-16 z-0 h-[52svh] min-h-[380px] w-[100%] opacity-70 md:top-20 lg:bottom-0 lg:right-[-6%] lg:h-auto lg:min-h-[480px] lg:w-[66%] lg:opacity-100">
        <OrbitSceneLazy />
      </div>

      <div className="container relative z-10 w-full pb-14 pt-[42svh] lg:py-24">
        <div className="max-w-[640px]">
          <p className="mb-6 inline-flex items-center rounded-full border border-primary/50 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-light">
            {siteConfig.slogan}
          </p>
          <h1 className="text-4xl font-black leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-[64px]">
            Сложные цифровые системы без компромиссов.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Берём в работу продукт целиком: от стратегии и UX до архитектуры,
            разработки и роста после запуска.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#contacts"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-deep transition-all duration-200 hover:-translate-y-0.5 hover:bg-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Запустить проект
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center justify-center rounded-full border border-line px-7 py-3.5 text-sm font-bold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-muted hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Наши услуги
            </Link>
          </div>
        </div>

        {/* Панель показателей */}
        <dl className="mt-12 grid w-full max-w-[640px] grid-cols-1 rounded-2xl border border-line/80 bg-deep/70 backdrop-blur-lg sm:grid-cols-3 lg:mt-16">
          {siteConfig.stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex items-center gap-3 px-5 py-4 sm:block sm:px-6 sm:py-5 ${
                index > 0
                  ? "border-t border-line/70 sm:border-l sm:border-t-0"
                  : ""
              }`}
            >
              <dt className="order-2 text-xs leading-snug text-muted sm:order-none sm:mt-2 sm:block">
                {stat.label}
              </dt>
              <dd className="min-w-[64px] text-2xl font-black leading-none text-light sm:text-3xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-muted">
          {siteConfig.geography.join(" · ")}
        </p>
      </div>
    </section>
  );
}
