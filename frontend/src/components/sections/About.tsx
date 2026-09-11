import Reveal from "@/components/ui/Reveal";

const facts = [
  { value: "300+", label: "лет опыта команды" },
  { value: "10x", label: "снижение рисков" },
  { value: "70%+", label: "ускорение процессов" },
  { value: "3", label: "страны: Россия, Беларусь, Казахстан" },
];

export default function About() {
  return (
    <section id="about" className="bg-base py-14 sm:py-24">
      <div className="container">
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              О компании
            </p>
            <h2 className="text-[1.65rem] font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Синергия технологий и стратегического подхода
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              «Алгоритмос» — российская ИТ-компания, объединяющая экспертов с
              глубокими знаниями и многолетним опытом в индустрии технологий.
              Помогаем бизнесу и госсектору достигать измеримых результатов
              через технологии. Строим масштабируемые решения, которые упрощают
              процессы, снижают TCO и повышают скорость вывода продукта на
              рынок.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              Создаём единое окно к цифровым услугам: превращаем задачи клиентов
              в надёжные решения, которые упрощают путь к технологической
              трансформации и устойчивому росту.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={120}>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {facts.map((item) => (
                <div key={item.label} className="bg-surface p-4 sm:p-6">
                  <dd className="block text-2xl font-black text-light sm:text-3xl">
                    {item.value}
                  </dd>
                  <dt className="mt-2 block text-xs leading-snug text-muted">
                    {item.label}
                  </dt>
                </div>
              ))}
            </dl>
            <div className="mt-5 rounded-2xl border border-line bg-surface p-6">
              <p className="text-sm leading-relaxed text-muted">
                <span className="font-bold text-foreground">Архетип бренда:</span>{" "}
                «Мудрец» с чертами «Правителя» — эксперты, которые упорядочивают
                хаос и выстраивают надёжные системы для клиентов.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
