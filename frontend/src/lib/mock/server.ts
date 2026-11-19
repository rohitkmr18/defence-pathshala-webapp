import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient as createUserClient } from "@/lib/supabase/server";
import { isMockProjectAllowed } from "@/lib/mock/project-guard";

/** Service-role client. Server-only; throws unless the project guard allows this Supabase project. */
export function mockAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key || !isMockProjectAllowed(url, process.env.MOCK_PRODUCTION_ENABLED)) {
    throw new Error("Mock environment is not configured");
  }
  return createAdminClient(url as string, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function mockUser() {
  mockAdmin(); // Enforce isolation before authorizing any user.
  const client = await createUserClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}
