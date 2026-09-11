import nodemailer from "nodemailer";

import { config } from "../config.js";
import type { LeadPayload } from "./lead-schema.js";

type MailResult = { ok: true } | { ok: false; reason: string };

/** SMTP настроен, только когда заданы все три параметра. */
export function isMailConfigured(): boolean {
  return Boolean(config.smtp.host && config.smtp.user && config.smtp.pass);
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

const UTM_LABELS: Record<string, string> = {
  utm_source: "utm_source",
  utm_medium: "utm_medium",
  utm_campaign: "utm_campaign",
  utm_content: "utm_content",
  utm_term: "utm_term",
};

function buildHtml(payload: LeadPayload, sentAt: string): string {
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

function buildText(payload: LeadPayload, sentAt: string): string {
  const utmLines = Object.entries(UTM_LABELS)
    .filter(([key]) => payload[key as keyof LeadPayload])
    .map(([key, label]) => `${label}: ${payload[key as keyof LeadPayload]}`)
    .join("\n");

  return [
    `Новая заявка с сайта`,
    ``,
    `Имя: ${payload.name}`,
    `Email: ${payload.email}`,
    `Задача: ${payload.message}`,
    utmLines ? `\nМетки кампании:\n${utmLines}` : "",
    `\nВремя: ${sentAt}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Отправляет заявку на почту компании через SMTP.
 * replyTo указывает на email клиента — менеджер отвечает одной кнопкой.
 */
export async function sendLeadEmail(payload: LeadPayload): Promise<MailResult> {
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
    connectionTimeout: 10_000,
    socketTimeout: 15_000,
  });

  const sentAt = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });

  try {
    await transporter.sendMail({
      from: `"Сайт Алгоритмос" <${config.mailFrom}>`,
      to: config.mailTo,
      replyTo: `"${payload.name.replaceAll('"', "")}" <${payload.email}>`,
      subject: `Заявка с сайта: ${payload.name}`,
      text: buildText(payload, sentAt),
      html: buildHtml(payload, sentAt),
    });
    return { ok: true };
  } catch (error) {
    console.error("SMTP send error:", error);
    return { ok: false, reason: "smtp_error" };
  }
}
