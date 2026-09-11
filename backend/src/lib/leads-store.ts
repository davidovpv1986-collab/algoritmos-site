import { appendFile, chmod, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LeadPayload } from "./lead-schema.js";

/**
 * Резервное хранилище заявок: backend/data/leads.jsonl
 * (одна строка = одна заявка в JSON).
 *
 * Используется, когда SMTP ещё не настроен или временно недоступен.
 * Каталог data/ в .gitignore. Права 0700/0600 — только владелец процесса.
 */
const dataDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "data");
const leadsFile = join(dataDir, "leads.jsonl");

export async function saveLeadToFile(payload: LeadPayload): Promise<string> {
  await mkdir(dataDir, { recursive: true, mode: 0o700 });
  const { company: _honeypot, startedAt: _timing, ...safe } = payload;
  const record = { ...safe, savedAt: new Date().toISOString() };
  await appendFile(leadsFile, JSON.stringify(record) + "\n", {
    encoding: "utf8",
    mode: 0o600,
  });
  await chmod(leadsFile, 0o600);
  return leadsFile;
}
