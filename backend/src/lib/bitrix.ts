import type { LeadPayload } from "./lead-schema.js";

type BitrixResult =
  | { ok: true; leadId: number }
  | { ok: false; reason: string };

/**
 * Создаёт лид в Bitrix24 через входящий вебхук crm.lead.add.
 * Адрес вебхука живёт только на сервере (BITRIX_WEBHOOK_URL)
 * и никогда не попадает в браузер.
 */
export async function createBitrixLead(
  payload: LeadPayload,
  webhookUrl: string,
): Promise<BitrixResult> {
  const { name, email, message, ...utm } = payload;

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
      signal: AbortSignal.timeout(10_000),
    });

    const result = (await response.json()) as {
      result?: number;
      error?: string;
      error_description?: string;
    };

    if (!response.ok || result.error) {
      console.error("Bitrix24 error:", result.error, result.error_description);
      return { ok: false, reason: result.error ?? "bitrix_request_failed" };
    }

    return { ok: true, leadId: Number(result.result) };
  } catch (error) {
    console.error("Bitrix24 request error:", error);
    return { ok: false, reason: "network_error" };
  }
}
