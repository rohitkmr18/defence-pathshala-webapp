// ─────────────────────────────────────────────────────────────────────────────
// Exam Scoring Engine (examScoring.ts)
// Exam-aware scoring rules and negative marking calculations.
// ─────────────────────────────────────────────────────────────────────────────

export interface ExamScoringRule {
  exam: string;
  totalQuestions: number;
  totalMarks: number;
  correctMarks: number;
  penaltyMarks: number;
  recoverableSwingPerQuestion: number;
  correctFormatted: string;
  penaltyFormatted: string;
  schemeLabel: string;
}

export const EXAM_SCORING_PRESETS: Record<string, ExamScoringRule> = {
  CDS: {
    exam: "CDS",
    totalQuestions: 120,
    totalMarks: 100,
    correctMarks: 100 / 120,
    penaltyMarks: 100 / 360, // one-third of the marks assigned to a question
    recoverableSwingPerQuestion: 100 / 90, // correct mark regained + wrong-answer penalty avoided
    correctFormatted: "+0.83",
    penaltyFormatted: "-0.28",
    schemeLabel: "+0.83 / -0.28",
  },
  "CAPF-AC": {
    exam: "CAPF-AC",
    totalQuestions: 125,
    totalMarks: 250,
    correctMarks: 2.0,
    penaltyMarks: 0.67,
    recoverableSwingPerQuestion: 2.67, // 2.0 + 0.67
    correctFormatted: "+2.00",
    penaltyFormatted: "-0.67",
    schemeLabel: "+2.00 / -0.67",
  },
  NDA: {
    exam: "NDA",
    totalQuestions: 120,
    totalMarks: 300,
    correctMarks: 2.5,
    penaltyMarks: 0.83,
    recoverableSwingPerQuestion: 3.33,
    correctFormatted: "+2.50",
    penaltyFormatted: "-0.83",
    schemeLabel: "+2.50 / -0.83",
  },
  AFCAT: {
    exam: "AFCAT",
    totalQuestions: 100,
    totalMarks: 300,
    correctMarks: 3.0,
    penaltyMarks: 1.0,
    recoverableSwingPerQuestion: 4.0,
    correctFormatted: "+3.00",
    penaltyFormatted: "-1.00",
    schemeLabel: "+3.00 / -1.00",
  },
};

export function getScoringRules(examOrPaper?: string): ExamScoringRule {
  const norm = (examOrPaper || "").toLowerCase();

  if (norm.includes("cds")) {
    return EXAM_SCORING_PRESETS.CDS!;
  }
  if (norm.includes("nda")) {
    return EXAM_SCORING_PRESETS.NDA!;
  }
  if (norm.includes("afcat")) {
    return EXAM_SCORING_PRESETS.AFCAT!;
  }

  // Default to CAPF AC
  return EXAM_SCORING_PRESETS["CAPF-AC"]!;
}
