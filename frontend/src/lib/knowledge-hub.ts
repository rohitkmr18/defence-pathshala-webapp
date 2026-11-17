import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

export type ArticleBlock = { type: "heading" | "paragraph" | "list"; text?: string; items?: string[] };
export type KnowledgeArticle = {
  slug: string; title: string; description: string; category: string;
  exam: string | null; author_name: string; reviewed_by: string | null;
  published_at: string; updated_at: string | null;
  blocks: ArticleBlock[]; sources: { label: string; url: string }[];
  related_practice_url: string | null; image_url: string | null;
};
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const isValidArticleSlug = (slug: string) => slug.length <= 120 && SLUG.test(slug);

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Knowledge Hub Supabase configuration missing");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

const columns = "slug,title,description,category,exam,author_name,reviewed_by,published_at,updated_at,blocks,sources,related_practice_url,image_url";

/** Public reads are deliberately anonymous and filtered; RLS additionally enforces publication status. */
export const getPublishedKnowledgeArticles = unstable_cache(async (): Promise<KnowledgeArticle[]> => {
  const { data, error } = await client().from("knowledge_articles").select(columns)
    .eq("status", "published").not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false }).limit(100);
  if (error) throw new Error("Knowledge Hub article list unavailable");
  return (data ?? []) as unknown as KnowledgeArticle[];
}, ["knowledge-hub-published-v1"], { revalidate: 300 });

/** Exhaustive sitemap inventory. Never silently stop after the first hundred articles. */
export const getPublishedKnowledgeInventory = unstable_cache(async (): Promise<
  Pick<KnowledgeArticle, "slug" | "published_at" | "updated_at">[]
> => {
  const db = client();
  const pageSize = 500;
  const rows: Pick<KnowledgeArticle, "slug" | "published_at" | "updated_at">[] = [];
  let offset = 0;
  for (;;) {
    const { data, error } = await db.from("knowledge_articles")
      .select("slug,published_at,updated_at")
      .eq("status", "published").not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false }).order("slug", { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (error) throw new Error("Knowledge Hub sitemap inventory unavailable");
    const batch = (data ?? []) as Pick<KnowledgeArticle, "slug" | "published_at" | "updated_at">[];
    rows.push(...batch);
    if (batch.length < pageSize) break;
    offset += batch.length;
  }
  return rows;
}, ["knowledge-hub-sitemap-v1"], { revalidate: 300 });

export const getPublishedKnowledgeArticle = unstable_cache(async (slug: string): Promise<KnowledgeArticle | null> => {
  if (!isValidArticleSlug(slug)) return null;
  const { data, error } = await client().from("knowledge_articles").select(columns)
    .eq("slug", slug).eq("status", "published").not("published_at", "is", null)
    .lte("published_at", new Date().toISOString()).maybeSingle();
  if (error) throw new Error("Knowledge Hub article unavailable");
  return data as unknown as KnowledgeArticle | null;
}, ["knowledge-hub-article-v1"], { revalidate: 300 });

export function safePracticePath(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\r\n]/.test(value)) return null;
  return value;
}
export function safeSourceUrl(value: string): string | null {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? parsed.href : null;
  } catch { return null; }
}
