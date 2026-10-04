import type { ProductEventProperties } from "../events";

type PostHogLike = {
  capture?: (event: string, properties?: Record<string, unknown>) => void;
  identify?: (distinctId: string, properties?: Record<string, unknown>) => void;
  reset?: () => void;
};

type PostHogWindow = Window & { posthog?: PostHogLike };

function getPostHog(): PostHogLike | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as PostHogWindow).posthog;
}

/**
 * Provider bridge only. The PostHog browser SDK is initialized separately.
 * Keeping the bridge dependency-free lets the event contract land before a
 * project token is configured and avoids direct SDK calls across components.
 */
export function capturePostHog(
  name: string,
  properties: ProductEventProperties
): void {
  getPostHog()?.capture?.(name, properties as Record<string, unknown>);
}

export function identifyPostHog(userId: string): void {
  getPostHog()?.identify?.(userId);
}

export function resetPostHog(): void {
  getPostHog()?.reset?.();
}
