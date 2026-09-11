"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { z } from "zod";

import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";
import { submitLead } from "@/lib/api";
import { reachGoal, goals } from "@/lib/analytics";

/** Клиентская валидация повторяет серверную — мгновенная обратная связь. */
const leadSchema = z.object({
  name: z.string().trim().min(1, "Укажите имя").max(120),
  email: z.string().trim().email("Некорректный email").max(200),
  message: z.string().trim().min(1, "Сообщение не может быть пустым").max(5000),
});

type FormStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const contactItems = [
  {
    label: "Телефон",
    value: siteConfig.contacts.phone,
    href: siteConfig.contacts.phoneHref,
    note: siteConfig.contacts.phoneNote,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: "Email",
    value: siteConfig.contacts.email,
    href: siteConfig.contacts.emailHref,
    note: siteConfig.contacts.emailNote,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "Офис",
    value: siteConfig.contacts.office,
    href: siteConfig.url,
    note: siteConfig.contacts.officeNote,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

export default function Contacts() {
  const [status, setStatus] = useState<FormStatus>({ state: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const goalSentRef = useRef(false);

  /* Цель «переход к контактам» — один раз при появлении секции */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !goalSentRef.current) {
          goalSentRef.current = true;
          reachGoal(goals.contactsView);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /* Переносим UTM-метки из адресной строки в скрытые поля формы */
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const params = new URLSearchParams(window.location.search);
    for (const key of UTM_KEYS) {
      const input = form.elements.namedItem(key) as HTMLInputElement | null;
      const value = params.get(key);
      if (input && value) input.value = value;
    }
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const fields = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    /* Мгновенная проверка на клиенте до обращения к API */
    const parsed = leadSchema.safeParse(fields);
    if (!parsed.success) {
      setStatus({
        state: "error",
        message: parsed.error.issues.map((issue) => issue.message).join("\n"),
      });
      return;
    }

    reachGoal(goals.formOpen);
    setStatus({ state: "submitting" });

    /* Собираем payload: проверенные поля + honeypot + UTM-метки */
    const payload = {
      ...parsed.data,
      company: String(data.get("company") ?? ""),
      ...Object.fromEntries(
        UTM_KEYS.map((key) => [key, String(data.get(key) ?? "")]),
      ),
    };

    try {
      const result = await submitLead(payload);
      if (result.ok) {
        form.reset();
        reachGoal(goals.leadSuccess);
        setStatus({ state: "success", message: result.message });
      } else {
        setStatus({ state: "error", message: result.message });
      }
    } catch {
      setStatus({
        state: "error",
        message:
          "Не удалось связаться с сервером. Проверьте соединение или позвоните нам.",
      });
    }
  };

  const isSubmitting = status.state === "submitting";

  return (
    <section id="contacts" ref={sectionRef} className="bg-base py-16 sm:py-24">
      <div className="container">
        <Reveal className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Контакты
          </p>
          <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
            Обсудим вашу задачу
          </h2>
          <p className="mt-4 text-base text-muted sm:text-lg">
            Расскажите о проекте — предложим решение и оценим сроки.
          </p>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="space-y-6 lg:col-span-5">
            {contactItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted">
                    {item.label}
                  </h3>
                  <a
                    href={item.href}
                    className="mt-1 block text-lg font-bold text-foreground transition-colors hover:text-primary"
                  >
                    {item.value}
                  </a>
                  <p className="mt-1 text-sm text-muted">{item.note}</p>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal className="lg:col-span-7" delay={120}>
            <form
              ref={formRef}
              onSubmit={onSubmit}
              className="rounded-2xl border border-line bg-surface p-6 sm:p-8"
            >
              {/* UTM-метки передаются в CRM вместе с заявкой */}
              {UTM_KEYS.map((key) => (
                <input key={key} type="hidden" name={key} />
              ))}

              {/* Honeypot: невидимое поле против ботов */}
              <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
                <label>
                  Не заполняйте это поле
                  <input type="text" name="company" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-bold text-foreground">
                    Ваше имя
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Как к вам обращаться"
                    className="w-full rounded-xl border border-line bg-deep px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-bold text-foreground">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@company.ru"
                    className="w-full rounded-xl border border-line bg-deep px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-primary"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="message" className="mb-2 block text-sm font-bold text-foreground">
                  О задаче
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Кратко опишите проект или вопрос"
                  className="w-full resize-none rounded-xl border border-line bg-deep px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-primary"
                />
              </div>

              <div aria-live="polite">
                {(status.state === "success" || status.state === "error") && (
                  <p
                    role="status"
                    className={`mt-4 whitespace-pre-line rounded-xl border px-4 py-3 text-sm ${
                      status.state === "error"
                        ? "border-red-400/40 bg-red-400/10 text-red-200"
                        : "border-primary/40 bg-primary/10 text-light"
                    }`}
                  >
                    {status.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-deep transition-all duration-200 hover:-translate-y-0.5 hover:bg-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? "Отправляем…" : "Отправить заявку"}
              </button>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <a href="/privacy" className="underline decoration-muted/50 underline-offset-2 transition-colors hover:text-foreground">
                  политикой обработки персональных данных
                </a>
                .
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
