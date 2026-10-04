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

import { releaseContext } from "./environment";
import { getAnonymousId, rotateAnonymousId } from "./identity";
import { safeEventProperties } from "./privacy";

const emitted = new Set<string>();
let currentUserId: string | undefined;

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
    timestamp: new Date().toISOString(),
    anonymous_id: getAnonymousId(),
    user_id: currentUserId,
    auth_state: currentUserId ? "authenticated" : "anonymous",
    route: window.location.pathname,
    source_surface: window.location.pathname.startsWith("/dashboard/practice") ? "direct_practice"
      : window.location.pathname.startsWith("/dashboard/question-bank") ? "explore"
      : window.location.pathname.startsWith("/dashboard/mistakes") ? "mistakes"
      : window.location.pathname.startsWith("/auth/") ? "auth"
      : window.location.pathname.startsWith("/onboarding") ? "onboarding" : "dashboard",
    ...releaseContext(),
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
  try {
    dispatchProductEvent(name, properties, once);
  } catch {
    // Context/storage failures must also never interrupt a learner action.
  }
}

function dispatchProductEvent(
  name: string,
  properties: ProductEventProperties,
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

  const event = {
    ...commonContext(),
    ...safeEventProperties(properties),
    practice_mode: properties.practice_mode || properties.mode,
    // Call sites cannot override the release or identity contract.
    ...releaseContext(),
    event_version: PRODUCT_EVENT_VERSION,
    anonymous_id: getAnonymousId(),
    user_id: currentUserId,
    auth_state: currentUserId ? "authenticated" : "anonymous",
  };
  try { captureGa4(name, event); } catch { /* Provider failures are isolated. */ }
  try { capturePostHog(name, event); } catch { /* Provider failures are isolated. */ }
}

export function identifyAnalyticsUser(userId: string): void {
  if (!userId || typeof window === "undefined") return;
  if (currentUserId === userId) return;
  if (currentUserId) resetAnalyticsUser(true);
  currentUserId = userId;
  identifyPostHog(userId);
}

export function resetAnalyticsUser(signedOut = false): void {
  if (!currentUserId && !signedOut) return;
  currentUserId = undefined;
  emitted.clear();
  try {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key?.startsWith("dp_event:")) sessionStorage.removeItem(key);
    }
  } catch { /* In-memory deduplication is already cleared. */ }
  resetPostHog(rotateAnonymousId());
}
