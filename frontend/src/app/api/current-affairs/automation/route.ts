import { createClient } from "@supabase/supabase-js";
import { verifyPublishingIdentity } from "@/lib/current-affairs/github-identity";
import { handlePublishingRequest } from "@/lib/current-affairs/automation-handler";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const service = () => createClient(url!, serviceKey!, { auth: { persistSession: false, autoRefreshToken: false } });
  return handlePublishingRequest(req, {
    verify: verifyPublishingIdentity,
    ready: () => url === "https://afhwegrxnvgsqbqadvwr.supabase.co" && !!serviceKey,
    production: process.env.VERCEL_ENV === "production",
    publish: async payload => {
      const { data, error } = await service().rpc("publish_current_affairs_edition_atomic", { payload });
      return error ? { errorCode: error.code || "unknown" } : { id: data };
    },
    connectivity: async () => {
      const { error } = await service().from("current_affairs_posts").select("id").limit(1);
      return !error;
    },
    audit: record => console.info("current_affairs_publication", JSON.stringify(record)),
  });
}
