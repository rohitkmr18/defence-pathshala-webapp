const { test } = require("node:test");
const assert = require("node:assert/strict");
const createLoader = require("./test-support/load-ts.cjs");

const { deriveLearnerIntelligence } = createLoader()(
  "frontend/src/lib/learner-intelligence.ts"
);

const q = (id, exam, subject, topic, extra = {}) => ({
  id,
  question_id: id,
  exam,
  question: `Question ${id}`,
  final_opt: "B",
  taxonomy_subject: subject,
  taxonomy_topic: topic,
  production_eligible: true,
  student_release_status: "RELEASED",
  ...extra,
});

const a = (id, question_id, is_correct, attempted_at, selected_option = "A") => ({
  id,
  question_id,
  selected_option,
  is_correct,
  time_taken: 30,
  attempted_at,
});

const baseSession = {
  id: "session-1",
  title: "CDS Polity",
  mode: "instant",
  filters: {},
  question_ids: ["q1", "q2"],
  current_index: 1,
  is_completed: false,
  total_questions: 2,
  correct_count: 0,
  incorrect_count: 1,
  time_spent_seconds: 30,
  started_at: "2026-10-04T08:00:00Z",
  updated_at: "2026-10-04T08:10:00Z",
};

test("new learner receives deterministic starter action", () => {
  const data = deriveLearnerIntelligence({
    attempts: [],
    sessions: [],
    corpus: [q("q1", "CDS", "Polity", "Parliament")],
    targetExams: ["CDS"],
  });
  assert.equal(data.learnerState, "new");
  assert.equal(data.nextBestMove.type, "starter_practice");
  assert.equal(data.overview.attempts, 0);
  assert.equal(data.mistakes.unresolved, 0);
});

test("in-progress recent activity uses saved attempts before session counters finalize", () => {
  const data = deriveLearnerIntelligence({
    attempts: [
      { ...a("a1", "q1", true, "2026-10-04T08:05:00Z"), session_id: baseSession.id },
      { ...a("a2", "q2", false, "2026-10-04T08:06:00Z"), session_id: baseSession.id },
    ],
    sessions: [{ ...baseSession, correct_count: 0, incorrect_count: 0 }],
    corpus: [q("q1", "CDS", "Polity", "Parliament"), q("q2", "CDS", "Polity", "Parliament")],
    targetExams: ["CDS"],
  });
  assert.equal(data.recentActivity[0].correct, 1);
  assert.equal(data.recentActivity[0].incorrect, 1);
  assert.equal(data.recentActivity[0].isCompleted, false);
});

test("unfinished session has absolute recommendation priority", () => {
  const data = deriveLearnerIntelligence({
    attempts: [a("a1", "q1", false, "2026-10-04T08:05:00Z")],
    sessions: [baseSession],
    corpus: [q("q1", "CDS", "Polity", "Parliament")],
    targetExams: ["CDS"],
  });
  assert.equal(data.nextBestMove.type, "resume_session");
  assert.equal(data.activeSession.id, "session-1");
  assert.match(data.nextBestMove.href, /resume=true/);
});

test("a later correct answer resolves an earlier mistake", () => {
  const data = deriveLearnerIntelligence({
    attempts: [
      a("a2", "q1", true, "2026-10-04T09:00:00Z", "B"),
      a("a1", "q1", false, "2026-10-04T08:00:00Z"),
    ],
    sessions: [],
    corpus: [q("q1", "CDS", "Polity", "Parliament")],
    targetExams: ["CDS"],
  });
  assert.equal(data.overview.attempts, 2);
  assert.equal(data.overview.uniqueQuestionsSolved, 1);
  assert.equal(data.mistakes.unresolved, 0);
});

