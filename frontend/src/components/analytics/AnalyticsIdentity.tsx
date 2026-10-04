"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  identifyAnalyticsUser,
  resetAnalyticsUser,
  trackProductEvent,
} from "@/lib/analytics/track";

export default function AnalyticsIdentity() {
  useEffect(() => {
    const supabase = createClient();
    let active = true;

    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (data.user?.id) {
        identifyAnalyticsUser(data.user.id);
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
      } else {
        resetAnalyticsUser();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.id) identifyAnalyticsUser(session.user.id);
      else resetAnalyticsUser();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
