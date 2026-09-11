/**
 * Клиент backend API сайта.
 * Базовый URL задаётся при сборке через NEXT_PUBLIC_API_URL.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type LeadRequest = {
  name: string;
  email: string;
  message: string;
  company?: string;
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = (await response.json()) as LeadResponse;
  return result;
}
