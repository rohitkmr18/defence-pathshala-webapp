const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./test-support/load-ts.cjs')();
const E = load('frontend/src/lib/mock/engine.ts');
const S = load('frontend/src/lib/mock/serialize.ts');
const G = load('frontend/src/lib/mock/project-guard.ts');
const R = load('frontend/src/lib/mock/results.ts');

// The loader runs modules in a VM, so compare plain data via JSON to avoid cross-realm prototype mismatches.
const plain = (v) => JSON.parse(JSON.stringify(v));
const CDS = { correctPoints: 15, wrongPoints: 5, pointsDivisor: 18 };
test('marks come from the test row: 120 correct = 100.00, mixed = (15c-5w)/18 to 2dp', () => {
  assert.equal(E.mockMarks(120, 0, CDS), 100);
  assert.equal(E.mockMarks(50, 10, CDS), 38.89);
  assert.equal(E.mockMarks(0, 120, CDS), -33.33);
  assert.equal(E.mockMarks(1, 0, CDS), 0.83);
  assert.equal(E.mockMarks(0, 1, CDS), -0.28);
  // A different paper's marking is honoured, nothing hard-coded.
  assert.equal(E.mockMarks(10, 4, { correctPoints: 3, wrongPoints: 1, pointsDivisor: 1 }), 26);
  assert.throws(() => E.mockMarks(1, 0, { correctPoints: 1, wrongPoints: 0, pointsDivisor: 0 }));
});
test('expiry uses trusted time and the exact boundary', () => {
  const start = '2026-11-19T10:00:00.000Z';
  assert.equal(E.isMockExpired(start, 7200, Date.parse('2026-11-19T11:59:59.999Z')), false);
  assert.equal(E.isMockExpired(start, 7200, Date.parse('2026-11-19T12:00:00.000Z')), true);
  assert.throws(() => E.isMockExpired('bad', 7200));
  assert.throws(() => E.isMockExpired(start, 0));
  assert.equal(E.mockDeadline(start, 7200), '2026-11-19T12:00:00.000Z');
});
test('response validation rejects unassigned, duplicate and invalid options', () => {
  assert.doesNotThrow(() => E.validateMockResponses(['q1', 'q2'], [{ questionId: 'q1', selected: 'B', markedForReview: true }]));
  assert.throws(() => E.validateMockResponses(['q1'], [{ questionId: 'x', selected: 'A', markedForReview: false }]));
  assert.throws(() => E.validateMockResponses(['q1'], [{ questionId: 'q1', selected: 'A', markedForReview: false }, { questionId: 'q1', selected: 'B', markedForReview: false }]));
  assert.throws(() => E.validateMockResponses(['q1'], [{ questionId: 'q1', selected: 'E', markedForReview: false }]));
});
test('autosave payload parser', () => {
  const id = '11111111-1111-4111-8111-111111111111';
  assert.deepEqual(plain(E.parseMockResponsePayload({ questionId: id, selected: 'C', markedForReview: false })), { questionId: id, selected: 'C', markedForReview: false });
  assert.equal(E.parseMockResponsePayload({ questionId: id, selected: null, markedForReview: true, timeSpentSeconds: 4 }).timeSpentSeconds, 4);
  for (const bad of [null, {}, { questionId: 'x', selected: 'A', markedForReview: false }, { questionId: id, selected: 'E', markedForReview: false },
    { questionId: id, selected: 'A', markedForReview: 'yes' }, { questionId: id, selected: 'A', markedForReview: false, timeSpentSeconds: -1 }])
    assert.equal(E.parseMockResponsePayload(bad), null);
});

