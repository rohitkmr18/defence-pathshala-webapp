import type { PracticeQuestion, OptionKey } from "@/lib/practice-types";
import { getCorrectKey } from "@/lib/practice-types";
import { checkEligibility, SectionEligibility } from "./analysisEligibility";

export interface SubjectStat {
  subject: string;
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  attempted: number;
  accuracy: number;
  netScore: number;
  attemptRate: number;
  badge: "Strength" | "Stable" | "Focus";
}

export interface TopicStat {
  topic: string;
  subject: string;
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  attempted: number;
  accuracy: number;
  recoverableMarks: number;
  priorityLevel: "High Priority" | "Medium Priority" | "Good Performance";
}

export interface DifficultyStat {
  category: "Easy" | "Moderate" | "Hard";
  total: number;
  attempted: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  marksLost: number;
}

export interface MistakePatternItem {
  type: "easy_miss" | "recurring_theme" | "high_yield_skip";
  title: string;
  description: string;
  count: number;
  impactMarks: number;
}

export interface RecoveryPlanStep {
  timeMinutes: number;
  topic: string;
  subject: string;
  reason: string;
  recoverableMarks: number;
}

export interface AnalysisMetrics {
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  attempted: number;
  attemptRate: number;
  accuracyRate: number;
  netScore: number;
  maxMarks: number;
  totalTimeSeconds: number;
  formattedTime: string;
  
  // Sections
  nextBestMove: {
    title: string;
    topic: string;
    subject: string;
    recoverableMarks: number;
    estimatedMinutes: number;
    reason: string;
  } | null;
  
  totalRecoverableMarks: number;
  recoverableTopics: { topic: string; subject: string; count: number; marks: number }[];
  
  subjects: SubjectStat[];
  topics: TopicStat[];
  difficulties: DifficultyStat[];
  mistakePatterns: MistakePatternItem[];
  
  timeManagement: {
    avgTimePerQuestionSeconds: number;
    paceScore: "Optimal" | "Fast / Rushed" | "Methodical / Slow";
    paceAdvice: string;
  };
  
