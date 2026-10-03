import { redirect } from "next/navigation";
import { getProfileContext } from "@/lib/profile-server";
import { readProfile } from "@/lib/profile-store";
import { resolveAuthDestination, safeAuthNext } from "@/lib/auth-redirect";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage({ searchParams }: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = safeAuthNext((await searchParams).next);
  const { supabase, user } = await getProfileContext();
  if (!user) redirect(resolveAuthDestination("guest", next));
  let profile;
  try { profile = await readProfile(supabase, user); } catch {
    redirect(resolveAuthDestination("error", next));
  }
  if (profile.onboarding_completed) redirect(resolveAuthDestination("complete", next));
  return <OnboardingForm profile={{ ...profile, full_name: profile.full_name ?? user.user_metadata?.full_name ?? user.user_metadata?.name ?? null }} next={next} />;
}
