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
  // gtag.js only processes Arguments objects in the dataLayer; a plain array is
  // silently ignored, so before this fix no custom event reached GA4 (28 days, zero).
  // Push `arguments` exactly as the gtag() stub does. Events queued before gtag.js
  // loads are replayed by it, so early landing events are kept.
  const analytics = window as AnalyticsWindow;
  analytics.dataLayer ??= [];
  analytics.dataLayer.push(asArguments("event", name, context));
}

/** Returns a real Arguments object, the only shape gtag.js reads from the dataLayer. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function asArguments(..._args: unknown[]): IArguments {
  // eslint-disable-next-line prefer-rest-params
  return arguments;
}
