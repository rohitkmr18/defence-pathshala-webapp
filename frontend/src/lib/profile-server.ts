import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/profile/types";

export type UserProfile = Profile;
export type { Profile };

// Request-scoped memoization only: user/profile data is never shared across users.
const getProfileContext = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
});

export async function getServerProfile(): Promise<{
  profile: UserProfile;
  user: import("@supabase/supabase-js").User;
}> {
  const { supabase, user } = await getProfileContext();

  if (!user) {
    redirect("/auth/login");
  }

  let profile: UserProfile | null = null;

  // Read the canonical profile directly; avoid a backend hop and timeout on navigation.
  if (!profile) {
    try {
      const [{ data: profileRow, error: profileError }, { data: examRows, error: examError }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, target_year, onboarding_completed")
          .eq("id", user.id).maybeSingle(),
        supabase.from("user_exam_preferences").select("exam").eq("user_id", user.id),
      ]);
      if (profileError || examError) throw new Error("Could not load profile");

      if (profileRow) {
        profile = {
          id: profileRow.id,
          full_name: profileRow.full_name,
          target_year: profileRow.target_year,
          onboarding_completed: profileRow.onboarding_completed ?? false,
          target_exams: (examRows || []).map((item) => item.exam),
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
  const { user } = await getProfileContext();

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
  } catch (error: unknown) {
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