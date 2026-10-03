import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { readAuthState } from "@/lib/profile-store";
import { resolveAuthDestination } from "@/lib/auth-redirect";

export default async function ContinuePage({ searchParams }: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  redirect(resolveAuthDestination(await readAuthState(await createClient()), next));
}
