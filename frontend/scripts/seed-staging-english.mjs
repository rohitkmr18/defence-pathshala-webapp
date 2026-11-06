// TEMPORARY, STAGING-ONLY preview seeding for CDS English. Runs before `next build`.
// No-op unless NEXT_PUBLIC_SUPABASE_URL points at the staging project. Never fails the build.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const STAGING_REF = "pxfstrzceyxnweeaydvz";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
if (!url.includes(STAGING_REF) || !key) {
  console.log("[seed-staging-english] skipped (not the staging project)");
  process.exit(0);
}
try {
  const db = createClient(url, key, { auth: { persistSession: false } });
  const uuid = (t) => { const h = createHash("sha1").update(t).digest("hex"); return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`; };
  const run = async (label, p) => { const { error } = await p; if (error) throw new Error(`${label}: ${error.message}`); };
  for (const f of ["cds_i_2026_english.json", "cds_ii_2026_english.json", "cds_i_2025_english.json", "cds_ii_2025_english.json"]) {
    const paper = JSON.parse(readFileSync(new URL(`./seed/english/${f}`, import.meta.url), "utf8"));
    const ids = {};
    const passages = paper.passages.map((p) => { const id = uuid(`${paper.code}|${p.key}`); ids[p.key] = id; return { id, paper_id: "cds-english", title: p.title, body: p.body, source: p.source }; });
    if (passages.length) await run("passages", db.from("question_passages").upsert(passages, { onConflict: "id" }));
    const rows = paper.questions.map(({ passage_key, ...q }) => ({ ...q, passage_id: passage_key ? ids[passage_key] : null }));
    for (let i = 0; i < rows.length; i += 25) await run("questions", db.from("questions").upsert(rows.slice(i, i + 25), { onConflict: "question_id" }));
    await run("intelligence", db.from("dp_question_intelligence_v1").upsert(paper.intelligence, { onConflict: "question_id" }));
    console.log(`[seed-staging-english] ${paper.code}: ${rows.length} questions`);
  }
  const { count } = await db.from("questions").select("id", { count: "exact", head: true }).eq("paper_id", "cds-english");
  console.log(`[seed-staging-english] OK: ${count} cds-english questions on staging`);
} catch (e) {
  console.log("[seed-staging-english] FAILED (build continues):", e.message);
}
