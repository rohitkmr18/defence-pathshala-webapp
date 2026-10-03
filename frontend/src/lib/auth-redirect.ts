/** Accept only local paths, never external URLs or protocol-relative redirects. */
export function safeAuthNext(value: string | null | undefined): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) {
    return "/dashboard";
  }
  const base = "https://auth.invalid";
  let url: URL;
  try { url = new URL(value, base); } catch { return "/dashboard"; }
  if (url.origin !== base || url.pathname.startsWith("//")) return "/dashboard";
  // Validate decoded path, but retain the original query including Explore's returnTo.
  let path = url.pathname;
  try {
    for (let i = 0; i < 4; i++) {
      const decoded = decodeURIComponent(path);
      if (decoded === path) break;
      path = decoded;
    }
  } catch { return "/dashboard"; }
  if (/[\\\u0000-\u0020%]/.test(path) || path.startsWith("//")) return "/dashboard";
  path = new URL(path, base).pathname.toLowerCase();
  if (path === "/auth" || path.startsWith("/auth/") ||
      path === "/onboarding" || path.startsWith("/onboarding/")) return "/dashboard";
  return `${url.pathname}${url.search}${url.hash}`;
}

export type AuthState = "guest" | "incomplete" | "complete" | "error";

export function authUrl(path: string, next: string | null | undefined): string {
  return `${path}?${new URLSearchParams({ next: safeAuthNext(next) })}`;
}

/** The single destination model, shared by route entry and post-auth flows. */
export function resolveAuthDestination(state: AuthState, next?: string | null): string {
  if (state === "guest") return authUrl("/auth/login", next);
  if (state === "error") return authUrl("/auth/recovery", next);
  if (state === "incomplete") return authUrl("/onboarding", next);
  return safeAuthNext(next);
}

/** null means this route may render, including public guest practice/Explore. */
export function authEntryDestination(
  state: AuthState, pathname: string, next: string | null, current: string,
): string | null {
  if (pathname === "/auth/continue") return resolveAuthDestination(state, next);
  if (pathname === "/auth/login" || pathname === "/auth/signup") {
    return state === "guest" ? null : resolveAuthDestination(state, next);
  }
  if (pathname === "/onboarding") {
    return state === "incomplete" ? null : resolveAuthDestination(state, next);
  }
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return state === "incomplete" || state === "error"
      ? resolveAuthDestination(state, current) : null;
  }
  return null;
}

export async function completeAuthCallback(
  params: URLSearchParams,
  exchangeCode: (code: string) => Promise<{ error: unknown }>,
): Promise<string> {
  const failure = `${authUrl("/auth/login", params.get("next"))}&error=oauth_failed`;
  const code = params.get("code");
  if (params.has("error") || !code) return failure;
  try {
    const { error } = await exchangeCode(code);
    return error ? failure : authUrl("/auth/continue", params.get("next"));
  } catch {
    return failure;
  }
}
