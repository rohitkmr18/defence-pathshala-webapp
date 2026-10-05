import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/profile/types";
import type { AuthState } from "@/lib/auth-redirect";

/** A missing row means setup is needed; a failed read is never completion. */
export async function readProfile(supabase: SupabaseClient, user: User): Promise<Profile> {
  const read = () => Promise.all([
    supabase.from("profiles").select("id, full_name, target_year, onboarding_completed")
      .eq("id", user.id).maybeSingle(),
    supabase.from("user_exam_preferences").select("exam").eq("user_id", user.id),
  ]);
  let [profileResult, examResult] = await read();
  // A freshly verified OTP session can be accepted by Auth while a REST read
  // rejects its JWT (PGRST303). Revalidate ownership and retry safe reads once.
  if (profileResult.error?.code === "PGRST303" || examResult.error?.code === "PGRST303") {
    const { data: { user: verifiedUser }, error } = await supabase.auth.getUser();
    if (error || verifiedUser?.id !== user.id) throw new Error("Your profile could not be loaded. Please retry.");
    [profileResult, examResult] = await read();
  }
  const { data: row, error: profileError } = profileResult;
  const { data: exams, error: examError } = examResult;
  if (profileError || examError) throw new Error("Your profile could not be loaded. Please retry.");
  return {
    id: user.id,
    full_name: row ? row.full_name : user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    target_year: row?.target_year ?? null,
    onboarding_completed: row?.onboarding_completed === true,
    target_exams: (exams ?? []).map((item) => item.exam),
  };
}

export async function readAuthState(supabase: SupabaseClient): Promise<AuthState> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error && error.status !== 401 && error.status !== 403 && error.name !== "AuthSessionMissingError") return "error";
    if (!user) return "guest";
    return (await readProfile(supabase, user)).onboarding_completed ? "complete" : "incomplete";
  } catch { return "error"; }
}
