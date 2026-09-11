import { services } from "@/data/services";

/**
 * Бегущая строка направлений — визуальный «пульс» компании.
 * Чистый CSS, дублированная дорожка для бесшовного цикла,
 * пауза при наведении, остановка при prefers-reduced-motion.
 */
export default function Marquee() {
  const items = services.map((service) => service.title);

  const track = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-10 pr-10 animate-marquee"
    >
      {items.map((title) => (
        <span
          key={title}
          className="flex items-center gap-10 whitespace-nowrap text-xs font-bold uppercase tracking-[0.22em] text-muted"
        >
          {title}
          <span className="h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="group relative overflow-hidden border-y border-line/70 bg-deep py-3 sm:py-4">
      <div className="flex w-max group-hover:[animation-play-state:paused]">
        {track(false)}
        {track(true)}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-deep to-transparent sm:w-24"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-deep to-transparent sm:w-24"
      />
    </div>
  );
}
