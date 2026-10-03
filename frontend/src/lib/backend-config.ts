export function getBackendUrl(): string | null {
  const configured = process.env.BACKEND_URL?.trim();
  if (!configured) return process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : null;
  const url = new URL(configured);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid BACKEND_URL protocol");
  if (process.env.NODE_ENV === "production" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
    throw new Error("Production BACKEND_URL must not use localhost");
  }
  return configured.replace(/\/$/, "");
}
export function requireBackendUrl(): string {
  const url = getBackendUrl();
  if (!url) throw new Error("FastAPI is not configured: set BACKEND_URL for this feature");
  return url;
}
