const STORAGE_KEY = "algorithmos-analytics";

export type AnalyticsConsent = "granted" | "denied" | null;

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (value === "granted" || value === "denied") return value;
  return null;
}

export function setAnalyticsConsent(value: Exclude<AnalyticsConsent, null>) {
  window.localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new Event("algorithmos-consent"));
}
