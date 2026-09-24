import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getServerProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/auth/login");

  const response = await fetch("http://127.0.0.1:8000/profile", {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  if (response.status === 401) redirect("/auth/login");

  if (!response.ok) {
    throw new Error(`Profile API failed (${response.status})`);
  }

  const profile = await response.json();

  if (!profile.onboarding_completed) {
    redirect("/onboarding");
  }

  return { profile, user };
}