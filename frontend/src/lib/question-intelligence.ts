import type { PracticeQuestion } from "@/lib/practice-types";

// ==============================================================================
// Question Intelligence Types & Read-Model Contract
// ==============================================================================

export interface QuestionIntelligenceRecord {
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
  concept?: string | null;
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
  final_opt?: string | null;
  key_discrepancy?: boolean | null;
  explanation?: string | null;
  source?: string | null;
  is_negative?: boolean | null;
  tags?: string[] | string | null;
  verified_status?: string | null;
  static_current_link?: string | null;
  difficulty_score?: number | null;
  difficulty_category?: "Easy" | "Moderate" | "Hard" | string | null;
  production_eligible: boolean;
  intelligence_eligible: boolean;
  human_review_required: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PracticeFiltersData {
  exams: string[];
  years: Record<string, number[]>;
  cycles: Record<string, string[]>;
  subjects: Record<string, string[]>;
  topics: Record<string, string[]>;
  subtopics: Record<string, Record<string, string[]>>;
  difficulties: string[];
}

export interface TargetedPracticeQuery {
  exam?: string;
  year?: number | number[];
  cycle?: string | string[];
  subject?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: string;
  limit?: number;
  intelligenceOnly?: boolean;
}

/**
 * Normalizes any database question row into a consistent, strongly-typed PracticeQuestion,
 * computing intelligence and production eligibility deterministically if not already provided.
 */
export function normalizeQuestion(raw: Record<string, unknown>): PracticeQuestion {
  const isProductionEligible =
    raw.production_eligible !== undefined
      ? Boolean(raw.production_eligible)
      : Boolean(
          raw.is_active !== false &&
            raw.question &&
            raw.opt_a &&
            raw.opt_b &&
            raw.opt_c &&
            raw.opt_d &&
            raw.final_opt
        );

  const isIntelligenceEligible =
    raw.intelligence_eligible !== undefined
      ? Boolean(raw.intelligence_eligible)
      : Boolean(
          raw.is_active !== false &&
            raw.verified_status === "Verified" &&
            raw.explanation &&
            raw.source &&
            (raw.key_discrepancy === false || raw.key_discrepancy === null)
        );

  const humanReviewRequired =
    raw.human_review_required !== undefined
      ? Boolean(raw.human_review_required)
      : Boolean(raw.verified_status !== "Verified" || raw.key_discrepancy === true);

  return {
    id: String(raw.id),
    question_id: String(raw.question_id || raw.id),
    exam: String(raw.exam || ""),
    year: Number(raw.year) || 0,
    cycle: raw.cycle ? String(raw.cycle).trim() : null,
    paper: raw.paper ? String(raw.paper).trim() : null,
    q_num: Number(raw.q_num) || 0,
    subject: String(raw.subject || "").trim(),
    topic: String(raw.topic || "").trim(),
    subtopic: raw.subtopic ? String(raw.subtopic).trim() : null,
    concept: raw.concept ? String(raw.concept).trim() : null,
    theme: raw.theme ? String(raw.theme).trim() : null,
    question: String(raw.question || ""),
    opt_a: String(raw.opt_a || ""),
    opt_b: String(raw.opt_b || ""),
    opt_c: String(raw.opt_c || ""),
    opt_d: String(raw.opt_d || ""),
    q_type: raw.q_type ? String(raw.q_type).trim() : null,
    q_pattern: raw.q_pattern ? String(raw.q_pattern).trim() : null,
    llm_opt: raw.llm_opt ? String(raw.llm_opt).trim() : null,
    official_opt: raw.official_opt ? String(raw.official_opt).trim() : null,
    final_opt: raw.final_opt ? String(raw.final_opt).trim() : null,
    key_discrepancy: typeof raw.key_discrepancy === "boolean" ? raw.key_discrepancy : null,
    explanation: raw.explanation ? String(raw.explanation) : null,
    source: raw.source ? String(raw.source).trim() : null,
    is_negative: Boolean(raw.is_negative),
    tags: Array.isArray(raw.tags) ? raw.tags.join(", ") : (raw.tags ? String(raw.tags) : null),
    verified_status: raw.verified_status ? String(raw.verified_status).trim() : null,
    static_current_link: raw.static_current_link ? String(raw.static_current_link).trim() : null,
    difficulty_score: raw.difficulty_score != null ? Number(raw.difficulty_score) : null,
    difficulty_category: raw.difficulty_category ? String(raw.difficulty_category).trim() : null,
    production_eligible: isProductionEligible,
    intelligence_eligible: isIntelligenceEligible,
    human_review_required: humanReviewRequired,
  };
}
