import { createClient } from "@/lib/supabase/server";

const BACKEND_URL =
  process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function backendGET(path: string) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: Record<string, string> = {};
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      headers,
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}