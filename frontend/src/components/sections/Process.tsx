import Reveal from "@/components/ui/Reveal";

const steps = [
  {
    number: "01",
    title: "Исследуем",
    description:
      "Погружаемся в бизнес-задачу, анализируем процессы и находим точку максимальной ценности продукта.",
  },
  {
    number: "02",
    title: "Проектируем",
    description:
      "Формируем UX, архитектуру и дорожную карту. Решение становится понятным до начала разработки.",
  },
  {
    number: "03",
    title: "Запускаем",
    description:
      "Разрабатываем, тестируем и выпускаем продукт. Отвечаем за стабильность релиза и сроки.",
  },
  {
    number: "04",
    title: "Развиваем",
    description:
      "Сопровождаем продукт после запуска: метрики, поддержка, масштабирование и новые возможности.",
  },
];

export default function Process() {
  return (
    <section id="process" className="bg-deep py-14 sm:py-24">
      <div className="container">
        <Reveal className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Подход
          </p>
          <h2 className="text-[1.65rem] font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Системно: от идеи до устойчивого продукта
          </h2>
          <p className="mt-4 text-base text-muted sm:text-lg">
            Собираем нужную команду и отвечаем за результат на каждом этапе.
          </p>
        </Reveal>

        <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.number} className="h-full">
              <Reveal delay={index * 90} className="h-full">
                <div className="h-full bg-surface p-5 transition-colors duration-300 hover:bg-surface2 sm:p-7">
                  <span className="text-3xl font-black text-primary" aria-hidden="true">
                    {step.number}
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