const FORBIDDEN = ['correct_option', 'correct', 'explanation', 'derivation_type', 'parent_pyq_ids', 'validation', 'answer', 'source_reference', 'fingerprint_sha256'];
test('learner serializer is an allow-list and never leaks answer/editorial keys', () => {
  const stem = { text: 'Q?', statements: ['one', 'two'], correct_option: 'B', answer: 'B', explanation: { text: 'secret' },
    derivation_type: 'VARIANT', parent_pyq_ids: ['p1'], validation: { ok: 1 } };
  const options = [{ text: 'a', correct: true, explanation: 'secret' }, 'b', 'c', 'd'];
  const q = S.sanitizeMockQuestion('q1', 1, 'History', stem, options);
  const json = JSON.stringify(q);
  for (const k of FORBIDDEN) assert.ok(!json.includes(`"${k}"`), `leaked key ${k}`);
  assert.ok(!json.includes('secret'));
  assert.deepEqual(plain(Object.keys(q)).sort(), ['id', 'number', 'options', 'stem', 'subject']);
  assert.deepEqual(plain(Object.keys(q.stem)).sort(), ['statements', 'text']);
  assert.deepEqual(plain(q.options.map((o) => Object.keys(o).sort().join())), ['key,text', 'key,text', 'key,text', 'key,text']);
});
test('learner serializer rejects malformed content', () => {
  const ok = ['a', 'b', 'c', 'd'];
  assert.throws(() => S.sanitizeMockQuestion('q', 1, 'H', null, ok));
  assert.throws(() => S.sanitizeMockQuestion('q', 1, 'H', { text: ' ' }, ok));
  assert.throws(() => S.sanitizeMockQuestion('q', 1, 'H', { text: 'x', statements: [] }, ok));
  assert.throws(() => S.sanitizeMockQuestion('q', 1, 'H', { text: 'x' }, ['a', 'b', 'c']));
  assert.throws(() => S.sanitizeMockQuestion('q', 1, 'H', { text: 'x' }, ['a', 'b', '', 'd']));
  assert.equal(S.mockExplanationText({ text: 'why', extra: 1 }), 'why');
  assert.equal(S.mockExplanationText('x'), null);
});
test('project guard fails closed; production only with exact flag and host', () => {
  const stg = 'https://pxfstrzceyxnweeaydvz.supabase.co', prod = 'https://afhwegrxnvgsqbqadvwr.supabase.co';
  assert.equal(G.isMockProjectAllowed(stg, undefined), true);
  assert.equal(G.isMockProjectAllowed(prod, undefined), false);
  assert.equal(G.isMockProjectAllowed(prod, 'TRUE'), false);
  assert.equal(G.isMockProjectAllowed(prod, '1'), false);
  assert.equal(G.isMockProjectAllowed(prod, 'true'), true);
  assert.equal(G.isMockProjectAllowed('https://other.supabase.co', 'true'), false);
  assert.equal(G.isMockProjectAllowed('http://pxfstrzceyxnweeaydvz.supabase.co', 'true'), false);
  assert.equal(G.isMockProjectAllowed(undefined, 'true'), false);
  assert.equal(G.isMockProjectAllowed('not a url', 'true'), false);
});
test('subject and difficulty breakdown', () => {
  const rows = [
    { subject: 'Polity', difficulty: 'HARD', selected: 'A', correct: 'A' },
    { subject: 'History', difficulty: 'EASY', selected: 'B', correct: 'A' },
    { subject: 'History', difficulty: 'EASY', selected: null, correct: 'A' },
    { subject: 'History', difficulty: 'MODERATE', selected: 'A', correct: 'A' },
  ];
  const a = R.analyzeMock(rows, ['History', 'Polity']);
  assert.deepEqual(plain(a.subjects.map((b) => b.key)), ['History', 'Polity']);
  const h = a.subjects[0];
  assert.deepEqual([h.total, h.correct, h.incorrect, h.unanswered, h.attempted, h.accuracyPercent], [3, 1, 1, 1, 2, 50]);
  assert.deepEqual(plain(a.difficulties.map((b) => b.key)), ['EASY', 'MODERATE', 'HARD']);
});

test('preview rejects the production project even with the production flag set', () => {
  assert.equal(G.isMockProjectAllowed(`https://${G.MOCK_PRODUCTION_PROJECT}.supabase.co`, 'true', 'preview'), false);
  assert.equal(G.isMockProjectAllowed(`https://${G.MOCK_STAGING_PROJECT}.supabase.co`, 'true', 'preview'), true);
});
