import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { completeAuthCallback } from "@/lib/auth-redirect";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const destination = await completeAuthCallback(searchParams, async (code) => {
    const supabase = await createClient();
    return supabase.auth.exchangeCodeForSession(code);
  });
  const response = NextResponse.redirect(new URL(destination, origin));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
