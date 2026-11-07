// CDS English PYQ load (4 papers, 480 questions, set A: CDS I/II 2026 and CDS I/II 2025).
// Default is DRY-RUN. Pass --apply to write. Upserts are idempotent (onConflict question_id / id).
// Run from frontend/:  SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/load-cds-english-prod.mjs [--apply]
// Answer keys are DP_SOLVED_INTERNAL (model-solved); learner copy must never call them official UPSC keys.
// --build-hook: TEMPORARY. Runs before `next build`; only acts when CDS_ENGLISH_PROD_LOAD=1 and the target is production. Never fails the build.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const PROD_REF = "afhwegrxnvgsqbqadvwr";
const FILES = ["cds_i_2026_english.json", "cds_ii_2026_english.json", "cds_i_2025_english.json", "cds_ii_2025_english.json"];
const EXPECTED = 480;
const hook = process.argv.includes("--build-hook");
const apply = process.argv.includes("--apply") || hook;
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
if (hook && (process.env.CDS_ENGLISH_PROD_LOAD !== "1" || !url.includes(PROD_REF) || !key)) {
  console.log("[cds-english-load] skipped (flag not set or not production)");
  process.exit(0);
}
if (hook) process.on("uncaughtException", (e) => { console.log("[cds-english-load] FAILED (build continues):", e.message); process.exit(0); });
if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
if (apply && !url.includes(PROD_REF) && !process.env.ALLOW_NON_PROD) throw new Error("--apply only against production (or set ALLOW_NON_PROD=1)");

const dir = new URL(process.env.CDS_ENGLISH_DATA_DIR || "../../data/ingestion/cds_english/prod_load/", import.meta.url);
const uuid = (t) => { const h = createHash("sha1").update(t).digest("hex"); return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`; };

const passages = [], questions = [], intelligence = [];
for (const f of FILES) {
  const paper = JSON.parse(readFileSync(new URL(f, dir), "utf8"));
  const ids = {};
  for (const p of paper.passages) { const id = uuid(`${paper.code}|${p.key}`); ids[p.key] = id; passages.push({ id, paper_id: "cds-english", title: p.title, body: p.body, source: p.source }); }
  for (const { passage_key, ...q } of paper.questions) questions.push({ ...q, passage_id: passage_key ? ids[passage_key] : null });
  intelligence.push(...paper.intelligence);
}
const unique = new Set(questions.map((q) => q.question_id)).size;
console.log(`Plan: ${passages.length} passages, ${questions.length} questions (${unique} unique ids), ${intelligence.length} intelligence rows`);
if (unique !== questions.length || questions.length !== EXPECTED) throw new Error("Unexpected question count/uniqueness; aborting");

const db = createClient(url, key, { auth: { persistSession: false } });
const { count: existing } = await db.from("questions").select("id", { count: "exact", head: true }).eq("paper_id", "cds-english");
console.log(`Existing cds-english questions in target: ${existing}`);
if (!apply) { console.log("DRY-RUN: nothing written. Re-run with --apply."); process.exit(0); }

const up = async (table, rows, onConflict, size = 25) => {
  for (let i = 0; i < rows.length; i += size) {
    const { error } = await db.from(table).upsert(rows.slice(i, i + size), { onConflict });
    if (error) throw new Error(`${table}: ${error.message}`);
  }
};
await up("question_passages", passages, "id");
await up("questions", questions, "question_id");
await up("dp_question_intelligence_v1", intelligence, "question_id", 100);
const { count } = await db.from("questions").select("id", { count: "exact", head: true }).eq("paper_id", "cds-english");
console.log(`DONE: ${count} cds-english questions in target. Next: flip exam-registry cds-english status to "live" and deploy.`);