test("recent unresolved mistakes outrank weak-topic coaching", () => {
  const corpus = [
    q("q1", "CDS", "Polity", "Parliament"),
    q("q2", "CDS", "Polity", "Parliament"),
    q("q3", "CDS", "Polity", "Parliament"),
  ];
  const data = deriveLearnerIntelligence({
    attempts: [
      a("a1", "q1", false, "2026-10-04T08:00:00Z"),
      a("a2", "q2", false, "2026-10-04T08:01:00Z"),
      a("a3", "q3", true, "2026-10-04T08:02:00Z", "B"),
    ],
    sessions: [],
    corpus,
    targetExams: ["CDS"],
  });
  assert.equal(data.nextBestMove.type, "review_mistakes");
  assert.equal(data.mistakes.unresolved, 2);
  assert.match(data.mistakes.recent[0].understandHref, /^\/dashboard\/mistakes\//);
  assert.equal(data.needsAttention[0].attempts, 3);
});

test("weak areas require minimum evidence and combine weakness with corpus value", () => {
  const corpus = [];
  for (let i = 1; i <= 8; i += 1) corpus.push(q(`p${i}`, "CDS", "Polity", "Parliament"));
  for (let i = 1; i <= 2; i += 1) corpus.push(q(`h${i}`, "CDS", "History", "Ancient India"));

  const attempts = [
    a("1", "p1", false, "2026-10-04T01:00:00Z"),
    a("2", "p2", false, "2026-10-04T02:00:00Z"),
    a("3", "p3", true, "2026-10-04T03:00:00Z", "B"),
    a("4", "h1", false, "2026-10-04T04:00:00Z"),
  ];

  const data = deriveLearnerIntelligence({
    attempts,
    sessions: [],
    corpus,
    targetExams: ["CDS"],
  });

  assert.equal(data.needsAttention.length, 1);
  assert.equal(data.needsAttention[0].topic, "Parliament");
  assert.equal(data.needsAttention[0].corpusQuestions, 8);
  assert.equal(data.needsAttention[0].accuracy, 33);
});

test("lifetime metrics are not capped at the former 200-attempt window", () => {
  const corpus = [q("q1", "CDS", "Polity", "Parliament")];
  const attempts = Array.from({ length: 250 }, (_, index) =>
    a(
      `a${index}`,
      "q1",
      index % 2 === 0,
      new Date(Date.UTC(2026, 9, 1, 0, index)).toISOString(),
      index % 2 === 0 ? "B" : "A"
    )
  );

  const data = deriveLearnerIntelligence({
    attempts,
    sessions: [],
    corpus,
    targetExams: ["CDS"],
  });

  assert.equal(data.overview.attempts, 250);
  assert.equal(data.overview.uniqueQuestionsSolved, 1);
  assert.equal(data.overview.correct, 125);
  assert.equal(data.overview.accuracy, 50);
});


test("performance coach is rebuilt from durable completed full-paper sessions", () => {
  const corpus = [
    q("q1", "CDS", "Polity", "Parliament", { difficulty_category: "Easy" }),
    q("q2", "CDS", "Polity", "Parliament", { difficulty_category: "Moderate" }),
    q("q3", "CDS", "History", "Modern India", { difficulty_category: "Hard" }),
  ];
  const sessions = [
    {
      ...baseSession,
      id: "mock-1",
      title: "CDS Full Paper",
      mode: "full_paper",
      is_completed: true,
      total_questions: 3,
      correct_count: 1,
      incorrect_count: 2,
      updated_at: "2026-10-04T10:00:00Z",
      completed_at: "2026-10-04T10:00:00Z",
      question_ids: ["q1", "q2", "q3"],
    },
  ];
  const attempts = [
    { ...a("a1", "q1", false, "2026-10-04T09:00:00Z"), session_id: "mock-1" },
    { ...a("a2", "q2", true, "2026-10-04T09:01:00Z", "B"), session_id: "mock-1" },
    { ...a("a3", "q3", false, "2026-10-04T09:02:00Z"), session_id: "mock-1" },
  ];

  const data = deriveLearnerIntelligence({
    attempts,
    sessions,
    corpus,
    targetExams: ["CDS"],
  });

  assert.equal(data.performanceCoach.mocksCompleted, 1);
  assert.equal(data.performanceCoach.totalQuestionsAttempted, 3);
  assert.equal(data.performanceCoach.averageAccuracy, 33.3);
  assert.equal(data.performanceCoach.averageScore, 0.6);
  assert.equal(data.performanceCoach.totalRecoverableMarks, 2.23);
  assert.equal(data.performanceCoach.lastMockTitle, "CDS Full Paper");
  assert.equal(data.performanceCoach.weakAreas[0].topic, "Parliament");
});


test("saved-answer accuracy trend works without mocks and keeps five-answer windows across the display boundary", () => {
  const attempts = Array.from({ length: 24 }, (_, i) => a(`a${i}`, 'q1', i < 4, `2026-10-04T09:${String(i).padStart(2, '0')}:00Z`));
  const data = deriveLearnerIntelligence({ attempts: attempts.reverse(), sessions: [], corpus: [q('q1', 'CDS', 'Polity', 'Parliament')], targetExams: ['CDS'] });
  assert.equal(data.performanceCoach.mocksCompleted, 0);
  assert.equal(data.performanceCoach.averageAccuracy, 16.7);
  assert.equal(data.performanceCoach.recentAccuracies.length, 20);
  assert.equal(data.performanceCoach.recentAccuracies[0], 80);
  assert.equal(data.performanceCoach.recentAccuracies.at(-1), 0);
  assert.equal(data.performanceCoach.recentScores.length, 0);
});
