import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface UserProfile {
  id: string;
  full_name: string | null;
  target_year: number | null;
  onboarding_completed: boolean;
  target_exams: string[];
}

export async function getServerProfile(): Promise<{
  profile: UserProfile;
  user: import("@supabase/supabase-js").User;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  let profile: UserProfile | null = null;

  // 1. Try FastAPI backend with a short timeout
  try {
    const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${backendUrl}/profile`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.status === 401) {
      redirect("/auth/login");
    }

    if (response.ok) {
      profile = (await response.json()) as UserProfile;
    }
  } catch (error: any) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    // Backend offline / connection refused / timeout — fall back to Supabase directly
  }

  // 2. Direct Supabase query fallback if backend did not respond
  if (!profile) {
    try {
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("id, full_name, target_year, onboarding_completed")
        .eq("id", user.id)
        .maybeSingle();

      const { data: examRows } = await supabase
        .from("user_exam_preferences")
        .select("exam")
        .eq("user_id", user.id);

      if (profileRow) {
        profile = {
          id: profileRow.id,
          full_name: profileRow.full_name,
          target_year: profileRow.target_year,
          onboarding_completed: profileRow.onboarding_completed ?? false,
          target_exams: (examRows || []).map((item: any) => item.exam),
        };
      } else {
        // Profile row doesn't exist yet in Supabase
        profile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Aspirant",
          target_year: null,
          onboarding_completed: false,
          target_exams: [],
        };
      }
    } catch {
      profile = {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Aspirant",
        target_year: null,
        onboarding_completed: true,
        target_exams: [],
      };
    }
  }

  if (!profile.onboarding_completed) {
    redirect("/onboarding");
  }

  return { profile, user };
}

/**
 * Safe version that does not redirect guests to /auth/login.
 * Returns guest profile for unauthenticated visitors.
 */
export async function getSafeProfile(): Promise<{
  profile: UserProfile;
  user: import("@supabase/supabase-js").User | null;
  isGuest: boolean;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      profile: {
        id: "guest",
        full_name: "Aspirant",
        target_year: null,
        onboarding_completed: true,
        target_exams: ["Choose your target exam"],
      },
      user: null,
      isGuest: true,
    };
  }

  try {
    const { profile } = await getServerProfile();
    return { profile, user, isGuest: false };
  } catch (error: any) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    return {
      profile: {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Aspirant",
        target_year: null,
        onboarding_completed: true,
        target_exams: ["Choose your target exam"],
      },
      user,
      isGuest: false,
    };
  }
}