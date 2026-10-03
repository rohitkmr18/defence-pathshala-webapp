import { safeAuthNext } from "@/lib/auth-navigation";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
    } catch {
      return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
    }
  }

  if (!code) return NextResponse.redirect(`${origin}/auth/login?error=missing_auth_code`);
  return NextResponse.redirect(new URL(safeAuthNext(searchParams.get("next")), origin));
}