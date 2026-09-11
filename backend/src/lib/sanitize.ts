/** Удаляет CR/LF и прочие управляющие символы — защита от header injection. */
export function stripControlChars(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, "");
}

/** Значение, безопасное для RFC 5322 display-name / Subject. */
export function headerSafe(value: string): string {
  return stripControlChars(value)
    .replaceAll('"', "")
    .replaceAll("<", "")
    .replaceAll(">", "")
    .replaceAll("\\", "")
    .trim();
}

/** Маскирует email в логах: i***@company.ru */
export function redactEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "[redacted]";
  return `${user.slice(0, 1)}***@${domain}`;
}
