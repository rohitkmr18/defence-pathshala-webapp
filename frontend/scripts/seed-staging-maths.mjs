// TEMPORARY, STAGING-ONLY preview seeding. Runs before `next build`.
// No-op unless NEXT_PUBLIC_SUPABASE_URL points at the staging project. Never fails the build.
import { readFileSync } from "node:fs";
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
  const { count } = await db.from("questions").select("id", { count: "exact", head: true }).eq("paper_id", "cds-maths");
  console.log(`[seed-staging-maths] OK: ${count} cds-maths questions on staging`);
} catch (e) {
  console.log("[seed-staging-maths] FAILED (build continues):", e.message);
}