  recoveryPlan: RecoveryPlanStep[];
  eligibility: SectionEligibility;
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

export function computeAnalysisMetrics(
  questions: PracticeQuestion[],
  answers: Record<string, OptionKey>,
  totalTimeSeconds: number
): AnalysisMetrics {
  const total = questions.length;
  let correct = 0;
  let incorrect = 0;
  let skipped = 0;

  // Trackers
  const subjectMap = new Map<string, { total: number; correct: number; incorrect: number; skipped: number }>();
  const topicMap = new Map<string, { subject: string; total: number; correct: number; incorrect: number; skipped: number; easyModerateMisses: number }>();
  const themeMissMap = new Map<string, { theme: string; subject: string; count: number }>();
  const difficultyMap = new Map<string, { total: number; attempted: number; correct: number; incorrect: number }>();

  // Init difficulty
  ["Easy", "Moderate", "Hard"].forEach((d) => {
    difficultyMap.set(d, { total: 0, attempted: 0, correct: 0, incorrect: 0 });
  });

  questions.forEach((q) => {
    const selected = answers[q.id];
    const correctKey = getCorrectKey(q);
    const isAttempted = selected !== undefined;
    const isCorrect = isAttempted && selected === correctKey;
    const isIncorrect = isAttempted && !isCorrect;

    if (!isAttempted) skipped++;
    else if (isCorrect) correct++;
    else incorrect++;

    // Subject tracking
    const sub = q.subject || "General";
    if (!subjectMap.has(sub)) {
      subjectMap.set(sub, { total: 0, correct: 0, incorrect: 0, skipped: 0 });
    }
    const subEntry = subjectMap.get(sub)!;
    subEntry.total++;
    if (!isAttempted) subEntry.skipped++;
    else if (isCorrect) subEntry.correct++;
    else subEntry.incorrect++;

    // Topic tracking
    const top = q.topic || "General";
    if (!topicMap.has(top)) {
      topicMap.set(top, { subject: sub, total: 0, correct: 0, incorrect: 0, skipped: 0, easyModerateMisses: 0 });
    }
    const topEntry = topicMap.get(top)!;
    topEntry.total++;
    if (!isAttempted) topEntry.skipped++;
    else if (isCorrect) topEntry.correct++;
    else topEntry.incorrect++;

    // Difficulty mapping (normalise Medium to Moderate)
    let rawDiff = q.difficulty_category?.trim() || "Moderate";
    if (rawDiff.toLowerCase() === "medium") rawDiff = "Moderate";
    if (!["Easy", "Moderate", "Hard"].includes(rawDiff)) rawDiff = "Moderate";

    const diffEntry = difficultyMap.get(rawDiff)!;
    diffEntry.total++;
    if (isAttempted) {
      diffEntry.attempted++;
      if (isCorrect) diffEntry.correct++;
      else diffEntry.incorrect++;
    }

    // Recoverable marks check: Easy or Moderate answered incorrectly
    if (isIncorrect && (rawDiff === "Easy" || rawDiff === "Moderate")) {
      topEntry.easyModerateMisses++;
    }

    // Theme mistake tracking
    if (isIncorrect && q.theme) {
      const themeKey = `${sub} › ${q.theme}`;
      if (!themeMissMap.has(themeKey)) {
        themeMissMap.set(themeKey, { theme: q.theme, subject: sub, count: 0 });
      }
      themeMissMap.get(themeKey)!.count++;
    }
  });

  const attempted = correct + incorrect;
  const attemptRate = total > 0 ? Math.round((attempted / total) * 100) : 0;
  const accuracyRate = attempted > 0 ? Math.round((correct / attempted) * 1000) / 10 : 0; // 1 decimal place

  // UPSC Standard Marking
  const marksPerCorrect = 2.0;
  const penaltyPerWrong = 0.67;
  const netScore = Math.max(0, Number((correct * marksPerCorrect - incorrect * penaltyPerWrong).toFixed(2)));
  const maxMarks = total * marksPerCorrect;

  // Recoverable marks: each missed Easy/Moderate question yields +2.67
  const recoverableMultiplier = 2.67;
  const recoverableTopicList: { topic: string; subject: string; count: number; marks: number }[] = [];
  let totalEasyModMisses = 0;

  topicMap.forEach((entry, topic) => {
    if (entry.easyModerateMisses > 0) {
      totalEasyModMisses += entry.easyModerateMisses;
      recoverableTopicList.push({
        topic,
        subject: entry.subject,
        count: entry.easyModerateMisses,
        marks: Number((entry.easyModerateMisses * recoverableMultiplier).toFixed(2)),
      });
    }
  });

  recoverableTopicList.sort((a, b) => b.marks - a.marks);
  const totalRecoverableMarks = Number((totalEasyModMisses * recoverableMultiplier).toFixed(2));

  // Subject Stats
  const subjects: SubjectStat[] = [];
  subjectMap.forEach((s, subject) => {
    const sAttempted = s.correct + s.incorrect;
    const sAcc = sAttempted > 0 ? Math.round((s.correct / sAttempted) * 100) : 0;
    const sScore = Math.max(0, Number((s.correct * marksPerCorrect - s.incorrect * penaltyPerWrong).toFixed(2)));
    const sAttRate = s.total > 0 ? Math.round((sAttempted / s.total) * 100) : 0;

    let badge: "Strength" | "Stable" | "Focus" = "Focus";
    if (sAcc >= 80) badge = "Strength";
    else if (sAcc >= 60) badge = "Stable";

    subjects.push({
      subject,
      total: s.total,
      correct: s.correct,
      incorrect: s.incorrect,
      skipped: s.skipped,
      attempted: sAttempted,
      accuracy: sAcc,
      netScore: sScore,
      attemptRate: sAttRate,
      badge,
    });
  });

  subjects.sort((a, b) => b.total - a.total);

  // Topic Stats
  const topics: TopicStat[] = [];
  topicMap.forEach((t, topic) => {
    const tAttempted = t.correct + t.incorrect;
    const tAcc = tAttempted > 0 ? Math.round((t.correct / tAttempted) * 100) : 0;
    const tRecoverable = Number((t.easyModerateMisses * recoverableMultiplier).toFixed(2));

    let priorityLevel: "High Priority" | "Medium Priority" | "Good Performance" = "Medium Priority";
    if (tAcc < 50 || t.easyModerateMisses >= 2) {
      priorityLevel = "High Priority";
    } else if (tAcc >= 75) {
      priorityLevel = "Good Performance";
    }

    topics.push({
      topic,
      subject: t.subject,
      total: t.total,
      correct: t.correct,
      incorrect: t.incorrect,
      skipped: t.skipped,
      attempted: tAttempted,
      accuracy: tAcc,
      recoverableMarks: tRecoverable,
      priorityLevel,
    });
  });

  topics.sort((a, b) => b.recoverableMarks - a.recoverableMarks || a.accuracy - b.accuracy);

  // Difficulty Stats
  const difficulties: DifficultyStat[] = (["Easy", "Moderate", "Hard"] as const).map((cat) => {
    const d = difficultyMap.get(cat)!;
    const dAcc = d.attempted > 0 ? Math.round((d.correct / d.attempted) * 100) : 0;
    const marksLost = Number((d.incorrect * recoverableMultiplier).toFixed(2));
    return {
      category: cat,
      total: d.total,
      attempted: d.attempted,
      correct: d.correct,
      incorrect: d.incorrect,
      accuracy: dAcc,
      marksLost,
    };
  });

  // Next Best Move
  let nextBestMove: AnalysisMetrics["nextBestMove"] = null;
  if (recoverableTopicList.length > 0 && recoverableTopicList[0]) {
    const top = recoverableTopicList[0];
    const mins = Math.min(25, Math.max(10, top.count * 5));
    nextBestMove = {
      title: `Revise ${top.topic} first`,
      topic: top.topic,
      subject: top.subject,
      recoverableMarks: top.marks,
      estimatedMinutes: mins,
      reason: `You lost ${top.marks} marks on ${top.count} Easy/Moderate question${top.count > 1 ? "s" : ""} here. Closing this gap directly boosts your UPSC cutoff margin.`,
    };
  } else if (topics.length > 0 && topics[0]) {
    const top = topics[0];
    nextBestMove = {
      title: `Consolidate ${top.topic}`,
      topic: top.topic,
      subject: top.subject,
      recoverableMarks: top.recoverableMarks,
      estimatedMinutes: 15,
      reason: `High question volume topic. Re-checking core concepts will solidify your accuracy.`,
    };
  }

  // Mistake Patterns
  const mistakePatterns: MistakePatternItem[] = [];

  // 1. Easy questions missed
  const easyEntry = difficultyMap.get("Easy");
  if (easyEntry && easyEntry.incorrect > 0) {
    mistakePatterns.push({
      type: "easy_miss",
      title: "Direct Recall Slips on Easy Questions",
      description: `You missed ${easyEntry.incorrect} standard factual questions that most qualifying aspirants score on.`,
      count: easyEntry.incorrect,
      impactMarks: Number((easyEntry.incorrect * recoverableMultiplier).toFixed(2)),
    });
  }

  // 2. Recurring themes missed
  themeMissMap.forEach((val) => {
    if (val.count >= 2) {
      mistakePatterns.push({
        type: "recurring_theme",
        title: `Repeated Slip in Theme: ${val.theme}`,
        description: `Missed ${val.count} questions connected to this specific examiner theme under ${val.subject}.`,
        count: val.count,
        impactMarks: Number((val.count * recoverableMultiplier).toFixed(2)),
      });
    }
  });

  // 3. High-yield topics skipped
  topics.forEach((t) => {
    if (t.total >= 3 && t.skipped >= 2) {
      mistakePatterns.push({
        type: "high_yield_skip",
        title: `High-Yield Topic Left Unattempted: ${t.topic}`,
        description: `Skipped ${t.skipped} out of ${t.total} questions in this core area.`,
        count: t.skipped,
        impactMarks: t.skipped * marksPerCorrect,
      });
    }
  });

  // Time Management
  const avgTimePerQuestionSeconds = attempted > 0 ? Math.round(totalTimeSeconds / attempted) : 0;
  let paceScore: "Optimal" | "Fast / Rushed" | "Methodical / Slow" = "Optimal";
  let paceAdvice = "Steady time distribution across questions.";

  // Standard UPSC Paper 1 is 120-125 questions in 120 mins (~58s / question)
  if (avgTimePerQuestionSeconds > 0 && avgTimePerQuestionSeconds < 35 && accuracyRate < 65) {
    paceScore = "Fast / Rushed";
    paceAdvice = "Averaged under 35s per question with sub-optimal accuracy. Slow down to avoid misreading negative qualifiers like 'NOT correct'.";
  } else if (avgTimePerQuestionSeconds > 80) {
    paceScore = "Methodical / Slow";
    paceAdvice = "Averaged over 80s per question. Streamline question elimination on the first pass to avoid time crunch.";
  } else {
    paceScore = "Optimal";
    paceAdvice = "Maintained a disciplined pace (~50-65s/q), allowing adequate time for second-round review.";
  }

  // Recovery Plan (Top 3 steps)
  const recoveryPlan: RecoveryPlanStep[] = [];
  const topTopicsForPlan = recoverableTopicList.slice(0, 3);
  topTopicsForPlan.forEach((item, idx) => {
    const mins = idx === 0 ? 15 : 10;
    recoveryPlan.push({
      timeMinutes: mins,
      topic: item.topic,
      subject: item.subject,
      reason: `${item.count} high-probability questions missed`,
      recoverableMarks: item.marks,
    });
  });

  // Eligibility
  const eligibility = checkEligibility({
    totalQuestions: total,
    attemptedQuestions: attempted,
    subjectCount: subjectMap.size,
  });

  return {
    total,
    correct,
    incorrect,
    skipped,
    attempted,
    attemptRate,
    accuracyRate,
    netScore,
    maxMarks,
    totalTimeSeconds,
    formattedTime: formatDuration(totalTimeSeconds),
    nextBestMove,
    totalRecoverableMarks,
    recoverableTopics: recoverableTopicList,
    subjects,
    topics,
    difficulties,
    mistakePatterns,
    timeManagement: {
      avgTimePerQuestionSeconds,
      paceScore,
      paceAdvice,
    },
    recoveryPlan,
    eligibility,
  };
}
