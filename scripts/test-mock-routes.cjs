// Route tests with a mocked Supabase client and mocked auth. No network, no credentials.
const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const createLoader = require('./test-support/load-ts.cjs');

const UID = '00000000-0000-4000-8000-000000000001';
const SID = '22222222-2222-4222-8222-222222222222';
const TID = '33333333-3333-4333-8333-333333333333';
const Q1 = '44444444-4444-4444-8444-444444444441';
const Q2 = '44444444-4444-4444-8444-444444444442';

let state;
function fakeDb() {
  const calls = [];
  const builder = (table) => {
    const call = { table, ops: [] };
    calls.push(call);
    const b = new Proxy({}, {
      get(_t, prop) {
        if (prop === 'then') {
          const r = (state.results[table] ?? (() => ({ data: null, error: null })))(call);
          return (res, rej) => Promise.resolve(r).then(res, rej);
        }
        return (...args) => { call.ops.push([prop, ...args]); return b; };
      },
    });
    return b;
  };
  return { from: builder, rpc: async (fn, args) => { calls.push({ rpc: fn, args }); return state.rpc(fn, args); }, calls };
}
const json = (body, init = {}) => ({ status: init.status ?? 200, body, headers: init.headers ?? {} });
const mocks = {
  'next/server': { NextResponse: { json } },
  '@/lib/mock/server': {
    mockAdmin: () => state.db,
    mockUser: async () => state.user,
  },
};
const load = createLoader(mocks);
const route = (p) => load(`frontend/src/app/api/mock/${p}/route.ts`);
const ctx = (id = SID) => ({ params: Promise.resolve({ id }) });
const req = (body) => ({ json: async () => { if (body === undefined) throw new Error('no body'); return body; } });
const ok = (data) => () => ({ data, error: null });
const FORBIDDEN = ['correct_option', 'explanation', 'derivation_type', 'parent_pyq_ids', 'validation', 'fingerprint_sha256'];

beforeEach(() => { state = { user: { id: UID }, results: {}, rpc: async () => ({ data: null, error: null }), db: null }; state.db = fakeDb(); });
const fresh = () => { state.db = fakeDb(); return state.db; };

test('GET tests: published cds-gk only, includes marking from the row', async () => {
  const db = fresh();
  state.results.mock_tests = ok([{ id: TID, code: 'CDS-GK-M00-DEMO', correct_points: 15, wrong_points: 5, points_divisor: 18, max_marks: '100.00' }]);
  const res = await route('tests').GET();
  assert.equal(res.status, 200);
  const ops = db.calls[0].ops.map((o) => o.join(':'));
  assert.ok(ops.includes('eq:status:PUBLISHED') && ops.includes('eq:paper_id:cds-gk'));
  assert.equal(res.body.tests[0].max_marks, '100.00');
});
test('GET tests: 503 without leaking error details', async () => {
  fresh(); state.results.mock_tests = () => ({ data: null, error: new Error('secret db detail') });
  const res = await route('tests').GET();
  assert.equal(res.status, 503);
  assert.ok(!JSON.stringify(res.body).includes('secret'));
});

