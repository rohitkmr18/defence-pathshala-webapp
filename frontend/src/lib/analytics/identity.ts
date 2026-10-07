const ANON_KEY = "dp_analytics_anonymous_id";
let anonymousId: string | undefined;

export function getAnonymousId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  if (anonymousId) return anonymousId;
  try {
    anonymousId = window.localStorage.getItem(ANON_KEY) || undefined;
  } catch { /* In-memory identity works when storage is unavailable. */ }
  if (!anonymousId) rotateAnonymousId();
  return anonymousId;
}

export function rotateAnonymousId(): string {
  anonymousId = globalThis.crypto?.randomUUID?.() ||
    `dp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  try {
    window.localStorage.setItem(ANON_KEY, anonymousId);
  } catch { /* Keep the new identity in memory. */ }
  return anonymousId;
}
