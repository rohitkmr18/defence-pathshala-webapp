import { trackLearningEvent } from "@/lib/learning-events";

/**
 * AFCAT acquisition funnel events (GA4, via the dataLayer already installed in the root layout).
 * Names are fixed here so the funnel can be built in GA4 Explore without guessing.
 * No personal data is sent: only the test code and a coarse placement label.
 */
export const AFCAT_TEST_CODE = "AFCAT-FM01-V2";

export type AfcatFunnelEvent =
  | "afcat_landing_view"
  | "afcat_cta_click"
  | "afcat_signin_click"
  | "afcat_mock_start"
  | "afcat_mock_submit"
  | "afcat_result_view"
  | "afcat_share_click";

export function trackAfcatFunnel(
  event: AfcatFunnelEvent,
  context: Record<string, string | number | boolean | undefined> = {},
  once?: string,
): void {
  trackLearningEvent(event, { test_code: AFCAT_TEST_CODE, ...context }, once);
}