test('POST sessions: auth, validation, unpublished', async () => {
  const P = route('sessions').POST;
  fresh(); state.user = null;
  assert.equal((await P(req({ testId: TID }))).status, 401);
  state.user = { id: UID };
  assert.equal((await P(req({ testId: 'nope' }))).status, 400);
  assert.equal((await P(req(undefined))).status, 400);
  state.results.mock_tests = ok(null);
  assert.equal((await P(req({ testId: TID }))).status, 404);
});
test('POST sessions: resumes in-progress attempt, creates otherwise, recovers 23505 race', async () => {
  const P = route('sessions').POST;
  fresh();
  state.results.mock_tests = ok({ id: TID, status: 'PUBLISHED', release_version: 1 });
  state.results.mock_sessions = () => ({ data: [{ id: SID }], error: null });
  let res = await P(req({ testId: TID }));
  assert.deepEqual([res.status, res.body.sessionId, res.body.resumed], [200, SID, true]);

  // create
  fresh();
  state.results.mock_tests = ok({ id: TID, status: 'PUBLISHED', release_version: 1 });
  state.results.mock_sessions = (c) => c.ops.some((o) => o[0] === 'insert') ? { data: { id: SID }, error: null } : { data: [], error: null };
  res = await P(req({ testId: TID }));
  assert.deepEqual([res.status, res.body.resumed], [201, false]);

  // race: insert hits the partial unique index, winner is read back
  fresh();
  state.results.mock_tests = ok({ id: TID, status: 'PUBLISHED', release_version: 1 });
  let inserted = false;
  state.results.mock_sessions = (c) => {
    if (c.ops.some((o) => o[0] === 'insert')) { inserted = true; return { data: null, error: { code: '23505' } }; }
    return inserted ? { data: { id: SID }, error: null } : { data: [], error: null };
  };
  res = await P(req({ testId: TID }));
  assert.deepEqual([res.status, res.body.sessionId, res.body.resumed], [200, SID, true]);
});

function sessionFixtures(overrides = {}) {
  const started = new Date(Date.now() - 60_000).toISOString();
  state.results.mock_sessions = ok({ id: SID, user_id: UID, test_id: TID, status: 'IN_PROGRESS', started_at: started, current_position: 1, ...overrides });
  state.results.mock_tests = ok({ id: TID, code: 'C', title: 'T', duration_seconds: 7200, expected_questions: 2, correct_points: 15, wrong_points: 5, points_divisor: 18, max_marks: '100.00', blueprint: { History: 2 } });
  state.results.mock_test_items = ok([{ question_id: Q1, position: 1, question_content_version: 1 }, { question_id: Q2, position: 2, question_content_version: 1 }]);
  const row = (id, extra = {}) => ({ id, subject: 'History', stem: { text: 'Q', correct_option: 'A', explanation: { text: 'secret' } }, options: ['a', 'b', 'c', 'd'], content_version: 1, editorial_status: 'APPROVED',
    correct_option: 'A', explanation: { text: 'secret' }, derivation_type: 'ORIGINAL', parent_pyq_ids: [], validation: { s: 1 }, ...extra });
  state.results.mock_questions = ok([row(Q1), row(Q2)]);
  state.results.mock_responses = ok([{ question_id: Q1, selected_option: 'B', marked_for_review: true, time_spent_seconds: 0 }]);
}
test('GET session: sanitised payload never contains answer or editorial keys; deadline is server-derived', async () => {
  const db = fresh(); sessionFixtures();
  const res = await route('sessions/[id]').GET({}, ctx());
  assert.equal(res.status, 200);
  const text = JSON.stringify(res.body);
  for (const k of FORBIDDEN) assert.ok(!text.includes(`"${k}"`), `leaked ${k}`);
  assert.ok(!text.includes('secret'));
  assert.equal(res.body.questions.length, 2);
  assert.equal(res.body.responses[0].selected_option, 'B');
  assert.equal(res.body.session.marking.pointsDivisor, 18);
  assert.ok(Date.parse(res.body.session.deadline) - Date.parse(res.body.serverNow) > 7000_000);
  // The query itself must not select the key columns.
  const select = db.calls.find((c) => c.table === 'mock_questions').ops.find((o) => o[0] === 'select')[1];
  for (const k of ['correct_option', 'explanation', 'derivation_type', 'parent_pyq_ids', 'validation']) assert.ok(!select.includes(k), `selects ${k}`);
  // ownership is part of the session query
  assert.ok(db.calls[0].ops.some((o) => o.join(':') === `eq:user_id:${UID}`));
});
test('GET session: 401, 400, 404, 409 incomplete / unapproved', async () => {
  const G = route('sessions/[id]').GET;
  fresh(); state.user = null; assert.equal((await G({}, ctx())).status, 401);
  state.user = { id: UID };
  assert.equal((await G({}, ctx('bad'))).status, 400);
  state.results.mock_sessions = ok(null); assert.equal((await G({}, ctx())).status, 404);
  fresh(); sessionFixtures(); state.results.mock_test_items = ok([{ question_id: Q1, position: 1, question_content_version: 1 }]);
  assert.equal((await G({}, ctx())).status, 409);
  fresh(); sessionFixtures(); const q = state.results.mock_questions; state.results.mock_questions = () => { const r = q(); r.data[1].editorial_status = 'DRAFT'; return r; };
  assert.equal((await G({}, ctx())).status, 409);
});

