export type CorpusFilter = { year?: number; section?: string; recordId?: string; offset: number; limit: number };
export type PublishedQuestion = {
  record_id: string; paper_id: string; year: number; section: string;
  original_label: string; revision_id: string; revision: number; prompt: string;
  printed_directions: string; marks: number; selection_rule: string;
  word_limit: number | null; word_limit_status: string; language_rule: string;
  primary_domain: string; secondary_tags: string[]; demand_tags: string[];
  demand_card: Record<string, unknown>; source_url: string; pdf_sha256: string;
  printed_page: string; pdf_page_index: number;
};
export type ReadPublished = (filter: CorpusFilter) => Promise<{ data: PublishedQuestion[]; count: number }>;

export function localReadsEnabled(env: Record<string, string | undefined>): boolean {
  if (env.CAPF_P2_LOCAL_READS !== "1" || env.VERCEL) return false;
  try {
    const url = new URL(env.NEXT_PUBLIC_SUPABASE_URL ?? "");
    return url.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)
      && !url.username && !url.password && url.pathname === "/" && !url.search && !url.hash;
  } catch { return false; }
}

const headers = { "Cache-Control": "no-store" };
function reply(body: unknown, status = 200) { return Response.json(body, { status, headers }); }

export async function readCorpus(request: Request, read: ReadPublished, enabled: boolean, recordId?: string) {
  if (!enabled) return reply({ error: "CAPF_NOT_AVAILABLE" }, 404);
  const params = new URL(request.url).searchParams;
  const allowed = recordId === undefined ? ["year", "section", "offset", "limit"] : [];
  if ([...params.keys()].some(k => !allowed.includes(k) || params.getAll(k).length !== 1))
    return reply({ error: "INVALID_FILTER" }, 400);
  if (recordId !== undefined && !/^CAPF-P2-20[0-9]{2}-Q[12]-[a-f]$/.test(recordId))
    return reply({ error: "NOT_FOUND" }, 404);
  const year = params.get("year");
  const section = params.get("section");
  const offset = params.get("offset") ?? "0";
  const limit = params.get("limit") ?? "20";
  if ((year !== null && !/^202[0-6]$/.test(year)) ||
      (section !== null && !["Q1_ESSAY", "Q2_ARGUMENT"].includes(section)) ||
      !/^[0-9]{1,5}$/.test(offset) || !/^[0-9]{1,2}$/.test(limit) || +limit < 1 || +limit > 50)
    return reply({ error: "INVALID_FILTER" }, 400);
  try {
    const result = await read({ year: year ? +year : undefined, section: section ?? undefined,
      recordId, offset: recordId ? 0 : +offset, limit: recordId ? 1 : +limit });
    if (recordId) return result.data.length ? reply({ question: result.data[0], scoring_enabled: false })
      : reply({ error: "NOT_FOUND" }, 404);
    return reply({ questions: result.data, total: result.count, offset: +offset, limit: +limit,
      publication: "approved_only", scoring_enabled: false });
  } catch {
    return reply({ error: "CORPUS_UNAVAILABLE" }, 503);
  }
}
