"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

import { YM_ID } from "@/lib/analytics";
import { getAnalyticsConsent } from "@/lib/consent";

/**
 * Яндекс.Метрика подключается только после согласия (152-ФЗ)
 * и при заданном NEXT_PUBLIC_YM_ID. Webvisor выключен.
 */
export default function YandexMetrika() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(getAnalyticsConsent() === "granted");
    sync();
    window.addEventListener("algorithmos-consent", sync);
    return () => window.removeEventListener("algorithmos-consent", sync);
  }, []);

  if (!YM_ID || !allowed) return null;

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],
        k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        ym(${YM_ID}, "init", {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: false
        });
      `}
    </Script>
  );
}