test('PATCH responses: validation, closed, expired, DB gate mapping, success', async () => {
  const P = route('sessions/[id]/responses').PATCH;
  const body = { questionId: Q1, selected: 'A', markedForReview: false };
  fresh(); state.user = null; assert.equal((await P(req(body), ctx())).status, 401);
  state.user = { id: UID };
  assert.equal((await P(req({ ...body, selected: 'Z' }), ctx())).status, 400);
  assert.equal((await P(req(body), ctx('bad'))).status, 400);
  const mk = (over) => ok({ id: SID, status: 'IN_PROGRESS', started_at: new Date(Date.now() - 1000).toISOString(), mock_tests: { duration_seconds: 7200 }, ...over });
  state.results.mock_sessions = mk({ status: 'SUBMITTED' }); assert.equal((await P(req(body), ctx())).status, 409);
  state.results.mock_sessions = mk({ started_at: new Date(Date.now() - 8000_000).toISOString() }); assert.equal((await P(req(body), ctx())).status, 409);
  state.results.mock_sessions = ok(null); assert.equal((await P(req(body), ctx())).status, 404);
  state.results.mock_sessions = mk();
  state.results.mock_responses = () => ({ data: null, error: { message: 'Mock response deadline passed' } });
  assert.equal((await P(req(body), ctx())).status, 409);
  state.results.mock_responses = () => ({ data: null, error: { message: 'Invalid or closed mock response' } });
  assert.equal((await P(req(body), ctx())).status, 400);
  state.results.mock_responses = () => ({ data: null, error: { message: 'boom' } });
  assert.equal((await P(req(body), ctx())).status, 503);
  const db = fresh(); state.results.mock_sessions = mk(); state.results.mock_responses = ok(null);
  const res = await P(req({ ...body, timeSpentSeconds: 99999 }), ctx());
  assert.deepEqual([res.status, res.body.saved], [200, true]);
  const upsert = db.calls.find((c) => c.table === 'mock_responses').ops.find((o) => o[0] === 'upsert')[1];
  assert.equal(upsert.user_id, UID); assert.ok(upsert.time_spent_seconds <= 7200);
});

test('POST submit: finalises through the DB function for the signed-in user only', async () => {
  const P = route('sessions/[id]/submit').POST;
  const db = fresh(); state.rpc = async () => ({ data: [{ status: 'SUBMITTED', score: '38.89', max_marks: '100.00' }], error: null });
  const res = await P({}, ctx());
  assert.equal(res.status, 200);
  assert.deepEqual(JSON.parse(JSON.stringify(db.calls[0])), { rpc: 'mock_finalize_session', args: { p_session_id: SID, p_user_id: UID } });
  state.rpc = async () => ({ data: null, error: { message: 'Mock session not found' } });
  assert.equal((await P({}, ctx())).status, 503);
  state.user = null; assert.equal((await P({}, ctx())).status, 401);
});

