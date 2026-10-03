import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { readProfile } from "@/lib/profile-store";
import { resolveAuthDestination } from "@/lib/auth-redirect";
import type { Profile } from "@/lib/profile/types";

export type UserProfile = Profile;
export type { Profile };

// Request-scoped only; errors propagate to the recoverable error boundary.
export const getProfileContext = cache(async () => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error && error.status !== 401 && error.status !== 403 && error.name !== "AuthSessionMissingError") {
    throw new Error("Your session could not be loaded. Please retry.");
  }
  return { supabase, user };
});

export async function getServerProfile(next = "/dashboard") {
  const { supabase, user } = await getProfileContext();
  if (!user) redirect(resolveAuthDestination("guest", next));
  const profile = await readProfile(supabase, user);
  if (!profile.onboarding_completed) redirect(resolveAuthDestination("incomplete", next));
  return { profile, user };
}

export async function getSafeProfile() {
  const { user } = await getProfileContext();
  if (!user) {
    return {
      profile: { id: "guest", full_name: "Aspirant", target_year: null,
        onboarding_completed: false, target_exams: [] } as Profile,
      user: null, isGuest: true,
    };
  }
  const { profile } = await getServerProfile();
  return { profile, user, isGuest: false };
}
