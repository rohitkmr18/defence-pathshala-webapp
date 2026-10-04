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
  concept?: string | null;
  production_eligible?: boolean;
  intelligence_eligible?: boolean;
  human_review_required?: boolean;
  intelligence_verified?: boolean;
  intelligence_confidence?: "MODEL_DERIVED" | "HUMAN_VERIFIED" | string;
  intelligence_trust_tier?: "HUMAN_VERIFIED" | "REVIEW_REQUIRED" | "MODEL_READY" | "NOT_ELIGIBLE" | string;
  intelligence_verification_status?: "VERIFIED" | "REVIEW_REQUIRED" | "UNVERIFIED_READY" | "NOT_ELIGIBLE" | string;
  student_release_status?: "RELEASED" | "WITHHELD" | string;
  pattern_id?: string | null;
  taxonomy_subject?: string | null;
  taxonomy_topic?: string | null;
  taxonomy_subtopic?: string | null;
  taxonomy_concept?: string | null;
  competency_id?: string | null;
  source_id?: string | null;
  temporal_context_id?: string | null;
  expected_knowledge?: number | null;
  source_accessibility?: number | null;
  preparation_accessibility?: number | null;
  cognitive_complexity?: number | null;
  esac_score?: number | null;
  relation_degree?: number | null;
  same_concept_degree?: number | null;
  cross_exam_variant_degree?: number | null;
  conceptual_variant_degree?: number | null;
  intelligence_readiness?: string | null;
  requires_content_review?: boolean | null;
  release_eligible?: boolean | null;
  release_version?: string | null;
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
