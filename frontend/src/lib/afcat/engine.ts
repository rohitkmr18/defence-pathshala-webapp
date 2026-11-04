/** AFCAT exam engine primitives. No credentials, database calls, or answer keys in this module. */
export type AfcatOption = "A" | "B" | "C" | "D";
export type AfcatSessionStatus = "IN_PROGRESS" | "SUBMITTED" | "EXPIRED";
export type AfcatMark = { questionId: string; selected: AfcatOption | null; markedForReview: boolean };
export type AfcatScore = {
  correct: number; incorrect: number; unanswered: number;
  attempted: number; marks: number; maximumMarks: number; accuracyPercent: number;
};

export const AFCAT_FULL_MOCK_QUESTIONS = 100;
export const AFCAT_FULL_MOCK_SECONDS = 2 * 60 * 60;
export const AFCAT_MARKS_CORRECT = 3;
export const AFCAT_MARKS_INCORRECT = -1;

/** Server-only answer keys should be passed to this function after authoritative submission. */
export function scoreAfcat(
  answerKeys: ReadonlyMap<string, AfcatOption>,
  responses: ReadonlyMap<string, AfcatOption | null>,
): AfcatScore {
  let correct = 0; let incorrect = 0; let unanswered = 0;
  for (const [questionId, answer] of answerKeys) {
    const selected = responses.get(questionId);
    if (selected == null) unanswered++;
    else if (selected === answer) correct++;
    else incorrect++;
  }
  const attempted = correct + incorrect;
  return {
    correct, incorrect, unanswered, attempted,
    marks: correct * AFCAT_MARKS_CORRECT + incorrect * AFCAT_MARKS_INCORRECT,
    maximumMarks: answerKeys.size * AFCAT_MARKS_CORRECT,
    accuracyPercent: attempted ? Math.round((correct / attempted) * 10000) / 100 : 0,
  };
}

/** Trusted server time rather than learner-supplied clock values determines expiry. */
export function isAfcatExpired(
  startedAt: string,
  durationSeconds: number,
  nowMs: number = Date.now(),
): boolean {
  const startMs = Date.parse(startedAt);
  if (!Number.isFinite(startMs) || !Number.isInteger(durationSeconds) || durationSeconds <= 0) {
    throw new Error("Invalid AFCAT timing metadata");
  }
  return nowMs >= startMs + durationSeconds * 1000;
}

export function validateAfcatResponses(
  assignedQuestionIds: readonly string[],
  submissions: readonly AfcatMark[],
): void {
  const assigned = new Set(assignedQuestionIds);
  const seen = new Set<string>();
  for (const entry of submissions) {
    if (!assigned.has(entry.questionId) || seen.has(entry.questionId)) {
      throw new Error("Response contains an unassigned or duplicate question");
    }
    if (entry.selected !== null && !["A", "B", "C", "D"].includes(entry.selected)) {
      throw new Error("Invalid selected option");
    }
    if (typeof entry.markedForReview !== "boolean") {
      throw new Error("Invalid review flag");
    }
    seen.add(entry.questionId);
  }
}
