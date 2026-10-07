import posthog from "posthog-js";
import type { ProductEventProperties } from "../events";
import { releaseContext } from "../environment";
import { getAnonymousId } from "../identity";
import { safeSdkUrls, safeEventProperties } from "../privacy";

let initialized = false;

/** Next.js calls this synchronously before hydration via instrumentation-client. */
export function initializePostHog(): void {
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (initialized || !projectToken || typeof window === "undefined") return;
  try {
    posthog.init(projectToken, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      // Preserve pre-SDK anonymous journeys; only Supabase establishes user identity.
      bootstrap: { distinctID: getAnonymousId(), isIdentifiedID: false },
      persistence: "localStorage",
      person_profiles: "identified_only",
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      capture_exceptions: false,
      capture_performance: false,
      disable_surveys: true,
      disable_capture_url_hashes: true,
      mask_personal_data_properties: true,
      custom_personal_data_properties: ["email", "otp", "password", "code", "token", "token_hash", "auth_token", "access_token", "refresh_token", "id_token", "next", "redirect_to"],
      enable_recording_console_log: false,
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: "*",
        maskAllElementAttributes: true,
        blockSelector: 'input, textarea, select, [contenteditable], .ph-no-capture',
        recordHeaders: false,
        recordBody: false,
        captureCanvas: { recordCanvas: false },
        captureJsonLd: false,
        maskCapturedNetworkRequestFn: () => null,
      },
      before_send: (event) => {
        if (!event) return null;
        event.properties = safeSdkUrls(event.properties);
        return event;
      },
    });
    posthog.register(releaseContext());
    initialized = true;
  } catch { /* Analytics must never break a learner journey. */ }
}

export function capturePostHog(name: string, properties: ProductEventProperties): void {
  if (!initialized) return;
  try { posthog.capture(name, safeEventProperties(properties)); }
  catch { /* Provider failures are isolated. */ }
}

export function identifyPostHog(userId: string): void {
  if (!initialized) return;
  try { posthog.identify(userId); }
  catch { /* Never send profile values or credentials. */ }
}

export function resetPostHog(anonymousId: string): void {
  if (!initialized) return;
  try {
    posthog.reset({ resetDeviceID: true, bootstrap: { distinctID: anonymousId, isIdentifiedID: false } });
    posthog.register(releaseContext());
  } catch { /* Logout must succeed even if analytics fails. */ }
}
