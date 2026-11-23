"use strict";
// Read-only, source-limited reconciliation. Does not connect to any database.
// Official UPSC CAPF AC 2025 Series A answer key, Q1-125, including dropped Q98.
// Source: https://www.upsc.gov.in/uploads/2026/08/AnsKey-CAPFACs-Exam-2025-GAI-110826.pdf
// Manually transcribed from extracted PDF text; visually cross-check source before data writes.
const KEY_GROUPS = Object.freeze({
  1: "A C A C A B D B B C C A C B A A C B A A",
  21: "A D A B A C C C C A B A A C D D A C C B",
  41: "D A A C C A A B B B D C A C A A C D B B",
  61: "C A C A D A B D C B A B C C A D D D C C",
  81: "D D C A C A D A D C D C D C A A B X A C",
  101: "B C C A B C A A B D C A A C C D C D C B",
  121: "D C A B A",
});
const SERIES_A_KEY = Object.freeze(Object.fromEntries(
  Object.entries(KEY_GROUPS).flatMap(([start, letters]) =>
    letters.split(" ").map((letter, index) => [Number(start) + index, letter])
  )
));
if (Object.keys(SERIES_A_KEY).length !== 125 || SERIES_A_KEY[98] !== "X") {
  throw new Error("Official Series A key transcription is invalid");
}

/**
 * Audit the 125 Series A key entries explicitly transcribed in SERIES_A_KEY.
 * Rows must be pre-exported by an authorized operator from a trusted read-only query.
 * Exact exam/year/paper is required; rejects other records rather than conflating series.
 * "X" denotes a dropped official item. A different answer letter may be valid for\n * an intentionally rewritten practice question; flag for provenance review, NEVER\n * automatically replace a stored answer with an official-key letter.
 */
function reconcile(rows) {
  if (!Array.isArray(rows)) throw new TypeError("Expected a JSON array");
  return rows
    .filter(r => r && r.exam === "CAPF-AC" && Number(r.year) === 2025 && r.paper === "Paper I")
    .map(r => {
      const q = Number(r.q_num);
      if (!Number.isInteger(q) || !Object.hasOwn(SERIES_A_KEY, q)) return null;
      const expected = SERIES_A_KEY[q];
      const recorded = String(r.final_opt ?? "").trim().toUpperCase();
      return {
        question_id: String(r.question_id || ""),
        q_num: q,
        official_series_a_key: expected,
        recorded_option: recorded || null,
        verification_status: String(r.verified_status || ""),
        finding: expected === "X"
          ? (recorded && recorded !== "X" ? "DROPPED_OFFICIAL_ITEM_WITH_ADAPTED_ANSWER" : "DROPPED_ITEM_REQUIRES_REVIEW")
          : (recorded === expected ? "MATCH" : "OFFICIAL_KEY_DIFFERS_REVIEW_SOURCE_TEXT"),
      };
    })
    .filter(Boolean)
    .sort((a,b) => a.q_num-b.q_num);
}
if (require.main === module) {
  const fs = require("node:fs");
  const file = process.argv[2];
  if (!file) {
    process.stderr.write("Usage: node scripts/seo/capf-2025-series-a-audit.cjs <authorized-rows.json>\n");
    process.exitCode = 2;
  } else {
    const results = reconcile(JSON.parse(fs.readFileSync(file, "utf8")));
    process.stdout.write(JSON.stringify({
      rows_checked: results.length,
      matched: results.filter(r=>r.finding==="MATCH").length,
      problems: results.filter(r=>r.finding!=="MATCH"),
    },null,2)+"\n");
    if (results.some(r=>r.finding==="OFFICIAL_KEY_DIFFERS_REVIEW_SOURCE_TEXT"||r.finding==="DROPPED_ITEM_HAS_SCORABLE_ANSWER")) process.exitCode=1;
  }
}
module.exports = { reconcile, SERIES_A_KEY };
