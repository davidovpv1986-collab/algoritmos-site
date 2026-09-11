import nodemailer from "nodemailer";

import { config } from "../config.js";
import type { LeadPayload } from "./lead-schema.js";

type MailResult = { ok: true } | { ok: false; reason: string };

const COMPANY = {
  name: "Алгоритмос",
  legalName: "ООО «Алгоритмос»",
  slogan: "Результат через технологии",
  phone: "+7 (919) 152-18-62",
  phoneHref: "+79191521862",
  email: "info@algorithmos.ru",
  office: "Уфа, Республика Башкортостан",
  geography: "Россия · Беларусь · Казахстан",
} as const;

const STATS = [
  { value: "300+", label: "лет совокупного опыта команды" },
  { value: "10x", label: "снижение проектных рисков" },
  { value: "70%+", label: "ускорение процессов" },
] as const;

const SERVICES = [
  "Разработка ПО",
  "Цифровизация",
  "Искусственный интеллект",
  "Безопасность",
  "Облака и DevOps",
  "1С",
] as const;

const NEXT_STEPS = [
  {
    number: "01",
    title: "Знакомимся",
    text: "Перезвоним в течение рабочего дня, уточним цели и ограничения задачи.",
  },
  {
    number: "02",
    title: "Предлагаем",
    text: "Коротко опишем подход, ориентировочные сроки и состав работ.",
  },
  {
    number: "03",
    title: "Запускаем",
    text: "После согласования собираем команду и берём проект в работу.",
  },
] as const;

/** SMTP настроен, только когда заданы все три параметра. */
export function isMailConfigured(): boolean {
  return Boolean(config.smtp.host && config.smtp.user && config.smtp.pass);
}

function createTransporter() {
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
    connectionTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

/** Экранирование пользовательского ввода перед вставкой в HTML-письмо. */
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

function quoteMessage(message: string, limit = 280): string {
  const compact = message.replace(/\s+/g, " ").trim();
  if (compact.length <= limit) return compact;
  return `${compact.slice(0, limit).trimEnd()}…`;
}

function moscowNow(): string {
  return new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
}

function safeDisplayName(name: string): string {
  return name.replaceAll('"', "");
}

function phoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits ? `+${digits}` : phone;
}

const UTM_LABELS: Record<string, string> = {
  utm_source: "utm_source",
  utm_medium: "utm_medium",
  utm_campaign: "utm_campaign",
  utm_content: "utm_content",
  utm_term: "utm_term",
};

