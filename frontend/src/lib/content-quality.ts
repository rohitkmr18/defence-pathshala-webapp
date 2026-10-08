/** Structural eligibility is independent from AI/taxonomy verification. */
export function isContentEligible(row: Record<string, unknown>): boolean {
  if (row.content_eligible === false || row.content_status === "WITHHELD") return false;
  const fields = [row.question, row.opt_a, row.opt_b, row.opt_c, row.opt_d];
  if (fields.some(value => typeof value !== "string" || !value.trim() || /#(?:ERROR!|REF!|VALUE!|DIV\/0!|N\/A\b|NAME\?|NUM!|NULL!)/i.test(value))) return false;
  const options = fields.slice(1).map(value => String(value).trim().toLowerCase());
  return new Set(options).size === 4 && /^[ABCD]$/.test(String(row.final_opt || "").trim().toUpperCase());
}

export function expectedPaperQuestions(exam: string): number | null {
  if (exam === "CDS") return 120;
  if (["CAPF", "CAPF-AC", "CAPF AC"].includes(exam)) return 125;
  return null;
}

export const CONTENT_UNAVAILABLE_MESSAGE = "This question is under content review. Your saved progress has been preserved.";
export const PAPER_UNAVAILABLE_MESSAGE = "This paper is being checked for content accuracy. Please choose another paper or use targeted practice.";

export interface PaperContentManifest {
  exam: string;
  year: number;
  cycle: string | null;
  paper: string | null;
  expectedQuestions: number;
  excludedQuestionNumbers: number[];
  note: string;
}

export const PAPER_CONTENT_MANIFESTS: PaperContentManifest[] = [
  {
    exam: "CAPF-AC",
    year: 2021,
    cycle: "I",
    paper: "Paper I",
    expectedQuestions: 125,
    excludedQuestionNumbers: [56, 94],
    note: "2 source-disputed questions were dropped from the release corpus.",
  },
  {
    exam: "CDS",
    year: 2021,
    cycle: "I",
    paper: "General Knowledge",
    expectedQuestions: 120,
    excludedQuestionNumbers: [76],
    note: "1 source-cancelled question was dropped from the release corpus.",
  },
  {
    exam: "CDS",
    year: 2021,
    cycle: "II",
    paper: "General Knowledge",
    expectedQuestions: 120,
    excludedQuestionNumbers: [74],
    note: "1 source-cancelled question was dropped from the release corpus.",
  },
  {
    exam: "CDS",
    year: 2026,
    cycle: "II",
    paper: "General Knowledge",
    expectedQuestions: 120,
    excludedQuestionNumbers: [55],
    note: "1 item is withheld pending source verification.",
  },
  {
    exam: "CAPF-AC",
    year: 2026,
    cycle: "I",
    paper: "Paper I",
    expectedQuestions: 125,
    excludedQuestionNumbers: [41, 103],
    note: "2 items are withheld pending source verification.",
  },
  {
    exam: "CAPF-AC",
    year: 2025,
    cycle: "I",
    paper: "Paper I",
    expectedQuestions: 125,
    excludedQuestionNumbers: [98, 106, 108, 113],
    note: "4 items are excluded while dropped/source-disputed questions remain under review.",
  },
];

export function getPaperContentManifest(row: Record<string, unknown>): PaperContentManifest | null {
  return PAPER_CONTENT_MANIFESTS.find(manifest =>
    manifest.exam === String(row.exam) &&
    manifest.year === Number(row.year) &&
    manifest.cycle === (row.cycle == null ? null : String(row.cycle)) &&
    manifest.paper === (row.paper == null ? null : String(row.paper))
  ) || null;
}

export function isCompletePaper(rows: Record<string, unknown>[]): boolean {
  if (!rows.length || !rows.every(isContentEligible)) return false;
  const first = rows[0];
  const expected = expectedPaperQuestions(String(first.exam));
  if (!expected || rows.some(row =>
    row.exam !== first.exam || row.year !== first.year || row.cycle !== first.cycle || row.paper !== first.paper)) return false;

  const manifest = getPaperContentManifest(first);
  const excluded = new Set(manifest?.excludedQuestionNumbers || []);
  const requiredNumbers = Array.from({ length: manifest?.expectedQuestions || expected }, (_, i) => i + 1)
    .filter(n => !excluded.has(n));
  const numbers = new Set(rows.map(row => Number(row.q_num)));

  return rows.length === requiredNumbers.length &&
    numbers.size === requiredNumbers.length &&
    requiredNumbers.every(n => numbers.has(n));
}
