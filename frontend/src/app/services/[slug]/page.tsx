import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { getServiceBySlug, services } from "@/data/services";
import { siteConfig } from "@/data/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/* Все страницы услуг генерируются статически при сборке */
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.excerpt,
    alternates: { canonical: `/services/${service.slug}/` },
    openGraph: {
      title: `${service.title} — ${siteConfig.name}`,
      description: service.excerpt,
      url: `${siteConfig.url}/services/${service.slug}/`,
      type: "article",
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const index = services.findIndex((item) => item.slug === service.slug);
  const prev = services[(index - 1 + services.length) % services.length];
  const next = services[(index + 1) % services.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: { "@id": `${siteConfig.url}/#organization` },
        areaServed: ["RU", "BY", "KZ"],
        url: `${siteConfig.url}/services/${service.slug}/`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Услуги",
            item: `${siteConfig.url}/#services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: `${siteConfig.url}/services/${service.slug}/`,
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-base">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Шапка страницы */}
      <section className="relative isolate overflow-hidden bg-deep pb-12 pt-[calc(6.5rem+env(safe-area-inset-top))] sm:pb-14 md:pt-[calc(9rem+env(safe-area-inset-top))]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 82% 18%, rgb(45 168 164 / 0.16), transparent 42%)",
          }}
        />
        <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 opacity-30" />
        <div className="container">
          <nav aria-label="Хлебные крошки" className="text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  Главная
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/#services" className="transition-colors hover:text-foreground">
                  Услуги
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">
                {service.title}
              </li>
            </ol>
          </nav>

          <div className="mt-8 flex items-start gap-5">
            <span className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary sm:flex">
              <ServiceIcon name={service.icon} className="h-8 w-8" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Направление {String(index + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
              </p>
              <h1 className="mt-3 max-w-3xl text-[1.7rem] font-black leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {service.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Содержание */}
      <section className="py-14 sm:py-20">
        <div className="container grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 className="text-xl font-bold text-foreground">Что мы делаем</h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              {service.description}
            </p>

            <h2 className="mt-10 text-xl font-bold text-foreground">Состав услуги</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 text-sm text-foreground"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="shrink-0 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={120}>
            <div className="rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/12 to-transparent p-5 sm:p-7 lg:sticky lg:top-28">
              <h2 className="text-xl font-bold text-foreground">Результат для вас</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {service.outcome}
              </p>
              <Link
                href="/#contacts"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-deep transition-all duration-200 hover:-translate-y-0.5 hover:bg-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Обсудить задачу
              </Link>
              <p className="mt-4 text-center text-xs leading-relaxed text-muted">
                Или напишите нам:{" "}
                <a
                  href={siteConfig.contacts.emailHref}
                  className="text-foreground transition-colors hover:text-primary"
                >
                  {siteConfig.contacts.email}
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Переключение между направлениями */}
      <nav aria-label="Другие услуги" className="border-t border-line bg-deep">
        <div className="container grid gap-px overflow-hidden py-0 sm:grid-cols-2">
          <Link
            href={`/services/${prev.slug}`}
            className="group min-h-[5.5rem] px-1 py-6 transition-colors hover:bg-surface sm:px-6 sm:py-7"
          >
            <span className="text-xs uppercase tracking-[0.18em] text-muted">
              ← Предыдущее направление
            </span>
            <span className="mt-2 block text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg">
              {prev.title}
            </span>
          </Link>
          <Link
            href={`/services/${next.slug}`}
            className="group min-h-[5.5rem] px-1 py-6 text-left transition-colors hover:bg-surface sm:px-6 sm:py-7 sm:text-right"
          >
            <span className="text-xs uppercase tracking-[0.18em] text-muted">
              Следующее направление →
            </span>
            <span className="mt-2 block text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg">
              {next.title}
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
