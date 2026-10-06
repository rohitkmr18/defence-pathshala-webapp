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

export function isCompletePaper(rows: Record<string, unknown>[]): boolean {
  if (!rows.length || !rows.every(isContentEligible)) return false;
  const first = rows[0];
  const expected = expectedPaperQuestions(String(first.exam));
  if (!expected || rows.length !== expected || rows.some(row =>
    row.exam !== first.exam || row.year !== first.year || row.cycle !== first.cycle || row.paper !== first.paper)) return false;
  const numbers = new Set(rows.map(row => Number(row.q_num)));
  return numbers.size === expected && Array.from({ length: expected }, (_, i) => i + 1).every(n => numbers.has(n));
}
