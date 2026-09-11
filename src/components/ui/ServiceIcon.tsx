import type { ServiceIconKey } from "@/data/services";

/**
 * Набор линейных иконок для направлений услуг.
 * Стиль — единый: контур 1.8px, скруглённые окончания.
 */
const paths: Record<ServiceIconKey, React.ReactNode> = {
  code: (
    <>
      <path d="m8 6-6 6 6 6" />
      <path d="m16 6 6 6-6 6" />
      <path d="m13 4-2 16" />
    </>
  ),
  automation: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="m7 15 4-6 4 3 5-8" />
    </>
  ),
  consulting: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  cloud: (
    <>
      <path d="M17.5 19a4.5 4.5 0 1 0-1.41-8.78 6 6 0 1 0-7.2 8.78" />
      <path d="M8 19h9.5" />
    </>
  ),
  certificate: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 14-1.5 7 5-3 5 3-1.5-7" />
    </>
  ),
  design: (
    <>
      <path d="M12 19a7 7 0 1 0-7-7c0 2 .5 3 2 3h2a2 2 0 0 1 2 2c0 1.5 1 2 1 2Z" />
      <circle cx="7.5" cy="10.5" r=".9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7.5" r=".9" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="10.5" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  qa: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
      <path d="m8.5 11 1.8 1.8 3.2-3.6" />
    </>
  ),
  onec: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9h4M7 13h7M7 17h5" />
      <path d="M15 9h2" />
    </>
  ),
  ai: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
};

export default function ServiceIcon({
  name,
  className = "",
}: {
  name: ServiceIconKey;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
