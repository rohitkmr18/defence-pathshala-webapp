// Decides which Supabase project the generic mock engine may talk to. Fails closed.
// Staging is always allowed. Production is allowed ONLY when MOCK_PRODUCTION_ENABLED is exactly
// "true" AND the URL host is the known production project.
export const MOCK_STAGING_PROJECT = "pxfstrzceyxnweeaydvz";
export const MOCK_PRODUCTION_PROJECT = "afhwegrxnvgsqbqadvwr";

export function isMockProjectAllowed(
  supabaseUrl: string | undefined,
  productionEnabled: string | undefined,
  vercelEnvironment?: string,
): boolean {
  if (!supabaseUrl) return false;
  let host: string;
  try {
    const u = new URL(supabaseUrl);
    if (u.protocol !== "https:") return false;
    host = u.hostname;
  } catch {
    return false;
  }
  if (host === `${MOCK_STAGING_PROJECT}.supabase.co`) return true;
  return vercelEnvironment !== "preview" && productionEnabled === "true"
    && host === `${MOCK_PRODUCTION_PROJECT}.supabase.co`;
}
