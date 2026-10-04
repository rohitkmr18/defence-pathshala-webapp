import { buildPracticeUrl } from "./question-filters";

export type LearnerState = "new" | "early" | "established";
export type NextBestMoveType =
  | "resume_session"
  | "review_mistakes"
  | "practice_weak_topic"
  | "starter_practice"
  | "explore";

export interface LearnerAttempt {
  id: string;
  question_id: string;
  selected_option: string;
  is_correct: boolean;
  time_taken: number | null;
  attempted_at: string | null;
  session_id?: string | null;
  mode?: string | null;
}

export interface LearnerSession {
  id: string;
  title: string;
  mode: string;
  filters?: Record<string, unknown> | null;
  question_ids?: string[] | null;
  current_index: number;
  is_completed: boolean;
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  time_spent_seconds: number;
  started_at: string;
  updated_at: string;
  completed_at?: string | null;
}

export interface LearnerQuestionMeta {
  id: string;
  question_id?: string;
  exam: string;
  question?: string | null;
  final_opt?: string | null;
  taxonomy_subject?: string | null;
  taxonomy_topic?: string | null;
  taxonomy_concept?: string | null;
  subject?: string | null;
  topic?: string | null;
  production_eligible?: boolean | null;
  intelligence_eligible?: boolean | null;
  student_release_status?: string | null;
}

export interface AttentionArea {
  exam: string;
  subject: string;
  topic: string;
  attempts: number;
  correct: number;
  accuracy: number;
  corpusQuestions: number;
  score: number;
  href: string;
}

export interface LearnerMistake {
  questionId: string;
  question: string;
  exam: string;
  subject: string;
  topic: string;
  selectedOption: string;
  correctOption: string | null;
  attemptedAt: string | null;
  understandHref: string;
  practiceHref: string;
}

export interface LearnerIntelligence {
  learnerState: LearnerState;
  overview: {
    attempts: number;
    uniqueQuestionsSolved: number;
    correct: number;
    incorrect: number;
    accuracy: number;
    practiceTimeSeconds: number;
    completedSessions: number;
  };
  activeSession: null | {
    id: string;
    title: string;
    mode: string;
    completedQuestions: number;
    totalQuestions: number;
    updatedAt: string;
    resumeHref: string;
  };
  mistakes: {
    unresolved: number;
    recent: LearnerMistake[];
    practiceHref: string | null;
  };
  needsAttention: AttentionArea[];
  recentActivity: Array<{
    id: string;
    title: string;
    mode: string;
    isCompleted: boolean;
    updatedAt: string;
    correct: number;
    incorrect: number;
  }>;
  nextBestMove: {
    type: NextBestMoveType;
    title: string;
    reason: string;
    href: string;
  };
}

const pct = (correct: number, total: number) =>
  total > 0 ? Math.round((correct / total) * 100) : 0;

function released(meta: LearnerQuestionMeta) {
  return meta.production_eligible !== false && meta.student_release_status !== "WITHHELD";
}

function subjectOf(meta?: LearnerQuestionMeta) {
  return meta?.taxonomy_subject || meta?.subject || "Other";
}

function topicOf(meta?: LearnerQuestionMeta) {
  return meta?.taxonomy_topic || meta?.topic || "Other";
}

function latestAttemptsByQuestion(attempts: LearnerAttempt[]) {
  const sorted = [...attempts].sort((a, b) =>
    String(b.attempted_at || "").localeCompare(String(a.attempted_at || ""))
  );
  const latest = new Map<string, LearnerAttempt>();
  for (const attempt of sorted) {
    if (!latest.has(attempt.question_id)) latest.set(attempt.question_id, attempt);
  }
  return latest;
}

