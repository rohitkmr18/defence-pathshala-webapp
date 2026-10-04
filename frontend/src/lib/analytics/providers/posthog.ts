import type { ProductEventProperties } from "../events";

type PostHogLike = {
  capture?: (event: string, properties?: Record<string, unknown>) => void;
  identify?: (distinctId: string, properties?: Record<string, unknown>) => void;
  reset?: () => void;
};

type PostHogWindow = Window & { posthog?: PostHogLike };

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const apiHost = (process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com").replace(/\/$/, "");

function getPostHog(): PostHogLike | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as PostHogWindow).posthog;
}

function cleanProperties(properties: ProductEventProperties): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined)
  );
}

function captureViaApi(
  event: string,
  distinctId: string | undefined,
  properties: ProductEventProperties
): void {
  if (!projectToken || !distinctId || typeof window === "undefined") return;

  const payload = JSON.stringify({
    api_key: projectToken,
    distinct_id: distinctId,
    event,
    properties: cleanProperties(properties),
    timestamp: new Date().toISOString(),
  });

  void fetch(`${apiHost}/i/v0/e/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
    mode: "cors",
    credentials: "omit",
  }).catch(() => {
    // Analytics must never break the learner journey.
  });
}

/**
 * Provider bridge for canonical DP product events.
 *
 * If the browser SDK is present, use it. Until posthog-js is added with a
 * committed lockfile, the documented public capture API provides real event
 * ingestion without adding a runtime dependency.
 */
export function capturePostHog(
  name: string,
  properties: ProductEventProperties
): void {
  const posthog = getPostHog();
  if (posthog?.capture) {
    posthog.capture(name, cleanProperties(properties));
    return;
  }

  const identified =
    typeof properties.user_id === "string" && Boolean(properties.user_id);
  const distinctId = identified
    ? String(properties.user_id)
    : typeof properties.anonymous_id === "string"
      ? properties.anonymous_id
      : undefined;

  captureViaApi(
    name,
    distinctId,
    identified
      ? properties
      : { ...properties, $process_person_profile: false }
  );
}

export function identifyPostHog(
  userId: string,
  anonymousId?: string
): void {
  const posthog = getPostHog();
  if (posthog?.identify) {
    posthog.identify(userId);
    return;
  }

  if (!anonymousId || anonymousId === userId) return;

  captureViaApi("$identify", userId, {
    $anon_distinct_id: anonymousId,
  });
}

export function resetPostHog(): void {
  getPostHog()?.reset?.();
}
