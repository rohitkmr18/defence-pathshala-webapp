import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient as createUserClient } from "@/lib/supabase/server";
import { isAfcatProjectAllowed } from "@/lib/afcat/project-guard";

export function afcatStagingAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // Deliberate fail closed: staging always; production only with AFCAT_PRODUCTION_ENABLED=true.
  if (!key || !isAfcatProjectAllowed(url, process.env.AFCAT_PRODUCTION_ENABLED)) {
    throw new Error("AFCAT environment is not configured");
  }
  return createAdminClient(url as string, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function afcatStagingUser() {
  afcatStagingAdmin(); // Enforce isolation before authorizing any user.
  const client = await createUserClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}
