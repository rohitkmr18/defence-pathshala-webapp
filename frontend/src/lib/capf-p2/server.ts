import "server-only";
import { createClient } from "@/lib/supabase/server";
import { localReadsEnabled, type ReadPublished } from "./read-contract";

// Never use a service client: the view and underlying table RLS both apply.
export const readPublished: ReadPublished = async (filter) => {
  if (!localReadsEnabled(process.env)) throw new Error("CAPF_NOT_AVAILABLE");
  const client = await createClient();
  let query = client.from("capf_p2_published_questions").select(
    "record_id,paper_id,year,section,original_label,revision_id,revision,prompt,printed_directions,marks,selection_rule,word_limit,word_limit_status,language_rule,primary_domain,secondary_tags,demand_tags,demand_card,source_url,pdf_sha256,printed_page,pdf_page_index",
    { count: "exact" },
  );
  if (filter.year !== undefined) query = query.eq("year", filter.year);
  if (filter.section) query = query.eq("section", filter.section);
  if (filter.recordId) query = query.eq("record_id", filter.recordId);
  const { data, count, error } = await query.order("record_id")
    .range(filter.offset, filter.offset + filter.limit - 1);
  if (error || data === null || count === null) throw new Error("CORPUS_UNAVAILABLE");
  return { data, count };
};
