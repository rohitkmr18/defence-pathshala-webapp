import type { ProductEventProperties } from "./events";

/** Defense in depth; call sites must construct bounded, non-sensitive events. */
export function safeEventProperties(properties: ProductEventProperties): ProductEventProperties {
  return Object.fromEntries(Object.entries(properties).filter(([key, value]) =>
    value !== undefined && !/(email|password|otp|token|authorization|cookie|full_name|phone)/i.test(key)
  ));
}

/** Auth callbacks can carry credentials in query strings and fragments. */
export function safeAnalyticsUrl(value: string): string {
  try {
    const url = new URL(value, window.location.origin);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "";
  }
}
