import type { MetadataRoute } from "next";

import { siteConfig } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Алгоритмос — цифровые решения для бизнеса",
    short_name: siteConfig.name,
    description: siteConfig.description,
    lang: "ru",
    start_url: "/",
    display: "standalone",
    background_color: "#05121A",
    theme_color: "#05121A",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
