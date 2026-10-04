type AnalyticsWindow = Window & { dataLayer?: unknown[] };
const emitted = new Set<string>();

/** Use the GoogleAnalytics dataLayer already installed in the root layout. */
export function trackLearningEvent(name: string, context: Record<string, string | number | boolean | undefined> = {}, once?: string): void {
  if (typeof window === "undefined") return;
  const key = once ? `${name}:${once}` : undefined;
  if (key) {
    if (emitted.has(key)) return;
    try {
      if (sessionStorage.getItem(`dp_event:${key}`)) return;
      sessionStorage.setItem(`dp_event:${key}`, "1");
    } catch { /* In-memory deduplication remains available. */ }
    emitted.add(key);
  }
  const analytics = window as AnalyticsWindow;
  analytics.dataLayer ??= [];
  // Same argument shape as @next/third-parties sendGAEvent.
  analytics.dataLayer.push(["event", name, context]);
}
