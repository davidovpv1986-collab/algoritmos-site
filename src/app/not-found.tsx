import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-[80svh] items-center overflow-hidden bg-deep">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgb(45 168 164 / 0.14), transparent 42%)",
        }}
      />
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 opacity-30" />
      <div className="container py-24">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Ошибка 404
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Такой страницы нет. Но алгоритм найти её у нас есть.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Возможно, страница была перемещена или адрес введён с опечаткой.
          Вернитесь на главную или сразу расскажите нам о своей задаче.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-deep transition-all duration-200 hover:-translate-y-0.5 hover:bg-light"
          >
            На главную
          </Link>
          <Link
            href="/#contacts"
            className="inline-flex items-center justify-center rounded-full border border-line px-7 py-3.5 text-sm font-bold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-muted hover:bg-surface"
          >
            Связаться с нами
          </Link>
        </div>
      </div>
    </div>
  );
}
