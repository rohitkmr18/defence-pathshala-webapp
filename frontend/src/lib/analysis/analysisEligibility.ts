// ─────────────────────────────────────────────────────────────────────────────
// Sample Size Engine (analysisEligibility.ts)
// Enforces minimum statistical sample thresholds to prevent false precision.
// ─────────────────────────────────────────────────────────────────────────────

export interface AnalysisSampleThresholds {
  totalQuestions: number;
  attemptedQuestions: number;
  subjectCount: number;
}

export const SAMPLE_SIZE_THRESHOLDS = {
  SCORE: 1,
  ACCURACY: 1,
  RECOVERABLE_MARKS: 5,
  DIFFICULTY: 10,
  TOPIC_MIN_PER_TOPIC: 2,
  TOPIC_HEATMAP: 10,
  SUBJECT_PERFORMANCE: 20,
  TIME_MANAGEMENT: 5,
  MISTAKE_PATTERNS: 10,
} as const;

export function checkEligibility(stats: AnalysisSampleThresholds) {
  return {
    hasScore: stats.totalQuestions >= SAMPLE_SIZE_THRESHOLDS.SCORE,
    hasAccuracy: stats.attemptedQuestions >= SAMPLE_SIZE_THRESHOLDS.ACCURACY,
    hasRecoverableMarks: stats.totalQuestions >= SAMPLE_SIZE_THRESHOLDS.RECOVERABLE_MARKS,
    hasDifficulty: stats.totalQuestions >= SAMPLE_SIZE_THRESHOLDS.DIFFICULTY,
    hasTopicHeatmap: stats.totalQuestions >= SAMPLE_SIZE_THRESHOLDS.TOPIC_HEATMAP,
    hasSubjectPerformance:
      stats.totalQuestions >= SAMPLE_SIZE_THRESHOLDS.SUBJECT_PERFORMANCE &&
      stats.subjectCount > 1,
    hasTimeManagement: stats.attemptedQuestions >= SAMPLE_SIZE_THRESHOLDS.TIME_MANAGEMENT,
    hasMistakePatterns: stats.totalQuestions >= SAMPLE_SIZE_THRESHOLDS.MISTAKE_PATTERNS,
  };
}

export type SectionEligibility = ReturnType<typeof checkEligibility>;
