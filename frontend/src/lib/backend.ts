import { requireBackendUrl } from "@/lib/backend-config";
import { createClient } from "@/lib/supabase/server";



export async function backendGET(path: string) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: Record<string, string> = {};
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const signal = AbortSignal.timeout(2000);

  try {
    const res = await fetch(`${requireBackendUrl()}${path}`, {
      headers,
      cache: "no-store",
      signal,
    });
    return res;
  } catch (err) {
    throw err;
  }
}