const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./test-support/load-ts.cjs')();
const A = load('frontend/src/lib/mock/analysis.ts');
const plain = (v) => JSON.parse(JSON.stringify(v));

const row = (position, outcome, extra = {}) => ({
  questionId: `q${position}`, position, subject: position % 2 ? 'History' : 'Polity', topic: 'T', difficulty: 'EASY',
  selected: outcome === 'UNANSWERED' ? null : outcome === 'CORRECT' ? 'A' : 'B', correct: 'A', outcome,
  question: { stem: { text: `Stem ${position}`, statements: ['one', 'two'] }, options: ['A', 'B', 'C', 'D'].map((key) => ({ key, text: `opt ${key}` })) },
  ...extra,
});

test('adapter maps to CDS scoring, keeps keys, skips unanswered and labels as DP practice', () => {
  const { questions, answers } = A.mockReviewToPractice([row(1, 'CORRECT'), row(2, 'INCORRECT'), row(3, 'UNANSWERED')]);
  assert.equal(questions.length, 3);
  assert.equal(questions[0].exam, 'CDS');
  assert.equal(questions[0].final_opt, 'A');
  assert.equal(questions[0].difficulty_category, 'Easy');
  assert.equal(questions[0].source, 'DP practice question');
  assert.match(questions[0].question, /Stem 1\n1\. one\n2\. two/);
  assert.equal(questions[1].opt_b, 'opt B');
  assert.deepEqual(plain(answers), { q1: 'A', q2: 'B' });
});

test('time analysis is null without enough data', () => {
  assert.equal(A.analyzeMockTime([row(1, 'CORRECT'), row(2, 'CORRECT')]), null);
  assert.equal(A.analyzeMockTime(Array.from({ length: 10 }, (_, i) => row(i + 1, 'CORRECT', { timeSpentSeconds: 2 }))), null);
});

test('time analysis averages by outcome, ranks slowest and flags costly mistakes', () => {
  const rows = [
    ...Array.from({ length: 8 }, (_, i) => row(i + 1, 'CORRECT', { timeSpentSeconds: 40 })),
    row(9, 'INCORRECT', { timeSpentSeconds: 150 }), row(10, 'INCORRECT', { timeSpentSeconds: 30 }),
  ];
  const t = A.analyzeMockTime(rows);
  assert.equal(t.trackedSeconds, 500);
  assert.equal(t.averageSeconds, 50);
  assert.deepEqual(plain(t.byOutcome.find((o) => o.outcome === 'INCORRECT')), { outcome: 'INCORRECT', count: 2, averageSeconds: 90 });
  assert.equal(t.slowest[0].position, 9);
  assert.equal(t.costlyMistakes, 1);
  assert.equal(t.bySubject.reduce((n, s) => n + s.questions, 0), 10);
});

test('durations format compactly', () => {
  assert.equal(A.formatMockSeconds(42), '42s');
  assert.equal(A.formatMockSeconds(125), '2m 5s');
  assert.equal(A.formatMockSeconds(3900), '1h 5m');
});
