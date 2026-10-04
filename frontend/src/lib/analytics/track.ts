import {
  PRODUCT_EVENT_VERSION,
  type ProductEventName,
  type ProductEventProperties,
} from "./events";
import { captureGa4 } from "./providers/ga4";
import {
  capturePostHog,
  identifyPostHog,
  resetPostHog,
} from "./providers/posthog";

const emitted = new Set<string>();
const ANON_KEY = "dp_analytics_anonymous_id";

function analyticsEnvironment(): string {
  return (
    process.env.NEXT_PUBLIC_VERCEL_ENV ||
    process.env.NEXT_PUBLIC_APP_ENV ||
    process.env.NODE_ENV ||
    "unknown"
  );
}

function getAnonymousId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const existing = window.localStorage.getItem(ANON_KEY);
    if (existing) return existing;
    const generated =
      globalThis.crypto?.randomUUID?.() ||
      `dp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(ANON_KEY, generated);
    return generated;
  } catch {
    return undefined;
  }
}

function viewportBucket(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const width = window.innerWidth;
  if (width < 390) return "xs_mobile";
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function commonContext(): ProductEventProperties {
  if (typeof window === "undefined") return {};
  return {
    event_version: PRODUCT_EVENT_VERSION,
    anonymous_id: getAnonymousId(),
    route: window.location.pathname,
    deployment_environment: analyticsEnvironment(),
    git_sha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    device_category: window.innerWidth < 640 ? "mobile" : "desktop",
    viewport_bucket: viewportBucket(),
  };
}

export function trackProductEvent(
  name: ProductEventName,
  properties: ProductEventProperties = {},
  once?: string
): void {
  trackProductEventUnsafe(name, properties, once);
}

/**
 * Temporary compatibility entry point for pre-v1 learning event names.
 * New instrumentation must use trackProductEvent with ProductEventName.
 */
export function trackProductEventUnsafe(
  name: string,
  properties: ProductEventProperties = {},
  once?: string
): void {
  if (typeof window === "undefined") return;

  const key = once ? `${name}:${once}` : undefined;
  if (key) {
    if (emitted.has(key)) return;
    try {
      if (sessionStorage.getItem(`dp_event:${key}`)) return;
      sessionStorage.setItem(`dp_event:${key}`, "1");
    } catch {
      // In-memory deduplication remains available.
    }
    emitted.add(key);
  }

  const event = { ...commonContext(), ...properties };
  captureGa4(name, event);
  capturePostHog(name, event);
}

export function identifyAnalyticsUser(userId: string): void {
  if (!userId) return;
  identifyPostHog(userId);
}

export function resetAnalyticsUser(): void {
  resetPostHog();
}
