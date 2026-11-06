// TEMPORARY, STAGING-ONLY preview seeding. Runs before `next build`.
// No-op unless NEXT_PUBLIC_SUPABASE_URL points at the staging project. Never fails the build.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const STAGING_REF = "pxfstrzceyxnweeaydvz";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
if (!url.includes(STAGING_REF) || !key) {
  console.log("[seed-staging-maths] skipped (not the staging project)");
  process.exit(0);
}
try {
  const seed = JSON.parse(readFileSync(new URL("./seed/cds_i_2026_maths.json", import.meta.url), "utf8"));
  const db = createClient(url, key, { auth: { persistSession: false } });
  const run = async (label, p) => { const { error } = await p; if (error) throw new Error(`${label}: ${error.message}`); };
  await run("passages", db.from("question_passages").upsert(seed.passages, { onConflict: "id" }));
  for (let i = 0; i < seed.questions.length; i += 25)
    await run("questions", db.from("questions").upsert(seed.questions.slice(i, i + 25), { onConflict: "question_id" }));
  await run("intelligence", db.from("dp_question_intelligence_v1").upsert(seed.intelligence, { onConflict: "question_id" }));
  const more = JSON.parse(readFileSync(new URL("./seed/cds_maths_more_papers.json", import.meta.url), "utf8"));
  const uuid = (t) => { const h = createHash("sha1").update(t).digest("hex"); return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`; };
  for (const paper of more) {
    const ids = {};
    const passages = paper.passages.map((p) => { const id = uuid(`${paper.code}|${p.key}`); ids[p.key] = id; return { id, paper_id: "cds-maths", title: p.title, body: p.body, source: p.source }; });
    if (passages.length) await run("passages", db.from("question_passages").upsert(passages, { onConflict: "id" }));
    const rows = paper.questions.map(({ passage_key, ...q }) => ({ ...q, passage_id: passage_key ? ids[passage_key] : null }));
    for (let i = 0; i < rows.length; i += 25) await run("questions", db.from("questions").upsert(rows.slice(i, i + 25), { onConflict: "question_id" }));
    await run("intelligence", db.from("dp_question_intelligence_v1").upsert(paper.intelligence, { onConflict: "question_id" }));
    console.log(`[seed-staging-maths] ${paper.code}: ${rows.length} questions`);
  }
  const { count } = await db.from("questions").select("id", { count: "exact", head: true }).eq("paper_id", "cds-maths");
  console.log(`[seed-staging-maths] OK: ${count} cds-maths questions on staging`);
} catch (e) {
  console.log("[seed-staging-maths] FAILED (build continues):", e.message);
}
