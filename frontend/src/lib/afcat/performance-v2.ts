import {
  AFCAT_SECTIONS,
  afcatOutcome,
  summarizeAfcatSections,
  type AfcatReviewItem,
  type AfcatSection,
} from "./results-analytics";

/**
 * B2 cross-mock intelligence. Inputs must contain ONLY a single authenticated
 * user's finalized exam reviews, built server-side after ownership checks.
 * No answer keys, raw responses, user identifiers or predictions in output.
 */
export type AfcatPerformanceGroup = {
  section: AfcatSection;
  label: string;
  topic: string | null;
  subtopic: string | null;
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  attempted: number;
  accuracyPercent: number | null;
  attemptRatePercent: number;
  marks: number;
  maximumMarks: number;
  marksLost: number;
  negativePenalty: number;
  timingRecorded: boolean;
  questionTimeSeconds: number | null;
  evidence: "LIMITED" | "SUFFICIENT";
};

export type AfcatFinalizedAttempt = {
  sessionId: string;
  title: string;
  status: string;
  completedAt: string | null;
  score: number | null;
  maxMarks: number;
  correct: number;
  incorrect: number;
  unanswered: number;
};

export type AfcatPerformanceV2 = {
  version: 2;
  overview: {
    completedMocks: number;
    latestScore: number | null;
    bestScore: number | null;
    averageScore: number | null;
    overallAccuracyPercent: number | null;
    overallAttemptRatePercent: number | null;
    correct: number;
    incorrect: number;
    unanswered: number;
    negativePenalty: number;
    questionTimeSeconds: number | null;
  };
  sections: AfcatPerformanceGroup[];
  topics: AfcatPerformanceGroup[];
  subtopics: AfcatPerformanceGroup[];
  trend: { sessionId: string; label: string; completedAt: string | null; score: number; maxMarks: number; percentOfMax: number }[];
  priorities: { section: AfcatSection; topic: string; reason: string; total: number; accuracyPercent: number | null; marksLost: number }[];
};

const pct = (part: number, whole: number) =>
  whole > 0 ? Math.round((part / whole) * 10000) / 100 : null;

function group(rows: readonly AfcatReviewItem[], section: AfcatSection, topic: string | null, subtopic: string | null): AfcatPerformanceGroup {
  let correct = 0, incorrect = 0, unanswered = 0, duration = 0, timed = false;
  for (const r of rows) {
    const o = afcatOutcome(r);
    if (o === "CORRECT") correct++;
    else if (o === "INCORRECT") incorrect++;
    else unanswered++;
    // A zero-duration observation is not proof that actual timing was recorded.
    if (typeof r.timeSpentSeconds === "number" && Number.isFinite(r.timeSpentSeconds) && r.timeSpentSeconds > 0) {
      timed = true;
      duration += Math.round(r.timeSpentSeconds);
    }
  }
  const attempted = correct + incorrect;
  const marks = 3 * correct - incorrect;
  return {
    section, label: AFCAT_SECTIONS.find((s) => s.key === section)?.label ?? section,
    topic, subtopic, total: rows.length, correct, incorrect, unanswered, attempted,
    accuracyPercent: pct(correct, attempted),
    attemptRatePercent: pct(attempted, rows.length) ?? 0,
    marks, maximumMarks: 3 * rows.length, marksLost: 3 * rows.length - marks,
    negativePenalty: incorrect,
    timingRecorded: timed, questionTimeSeconds: timed ? duration : null,
    evidence: rows.length >= 5 ? "SUFFICIENT" : "LIMITED",
  };
}

function grouped(rows: readonly AfcatReviewItem[], depth: 1 | 2) {
  const groups = new Map<string, AfcatReviewItem[]>();
  for (const row of rows) {
    const topic = row.topic?.trim() || "Unclassified";
    const subtopic = row.subtopic?.trim() || "Unclassified";
    const key = JSON.stringify(depth === 1 ? [row.section, topic] : [row.section, topic, subtopic]);
    const list = groups.get(key) ?? [];
    list.push(row);
    groups.set(key, list);
  }
  return [...groups.entries()].map(([key, list]) => {
    const [section, topic, subtopic] = JSON.parse(key) as [AfcatSection, string, string?];
    return group(list, section, topic, depth === 2 ? (subtopic ?? null) : null);
  }).sort((a, b) => b.marksLost - a.marksLost || b.total - a.total || (a.topic ?? "").localeCompare(b.topic ?? ""));
}

export function buildAfcatPerformanceV2(
  review: readonly AfcatReviewItem[],
  attempts: readonly AfcatFinalizedAttempt[],
): AfcatPerformanceV2 {
  const scored = attempts.filter((a) => a.score !== null && a.maxMarks > 0);
  // Avoid treating finalized-but-missing-result rows as submitted scored mocks.
  const newestFirst = [...scored].sort((a, b) =>
    (Date.parse(b.completedAt ?? "") || 0) - (Date.parse(a.completedAt ?? "") || 0));
  const correct = scored.reduce((n, a) => n + a.correct, 0);
  const incorrect = scored.reduce((n, a) => n + a.incorrect, 0);
  const unanswered = scored.reduce((n, a) => n + a.unanswered, 0);
  const sections = AFCAT_SECTIONS.map((s) => group(review.filter((r) => r.section === s.key), s.key, null, null));
  // Maintain the existing per-attempt section calculation as a regression cross-check.
  const checks = summarizeAfcatSections(review);
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].marks !== checks[i].marks || sections[i].total !== checks[i].total) {
      throw new Error("AFCAT section metric mismatch");
    }
  }
  const times = sections.filter((s) => s.timingRecorded);
  const topics = grouped(review, 1);
  const priorities = topics.filter((t) => t.evidence === "SUFFICIENT" && t.attempted > 0 && t.accuracyPercent !== null && t.accuracyPercent < 60)
    .slice(0, 3).map((t) => ({
      section: t.section,
      topic: t.topic ?? "Unclassified",
      reason: `${t.incorrect} incorrect and ${t.unanswered} skipped out of ${t.total} questions seen. Review before the next mock.`,
      total: t.total, accuracyPercent: t.accuracyPercent, marksLost: t.marksLost,
    }));
  return {
    version: 2,
    overview: {
      completedMocks: scored.length,
      latestScore: newestFirst[0]?.score ?? null,
      bestScore: scored.length ? Math.max(...scored.map((a) => a.score as number)) : null,
      averageScore: scored.length ? Math.round(scored.reduce((n, a) => n + (a.score as number), 0) / scored.length) : null,
      overallAccuracyPercent: pct(correct, correct + incorrect),
      overallAttemptRatePercent: pct(correct + incorrect, correct + incorrect + unanswered),
      correct, incorrect, unanswered, negativePenalty: incorrect,
      questionTimeSeconds: times.length ? times.reduce((n, s) => n + (s.questionTimeSeconds ?? 0), 0) : null,
    },
    sections,
    topics,
    subtopics: grouped(review, 2),
    trend: [...newestFirst].reverse().map((a) => ({
      sessionId: a.sessionId, label: a.title, completedAt: a.completedAt,
      score: a.score as number, maxMarks: a.maxMarks,
      percentOfMax: Math.round(((a.score as number) / a.maxMarks) * 10000) / 100,
    })),
    priorities,
  };
}
