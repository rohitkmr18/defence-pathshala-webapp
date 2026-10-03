import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authEntryDestination } from "@/lib/auth-redirect";
import { readAuthState } from "@/lib/profile-store";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;
  const guarded = ["/auth/login", "/auth/signup", "/auth/continue", "/onboarding", "/dashboard"].includes(pathname)
    || pathname.startsWith("/dashboard/");
  if (guarded) {
    const state = await readAuthState(supabase);
    const destination = authEntryDestination(state, pathname, request.nextUrl.searchParams.get("next"),
      `${pathname}${request.nextUrl.search}`);
    if (destination) {
      const redirected = NextResponse.redirect(new URL(destination, request.url));
      response.cookies.getAll().forEach((cookie) => redirected.cookies.set(cookie));
      redirected.headers.set("Cache-Control", "private, no-store");
      return redirected;
    }
  } else {
    // A session refresh outage must not prevent recovery/public pages rendering.
    try { await supabase.auth.getUser(); } catch { /* guarded routes handle errors above */ }
  }

  return response;
}
