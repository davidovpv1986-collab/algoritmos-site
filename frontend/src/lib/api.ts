/**
 * Клиент backend API сайта.
 * Базовый URL задаётся при сборке через NEXT_PUBLIC_API_URL.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type LeadRequest = {
  name: string;
  email: string;
  phone: string;
  message: string;
  company?: string;
  startedAt?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export type LeadResponse = {
  ok: boolean;
  message: string;
};

export async function submitLead(data: LeadRequest): Promise<LeadResponse> {
  const response = await fetch(`${API_URL}/api/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify(data),
  });

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return {
      ok: false,
      message:
        "Сервер временно недоступен. Позвоните нам или напишите на почту.",
    };
  }

  const result = (await response.json()) as LeadResponse;
  if (!response.ok && result.ok !== false) {
    return { ok: false, message: result.message || "Не удалось отправить заявку." };
  }
  return result;
}
