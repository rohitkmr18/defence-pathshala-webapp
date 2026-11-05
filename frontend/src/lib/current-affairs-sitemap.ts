import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export interface CurrentAffairsSitemapEdition {
  date: string;
  updatedAt: string | null;
}

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://afhwegrxnvgsqbqadvwr.supabase.co";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Published Current Affairs editions for the sitemap.
 * Reads only date + updated_at of published posts; no learner data.
 */
export const getPublishedCurrentAffairsEditions = unstable_cache(
  async (): Promise<CurrentAffairsSitemapEdition[]> => {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!key) {
      console.error("[Sitemap] No Supabase key available for Current Affairs editions.");
      return [];
    }
    const client = createClient(supabaseUrl, key, { auth: { persistSession: false } });
    const { data, error } = await client
      .from("current_affairs_posts")
      .select("date,updated_at")
      .eq("published", true)
      .order("date", { ascending: false });

    if (error) {
      console.error("[Sitemap] Current Affairs query error:", error);
      return [];
    }

    return (data ?? [])
      .filter((row) => typeof row.date === "string" && DATE_RE.test(row.date))
      .map((row) => ({ date: row.date as string, updatedAt: (row.updated_at as string | null) ?? null }));
  },
  ["sitemap-current-affairs-editions-v1"],
  { revalidate: 3600 }
);

/** Converts a stored timestamp into a Date the sitemap can emit, or undefined if unusable. */
export function toLastModified(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}
