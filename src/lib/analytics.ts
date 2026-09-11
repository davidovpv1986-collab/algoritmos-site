/**
 * Лёгкая обёртка над Яндекс.Метрикой.
 * Счётчик подключается только при наличии NEXT_PUBLIC_YM_ID,
 * поэтому все вызовы безопасны и без настроенного счётчика.
 */

declare global {
  interface Window {
    ym?: (counterId: number, action: string, goal: string, params?: Record<string, unknown>) => void;
  }
}

export const YM_ID = process.env.NEXT_PUBLIC_YM_ID
  ? Number(process.env.NEXT_PUBLIC_YM_ID)
  : null;

/** События воронки из технического задания. */
export const goals = {
  ctaClick: "cta_click",
  formOpen: "form_open",
  leadSuccess: "lead_success",
  contactsView: "contacts_view",
} as const;

export function reachGoal(goal: (typeof goals)[keyof typeof goals]) {
  if (YM_ID && typeof window !== "undefined" && window.ym) {
    window.ym(YM_ID, "reachGoal", goal);
  }
}
