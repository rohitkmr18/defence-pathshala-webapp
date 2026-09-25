import { createClient } from "@/lib/supabase/server";

const BACKEND_URL =
  process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function backendGET(path: string) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return fetch(`${BACKEND_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });
}