"use server";

import { z } from "zod";

const leadSchema = z.object({
  name: z.string().trim().min(1, { message: "Укажите имя" }).max(120),
  email: z.string().trim().email({ message: "Некорректный email" }).max(200),
  message: z
    .string()
    .trim()
    .min(1, { message: "Сообщение не может быть пустым" })
    .max(5000),
  company: z.string().optional(),
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_content: z.string().max(200).optional(),
  utm_term: z.string().max(200).optional(),
});

export type LeadState = {
  message: string;
  error: boolean;
};

const SUCCESS_MESSAGE =
  "Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.";

export async function sendLead(
  _prevState: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const validatedFields = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    company: formData.get("company") ?? undefined,
    utm_source: formData.get("utm_source") ?? undefined,
    utm_medium: formData.get("utm_medium") ?? undefined,
    utm_campaign: formData.get("utm_campaign") ?? undefined,
    utm_content: formData.get("utm_content") ?? undefined,
    utm_term: formData.get("utm_term") ?? undefined,
  });

  if (!validatedFields.success) {
    return {
      error: true,
      message: Object.values(validatedFields.error.flatten().fieldErrors)
        .flat()
        .join("\n"),
    };
  }

  const { name, email, message, company, ...utm } = validatedFields.data;

  /* Honeypot: боты заполняют скрытое поле — молча отвечаем «успехом»,
     не создавая лид и не раскрывая механику защиты. */
  if (company && company.trim().length > 0) {
    return { message: SUCCESS_MESSAGE, error: false };
  }

  const webhookUrl = process.env.BITRIX_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("BITRIX_WEBHOOK_URL is not configured");
    return {
      error: true,
      message:
        "Сервис приёма заявок временно недоступен. Свяжитесь с нами по телефону или email.",
    };
  }

  const utmLines = Object.entries(utm)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const comments = utmLines
    ? `${message}\n\n---\nМетки кампании:\n${utmLines}`
    : message;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          TITLE: `Новая заявка с сайта от ${name}`,
          NAME: name,
          EMAIL: [{ VALUE: email, VALUE_TYPE: "WORK" }],
          COMMENTS: comments,
          SOURCE_DESCRIPTION: "Сайт algorithmos.ru",
          UTM_SOURCE: utm.utm_source || undefined,
          UTM_MEDIUM: utm.utm_medium || undefined,
          UTM_CAMPAIGN: utm.utm_campaign || undefined,
          UTM_CONTENT: utm.utm_content || undefined,
          UTM_TERM: utm.utm_term || undefined,
        },
        params: { REGISTER_SONET_EVENT: "Y" },
      }),
    });

    const result = await response.json();

    if (result.error || !response.ok) {
      console.error("Bitrix24 error:", result);
      return {
        error: true,
        message: "Не удалось отправить заявку. Попробуйте позже или позвоните нам.",
      };
    }

    return { message: SUCCESS_MESSAGE, error: false };
  } catch (error) {
    console.error("Lead submission error:", error);
    return {
      error: true,
      message: "Ошибка сервера. Попробуйте позже или позвоните нам.",
    };
  }
}
