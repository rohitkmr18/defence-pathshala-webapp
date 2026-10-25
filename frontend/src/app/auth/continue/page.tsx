import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { readAuthState } from "@/lib/profile-store";
import { resolveAuthDestination, safeAuthNext } from "@/lib/auth-redirect";

const AFCAT_STAGING_URL = "https://pxfstrzceyxnweeaydvz.supabase.co";

export default async function ContinuePage({ searchParams }: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  // Isolated AFCAT QA only: the shared DP profile tables may not be fully
  // provisioned in the disposable staging environment. Never bypass Auth.
  // This exception is inert in every production Supabase deployment.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL === AFCAT_STAGING_URL &&
      safeAuthNext(next) === "/afcat/lab") {
    const client = await createClient();
    const { data: { user }, error } = await client.auth.getUser();
    if (!error && user) redirect("/afcat/lab");
    redirect(resolveAuthDestination("guest", next));
  }
  redirect(resolveAuthDestination(await readAuthState(await createClient()), next));
}