export function deriveLearnerIntelligence(input: {
  attempts: LearnerAttempt[];
  sessions: LearnerSession[];
  corpus: LearnerQuestionMeta[];
  targetExams?: string[];
}): LearnerIntelligence {
  const { attempts, sessions, corpus } = input;
  const targetExams = (input.targetExams || []).filter(Boolean);
  const metaById = new Map(corpus.filter(released).map((q) => [q.id, q]));
  const uniqueQuestionsSolved = new Set(attempts.map((a) => a.question_id)).size;
  const correct = attempts.filter((a) => a.is_correct).length;
  const incorrect = attempts.length - correct;
  const practiceTimeSeconds = attempts.reduce(
    (sum, a) => sum + Math.max(0, Number(a.time_taken || 0)),
    0
  );
  const completedSessions = sessions.filter((s) => s.is_completed).length;
  const learnerState: LearnerState =
    attempts.length === 0 ? "new" : attempts.length < 20 ? "early" : "established";

  const active = [...sessions]
    .filter((s) => !s.is_completed)
    .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))[0] || null;

  const activeSession = active
    ? {
        id: active.id,
        title: active.title,
        mode: active.mode,
        completedQuestions: Math.max(
          active.current_index,
          active.correct_count + active.incorrect_count
        ),
        totalQuestions: active.total_questions,
        updatedAt: active.updated_at,
        resumeHref:
          `/dashboard/practice/session?resume=true&session_id=${encodeURIComponent(active.id)}&returnTo=%2Fdashboard&origin=dashboard`,
      }
    : null;

  const latest = latestAttemptsByQuestion(attempts);
  const unresolved = [...latest.values()]
    .filter((a) => !a.is_correct && metaById.has(a.question_id))
    .sort((a, b) => String(b.attempted_at || "").localeCompare(String(a.attempted_at || "")));

  const recentMistakes: LearnerMistake[] = unresolved.slice(0, 20).map((a) => {
    const meta = metaById.get(a.question_id)!;
    const exam = meta.exam || "Exam";
    const subject = subjectOf(meta);
    const topic = topicOf(meta);
    return {
      questionId: a.question_id,
      question: meta.question || "Review this PYQ",
      exam,
      subject,
      topic,
      selectedOption: a.selected_option,
      correctOption: meta.final_opt || null,
      attemptedAt: a.attempted_at,
      understandHref: `/dashboard/practice/session?ids=${encodeURIComponent(a.question_id)}&returnTo=%2Fdashboard%2Fmistakes&origin=mistakes`,
      practiceHref: buildPracticeUrl({
        exams: [exam],
        subjects: [subject],
        topics: [topic],
        limit: 10,
        origin: "mistakes",
        returnTo: "/dashboard/mistakes",
      }),
    };
  });

  const unresolvedIds = unresolved.map((a) => a.question_id);
  const mistakePracticeHref = unresolvedIds.length
    ? `/dashboard/practice/session?ids=${unresolvedIds.slice(0, 50).map(encodeURIComponent).join(",")}&returnTo=%2Fdashboard%2Fmistakes&origin=mistakes`
    : null;

  const corpusFrequency = new Map<string, number>();
  for (const q of corpus.filter(released)) {
    if (targetExams.length && !targetExams.includes(q.exam)) continue;
    const key = `${q.exam}||| ${subjectOf(q)}||| ${topicOf(q)}`;
    corpusFrequency.set(key, (corpusFrequency.get(key) || 0) + 1);
  }

  const performance = new Map<string, { exam: string; subject: string; topic: string; attempts: number; correct: number }>();
  for (const attempt of attempts) {
    const meta = metaById.get(attempt.question_id);
    if (!meta) continue;
    const exam = meta.exam || "Exam";
    if (targetExams.length && !targetExams.includes(exam)) continue;
    const subject = subjectOf(meta);
    const topic = topicOf(meta);
    const key = `${exam}||| ${subject}||| ${topic}`;
    const row = performance.get(key) || { exam, subject, topic, attempts: 0, correct: 0 };
    row.attempts += 1;
    if (attempt.is_correct) row.correct += 1;
    performance.set(key, row);
  }

  const maxCorpus = Math.max(1, ...corpusFrequency.values());
  const needsAttention: AttentionArea[] = [...performance.entries()]
    .filter(([, row]) => row.attempts >= 3)
    .map(([key, row]) => {
      const accuracy = pct(row.correct, row.attempts);
      const corpusQuestions = corpusFrequency.get(key) || 0;
      const evidence = Math.min(1, row.attempts / 10);
      const weakness = 1 - accuracy / 100;
      const value = corpusQuestions / maxCorpus;
      const score = Math.round((weakness * 0.55 + value * 0.3 + evidence * 0.15) * 1000) / 10;
      return {
        ...row,
        accuracy,
        corpusQuestions,
        score,
        href: buildPracticeUrl({
          exams: [row.exam],
          subjects: [row.subject],
          topics: [row.topic],
          limit: 10,
          origin: "dashboard",
          returnTo: "/dashboard",
        }),
      };
    })
    .sort((a, b) => b.score - a.score || b.attempts - a.attempts)
    .slice(0, 3);

  const recentActivity = [...sessions]
    .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      title: s.title,
      mode: s.mode,
      isCompleted: s.is_completed,
      updatedAt: s.updated_at,
      correct: s.correct_count,
      incorrect: s.incorrect_count,
    }));

  let nextBestMove: LearnerIntelligence["nextBestMove"];
  if (activeSession) {
    nextBestMove = {
      type: "resume_session",
      title: `Resume ${activeSession.title}`,
      reason: `${activeSession.completedQuestions} of ${activeSession.totalQuestions} questions completed.`,
      href: activeSession.resumeHref,
    };
  } else if (recentMistakes.length) {
    nextBestMove = {
      type: "review_mistakes",
      title: `Review ${Math.min(unresolved.length, 20)} recent mistake${unresolved.length === 1 ? "" : "s"}`,
      reason: "Fix unresolved errors before adding more new questions.",
      href: "/dashboard/mistakes",
    };
  } else if (needsAttention.length) {
    const area = needsAttention[0];
    nextBestMove = {
      type: "practice_weak_topic",
      title: `Strengthen ${area.topic}`,
      reason: `${area.accuracy}% accuracy across ${area.attempts} attempts · ${area.corpusQuestions} relevant PYQs in the corpus.`,
      href: area.href,
    };
  } else if (targetExams.length) {
    const exam = targetExams[0];
    nextBestMove = {
      type: "starter_practice",
      title: `Start ${exam} practice`,
      reason: "Build enough evidence for personalized weak-area recommendations.",
      href: buildPracticeUrl({ exams: [exam], limit: 10, origin: "dashboard", returnTo: "/dashboard" }),
    };
  } else {
    nextBestMove = {
      type: "explore",
      title: "Explore PYQ intelligence",
      reason: "Choose an exam and topic to create your first evidence-backed practice set.",
      href: "/dashboard/question-bank",
    };
  }

  return {
    learnerState,
    overview: {
      attempts: attempts.length,
      uniqueQuestionsSolved,
      correct,
      incorrect,
      accuracy: pct(correct, attempts.length),
      practiceTimeSeconds,
      completedSessions,
    },
    activeSession,
    mistakes: {
      unresolved: unresolved.length,
      recent: recentMistakes,
      practiceHref: mistakePracticeHref,
    },
    needsAttention,
    recentActivity,
    nextBestMove,
  };
}
