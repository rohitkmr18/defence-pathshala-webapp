import type { ProductEventProperties } from "../events";

type AnalyticsWindow = Window & { dataLayer?: unknown[] };

export function captureGa4(
  name: string,
  properties: ProductEventProperties
): void {
  if (typeof window === "undefined") return;
  const analytics = window as AnalyticsWindow;
  analytics.dataLayer ??= [];
  analytics.dataLayer.push(["event", name, properties]);
}
