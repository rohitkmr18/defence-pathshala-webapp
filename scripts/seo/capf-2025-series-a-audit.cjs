"use strict";
// Read-only, source-limited reconciliation. Does not connect to any database.
// UPSC official CAPF AC 2025 Series A answer key, first 20 items and dropped Q98.
// https://www.upsc.gov.in/uploads/2026/08/AnsKey-CAPFACs-Exam-2025-GAI-110826.pdf
const SERIES_A_KEY = Object.freeze({
  1:"A",2:"C",3:"A",4:"C",5:"A",6:"B",7:"D",8:"B",9:"B",10:"C",
  11:"C",12:"A",13:"C",14:"B",15:"A",16:"A",17:"C",18:"B",19:"A",20:"A",
  98:"X",
});

/**
 * Audit only official-key entries explicitly transcribed in SERIES_A_KEY.
 * Rows must be pre-exported by an authorized operator from a trusted read-only query.
 * Exact exam/year/paper is required; rejects other records rather than conflating series.
 * "X" denotes a dropped item and MUST NOT be scored as one of A/B/C/D.
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
          ? (recorded && recorded !== "X" ? "DROPPED_ITEM_HAS_SCORABLE_ANSWER" : "DROPPED_ITEM_REQUIRES_REVIEW")
          : (recorded === expected ? "MATCH" : "ANSWER_MISMATCH"),
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
    if (results.some(r=>r.finding==="ANSWER_MISMATCH"||r.finding==="DROPPED_ITEM_HAS_SCORABLE_ANSWER")) process.exitCode=1;
  }
}
module.exports = { reconcile, SERIES_A_KEY };
