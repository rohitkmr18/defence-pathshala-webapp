// Decides which Supabase project the AFCAT engine may talk to. Fails closed.
// Staging is always allowed. Production is allowed ONLY when the explicit kill-switch
// AFCAT_PRODUCTION_ENABLED is exactly "true" AND the URL host is the known production project.
export const AFCAT_STAGING_PROJECT = "pxfstrzceyxnweeaydvz";
export const AFCAT_PRODUCTION_PROJECT = "afhwegrxnvgsqbqadvwr";

export function isAfcatProjectAllowed(
  supabaseUrl: string | undefined,
  productionEnabled: string | undefined,
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
  if (host === `${AFCAT_STAGING_PROJECT}.supabase.co`) return true;
  return productionEnabled === "true" && host === `${AFCAT_PRODUCTION_PROJECT}.supabase.co`;
}
