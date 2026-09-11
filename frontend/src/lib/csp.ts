function apiOrigin(): string {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").origin;
  } catch {
    return "'self'";
  }
}

/** Allowlist CSP для статического экспорта (дублируется заголовком nginx). */
export function contentSecurityPolicy(): string {
  const connect = ["'self'", apiOrigin(), "https://mc.yandex.ru", "https://mc.yandex.com"]
    .filter((value, index, list) => list.indexOf(value) === index)
    .join(" ");

  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://mc.yandex.ru https://mc.yandex.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://mc.yandex.ru",
    "font-src 'self'",
    `connect-src ${connect}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}
