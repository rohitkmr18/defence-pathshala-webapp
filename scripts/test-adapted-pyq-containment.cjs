const { test } = require("node:test");
const assert = require("node:assert/strict");
const createLoader = require("./test-support/load-ts.cjs");
const quality = createLoader()("frontend/src/lib/content-quality.ts");

const row = (q_num, status = "UNCHECKED") => ({
  exam: "CAPF-AC", year: 2025, cycle: "I", paper: "Paper I", q_num,
  content_status: status, content_eligible: status !== "WITHHELD",
  question: "Synthetic sample " + q_num,
  opt_a: "First", opt_b: "Second", opt_c: "Third", opt_d: "Fourth",
  final_opt: "C",
});

test("three source-adapted CAPF records are ineligible after guarded hold", () => {
  for (const n of [62,98,108]) {
    assert.equal(quality.isContentEligible(row(n,"WITHHELD")),false);
    assert.equal(quality.isContentEligible(row(n)),true);
  }
});
test("not falsely represent 122 eligible questions as a complete official 2025 paper", () => {
  const eligible = Array.from({length:125},(_,i)=>row(i+1))
    .filter(r=>![62,98,108].includes(r.q_num));
  assert.equal(eligible.length,122);
  assert.equal(eligible.every(quality.isContentEligible),true);
  assert.equal(quality.isCompletePaper(eligible),false);
});
test("previously defined paper exclusion manifest remains intact",()=>{
  const m = quality.getPaperContentManifest(row(1));
  assert.deepEqual(Array.from(m.excludedQuestionNumbers),[98,106,108,113]);
  // Full-paper behavior must stay unavailable, not silently relax completeness.
  const rows = Array.from({length:125},(_,i)=>row(i+1))
    .filter(r=>![62,98,108].includes(r.q_num));
  assert.equal(quality.isCompletePaper(rows),false);
});
