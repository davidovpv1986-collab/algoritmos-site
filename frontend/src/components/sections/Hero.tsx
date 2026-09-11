import Link from "next/link";

import OrbitSceneLazy from "@/components/three/OrbitSceneLazy";
import { siteConfig } from "@/data/site";

export default function Hero() {
  return (
    <section
      id="home"
      className="hero-section relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-deep pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+env(safe-area-inset-top))] md:pt-[calc(5rem+env(safe-area-inset-top))] lg:flex-row lg:items-center"
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

      {/* 3D: на телефоне — компактная полоса сверху, на десктопе — фон справа */}
      <div className="hero-visual relative z-0 mx-auto h-[min(34svh,220px)] w-full max-w-md shrink-0 opacity-75 sm:h-[min(38svh,280px)] sm:max-w-lg lg:absolute lg:bottom-0 lg:right-[-6%] lg:top-20 lg:mx-0 lg:h-auto lg:min-h-[480px] lg:max-w-none lg:w-[66%] lg:opacity-100">
        <OrbitSceneLazy />
      </div>

      <div className="container relative z-10 w-full pb-10 pt-3 sm:pb-14 sm:pt-5 lg:py-24">
        <div className="max-w-[640px]">
          <p className="mb-4 inline-flex max-w-full items-center rounded-full border border-primary/50 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-light sm:mb-6 sm:px-4 sm:text-[11px] sm:tracking-[0.14em]">
            {siteConfig.slogan}
          </p>
          <h1 className="text-[1.7rem] font-black leading-[1.12] tracking-tight text-foreground sm:text-4xl sm:leading-[1.08] lg:text-[64px] lg:leading-[1.04]">
            Сложные цифровые системы без компромиссов.
          </h1>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted sm:mt-6 sm:text-lg">
            Берём в работу продукт целиком: от стратегии и UX до архитектуры,
            разработки и роста после запуска.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Link
              href="#contacts"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-deep transition-all duration-200 hover:-translate-y-0.5 hover:bg-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
            >
              Запустить проект
            </Link>
            <Link
              href="#services"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-line px-7 py-3.5 text-sm font-bold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-muted hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
            >
              Наши услуги
            </Link>
          </div>
        </div>

        {/* Панель показателей */}
        <dl className="mt-8 grid w-full max-w-[640px] grid-cols-1 overflow-hidden rounded-2xl border border-line/80 bg-deep/70 backdrop-blur-lg sm:mt-12 sm:grid-cols-3 lg:mt-16">
          {siteConfig.stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex items-center gap-3 px-4 py-3.5 sm:block sm:px-6 sm:py-5 ${
                index > 0
                  ? "border-t border-line/70 sm:border-l sm:border-t-0"
                  : ""
              }`}
            >
              <dt className="order-2 min-w-0 text-xs leading-snug text-muted sm:order-none sm:mt-2 sm:block">
                {stat.label}
              </dt>
              <dd className="min-w-[56px] text-xl font-black leading-none text-light sm:text-2xl md:text-3xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-[10px] uppercase tracking-[0.16em] text-muted sm:mt-8 sm:text-[11px] sm:tracking-[0.18em]">
          {siteConfig.geography.join(" · ")}
        </p>
      </div>
    </section>
  );
}
