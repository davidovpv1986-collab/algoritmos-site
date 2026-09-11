import Reveal from "@/components/ui/Reveal";

const reasons = [
  {
    title: "Сильная команда и широкая экспертиза",
    description:
      "Инженеры, дизайнеры, маркетологи, аналитики и менеджеры проектов с многолетним опытом.",
  },
  {
    title: "Полный цикл ИТ-решений",
    description:
      "От разработки ПО до внедрения ИИ и обеспечения безопасности.",
  },
  {
    title: "Прозрачность процессов",
    description:
      "Открытая коммуникация и понятные этапы работы на всех уровнях сотрудничества.",
  },
  {
    title: "Безопасность и доверие",
    description: "Защищаем данные клиентов и их бизнес.",
  },
  {
    title: "Клиент в центре",
    description:
      "Слушаем, понимаем и создаём решения, которые работают на цели клиента.",
  },
  {
    title: "Индивидуальный подход",
    description: "Решения под уникальные задачи каждого клиента.",
  },
  {
    title: "Соответствие стандартам",
    description:
      "Требования российского рынка и международные нормы качества.",
  },
  {
    title: "Инновационный дух",
    description:
      "Agile, Scrum и DevOps — гибкость, скорость и эффективность проектов.",
  },
  {
    title: "Единое окно к цифровым услугам",
    description:
      "Упрощаем путь к цифровой трансформации и устойчивому росту.",
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="bg-deep py-16 sm:py-24">
      <div className="container">
        <Reveal className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Почему мы
          </p>
          <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
            Экспертность. Структура. Надёжность.
          </h2>
          <p className="mt-4 text-base text-muted sm:text-lg">
            Девять причин доверить нам цифровую трансформацию вашего бизнеса.
          </p>
        </Reveal>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <li key={reason.title} className="h-full">
              <Reveal delay={(index % 3) * 90} className="h-full">
                <div className="flex h-full gap-4 rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-aqua/60">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary"
                  />
                  <div>
                    <h3 className="text-base font-bold leading-snug text-foreground">
                      {reason.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
