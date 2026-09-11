/**
 * Общие данные сайта: контакты, навигация, география.
 * Единый источник правды — правки здесь применяются везде.
 */

export const siteConfig = {
  name: "Алгоритмос",
  legalName: "ООО «Алгоритмос»",
  slogan: "Результат через технологии",
  description:
    "Российская ИТ-компания полного цикла: разработка ПО, цифровизация, искусственный интеллект, безопасность, облака и DevOps. Результат через технологии.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://algorithmos.ru",
  contacts: {
    phone: "+7 (919) 152-18-62",
    phoneHref: "tel:+79191521862",
    phoneNote: "Пн–Пт, 9:00–18:00",
    email: "info@algorithmos.ru",
    emailHref: "mailto:info@algorithmos.ru",
    emailNote: "Отвечаем в течение 24 часов",
    office: "Уфа, Республика Башкортостан",
    officeNote: "Работаем по России, Беларуси и Казахстану",
  },
  geography: ["Россия", "Беларусь", "Казахстан"],
  stats: [
    { value: "300+", label: "лет совокупного опыта команды" },
    { value: "10x", label: "снижение проектных рисков" },
    { value: "70%+", label: "ускорение процессов" },
  ],
} as const;

export const navLinks = [
  { href: "/#about", label: "О компании" },
  { href: "/#process", label: "Подход" },
  { href: "/#services", label: "Услуги" },
  { href: "/#why-us", label: "Преимущества" },
  { href: "/#faq", label: "Вопросы" },
  { href: "/#contacts", label: "Контакты" },
] as const;
