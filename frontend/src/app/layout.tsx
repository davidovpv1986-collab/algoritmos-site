import type { Metadata, Viewport } from "next";

import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import YandexMetrika from "@/components/analytics/YandexMetrika";
import CookieConsent from "@/components/analytics/CookieConsent";
import { contentSecurityPolicy } from "@/lib/csp";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Алгоритмос — цифровые решения для бизнеса",
    template: "%s — Алгоритмос",
  },
  description: siteConfig.description,
  keywords: [
    "разработка ПО",
    "цифровизация",
    "автоматизация бизнеса",
    "искусственный интеллект",
    "информационная безопасность",
    "облачные технологии",
    "DevOps",
    "ИТ-компания Уфа",
    "Алгоритмос",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Алгоритмос — цифровые решения для бизнеса",
    description: siteConfig.description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Алгоритмос — результат через технологии",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Алгоритмос — цифровые решения для бизнеса",
    description: siteConfig.description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#05121A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Schema.org: Organization + WebSite */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.legalName,
      alternateName: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/icon.svg`,
      description: siteConfig.description,
      email: siteConfig.contacts.email,
      telephone: "+79191521862",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Уфа",
        addressRegion: "Республика Башкортостан",
        addressCountry: "RU",
      },
      areaServed: ["RU", "BY", "KZ"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      publisher: { "@id": `${siteConfig.url}/#organization` },
      inLanguage: "ru-RU",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <head>
        <meta httpEquiv="Content-Security-Policy" content={contentSecurityPolicy()} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-deep"
        >
          К содержимому
        </a>
        <ScrollProgress />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <BackToTop />
        <CookieConsent />
        <YandexMetrika />
      </body>
    </html>
  );
}
