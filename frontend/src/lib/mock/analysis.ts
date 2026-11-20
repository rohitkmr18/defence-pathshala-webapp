// Turns a DP mock result into the shapes used by the shared analysis engine
// (lib/analysis/computeAnalysisMetrics) and adds time analysis from per-question timings.
import type { OptionKey, PracticeQuestion } from "@/lib/practice-types";

export type MockReviewRow = {
  questionId: string;
  position: number;
  subject: string;
  topic: string | null;
  difficulty: string;
  selected: OptionKey | null;
  correct: OptionKey;
  outcome: "CORRECT" | "INCORRECT" | "UNANSWERED";
  timeSpentSeconds?: number;
  question: { stem: { text: string; statements?: string[] }; options: { key: OptionKey; text: string }[] };
};

const DIFFICULTY: Record<string, string> = { EASY: "Easy", MODERATE: "Moderate", HARD: "Hard" };

/** DP practice questions are labelled as such: exam "CDS" selects the CDS GK marking preset (+100/120, −100/360). */
export function mockReviewToPractice(review: MockReviewRow[]) {
  const questions: PracticeQuestion[] = review.map((r) => {
    const option = (k: OptionKey) => r.question.options.find((o) => o.key === k)?.text ?? "";
    const stem = [r.question.stem.text, ...(r.question.stem.statements ?? []).map((s, i) => `${i + 1}. ${s}`)].join("\n");
    return {
      id: r.questionId, question_id: r.questionId, exam: "CDS", year: 0, paper: "General Knowledge",
      q_num: r.position, subject: r.subject, topic: r.topic || r.subject, theme: r.topic,
      question: stem, opt_a: option("A"), opt_b: option("B"), opt_c: option("C"), opt_d: option("D"),
      final_opt: r.correct, difficulty_category: DIFFICULTY[r.difficulty] ?? "Moderate",
      source: "DP practice question",
    };
  });
  const answers: Record<string, OptionKey> = {};
  for (const r of review) if (r.selected) answers[r.questionId] = r.selected;
  return { questions, answers };
}

export type MockTimeAnalysis = {
  trackedSeconds: number;
  averageSeconds: number;
  byOutcome: { outcome: MockReviewRow["outcome"]; count: number; averageSeconds: number }[];
  bySubject: { subject: string; seconds: number; questions: number; averageSeconds: number; accuracyPercent: number | null }[];
  slowest: { position: number; subject: string; seconds: number; outcome: MockReviewRow["outcome"] }[];
  /** Wrong answers that took well over the average: time spent and marks lost. */
  costlyMistakes: number;
};

/** Returns null when too little time was recorded to say anything (e.g. attempts before timing existed). */
export function analyzeMockTime(review: MockReviewRow[]): MockTimeAnalysis | null {
  const timed = review.filter((r) => (r.timeSpentSeconds ?? 0) > 0);
  const trackedSeconds = timed.reduce((n, r) => n + (r.timeSpentSeconds ?? 0), 0);
  if (trackedSeconds < 60 || timed.length < 5) return null;
  const averageSeconds = Math.round(trackedSeconds / timed.length);
  const avg = (rows: MockReviewRow[]) => rows.length ? Math.round(rows.reduce((n, r) => n + (r.timeSpentSeconds ?? 0), 0) / rows.length) : 0;
  const byOutcome = (["CORRECT", "INCORRECT", "UNANSWERED"] as const).map((outcome) => {
    const rows = timed.filter((r) => r.outcome === outcome);
    return { outcome, count: rows.length, averageSeconds: avg(rows) };
  });
  const subjects = new Map<string, MockReviewRow[]>();
  for (const r of review) subjects.set(r.subject, [...(subjects.get(r.subject) ?? []), r]);
  const bySubject = [...subjects.entries()].map(([subject, rows]) => {
    const seconds = rows.reduce((n, r) => n + (r.timeSpentSeconds ?? 0), 0);
    const attempted = rows.filter((r) => r.outcome !== "UNANSWERED");
    return {
      subject, seconds, questions: rows.length, averageSeconds: Math.round(seconds / rows.length),
      accuracyPercent: attempted.length ? Math.round((attempted.filter((r) => r.outcome === "CORRECT").length / attempted.length) * 100) : null,
    };
  }).sort((a, b) => b.seconds - a.seconds);
  const slowest = [...timed].sort((a, b) => (b.timeSpentSeconds ?? 0) - (a.timeSpentSeconds ?? 0)).slice(0, 5)
    .map((r) => ({ position: r.position, subject: r.subject, seconds: r.timeSpentSeconds ?? 0, outcome: r.outcome }));
  const costlyMistakes = timed.filter((r) => r.outcome === "INCORRECT" && (r.timeSpentSeconds ?? 0) > averageSeconds * 1.5).length;
  return { trackedSeconds, averageSeconds, byOutcome, bySubject, slowest, costlyMistakes };
}

export function formatMockSeconds(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s}s`;
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return h ? `${h}h ${m}m` : r ? `${m}m ${r}s` : `${m}m`;
}
