import { appendFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LeadPayload } from "./lead-schema.js";

/**
 * Резервное хранилище заявок: backend/data/leads.jsonl
 * (одна строка = одна заявка в JSON).
 *
 * Используется, когда SMTP ещё не настроен или временно недоступен,
 * чтобы ни одна заявка не потерялась. Каталог data/ в .gitignore.
 */
const dataDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "data");
const leadsFile = join(dataDir, "leads.jsonl");

export async function saveLeadToFile(payload: LeadPayload): Promise<string> {
  await mkdir(dataDir, { recursive: true });
  const record = { ...payload, savedAt: new Date().toISOString() };
  await appendFile(leadsFile, JSON.stringify(record) + "\n", "utf8");
  return leadsFile;
}
