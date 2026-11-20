/** Generic mock engine primitives. No credentials, database calls, or answer keys in this module.
 *  Marking always comes from the mock_tests row; nothing here hard-codes a paper's marks. */
export type MockOption = "A" | "B" | "C" | "D";
export const MOCK_OPTIONS: readonly MockOption[] = ["A", "B", "C", "D"];
export type MockSessionStatus = "IN_PROGRESS" | "SUBMITTED" | "EXPIRED";
export type MockMarking = { correctPoints: number; wrongPoints: number; pointsDivisor: number };
export type MockMark = { questionId: string; selected: MockOption | null; markedForReview: boolean };

export const MOCK_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isMockUuid = (v: unknown): v is string => typeof v === "string" && MOCK_UUID.test(v);

/** Marks for a count of correct/wrong answers, rounded to 2 dp. Mirrors mock_finalize_session
 *  (the database result is authoritative; this is for display of per-question marks). */
export function mockMarks(correct: number, wrong: number, m: MockMarking): number {
  if (!Number.isInteger(m.pointsDivisor) || m.pointsDivisor <= 0) throw new Error("Invalid marking");
  return Math.round(((correct * m.correctPoints - wrong * m.wrongPoints) / m.pointsDivisor) * 100) / 100;
}

/** Trusted server time rather than learner-supplied clock values determines expiry. */
export function isMockExpired(startedAt: string, durationSeconds: number, nowMs: number = Date.now()): boolean {
  const startMs = Date.parse(startedAt);
  if (!Number.isFinite(startMs) || !Number.isInteger(durationSeconds) || durationSeconds <= 0) {
    throw new Error("Invalid mock timing metadata");
  }
  return nowMs >= startMs + durationSeconds * 1000;
}

export function mockDeadline(startedAt: string, durationSeconds: number): string {
  return new Date(Date.parse(startedAt) + durationSeconds * 1000).toISOString();
}

export function validateMockResponses(assignedQuestionIds: readonly string[], submissions: readonly MockMark[]): void {
  const assigned = new Set(assignedQuestionIds);
  const seen = new Set<string>();
  for (const entry of submissions) {
    if (!assigned.has(entry.questionId) || seen.has(entry.questionId)) {
      throw new Error("Response contains an unassigned or duplicate question");
    }
    if (entry.selected !== null && !MOCK_OPTIONS.includes(entry.selected)) throw new Error("Invalid selected option");
    if (typeof entry.markedForReview !== "boolean") throw new Error("Invalid review flag");
    seen.add(entry.questionId);
  }
}

export type MockResponsePayload = MockMark & { timeSpentSeconds?: number };
/** Parses an autosave body; returns null when it is not a well-formed response. */
export function parseMockResponsePayload(body: unknown): MockResponsePayload | null {
  if (!body || typeof body !== "object") return null;
  const p = body as Record<string, unknown>;
  if (!isMockUuid(p.questionId)) return null;
  if (!(p.selected === null || (typeof p.selected === "string" && (MOCK_OPTIONS as readonly string[]).includes(p.selected)))) return null;
  if (typeof p.markedForReview !== "boolean") return null;
  if ("timeSpentSeconds" in p && !(Number.isInteger(p.timeSpentSeconds) && (p.timeSpentSeconds as number) >= 0)) return null;
  return {
    questionId: p.questionId, selected: p.selected as MockOption | null, markedForReview: p.markedForReview,
    ...("timeSpentSeconds" in p ? { timeSpentSeconds: p.timeSpentSeconds as number } : {}),
  };
}
export const MOCK_PAPER_CDS_GK = "cds-gk";
