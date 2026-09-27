/**
 * Exam canonical mapping utilities.
 * Ensures generic mapping between database values (e.g. 'CAPF-AC') and UI labels (e.g. 'CAPF').
 */

export const EXAM_DB_TO_LABEL: Record<string, string> = {
  "CAPF-AC": "CAPF",
  "CAPF AC": "CAPF",
  "CAPF": "CAPF",
  "CDS": "CDS",
  "NDA": "NDA",
  "AFCAT": "AFCAT",
};

export const EXAM_LABEL_TO_DB: Record<string, string> = {
  "CAPF": "CAPF-AC",
  "CAPF AC": "CAPF-AC",
  "CAPF-AC": "CAPF-AC",
  "CDS": "CDS",
  "NDA": "NDA",
  "AFCAT": "AFCAT",
};

/**
 * Returns the clean UI label for an exam DB value (e.g. 'CAPF-AC' -> 'CAPF').
 */
export function getExamLabel(exam: string | null | undefined): string {
  if (!exam) return "";
  const cleaned = String(exam).trim();
  const upper = cleaned.toUpperCase();
  if (EXAM_DB_TO_LABEL[upper]) {
    return EXAM_DB_TO_LABEL[upper];
  }
  // Generic fallback: strip -AC or AC suffix
  if (upper.endsWith("-AC")) {
    return cleaned.slice(0, -3).trim();
  }
  if (upper.endsWith(" AC")) {
    return cleaned.slice(0, -3).trim();
  }
  return cleaned;
}

/**
 * Returns the canonical database value for an exam (e.g. 'CAPF' -> 'CAPF-AC').
 */
export function getExamDbValue(exam: string | null | undefined): string {
  if (!exam) return "";
  const cleaned = String(exam).trim();
  const upper = cleaned.toUpperCase();
  if (EXAM_LABEL_TO_DB[upper]) {
    return EXAM_LABEL_TO_DB[upper];
  }
  return cleaned;
}

/**
 * Expands an exam filter parameter into all recognized database and UI variations
 * so queries match regardless of format.
 */
export function expandExamQuery(examParam: string | string[] | null | undefined): string[] {
  if (!examParam) return [];

  const rawItems = Array.isArray(examParam)
    ? examParam.map((s) => String(s).trim()).filter(Boolean)
    : String(examParam)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const expanded = new Set<string>();

  for (const item of rawItems) {
    expanded.add(item);
    const dbVal = getExamDbValue(item);
    if (dbVal) expanded.add(dbVal);
    const labelVal = getExamLabel(item);
    if (labelVal) expanded.add(labelVal);
    if (item.includes(" ")) expanded.add(item.replace(/ /g, "-"));
    if (item.includes("-")) expanded.add(item.replace(/-/g, " "));
  }

  return Array.from(expanded);
}
