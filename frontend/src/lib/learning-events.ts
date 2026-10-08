import type { ProductEventProperties } from "@/lib/analytics/events";
import { trackProductEventUnsafe } from "@/lib/analytics/track";

/**
 * Backward-compatible bridge for existing learning telemetry.
 *
 * New instrumentation should use trackProductEvent() with the canonical v1
 * event taxonomy. Existing names continue to flow to both configured providers
 * until their call sites are migrated deliberately.
 */
export function trackLearningEvent(
  name: string,
  context: ProductEventProperties = {},
  once?: string
): void {
  trackProductEventUnsafe(name, context, once);
}
