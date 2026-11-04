/**
 * Derive post-submission insights from server-authorized review data only.
 * Everything here is deterministic: no predictions, percentiles or cut-off claims.
 */
export type AfcatSection = "ENGLISH" | "GENERAL_AWARENESS" | "NUMERICAL_ABILITY" | "REASONING_MILITARY_APTITUDE";
export type AfcatKey = "A" | "B" | "C" | "D";
export type AfcatDifficulty = "EASY" | "MODERATE" | "HARD";

// Display order follows the AFCAT paper.
export const AFCAT_SECTIONS: readonly { key: AfcatSection; label: string; expected: number }[] = [
  { key: "GENERAL_AWARENESS", label: "General Awareness", expected: 25 },
  { key: "ENGLISH", label: "English", expected: 30 },
  { key: "NUMERICAL_ABILITY", label: "Numerical Ability", expected: 20 },
  { key: "REASONING_MILITARY_APTITUDE", label: "Reasoning & Military Aptitude", expected: 25 },
] as const;

export const AFCAT_MARKS = { correct: 3, incorrect: -1 } as const;
/** 120 minutes for 100 questions. */
export const AFCAT_PACE_SECONDS = 72;

export type AfcatReviewItem = {
  questionId: string;
  position: number;
  section: AfcatSection;
  selected: AfcatKey | null;
  correct: AfcatKey;
  explanation: unknown;
  topic?: string | null;
  subtopic?: string | null;
  difficulty?: AfcatDifficulty | null;
  timeSpentSeconds?: number | null;
  markedForReview?: boolean;
};

export type AfcatOutcome = "CORRECT" | "INCORRECT" | "UNANSWERED";
export function afcatOutcome(item: Pick<AfcatReviewItem, "selected" | "correct">): AfcatOutcome {
  if (item.selected === null) return "UNANSWERED";
  return item.selected === item.correct ? "CORRECT" : "INCORRECT";
}

type Tally = {
  total: number; correct: number; incorrect: number; unanswered: number;
  attempted: number; marks: number; maximumMarks: number; accuracyPercent: number;
};

function tally(rows: readonly AfcatReviewItem[]): Tally {
  let correct = 0, incorrect = 0, unanswered = 0;
  for (const item of rows) {
    const outcome = afcatOutcome(item);
    if (outcome === "CORRECT") correct++;
    else if (outcome === "INCORRECT") incorrect++;
    else unanswered++;
  }
  const attempted = correct + incorrect;
  return {
    total: rows.length, correct, incorrect, unanswered, attempted,
    marks: correct * AFCAT_MARKS.correct + incorrect * AFCAT_MARKS.incorrect,
    maximumMarks: rows.length * AFCAT_MARKS.correct,
    accuracyPercent: attempted ? Math.round(correct / attempted * 10000) / 100 : 0,
  };
}

const seconds = (item: AfcatReviewItem) =>
  Number.isFinite(item.timeSpentSeconds) && (item.timeSpentSeconds ?? 0) > 0 ? Math.round(item.timeSpentSeconds as number) : 0;

export type AfcatSectionSummary = Tally & {
  section: AfcatSection;
  label: string;
  /** Marks given away by wrong answers (1 per wrong answer). */
  negativeMarks: number;
  timeSeconds: number;
  averageSecondsPerAttempt: number | null;
};

export function summarizeAfcatSections(review: readonly AfcatReviewItem[]): AfcatSectionSummary[] {
  return AFCAT_SECTIONS.map(section => {
    const rows = review.filter(item => item.section === section.key);
    const t = tally(rows);
    const timeSeconds = rows.reduce((sum, item) => sum + seconds(item), 0);
    return {
      ...t, section: section.key, label: section.label,
      negativeMarks: t.incorrect * -AFCAT_MARKS.incorrect,
      timeSeconds,
      averageSecondsPerAttempt: t.attempted && timeSeconds ? Math.round(timeSeconds / t.attempted) : null,
    };
  });
}

export type AfcatTopicSummary = Tally & { section: AfcatSection; topic: string; marksLost: number };

