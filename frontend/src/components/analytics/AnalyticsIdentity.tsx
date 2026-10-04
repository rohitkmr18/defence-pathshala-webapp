"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  identifyAnalyticsUser,
  resetAnalyticsUser,
} from "@/lib/analytics/track";

export default function AnalyticsIdentity() {
  useEffect(() => {
    const supabase = createClient();
    let active = true;

    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (data.user?.id) identifyAnalyticsUser(data.user.id);
      else resetAnalyticsUser();
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
