import type { ProductEventProperties } from "./events";

/** Defense in depth; call sites must construct bounded, non-sensitive events. */
export function safeEventProperties(properties: ProductEventProperties): ProductEventProperties {
  return Object.fromEntries(Object.entries(properties).filter(([key, value]) =>
    value !== undefined && !/(email|password|otp|token|authorization|cookie|full_name|phone)/i.test(key)
  ));
}

/** Auth callbacks can carry credentials in query strings and fragments. */
export function safeAnalyticsUrl(value: string): string {
  if (value === "$direct") return value;
  try {
    const url = new URL(value, window.location.origin);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "";
  }
}

/** SDK person metadata (e.g. $set_once) can contain nested initial URLs. */
export function safeSdkUrls(properties: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(properties).map(([key, value]) => {
    if (/url|referrer/i.test(key) && typeof value === "string") {
      return [key, safeAnalyticsUrl(value)];
    }
    if (Array.isArray(value)) {
      return [key, value.map(item => item && typeof item === "object" ? safeSdkUrls(item) : item)];
    }
    return [key, value && typeof value === "object"
      ? safeSdkUrls(value as Record<string, unknown>) : value];
  }));
}