/** Marks lost = marks available minus marks scored, counting wrong and skipped questions. */
export function summarizeAfcatTopics(review: readonly AfcatReviewItem[]): AfcatTopicSummary[] {
  const groups = new Map<string, AfcatReviewItem[]>();
  for (const item of review) {
    const topic = item.topic?.trim() || "Other";
    const key = `${item.section}\u0000${topic}`;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return [...groups.entries()].map(([key, rows]) => {
    const [section, topic] = key.split("\u0000") as [AfcatSection, string];
    const t = tally(rows);
    return { ...t, section, topic, marksLost: t.maximumMarks - t.marks };
  }).sort((a, b) => b.marksLost - a.marksLost || a.accuracyPercent - b.accuracyPercent || a.topic.localeCompare(b.topic));
}

export type AfcatDifficultySummary = Tally & { difficulty: AfcatDifficulty };
export function summarizeAfcatDifficulty(review: readonly AfcatReviewItem[]): AfcatDifficultySummary[] {
  return (["EASY", "MODERATE", "HARD"] as const)
    .map(difficulty => ({ difficulty, ...tally(review.filter(item => item.difficulty === difficulty)) }))
    .filter(row => row.total > 0);
}

export type AfcatTimeSummary = {
  recorded: boolean;
  totalSeconds: number;
  /** Questions that took more than twice the paper's average pace. */
  slowQuestions: { position: number; section: AfcatSection; seconds: number; outcome: AfcatOutcome }[];
  /** Wrong answers where the student spent more than the average pace: costly misses. */
  costlyMisses: number;
};

export function summarizeAfcatTime(review: readonly AfcatReviewItem[]): AfcatTimeSummary {
  const totalSeconds = review.reduce((sum, item) => sum + seconds(item), 0);
  if (!totalSeconds) return { recorded: false, totalSeconds: 0, slowQuestions: [], costlyMisses: 0 };
  const slowQuestions = review
    .filter(item => seconds(item) > AFCAT_PACE_SECONDS * 2)
    .map(item => ({ position: item.position, section: item.section, seconds: seconds(item), outcome: afcatOutcome(item) }))
    .sort((a, b) => b.seconds - a.seconds)
    .slice(0, 5);
  const costlyMisses = review.filter(item => afcatOutcome(item) === "INCORRECT" && seconds(item) > AFCAT_PACE_SECONDS).length;
  return { recorded: true, totalSeconds, slowQuestions, costlyMisses };
}

export type AfcatRecommendation = {
  kind: "WEAKEST_SECTION" | "REDUCE_GUESSING" | "ATTEMPT_MORE" | "REVISE_TOPICS" | "SPEED";
  title: string;
  reason: string;
  section?: AfcatSection;
  topics?: string[];
};

const label = (section: AfcatSection) => AFCAT_SECTIONS.find(s => s.key === section)?.label ?? section;

/** At most three actions, most valuable first. Every claim is computed from this attempt. */
export function recommendAfcatNextSteps(
  overall: Tally,
  sections: readonly AfcatSectionSummary[],
  topics: readonly AfcatTopicSummary[],
  time: AfcatTimeSummary,
): AfcatRecommendation[] {
  const out: AfcatRecommendation[] = [];
  const scored = sections.filter(s => s.total > 0);

  if (overall.incorrect >= 8 && overall.attempted && overall.incorrect / overall.attempted > 0.35) {
    out.push({
      kind: "REDUCE_GUESSING",
      title: "Guess less, eliminate more",
      reason: `${overall.incorrect} wrong answers cost you ${overall.incorrect} marks. A blind guess among four options gains nothing on average under +3/−1; ruling out even one option makes a guess worth taking.`,
    });
  }

  const weakest = [...scored].sort((a, b) => a.marks / a.maximumMarks - b.marks / b.maximumMarks)[0];
  if (weakest && weakest.marks / weakest.maximumMarks < 0.6) {
    out.push({
      kind: "WEAKEST_SECTION",
      title: `Practise ${weakest.label} first`,
      reason: `You scored ${weakest.marks} of ${weakest.maximumMarks} here, your lowest share of any section.`,
      section: weakest.section,
    });
  }

  const underAttempted = [...scored]
    .filter(s => s.unanswered >= 5 && s.attempted >= 5 && s.accuracyPercent >= 70)
    .sort((a, b) => b.unanswered - a.unanswered)[0];
  if (underAttempted) {
    out.push({
      kind: "ATTEMPT_MORE",
      title: `Attempt more in ${underAttempted.label}`,
      reason: `You left ${underAttempted.unanswered} unanswered there, yet ${underAttempted.accuracyPercent}% of your attempts were correct.`,
      section: underAttempted.section,
    });
  }

  const weakTopics = topics.filter(t => t.marksLost >= 6 && t.accuracyPercent < 50).slice(0, 3);
  if (weakTopics.length) {
    out.push({
      kind: "REVISE_TOPICS",
      title: "Revise these topics",
      reason: `Most marks were lost in ${weakTopics.map(t => `${t.topic} (${t.marksLost})`).join(", ")}.`,
      topics: weakTopics.map(t => t.topic),
    });
  }

  if (time.recorded && time.costlyMisses >= 5) {
    out.push({
      kind: "SPEED",
      title: "Move on sooner",
      reason: `${time.costlyMisses} questions took longer than ${AFCAT_PACE_SECONDS} seconds and were still wrong. Mark slow questions for review and come back to them.`,
    });
  }
  return out.slice(0, 3);
}

export type AfcatAnalysis = {
  overall: Tally & { negativeMarks: number; markedForReview: number };
  sections: AfcatSectionSummary[];
  topics: AfcatTopicSummary[];
  difficulty: AfcatDifficultySummary[];
  time: AfcatTimeSummary;
  recommendations: AfcatRecommendation[];
};

export function analyzeAfcatAttempt(review: readonly AfcatReviewItem[]): AfcatAnalysis {
  const overallTally = tally(review);
  const sections = summarizeAfcatSections(review);
  const topics = summarizeAfcatTopics(review);
  const time = summarizeAfcatTime(review);
  return {
    overall: {
      ...overallTally,
      negativeMarks: overallTally.incorrect * -AFCAT_MARKS.incorrect,
      markedForReview: review.filter(item => item.markedForReview).length,
    },
    sections,
    topics,
    difficulty: summarizeAfcatDifficulty(review),
    time,
    recommendations: recommendAfcatNextSteps(overallTally, sections, topics, time),
  };
}

export function sectionLabel(section: AfcatSection): string {
  return label(section);
}
