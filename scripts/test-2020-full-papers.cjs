const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const load = require("./test-support/load-ts.cjs");

const catalogueSource = fs.readFileSync("frontend/src/components/practice/FullPaperHero.tsx", "utf8");
const { isCompletePaper } = load()("frontend/src/lib/content-quality.ts");

const cases = [
  { id: "cds-2020-1", exam: "CDS", cycle: "I", paper: "General Knowledge", count: 120, marks: 100 },
  { id: "cds-2020-2", exam: "CDS", cycle: "II", paper: "General Knowledge", count: 120, marks: 100 },
  { id: "capf-2020", exam: "CAPF-AC", cycle: "I", paper: "Paper I", count: 125, marks: 250 },
];

for (const p of cases) {
  test(`2020 full-paper catalogue includes ${p.id} and completeness gate accepts its valid shape`, () => {
    const escaped = p.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const entry = catalogueSource.match(new RegExp(`id: "${escaped}",([\\s\\S]*?)(?=\\n  },)`));
    assert.ok(entry, `Missing catalogue entry ${p.id}`);
    const body = entry[1];
    assert.match(body, new RegExp(`exam: "${p.exam}"`));
    assert.match(body, /year: 2020/);
    assert.match(body, new RegExp(`cycle: "${p.cycle}"`));
    assert.match(body, new RegExp(`questions: ${p.count}`));
    assert.match(body, new RegExp(`marks: ${p.marks}`));
    assert.match(body, /durationSeconds: 7200/);

    const rows = Array.from({ length: p.count }, (_, i) => ({
      exam: p.exam, year: 2020, cycle: p.cycle, paper: p.paper,
      q_num: i + 1, question: "Which?", opt_a: "A", opt_b: "B", opt_c: "C", opt_d: "D", final_opt: "A",
    }));
    assert.equal(isCompletePaper(rows), true);
    assert.equal(isCompletePaper(rows.slice(1)), false);
  });
}

test("Full Paper discovery links AFCAT to its dedicated player instead of treating it as a CDS/CAPF PYQ paper", () => {
  assert.match(catalogueSource, /href="\\/afcat"/);
  assert.match(catalogueSource, /Open AFCAT Full Mock 01/);
  assert.doesNotMatch(catalogueSource, /exam: "AFCAT"/);
});
