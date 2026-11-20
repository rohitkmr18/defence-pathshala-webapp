const KEYS = ["A", "B", "C", "D"] as const;
export type MockLearnerQuestion = {
  id: string;
  number: number;
  subject: string;
  stem: { text: string; statements?: string[] };
  options: { key: (typeof KEYS)[number]; text: string }[];
};

const nonEmpty = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

/** Untrusted stored JSON is projected into an allow-listed learner payload.
 *  Only stem.text, optional stem.statements and option text are copied; every other key
 *  (correct_option, explanation, derivation_type, parent_pyq_ids, validation, ...) is dropped. */
export function sanitizeMockQuestion(
  id: string, number: number, subject: string, stem: unknown, options: unknown,
): MockLearnerQuestion {
  if (!stem || typeof stem !== "object" || Array.isArray(stem)) throw new Error("Invalid stem");
  const s = stem as Record<string, unknown>;
  if (!nonEmpty(s.text)) throw new Error("Invalid stem text");
  let statements: string[] | undefined;
  if (s.statements !== undefined) {
    if (!Array.isArray(s.statements) || !s.statements.length || !s.statements.every(nonEmpty)) throw new Error("Invalid statements");
    statements = (s.statements as string[]).map((x) => x.trim());
  }
  if (!Array.isArray(options) || options.length !== 4) throw new Error("Invalid option count");
  const opts = KEYS.map((key, i) => {
    const raw = options[i] as unknown;
    const text = typeof raw === "string" ? raw
      : raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>).text : undefined;
    if (!nonEmpty(text)) throw new Error("Invalid option");
    return { key, text };
  });
  return { id, number, subject, stem: statements ? { text: s.text, statements } : { text: s.text }, options: opts };
}

/** Explanation JSON is shown only post-submission; copy its text field alone. */
export function mockExplanationText(value: unknown): string | null {
  return value && typeof value === "object" && !Array.isArray(value) && nonEmpty((value as Record<string, unknown>).text)
    ? (value as { text: string }).text : null;
}
