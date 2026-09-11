"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/ui/Logo";
import { navLinks, siteConfig } from "@/data/site";
import { reachGoal, goals } from "@/lib/analytics";

/** Секции, за которыми следит подсветка активного пункта меню. */
const sectionIds = navLinks
  .map((link) => link.href.split("#")[1])
  .filter(Boolean);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Подсветка пункта меню для видимой секции */
  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const id of sectionIds) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [isHome]);

  /* Блокируем прокрутку фона при открытом мобильном меню */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  /* Смена страницы закрывает меню */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const linkClass = (href: string) => {
    const id = href.split("#")[1];
    const active = isHome && activeSection === id;
    return `transition-colors duration-200 hover:text-foreground ${
      active ? "text-foreground" : ""
    }`;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] transition-colors duration-300 ${
        scrolled || isMenuOpen
          ? "border-line/70 bg-deep/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container flex h-14 items-center justify-between gap-3 sm:h-16 sm:gap-6 md:h-20">
        <Link
          href="/"
          aria-label="Алгоритмос — на главную"
          className="min-w-0 shrink text-light transition-opacity hover:opacity-85"
          onClick={() => setIsMenuOpen(false)}
        >
          <Logo className="h-6 w-auto max-w-[min(52vw,11.5rem)] sm:h-7 sm:max-w-none md:h-8" />
        </Link>

        <nav aria-label="Основная навигация" className="hidden items-center gap-7 text-sm text-muted lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
              <span
                aria-hidden="true"
                className={`mx-auto mt-0.5 block h-0.5 w-4 rounded-full bg-primary transition-opacity duration-200 ${
                  isHome && activeSection === link.href.split("#")[1]
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={siteConfig.contacts.phoneHref}
            aria-label={`Позвонить ${siteConfig.contacts.phone}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-foreground transition-colors hover:border-primary/50 hover:text-primary sm:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </a>
          <Link
            href="/#contacts"
            onClick={() => reachGoal(goals.ctaClick)}
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-deep transition-all duration-200 hover:-translate-y-0.5 hover:bg-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline-flex"
          >
            Обсудить проект
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-foreground transition-colors hover:border-primary/50 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          aria-label="Мобильная навигация"
          className="max-h-[calc(100svh-3.5rem-env(safe-area-inset-top))] overflow-y-auto border-t border-line/70 bg-deep/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
        >
          <div className="container flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="min-h-12 rounded-lg px-3 py-3.5 text-base text-foreground transition-colors hover:bg-surface"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contacts"
              className="mt-2 min-h-12 rounded-full bg-primary px-5 py-3.5 text-center text-sm font-bold text-deep"
              onClick={() => {
                reachGoal(goals.ctaClick);
                setIsMenuOpen(false);
              }}
            >
              Обсудить проект
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
