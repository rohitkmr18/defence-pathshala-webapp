#!/usr/bin/env node
// STAGING-ONLY seed: 120 clearly-marked DUMMY approved questions + mock test CDS-GK-M00-DEMO.
//   node scripts/seed-mock-cds-gk-demo.mjs            # idempotent create + publish
//   node scripts/seed-mock-cds-gk-demo.mjs --retire   # remove from the catalogue (status RETIRED)
// Needs NEXT_PUBLIC_SUPABASE_URL (staging) and SUPABASE_SERVICE_ROLE_KEY. Refuses any other host.
// Hard delete is blocked by the engine's immutability triggers by design; see
// scripts/mock-cds-gk-demo-teardown.sql (run by an operator in the staging SQL editor).
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

export const STAGING_HOST = "pxfstrzceyxnweeaydvz.supabase.co";
export const PRODUCTION_HOST = "afhwegrxnvgsqbqadvwr.supabase.co";
export const TEST_CODE = "CDS-GK-M00-DEMO";
export const PAPER_ID = "cds-gk";
export const BLUEPRINT = {
  History: 22, Geography: 18, Polity: 15, Economy: 13, "Science & Tech": 35,
  "Current Affairs": 9, Environment: 4, "International Relations": 2, Security: 2,
};

export function assertStaging(url) {
  let host;
  try { host = new URL(url ?? "").hostname; } catch { throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing or invalid"); }
  if (host === PRODUCTION_HOST) throw new Error("Refusing to run: this is the PRODUCTION Supabase project");
  if (host !== STAGING_HOST) throw new Error(`Refusing to run: ${host} is not the staging project`);
}

const DIFFICULTIES = ["EASY", "MODERATE", "HARD"];
const LETTERS = ["A", "B", "C", "D"];

/** Deterministic dummy content. Every item is labelled DUMMY so it can never pass as real. */
export function buildDemoQuestions() {
  const out = [];
  let n = 0;
  for (const [subject, count] of Object.entries(BLUEPRINT)) {
    for (let i = 1; i <= count; i++) {
      n++;
      const id = String(n).padStart(3, "0");
      const external_id = `DUMMY-CDS-GK-M00-${id}`;
      const correct = LETTERS[n % 4];
      const statementType = n % 5 === 0;
      const stem = statementType
        ? { text: `[DUMMY] ${subject} item ${id}: consider the following placeholder statements and choose the correct option.`,
            statements: [`Placeholder statement one for ${subject} item ${id}.`, `Placeholder statement two for ${subject} item ${id}.`, `Placeholder statement three for ${subject} item ${id}.`] }
        : { text: `[DUMMY] ${subject} item ${id}: which option is marked as the correct placeholder answer?` };
      const options = LETTERS.map((l) => `Option ${l}${l === correct ? " (dummy key)" : ""}`);
      out.push({
        external_id, paper_id: PAPER_ID, subject, topic: `${subject} (dummy)`, subtopic: null,
        q_pattern: statementType ? "STATEMENTS" : "DIRECT",
        stem, options, correct_option: correct,
        explanation: { text: `[DUMMY] Explanation for ${external_id}. The correct option is ${correct}. This is placeholder content for staging only.` },
        difficulty: DIFFICULTIES[n % 3], derivation_type: "ORIGINAL", parent_pyq_ids: [],
        source_reference: "DUMMY - staging demo, not real exam content", validation: { dummy: true, seed: TEST_CODE },
        fingerprint_sha256: createHash("sha256").update(`${external_id}|${JSON.stringify(stem)}|${JSON.stringify(options)}`).digest("hex"),
        content_version: 1, editorial_status: "APPROVED",
      });
    }
  }
  return out;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  assertStaging(url);
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
  const { createClient } = await import("@supabase/supabase-js");
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const ok = (r, what) => { if (r.error) throw new Error(`${what}: ${r.error.message}`); return r.data; };

  const existing = ok(await db.from("mock_tests").select("id,status").eq("code", TEST_CODE).maybeSingle(), "lookup test");
  if (process.argv.includes("--retire")) {
    if (!existing) return console.log("Nothing to retire.");
    if (existing.status === "RETIRED") return console.log("Already retired.");
    ok(await db.from("mock_tests").update({ status: "RETIRED" }).eq("id", existing.id), "retire");
    return console.log(`${TEST_CODE} retired (hidden from the catalogue).`);
  }
  if (existing?.status === "PUBLISHED") return console.log(`${TEST_CODE} is already published; nothing to do.`);
  if (existing?.status === "RETIRED") throw new Error(`${TEST_CODE} is retired; use the teardown SQL before re-seeding.`);

  const questions = buildDemoQuestions();
  ok(await db.from("mock_questions").upsert(questions, { onConflict: "external_id", ignoreDuplicates: true }), "insert questions");
  const rows = ok(await db.from("mock_questions").select("id,external_id,content_version").in("external_id", questions.map((q) => q.external_id)), "read questions");
  const byExternal = new Map(rows.map((r) => [r.external_id, r]));

  let test = existing;
  if (!test) {
    test = ok(await db.from("mock_tests").insert({
      code: TEST_CODE, paper_id: PAPER_ID, title: "CDS GK Demo Mock (dummy questions)",
      duration_seconds: 7200, expected_questions: 120, correct_points: 15, wrong_points: 5, points_divisor: 18,
      max_marks: "100.00", blueprint: BLUEPRINT, status: "DRAFT",
    }).select("id").single(), "insert test");
  }
  const items = questions.map((q, i) => ({ test_id: test.id, question_id: byExternal.get(q.external_id).id, position: i + 1, question_content_version: 1 }));
  ok(await db.from("mock_test_items").upsert(items, { onConflict: "test_id,position", ignoreDuplicates: true }), "insert items");
  ok(await db.from("mock_tests").update({ status: "PUBLISHED" }).eq("id", test.id), "publish");
  console.log(`${TEST_CODE} published with ${items.length} dummy questions.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e.message); process.exit(1); });
}
