import type { MockOption } from "@/lib/mock/engine";

export type MockOutcome = "CORRECT" | "INCORRECT" | "UNANSWERED";
export type MockReviewInput = { subject: string; difficulty: string; selected: MockOption | null; correct: MockOption };
export type MockBucket = { key: string; total: number; correct: number; incorrect: number; unanswered: number; attempted: number; accuracyPercent: number };

export const mockOutcome = (r: Pick<MockReviewInput, "selected" | "correct">): MockOutcome =>
  r.selected === null ? "UNANSWERED" : r.selected === r.correct ? "CORRECT" : "INCORRECT";

function bucketBy(rows: readonly MockReviewInput[], pick: (r: MockReviewInput) => string, order: readonly string[] = []): MockBucket[] {
  const map = new Map<string, MockBucket>();
  for (const r of rows) {
    const key = pick(r);
    const b = map.get(key) ?? { key, total: 0, correct: 0, incorrect: 0, unanswered: 0, attempted: 0, accuracyPercent: 0 };
    b.total++;
    const o = mockOutcome(r);
    if (o === "CORRECT") b.correct++; else if (o === "INCORRECT") b.incorrect++; else b.unanswered++;
    map.set(key, b);
  }
  for (const b of map.values()) {
    b.attempted = b.correct + b.incorrect;
    b.accuracyPercent = b.attempted ? Math.round((b.correct / b.attempted) * 10000) / 100 : 0;
  }
  const rank = (k: string) => { const i = order.indexOf(k); return i < 0 ? order.length : i; };
  return [...map.values()].sort((a, b) => rank(a.key) - rank(b.key) || a.key.localeCompare(b.key));
}

export const MOCK_DIFFICULTY_ORDER = ["EASY", "MODERATE", "HARD"] as const;

export function analyzeMock(rows: readonly MockReviewInput[], subjectOrder: readonly string[] = []) {
  return {
    subjects: bucketBy(rows, (r) => r.subject, subjectOrder),
    difficulties: bucketBy(rows, (r) => r.difficulty, MOCK_DIFFICULTY_ORDER),
  };
}
