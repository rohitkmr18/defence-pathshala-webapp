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

// Staging has no learner content of its own: mirror production's GS corpus and Current Affairs (read-only copy) so the preview looks like the real site.
try {
  const db2 = createClient(url, key, { auth: { persistSession: false } });
  const up = async (table, rows, onConflict, size = 100) => {
    for (let i = 0; i < rows.length; i += size) {
      const { error } = await db2.from(table).upsert(rows.slice(i, i + size), { onConflict });
      if (error) throw new Error(`${table}: ${error.message}`);
    }
  };
  const read = (f) => JSON.parse(readFileSync(new URL(`./seed/${f}`, import.meta.url), "utf8"));
  for (let n = 0; n < 4; n++) await up("questions", read(`gs_questions_${n}.json`), "question_id");
  await up("dp_question_intelligence_v1", read("gs_intelligence.json"), "question_id", 300);
  const ca = read("current_affairs.json");
  await up("current_affairs_posts", ca.posts, "id");
  await up("current_affairs_stories", ca.stories, "id");
  await up("current_affairs_mcqs", ca.mcqs, "id");
  const { count: gs } = await db2.from("questions").select("id", { count: "exact", head: true }).in("paper_id", ["cds-gk", "capf-p1"]);
  const { count: cp } = await db2.from("current_affairs_posts").select("id", { count: "exact", head: true });
  console.log(`[seed-staging-maths] GS/CA mirror OK: ${gs} GS questions, ${cp} CA posts`);
} catch (e) {
  console.log("[seed-staging-maths] GS/CA mirror FAILED (build continues):", e.message);
}
