// ─────────────────────────────────────────────────────────────────────────────
// Canonical PracticeQuestion type — mirrors the 29-column Supabase schema.
// Single source of truth for all player components.
// ─────────────────────────────────────────────────────────────────────────────

export interface PracticeQuestion {
  id: string;
  question_id: string;

  exam: string;
  year: number;
  cycle?: string | null;
  paper?: string | null;
  q_num: number;

  subject: string;
  topic: string;
  subtopic?: string | null;
  theme?: string | null;

  question: string;

  opt_a: string;
  opt_b: string;
  opt_c: string;
  opt_d: string;

  q_type?: string | null;
  q_pattern?: string | null;

  llm_opt?: string | null;
  official_opt?: string | null;
  /** Correct answer key: "A" | "B" | "C" | "D" */
  final_opt?: string | null;

  key_discrepancy?: boolean | null;
  explanation?: string | null;
  source?: string | null;
  is_negative?: boolean | null;
  tags?: string | null;
  verified_status?: string | null;
  static_current_link?: string | null;
  difficulty_score?: number | null;
  difficulty_category?: string | null;
}

/** All possible option keys */
export const OPTION_KEYS = ["A", "B", "C", "D"] as const;
export type OptionKey = (typeof OPTION_KEYS)[number];

/** Map a PracticeQuestion's options into a flat array for rendering */
export function getOptions(
  q: PracticeQuestion
): { key: OptionKey; text: string }[] {
  return [
    { key: "A", text: q.opt_a },
    { key: "B", text: q.opt_b },
    { key: "C", text: q.opt_c },
    { key: "D", text: q.opt_d },
  ];
}

/** Resolve the correct answer key, normalised to uppercase */
export function getCorrectKey(q: PracticeQuestion): OptionKey | null {
  const raw = q.final_opt?.trim().toUpperCase();
  if (raw === "A" || raw === "B" || raw === "C" || raw === "D") return raw;
  return null;
}

export type PlayerMode = "instant" | "attempt";
