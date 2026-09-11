"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getAnalyticsConsent, setAnalyticsConsent } from "@/lib/consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getAnalyticsConsent() === null);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-deep/95 pb-[env(safe-area-inset-bottom)] shadow-2xl shadow-deep/50 backdrop-blur-md">
      <div className="container flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Мы используем необходимые файлы cookie и, с вашего согласия, Яндекс.Метрику
          (счётчик посещений без записи сессий). Подробности — в{" "}
          <Link href="/privacy" className="text-foreground underline decoration-muted/50 underline-offset-2 hover:text-primary">
            политике конфиденциальности
          </Link>
          .
        </p>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="min-h-11 rounded-full border border-line px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-muted"
            onClick={() => {
              setAnalyticsConsent("denied");
              setVisible(false);
            }}
          >
            Только необходимые
          </button>
          <button
            type="button"
            className="min-h-11 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-deep transition-colors hover:bg-light"
            onClick={() => {
              setAnalyticsConsent("granted");
              setVisible(false);
            }}
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
