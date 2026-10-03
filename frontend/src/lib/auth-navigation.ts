/** Only same-origin application paths may be used after authentication. */
export function safeAuthNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\r\n]/.test(value)) return "/dashboard";
  return value;
}
