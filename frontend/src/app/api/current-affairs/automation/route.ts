import { createHash } from "node:crypto";
import { validateEditorialEdition } from "@/lib/current-affairs/editorial-validation";
import { createClient } from "@supabase/supabase-js";
import { verifyPublishingIdentity } from "@/lib/current-affairs/github-identity";
import { handlePublishingRequest } from "@/lib/current-affairs/automation-handler";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const service = () => createClient(url!, serviceKey!, { auth: { persistSession: false, autoRefreshToken: false } });
  async function publishEditorial(day: string, digest: string | null, legacyPayload?: Record<string, unknown>) {
    const { data, error } = await service().rpc("ca_publish_editorial", {
      day, digest, legacy_payload: legacyPayload,
    });
    if (error?.code === "P0001" && /draft approval/i.test(error.message)) return { errorCode: "draft_approval" };
    return error ? { errorCode: error.code || "unknown" } : { id: data };
  }
  return handlePublishingRequest(req, {
    verify: verifyPublishingIdentity,
    ready: () => url === "https://afhwegrxnvgsqbqadvwr.supabase.co" && !!serviceKey,
    production: process.env.VERCEL_ENV === "production",
    publish: payload => publishEditorial(String(payload.date), null, payload),
    publishDraft: async (date, digest) => {
      const { data, error } = await service().from("ca_editorial_drafts").select("package")
        .eq("edition_date", date).eq("sha256", digest).maybeSingle();
      if (error) return { errorCode: error.code || "unknown" };
      if (!data || createHash("sha256").update(data.package, "utf8").digest("hex") !== digest) {
        return { errorCode: "draft_approval" };
      }
      try { validateEditorialEdition(JSON.parse(data.package).edition); }
      catch { return { errorCode: "draft_approval" }; }
      return publishEditorial(date, digest);
    },
    connectivity: async () => {
      const { error } = await service().from("current_affairs_posts").select("id").limit(1);
      return !error;
    },
    audit: record => console.info("current_affairs_publication", JSON.stringify(record)),
  });
}
