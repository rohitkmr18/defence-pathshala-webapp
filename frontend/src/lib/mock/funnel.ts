import { trackLearningEvent } from "@/lib/learning-events";

/** Mock funnel events (GA4 via the existing dataLayer). Mirrors the AFCAT funnel; only a test code
 *  and coarse flags are sent, never personal data. PostHog is not present in this codebase. */
export type MockFunnelEvent =
  | "mock_catalogue_view" | "mock_start" | "mock_resume"
  | "mock_answer_first" | "mock_submit" | "mock_result_view";

export function trackMockFunnel(
  event: MockFunnelEvent,
  context: Record<string, string | number | boolean | undefined> = {},
  once?: string,
): void {
  trackLearningEvent(event, { paper_id: "cds-gk", ...context }, once);
}
