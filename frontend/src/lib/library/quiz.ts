// ─────────────────────────────────────────────────────────────────────────────
// Free Library — interactive end-of-book MCQ practice.
// The MCQ and answer-key pages of each eBook are served as this quiz instead of
// page images, so answers are not visible before the learner attempts them.
// Pure data + scoring only (no runtime imports) so it runs under `node --test`.
// ─────────────────────────────────────────────────────────────────────────────

export type OptionKey = "A" | "B" | "C" | "D";
export const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

/** PYQ = actual UPSC question (with paper reference). Original = DP practice question. */
export type McqSource = { kind: "pyq"; label: string } | { kind: "original" };

/** Where the answer comes from. Only PYQs can have an official UPSC key. */
export type KeySource = "official" | "dp-solution" | "dp-original";

export interface McqLists {
  leftTitle: string;
  rightTitle: string;
  left: string[];
  right: string[];
  /** Shown above the options when they are written as a code, e.g. "A B C D". */
  codeOrder?: string;
}

export interface LibraryMcq {
  n: number;
  source: McqSource;
  /** Question pattern as printed in the eBook, e.g. "2-STATEMENT", "MATCH", "SINGLE · NOT". */
  format: string;
  stem: string;
  statements?: string[];
  lists?: McqLists;
  /** Text after the statements/lists, e.g. "Which of the statements given above is/are correct?" */
  prompt?: string;
  options: Record<OptionKey, string>;
  answer: OptionKey;
  explanation: string;
  trap?: string;
  keySource: KeySource;
  /** Id of the book topic this question tests (see LibraryQuiz.topics). */
  topic: string;
  /** eBook page that teaches the concept, for "revise this" links. */
  page: number;
}

export interface QuizTopic {
  id: string;
  title: string;
  page: number;
}

export interface LibraryQuiz {
  slug: string;
  topics: QuizTopic[];
  questions: LibraryMcq[];
}

export type Responses = Partial<Record<number, OptionKey>>;

export interface TopicResult {
  id: string;
  title: string;
  page: number;
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  /** correct / total, 0–100 */
  score: number;
}

export interface QuizResult {
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  attempted: number;
  /** correct / total, 0–100 */
  scorePercent: number;
  /** correct / attempted, 0–100 (0 when nothing attempted) */
  accuracy: number;
  /** UPSC CDS / CAPF / NDA style: +1 per correct, −⅓ per wrong, 0 skipped. */
  netMarks: number;
  bySource: { pyq: { total: number; correct: number }; original: { total: number; correct: number } };
  topics: TopicResult[];
  /** Topics with at least one wrong or skipped question, weakest first. */
  revise: TopicResult[];
  /** Questions answered wrong whose explanation flags a trap. */
  trapsHit: number;
  verdict: { band: "strong" | "good" | "building" | "start"; headline: string; advice: string };
}

export const NEGATIVE_MARK = 1 / 3;

const round1 = (n: number) => Math.round(n * 10) / 10;

export function scoreQuiz(quiz: LibraryQuiz, responses: Responses): QuizResult {
  const total = quiz.questions.length;
  let correct = 0;
  let wrong = 0;
  let trapsHit = 0;
  const bySource = { pyq: { total: 0, correct: 0 }, original: { total: 0, correct: 0 } };
  const topicMap = new Map<string, TopicResult>();
  for (const t of quiz.topics) {
    topicMap.set(t.id, { id: t.id, title: t.title, page: t.page, total: 0, correct: 0, wrong: 0, skipped: 0, score: 0 });
  }

  for (const q of quiz.questions) {
    const picked = responses[q.n];
    const t = topicMap.get(q.topic);
    const src = q.source.kind === "pyq" ? bySource.pyq : bySource.original;
    src.total += 1;
    if (t) t.total += 1;
    if (!picked) {
      if (t) t.skipped += 1;
      continue;
    }
    if (picked === q.answer) {
      correct += 1;
      src.correct += 1;
      if (t) t.correct += 1;
    } else {
      wrong += 1;
      if (t) t.wrong += 1;
      if (q.trap) trapsHit += 1;
    }
  }

  const topics = [...topicMap.values()]
    .filter((t) => t.total > 0)
    .map((t) => ({ ...t, score: Math.round((t.correct / t.total) * 100) }));
  const revise = topics
    .filter((t) => t.correct < t.total)
    .sort((a, b) => a.score - b.score || b.total - a.total || a.page - b.page);

  const attempted = correct + wrong;
  const scorePercent = total ? Math.round((correct / total) * 100) : 0;
  const accuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
  const netMarks = round1(correct - wrong * NEGATIVE_MARK);

  return {
    total,
    correct,
    wrong,
    skipped: total - attempted,
    attempted,
    scorePercent,
    accuracy,
    netMarks,
    bySource,
    topics,
    revise,
    trapsHit,
    verdict: verdictFor(scorePercent, accuracy, attempted, total),
  };
}

export function verdictFor(scorePercent: number, accuracy: number, attempted: number, total: number): QuizResult["verdict"] {
  if (attempted === 0) {
    return {
      band: "start",
      headline: "No answers yet",
      advice: "Attempt the questions to see your score and the topics to revise.",
    };
  }
  const guessing = attempted >= Math.ceil(total * 0.9) && accuracy < 50;
  if (scorePercent >= 80) {
    return {
      band: "strong",
      headline: "Exam-ready on this book",
      advice: "Keep it fresh with timed PYQ practice and revise the one-liners before the exam.",
    };
  }
  if (scorePercent >= 60) {
    return {
      band: "good",
      headline: "Good base — tighten the weak topics",
      advice: "Re-read the topics below, then practise their PYQs to lock them in.",
    };
  }
  return {
    band: "building",
    headline: guessing ? "Too many guesses are costing marks" : "Revise before you practise more",
    advice: guessing
      ? "With negative marking, skip a question unless you can eliminate at least two options. Revise the topics below first."
      : "Go back to the topics below in the eBook, then retry this practice set.",
  };
}

/** Validates a quiz definition. Returns a list of problems (empty when valid). */
export function validateQuiz(quiz: LibraryQuiz, pageCount: number): string[] {
  const problems: string[] = [];
  const topicIds = new Set(quiz.topics.map((t) => t.id));
  quiz.questions.forEach((q, i) => {
    const where = `${quiz.slug} Q${q.n}`;
    if (q.n !== i + 1) problems.push(`${where}: numbering out of order`);
    if (!OPTION_KEYS.includes(q.answer)) problems.push(`${where}: invalid answer`);
    for (const k of OPTION_KEYS) if (!q.options[k]?.trim()) problems.push(`${where}: option ${k} empty`);
    if (new Set(OPTION_KEYS.map((k) => q.options[k])).size !== 4) problems.push(`${where}: duplicate options`);
    if (!topicIds.has(q.topic)) problems.push(`${where}: unknown topic ${q.topic}`);
    if (q.page < 1 || q.page > pageCount) problems.push(`${where}: revise page out of range`);
    if (!q.explanation.trim()) problems.push(`${where}: missing explanation`);
    if (q.source.kind === "original" && q.keySource !== "dp-original") problems.push(`${where}: DP original cannot have an exam key`);
    if (q.source.kind === "pyq" && q.keySource === "dp-original") problems.push(`${where}: PYQ needs an official or DP-solution key`);
    if (q.lists && q.lists.left.length !== q.lists.right.length) problems.push(`${where}: list lengths differ`);
  });
  return problems;
}
