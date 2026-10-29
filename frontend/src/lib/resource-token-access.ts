import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

/**
 * Fail-closed, server-only bearer-token validation. NOT a public browser client.
 * Requires private.resource_access_tokens schema installed in a dedicated staging DB.
 * Never expose the service-role credential, bearer token, or token hash through a client.
 */
export async function validateResourceToken(resourceSlug: string, token: string | null): Promise<boolean> {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !token || token.length < 32 || token.length > 256) return false;
  // Only URL-safe generated tokens, not arbitrary user-controlled strings.
  if (!/^[a-zA-Z0-9_-]+$/.test(token)) return false;
  const tokenHash = createHash("sha256").update(token, "utf8").digest("hex");
  const supabase = createClient(url, key, {auth: {persistSession:false, autoRefreshToken:false}});
  // Query the private schema only; the schema must NOT be exposed via the Data API.
  // For fail-closed operation until database integration, no token is accepted.
  void supabase;
  void tokenHash;
  void resourceSlug;
  return false;
}

/** Constant-time matching utility for a future server-side token verifier. */
export function hashesEqual(a: string, b: string): boolean {
  if (!/^[0-9a-f]{64}$/.test(a) || !/^[0-9a-f]{64}$/.test(b)) return false;
  return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
}
