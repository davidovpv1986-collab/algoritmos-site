import Link from "next/link";

import Logo from "@/components/ui/Logo";
import { navLinks, siteConfig } from "@/data/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { contacts } = siteConfig;

  return (
    <footer className="border-t border-line bg-deep">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" aria-label="Алгоритмос — на главную" className="inline-block text-light">
              <Logo className="h-8 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {siteConfig.slogan}. Цифровые решения полного цикла для бизнеса
              и госсектора.
            </p>
          </div>

          <nav aria-label="Навигация в подвале" className="md:col-span-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Разделы
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Контакты
            </h2>
            <address className="mt-4 text-sm not-italic text-muted">
              <p>
                <a
                  href={contacts.emailHref}
                  className="text-foreground transition-colors hover:text-primary"
                >
                  {contacts.email}
                </a>
              </p>
              <p className="mt-2">
                <a
                  href={contacts.phoneHref}
                  className="text-foreground transition-colors hover:text-primary"
                >
                  {contacts.phone}
                </a>
              </p>
              <p className="mt-2">{contacts.office}</p>
            </address>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line/60 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} {siteConfig.legalName}. Все права защищены.</p>
          <Link
            href="/privacy"
            className="transition-colors hover:text-foreground"
          >
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}
