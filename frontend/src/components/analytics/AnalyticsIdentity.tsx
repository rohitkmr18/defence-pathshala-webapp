"use client";

import { useEffect } from "react";
import { MISTAKE_RESOLVED_EVENT } from "@/lib/practice-session-client";
import { createClient } from "@/lib/supabase/client";
import {
  identifyAnalyticsUser,
  resetAnalyticsUser,
  trackProductEvent,
} from "@/lib/analytics/track";

export default function AnalyticsIdentity() {
  useEffect(() => {
    const resolved = (event: Event) => {
      const properties = (event as CustomEvent).detail;
      if (properties?.attempt_id) trackProductEvent("mistake_resolved", properties, properties.attempt_id);
    };
    if (typeof window !== "undefined") window.addEventListener?.(MISTAKE_RESOLVED_EVENT, resolved);
    const supabase = createClient();
    let active = true;
    let authChanged = false;

    function syncIdentity(userId?: string, signedOut = false) {
      if (!active) return;
      if (!userId) {
        resetAnalyticsUser(signedOut);
        return;
      }
      identifyAnalyticsUser(userId);
      try {
        const source = sessionStorage.getItem("dp_auth_return_pending");
        if (source) {
          trackProductEvent(
            "auth_return_completed",
            {
              source_surface: source === "signup" ? "signup" : "login",
              auth_method: "email_otp",
            },
            `email_otp:${source}`
          );
          sessionStorage.removeItem("dp_auth_return_pending");
        }
      } catch {
        // Identity still succeeds if storage is unavailable.
      }
    }

    void supabase.auth.getUser().then(({ data }) => {
      if (!authChanged) syncIdentity(data.user?.id);
    }).catch(() => {
      // Auth lookup failure must not affect navigation or restore stale identity.
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      authChanged = true;
      syncIdentity(session?.user?.id, event === "SIGNED_OUT");
    });

    return () => {
      active = false;
      subscription.unsubscribe();
      if (typeof window !== "undefined") window.removeEventListener?.(MISTAKE_RESOLVED_EVENT, resolved);
    };
  }, []);

  return null;
}