function buildLeadHtml(payload: LeadPayload, sentAt: string): string {
  const utmRows = Object.entries(UTM_LABELS)
    .filter(([key]) => payload[key as keyof LeadPayload])
    .map(
      ([key, label]) => `
      <tr>
        <td style="padding:8px 12px;color:#9DBBB6;font-size:13px;">${label}</td>
        <td style="padding:8px 12px;color:#EAF3EF;font-size:13px;">${escapeHtml(String(payload[key as keyof LeadPayload]))}</td>
      </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="ru">
<body style="margin:0;padding:24px;background:#05121A;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#0B2E3D;border:1px solid #16414E;border-radius:16px;overflow:hidden;">
    <div style="height:4px;background:#2DA8A4;"></div>
    <div style="padding:20px 24px;background:#072230;border-bottom:1px solid #16414E;">
      <span style="color:#2DA8A4;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Заявка с сайта</span>
      <h1 style="margin:8px 0 0;color:#EAF3EF;font-size:20px;">${escapeHtml(payload.name)}</h1>
    </div>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:8px 12px;color:#9DBBB6;font-size:13px;width:140px;">Email</td>
        <td style="padding:8px 12px;font-size:13px;"><a href="mailto:${escapeHtml(payload.email)}" style="color:#2DA8A4;">${escapeHtml(payload.email)}</a></td>
      </tr>
      <tr>
        <td style="padding:8px 12px;color:#9DBBB6;font-size:13px;">Телефон</td>
        <td style="padding:8px 12px;font-size:13px;"><a href="tel:${escapeHtml(phoneHref(payload.phone))}" style="color:#2DA8A4;">${escapeHtml(payload.phone)}</a></td>
      </tr>
      <tr>
        <td style="padding:8px 12px;color:#9DBBB6;font-size:13px;vertical-align:top;">Задача</td>
        <td style="padding:8px 12px;color:#EAF3EF;font-size:13px;white-space:pre-line;">${escapeHtml(payload.message)}</td>
      </tr>
      ${utmRows}
      <tr>
        <td style="padding:8px 12px;color:#9DBBB6;font-size:13px;">Время</td>
        <td style="padding:8px 12px;color:#EAF3EF;font-size:13px;">${sentAt}</td>
      </tr>
    </table>
    <div style="padding:14px 24px;background:#072230;border-top:1px solid #16414E;color:#9DBBB6;font-size:11px;">
      Ответьте на это письмо, чтобы написать клиенту напрямую.
    </div>
  </div>
</body>
</html>`;
}

function buildLeadText(payload: LeadPayload, sentAt: string): string {
  const utmLines = Object.entries(UTM_LABELS)
    .filter(([key]) => payload[key as keyof LeadPayload])
    .map(([key, label]) => `${label}: ${payload[key as keyof LeadPayload]}`)
    .join("\n");

  return [
    `Новая заявка с сайта`,
    ``,
    `Имя: ${payload.name}`,
    `Email: ${payload.email}`,
    `Телефон: ${payload.phone}`,
    `Задача: ${payload.message}`,
    utmLines ? `\nМетки кампании:\n${utmLines}` : "",
    `\nВремя: ${sentAt}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildAutoReplyHtml(payload: LeadPayload): string {
  const name = escapeHtml(firstName(payload.name));
  const phone = escapeHtml(payload.phone);
  const quote = escapeHtml(quoteMessage(payload.message));

  const statCells = STATS.map(
    (stat, index) => `
      <td style="width:33%;padding:0;${index > 0 ? "border-left:1px solid #16414E;" : ""}">
        <div style="padding:16px 10px;text-align:center;">
          <div style="color:#EAF3EF;font-size:22px;font-weight:bold;line-height:1;">${stat.value}</div>
          <div style="color:#9DBBB6;font-size:11px;line-height:1.4;margin-top:6px;">${stat.label}</div>
        </div>
      </td>`,
  ).join("");

  const stepRows = NEXT_STEPS.map(
    (step) => `
      <tr>
        <td style="padding:10px 12px 10px 0;vertical-align:top;width:42px;">
          <div style="color:#2DA8A4;font-size:13px;font-weight:bold;letter-spacing:1px;">${step.number}</div>
        </td>
        <td style="padding:8px 0;vertical-align:top;">
          <div style="color:#EAF3EF;font-size:14px;font-weight:bold;">${step.title}</div>
          <div style="color:#9DBBB6;font-size:13px;line-height:1.5;margin-top:3px;">${step.text}</div>
        </td>
      </tr>`,
  ).join("");

  const serviceChips = SERVICES.map(
    (service) =>
      `<span style="display:inline-block;background:#072230;border:1px solid #16414E;color:#9DBBB6;font-size:12px;border-radius:999px;padding:6px 12px;margin:3px 2px;">${service}</span>`,
  ).join("");

  return `<!doctype html>
<html lang="ru">
<body style="margin:0;padding:24px;background:#05121A;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#0B2E3D;border:1px solid #16414E;border-radius:16px;overflow:hidden;">
    <div style="height:4px;background:#2DA8A4;"></div>
    <div style="padding:28px 24px 24px;background:#072230;border-bottom:1px solid #16414E;text-align:center;">
      <div style="display:inline-block;border:1px solid rgba(45,168,164,0.5);background:rgba(45,168,164,0.12);color:#EAF3EF;font-size:11px;font-weight:bold;letter-spacing:1.6px;text-transform:uppercase;border-radius:999px;padding:6px 14px;">${COMPANY.slogan}</div>
      <div style="color:#EAF3EF;font-size:22px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;margin-top:14px;">${COMPANY.name}</div>
    </div>

    <div style="padding:28px 24px 8px;">
      <h1 style="margin:0 0 14px;color:#EAF3EF;font-size:22px;line-height:1.3;">Здравствуйте, ${name}!</h1>
      <p style="margin:0 0 12px;color:#EAF3EF;font-size:14px;line-height:1.65;">
        Благодарим вас за обращение в «${COMPANY.name}». Ваша заявка получена
        и уже передана специалисту, который занимается такими задачами.
      </p>
      <p style="margin:0 0 18px;color:#9DBBB6;font-size:14px;line-height:1.65;">
        Свяжемся с вами в течение рабочего дня по номеру
        <span style="color:#EAF3EF;font-weight:bold;">${phone}</span>
        — уточним детали и предложим понятный следующий шаг.
      </p>
    </div>

    <div style="padding:0 24px 8px;">
      <div style="background:#072230;border:1px solid #16414E;border-radius:14px;padding:16px 18px;">
        <div style="color:#2DA8A4;font-size:11px;font-weight:bold;letter-spacing:1.6px;text-transform:uppercase;margin-bottom:8px;">Ваш запрос</div>
        <div style="color:#EAF3EF;font-size:14px;line-height:1.6;">«${quote}»</div>
      </div>
    </div>

    <div style="padding:20px 24px 8px;">
      <div style="color:#2DA8A4;font-size:11px;font-weight:bold;letter-spacing:1.6px;text-transform:uppercase;margin-bottom:10px;">Что будет дальше</div>
      <table style="width:100%;border-collapse:collapse;">${stepRows}</table>
    </div>

    <div style="padding:16px 24px 8px;">
      <table style="width:100%;border-collapse:collapse;background:#072230;border:1px solid #16414E;border-radius:14px;overflow:hidden;">
        <tr>${statCells}</tr>
      </table>
    </div>

    <div style="padding:16px 24px 8px;text-align:center;">
      ${serviceChips}
    </div>

    <div style="padding:12px 24px 28px;text-align:center;">
      <a href="${config.siteUrl}" style="display:inline-block;background:#2DA8A4;color:#05121A;font-size:14px;font-weight:bold;text-decoration:none;border-radius:999px;padding:13px 32px;">Перейти на сайт</a>
      <div style="color:#9DBBB6;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;margin-top:16px;">${COMPANY.geography}</div>
    </div>

    <div style="padding:16px 24px;background:#072230;border-top:1px solid #16414E;color:#9DBBB6;font-size:12px;line-height:1.7;text-align:center;">
      ${COMPANY.legalName} · ${COMPANY.office}<br>
      <a href="tel:${COMPANY.phoneHref}" style="color:#2DA8A4;text-decoration:none;">${COMPANY.phone}</a>
      ·
      <a href="mailto:${COMPANY.email}" style="color:#2DA8A4;text-decoration:none;">${COMPANY.email}</a><br>
      <span style="font-size:11px;">Хотите дополнить заявку? Просто ответьте на это письмо.</span>
    </div>
  </div>
</body>
</html>`;
}

function buildAutoReplyText(payload: LeadPayload): string {
  const name = firstName(payload.name);
  const quote = quoteMessage(payload.message);

  return [
    `Здравствуйте, ${name}!`,
    ``,
    `Благодарим вас за обращение в «${COMPANY.name}».`,
    `Ваша заявка получена и уже передана специалисту.`,
    `Свяжемся с вами в течение рабочего дня по номеру ${payload.phone}.`,
    ``,
    `Ваш запрос:`,
    `«${quote}»`,
    ``,
    `Что будет дальше:`,
    ...NEXT_STEPS.map((step) => `${step.number} ${step.title} — ${step.text}`),
    ``,
    `${COMPANY.legalName} · ${COMPANY.office}`,
    `${COMPANY.phone} · ${COMPANY.email}`,
    config.siteUrl,
    ``,
    `Хотите дополнить заявку? Просто ответьте на это письмо.`,
  ].join("\n");
}

/**
 * Отправляет заявку на почту компании через SMTP.
 * replyTo указывает на email клиента — менеджер отвечает одной кнопкой.
 */
export async function sendLeadEmail(payload: LeadPayload): Promise<MailResult> {
  const sentAt = moscowNow();

  try {
    await createTransporter().sendMail({
      from: `"Сайт ${COMPANY.name}" <${config.mailFrom}>`,
      to: config.mailTo,
      replyTo: `"${safeDisplayName(payload.name)}" <${payload.email}>`,
      subject: `Заявка с сайта: ${payload.name}`,
      text: buildLeadText(payload, sentAt),
      html: buildLeadHtml(payload, sentAt),
    });
    return { ok: true };
  } catch (error) {
    console.error("SMTP send error:", error);
    return { ok: false, reason: "smtp_error" };
  }
}

/**
 * Автоответ клиенту: подтверждение получения заявки в фирменном стиле.
 * Сбой автоответа не влияет на заявку — только логируется.
 */
export async function sendAutoReplyEmail(payload: LeadPayload): Promise<MailResult> {
  try {
    await createTransporter().sendMail({
      from: `"${COMPANY.name}" <${config.mailFrom}>`,
      to: `"${safeDisplayName(payload.name)}" <${payload.email}>`,
      replyTo: config.mailTo,
      subject: `${firstName(payload.name)}, ваша заявка получена — ${COMPANY.name}`,
      text: buildAutoReplyText(payload),
      html: buildAutoReplyHtml(payload),
    });
    return { ok: true };
  } catch (error) {
    console.error("SMTP auto-reply error:", error);
    return { ok: false, reason: "smtp_error" };
  }
}
