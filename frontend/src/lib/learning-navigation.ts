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
  { name: "Home", href: "/dashboard" },
  { name: "Explore", href: "/dashboard/question-bank" },
  { name: "Practice", href: "/dashboard/practice" },
] as const;

export function isMobileLearningNavActive(href: string, pathname: string): boolean {
  const path = pathname.split(/[?#]/)[0];
  return path === href || (href !== "/dashboard" && path.startsWith(`${href}/`));
}

/** Attempt URLs keep the session in charge of the mobile bottom interaction zone.
 * This also covers their inline debrief; navigation returns when leaving the route.
 */
export function showGlobalMobileNav(pathname: string): boolean {
  const path = pathname.split(/[?#]/)[0];
  return !["/dashboard/practice/session", "/dashboard/practice/full-paper"].some(
    attempt => path === attempt || path.startsWith(`${attempt}/`)
  );
}
