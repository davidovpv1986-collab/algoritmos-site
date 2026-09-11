import Link from "next/link";

import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { services } from "@/data/services";

export default function Services() {
  return (
    <section id="services" className="bg-base py-16 sm:py-24">
      <div className="container">
        <Reveal className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Услуги
          </p>
          <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
            Единое окно к цифровым услугам
          </h2>
          <p className="mt-4 text-base text-muted sm:text-lg">
            Полный спектр ИТ-услуг для поддержки и развития вашего бизнеса на
            каждом этапе. Нажмите на направление, чтобы узнать детали.
          </p>
        </Reveal>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <li key={service.slug} className="h-full">
              <Reveal delay={(index % 3) * 90} className="h-full">
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                      <ServiceIcon name={service.icon} className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-bold text-primary/80">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold leading-snug text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {service.excerpt}
                  </p>
                  <ul className="mt-4 flex flex-wrap content-start gap-2">
                    {service.items.slice(0, 4).map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors duration-300 group-hover:border-primary/30"
                      >
                        {item}
                      </li>
                    ))}
                    {service.items.length > 4 && (
                      <li className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                        +{service.items.length - 4}
                      </li>
                    )}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-primary">
                    Подробнее
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
