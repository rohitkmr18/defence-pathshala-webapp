"use client";

import { useEffect } from "react";
import type { ProductEventName, ProductEventProperties } from "@/lib/analytics/events";
import { trackProductEvent } from "@/lib/analytics/track";

export default function TrackOnMount({
  event,
  properties = {},
  once,
}: {
  event: ProductEventName;
  properties?: ProductEventProperties;
  once?: string;
}) {
  useEffect(() => {
    trackProductEvent(event, properties, once);
  }, [event, once, properties]);

  return null;
}
