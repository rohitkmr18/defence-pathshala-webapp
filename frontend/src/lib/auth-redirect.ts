/** Accept only local paths, never external URLs or protocol-relative redirects. */
export function safeAuthNext(value: string | null | undefined): string {
  if (!value?.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) {
    return "/dashboard";
  }
  const base = "https://auth.invalid";
  const url = new URL(value, base);
  if (url.origin !== base || url.pathname.startsWith("//")) return "/dashboard";
  return `${url.pathname}${url.search}${url.hash}`;
}

export async function completeAuthCallback(
  params: URLSearchParams,
  exchangeCode: (code: string) => Promise<{ error: unknown }>,
): Promise<string> {
  const failure = "/auth/login?error=oauth_failed";
  const code = params.get("code");
  if (params.has("error") || !code) return failure;
  try {
    const { error } = await exchangeCode(code);
    return error ? failure : safeAuthNext(params.get("next"));
  } catch {
    return failure;
  }
}
