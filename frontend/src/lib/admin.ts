import { createClient } from "@/lib/supabase/server";

export async function checkIsAdmin(): Promise<{
  isAdmin: boolean;
  user: import("@supabase/supabase-js").User | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isAdmin: false, user: null };
  }

  const email = user.email?.toLowerCase();
  const appMeta = user.app_metadata || {};

  // Check configured admin email or metadata
  const adminEmails = [
    "rohitcool423@gmail.com",
    process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase(),
  ].filter(Boolean);

  if (
    adminEmails.includes(email) ||
    appMeta.role === "admin"
  ) {
    return { isAdmin: true, user };
  }

  // Check profiles table role
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "admin") {
      return { isAdmin: true, user };
    }
  } catch {
    // ignore
  }

  return { isAdmin: false, user };
}

