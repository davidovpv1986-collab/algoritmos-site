import Reveal from "@/components/ui/Reveal";
import { faqItems } from "@/data/faq";

/**
 * FAQ на нативных <details>/<summary> — доступно с клавиатуры
 * и работает даже без JavaScript.
 */
export default function Faq() {
  return (
    <section id="faq" className="bg-base py-14 sm:py-24">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Вопросы и ответы
            </p>
            <h2 className="text-[1.65rem] font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Частые вопросы
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              Собрали ответы на то, что спрашивают чаще всего. Не нашли свой
              вопрос — напишите нам, отвечаем в течение 24 часов.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-8" delay={120}>
            <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
              {faqItems.map((item, index) => (
                <details key={item.question} className="group">
                  <summary className="flex min-h-12 cursor-pointer list-none items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-surface2 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:items-center sm:gap-4 sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
                    <span className="text-xs font-bold text-primary/80">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[0.95rem] font-bold leading-snug text-foreground sm:text-base">
                      {item.question}
                    </span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-45"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </summary>
                  <p className="px-4 pb-5 text-sm leading-relaxed text-muted sm:px-6 sm:pb-6 sm:pl-[52px]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