function resultFixtures(status = 'SUBMITTED') {
  sessionFixtures({ status });
  state.results.mock_session_results = ok({ correct_count: 1, incorrect_count: 1, unanswered_count: 0, score: '0.56', max_marks: '100.00', completed_at: 'x' });
  state.results.mock_questions = ok([
    { id: Q1, subject: 'History', topic: 'T', difficulty: 'EASY', stem: { text: 'Q1' }, options: ['a', 'b', 'c', 'd'], correct_option: 'A', explanation: { text: 'Because A' } },
    { id: Q2, subject: 'History', topic: 'T', difficulty: 'HARD', stem: { text: 'Q2' }, options: ['a', 'b', 'c', 'd'], correct_option: 'C', explanation: { text: 'Because C' } },
  ]);
  state.results.mock_responses = ok([{ question_id: Q1, selected_option: 'A', marked_for_review: false, time_spent_seconds: 3 }, { question_id: Q2, selected_option: 'B', marked_for_review: true, time_spent_seconds: 5 }]);
}
test('GET result: keys and explanations are withheld while IN_PROGRESS', async () => {
  const db = fresh(); resultFixtures('IN_PROGRESS');
  const res = await route('sessions/[id]/result').GET({}, ctx());
  assert.equal(res.status, 409);
  assert.ok(!db.calls.some((c) => c.table === 'mock_questions'), 'answer table must not be read before submission');
  assert.ok(!JSON.stringify(res.body).includes('Because'));
});
test('GET result: released after submission with breakdowns and per-question marks', async () => {
  fresh(); resultFixtures('SUBMITTED');
  const res = await route('sessions/[id]/result').GET({}, ctx());
  assert.equal(res.status, 200);
  const b = res.body;
  assert.equal(b.summary.score, 0.56); assert.equal(b.summary.attempted, 2); assert.equal(b.summary.accuracyPercent, 50);
  assert.equal(b.review[0].correct, 'A'); assert.equal(b.review[0].explanation, 'Because A');
  assert.deepEqual([b.review[0].outcome, b.review[0].marks, b.review[1].outcome, b.review[1].marks], ['CORRECT', 0.83, 'INCORRECT', -0.28]);
  assert.equal(b.analysis.subjects[0].key, 'History'); assert.equal(b.analysis.subjects[0].total, 2);
  assert.equal(b.analysis.difficulties.length, 2);
  const text = JSON.stringify(b);
  for (const k of ['derivation_type', 'parent_pyq_ids', 'validation', 'fingerprint_sha256', 'correct_option']) assert.ok(!text.includes(`"${k}"`), `leaked ${k}`);
  fresh(); resultFixtures('EXPIRED'); assert.equal((await route('sessions/[id]/result').GET({}, ctx())).status, 200);
  fresh(); resultFixtures('SUBMITTED'); state.results.mock_session_results = ok(null);
  assert.equal((await route('sessions/[id]/result').GET({}, ctx())).status, 409);
});

test('server module fails closed on production host without the flag', () => {
  const calls = [];
  const l = createLoader({
    '@supabase/supabase-js': { createClient: (...a) => { calls.push(a); return {}; } },
    '@/lib/supabase/server': { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: null }, error: null }) } }) },
  }, { process });
  const { mockAdmin } = l('frontend/src/lib/mock/server.ts');
  const keep = { ...process.env };
  try {
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'k';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://afhwegrxnvgsqbqadvwr.supabase.co';
    delete process.env.MOCK_PRODUCTION_ENABLED;
    assert.throws(() => mockAdmin(), /not configured/);
    process.env.MOCK_PRODUCTION_ENABLED = 'yes'; assert.throws(() => mockAdmin(), /not configured/);
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://pxfstrzceyxnweeaydvz.supabase.co'; delete process.env.MOCK_PRODUCTION_ENABLED;
    assert.doesNotThrow(() => mockAdmin());
    delete process.env.SUPABASE_SERVICE_ROLE_KEY; assert.throws(() => mockAdmin(), /not configured/);
    assert.equal(calls.length, 1);
  } finally { process.env = keep; }
});
