import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient as createUserClient } from "@/lib/supabase/server";

const AFCAT_STAGING_PROJECT = "pxfstrzceyxnweeaydvz";

export function afcatStagingAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // Deliberate fail closed: a normal DP deployment must never use this unfinished engine.
  if (!url || new URL(url).hostname !== `${AFCAT_STAGING_PROJECT}.supabase.co` || !key) {
    throw new Error("AFCAT staging environment is not configured");
  }
  return createAdminClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function afcatStagingUser() {
  afcatStagingAdmin(); // Enforce isolation before authorizing any user.
  const client = await createUserClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}
