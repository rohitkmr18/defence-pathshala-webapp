"use client";
import { useEffect } from "react";
import { trackAfcatFunnel } from "@/lib/afcat/funnel";

/** Fires the landing view once per browser session. Renders nothing. */
export default function AfcatLandingTracker() {
  useEffect(() => {
    trackAfcatFunnel("afcat_landing_view", {}, "landing");
  }, []);
  return null;
}
