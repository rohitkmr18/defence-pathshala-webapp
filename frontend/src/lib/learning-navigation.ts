import { safeAuthNext } from "./auth-redirect";

/** Search params are already decoded. Never decode an entire nested return URL. */
export function safeLearningReturn(value: string | null | undefined, fallback = "/dashboard/practice"): string {
  const safe = safeAuthNext(value);
  if (safe === "/dashboard" && value !== "/dashboard") return fallback;
  const path = safe.split(/[?#]/)[0];
  return path === "/dashboard" || path === "/dashboard/question-bank" || path === "/dashboard/practice"
    ? safe : fallback;
}

export const MOBILE_LEARNING_NAV = [
  { name: "Explore", href: "/dashboard/question-bank" },
  { name: "Practice", href: "/dashboard/practice" },
  { name: "Progress", href: "/dashboard#performance-coach" },
] as const;

export function isMobileLearningNavActive(href: string, pathname: string, hash: string): boolean {
  const [path, anchor] = href.split("#");
  if (anchor) return pathname === path && hash === `#${anchor}`;
  return pathname === path || pathname.startsWith(`${path}/`);
}
