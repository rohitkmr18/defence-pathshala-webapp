import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { handleEditorialReview } from "@/lib/current-affairs/editorial-review";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return handleEditorialReview(request, {
    async isFounder() {
      const founder = process.env.ADMIN_EMAIL;
      if (!founder) return false;
      const auth = await createClient();
      const { data: { user }, error } = await auth.auth.getUser();
      return !error && !!user?.email_confirmed_at && user.email?.toLowerCase() === founder.toLowerCase();
    },
    async read(date) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!url || !key || (process.env.VERCEL_ENV === "preview" &&
          url === "https://afhwegrxnvgsqbqadvwr.supabase.co")) throw new Error("Review storage unavailable");
      const client = createServiceClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
      const { data, error } = await client.from("ca_editorial_drafts").select("sha256,package")
        .eq("edition_date", date).order("revision", { ascending: false }).limit(1)
        .abortSignal(AbortSignal.timeout(10000)).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}
