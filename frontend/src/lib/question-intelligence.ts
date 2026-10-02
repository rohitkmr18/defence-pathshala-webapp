import type { PracticeQuestion } from "@/lib/practice-types";

// ==============================================================================
// Question Intelligence Types & Canonical v2 Read-Model Contract
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
  intelligence_verified?: boolean;
  intelligence_confidence?: "MODEL_DERIVED" | "HUMAN_VERIFIED" | string;
  pattern_id?: string | null;
  taxonomy_subject?: string | null;
  taxonomy_topic?: string | null;
  taxonomy_subtopic?: string | null;
  taxonomy_concept?: string | null;
  competency_id?: string | null;
  source_id?: string | null;
  temporal_context_id?: string | null;
  expected_knowledge?: string | null;
  source_accessibility?: string | null;
  preparation_accessibility?: string | null;
  cognitive_complexity?: string | null;
  esac_score?: number | null;
  relation_degree?: number | null;
  same_concept_degree?: number | null;
  cross_exam_variant_degree?: number | null;
  conceptual_variant_degree?: number | null;
  intelligence_readiness?: string | null;
  requires_content_review?: boolean | null;
  release_eligible?: boolean | null;
  release_version?: string | null;
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
 * Normalizes a database question record into a PracticeQuestion, consuming
 * the canonical v2 read-model directly without inventing eligibility policies.
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
      : isProductionEligible;

  const humanReviewRequired =
    raw.human_review_required !== undefined
      ? Boolean(raw.human_review_required)
      : Boolean(raw.verified_status !== "Verified" || raw.key_discrepancy === true);

  const isVerified =
    raw.intelligence_verified !== undefined
      ? Boolean(raw.intelligence_verified)
      : Boolean(raw.verified_status === "Verified");

  const confidence: "MODEL_DERIVED" | "HUMAN_VERIFIED" | string =
    typeof raw.intelligence_confidence === "string" && raw.intelligence_confidence
      ? (raw.intelligence_confidence as "MODEL_DERIVED" | "HUMAN_VERIFIED" | string)
      : isVerified && !raw.key_discrepancy
      ? "HUMAN_VERIFIED"
      : "MODEL_DERIVED";

  return {
    id: String(raw.id),
    question_id: String(raw.question_id || raw.id),
    exam: String(raw.exam || ""),
    year: Number(raw.year) || 0,
    cycle: raw.cycle ? String(raw.cycle).trim() : null,
    paper: raw.paper ? String(raw.paper).trim() : null,
    q_num: Number(raw.q_num) || 0,
    subject: String(raw.taxonomy_subject || raw.subject || "").trim(),
    topic: String(raw.taxonomy_topic || raw.topic || "").trim(),
    subtopic: raw.taxonomy_subtopic ? String(raw.taxonomy_subtopic).trim() : (raw.subtopic ? String(raw.subtopic).trim() : null),
    concept: raw.taxonomy_concept ? String(raw.taxonomy_concept).trim() : (raw.concept ? String(raw.concept).trim() : null),
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
    intelligence_verified: isVerified,
    intelligence_confidence: confidence,
    pattern_id: raw.pattern_id ? String(raw.pattern_id).trim() : null,
    taxonomy_subject: raw.taxonomy_subject ? String(raw.taxonomy_subject).trim() : null,
    taxonomy_topic: raw.taxonomy_topic ? String(raw.taxonomy_topic).trim() : null,
    taxonomy_subtopic: raw.taxonomy_subtopic ? String(raw.taxonomy_subtopic).trim() : null,
    taxonomy_concept: raw.taxonomy_concept ? String(raw.taxonomy_concept).trim() : null,
    competency_id: raw.competency_id ? String(raw.competency_id).trim() : null,
    source_id: raw.source_id ? String(raw.source_id).trim() : null,
    temporal_context_id: raw.temporal_context_id ? String(raw.temporal_context_id).trim() : null,
    expected_knowledge: raw.expected_knowledge ? String(raw.expected_knowledge).trim() : null,
    source_accessibility: raw.source_accessibility ? String(raw.source_accessibility).trim() : null,
    preparation_accessibility: raw.preparation_accessibility ? String(raw.preparation_accessibility).trim() : null,
    cognitive_complexity: raw.cognitive_complexity ? String(raw.cognitive_complexity).trim() : null,
    esac_score: raw.esac_score != null ? Number(raw.esac_score) : null,
    relation_degree: raw.relation_degree != null ? Number(raw.relation_degree) : null,
    same_concept_degree: raw.same_concept_degree != null ? Number(raw.same_concept_degree) : null,
    cross_exam_variant_degree: raw.cross_exam_variant_degree != null ? Number(raw.cross_exam_variant_degree) : null,
    conceptual_variant_degree: raw.conceptual_variant_degree != null ? Number(raw.conceptual_variant_degree) : null,
    intelligence_readiness: raw.intelligence_readiness ? String(raw.intelligence_readiness).trim() : null,
    requires_content_review: typeof raw.requires_content_review === "boolean" ? raw.requires_content_review : null,
    release_eligible: typeof raw.release_eligible === "boolean" ? raw.release_eligible : null,
    release_version: raw.release_version ? String(raw.release_version).trim() : null,
  };
}
