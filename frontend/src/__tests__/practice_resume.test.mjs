import test, { beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadResumeSession, latestSessionSnapshot, restoreQuestionOrder, initializeSession,
  updateSessionProgress, getLocalSession, saveLocalSession, recordQuestionAttempt, completePracticeSession, retryPracticePersistence,
} from '../lib/practice-session-client.ts';

const originalFetch = globalThis.fetch;
const originalWindow = globalThis.window;
const originalStorage = globalThis.localStorage;
const session = (overrides = {}) => ({
  id: 'saved-id', title: 'Four polity questions', mode: 'attempt',
  filters: { subjects: ['Polity'] }, question_ids: ['q4', 'q1', 'q3', 'q2'],
  current_index: 2, answers: { q4: 'A', q1: 'B' }, is_completed: false,
  checked_ids: [], question_times: {},
  total_questions: 4, correct_count: 0, incorrect_count: 0, time_spent_seconds: 0,
  started_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...overrides,
});
const tick = () => new Promise(resolve => setImmediate(resolve));

test('delayed restore retains cloud identity and newer progress after question loading', () => {
  const stale = session({ id: 'delayed-restore', revision: 1 });
  const latest = { ...stale, server_id: 'cloud-identity', revision: 2,
    current_index: 3, answers: { q4: 'A', q1: 'B', q3: 'C' }, cloud_status: 'saved' };
  saveLocalSession(latest);
  assert.deepEqual(latestSessionSnapshot(stale), latest);
  assert.equal(latestSessionSnapshot(session({ id: 'another-session' })).id, 'another-session');
});

beforeEach(() => {
  const storage = new Map();
  globalThis.window = { dispatchEvent() {} };
  globalThis.localStorage = { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) };
  globalThis.fetch = async () => ({ ok: true, json: async () => ({}) });
});
afterEach(async () => {
  await tick();
  globalThis.fetch = originalFetch;
  globalThis.window = originalWindow;
  globalThis.localStorage = originalStorage;
});

test('resume restores the exact four questions in saved order, even from unordered database results', () => {
  const saved = session();
  const fetched = ['q1', 'q2', 'q4', 'q3', 'unrelated'].map(id => ({ id }));
  assert.deepEqual(restoreQuestionOrder(saved.question_ids, fetched).map(q => q.id), saved.question_ids);
});

test('matching local resume retains index, answers and timed mode without an API wait', async () => {
  const saved = session(); saveLocalSession(saved);
  globalThis.fetch = () => { throw new Error('Unnecessary server call'); };
  assert.deepEqual(await loadResumeSession(saved.id), saved);
});

test('server-only session is fetched by requested identity rather than using a different local session', async () => {
  saveLocalSession(session({ id: 'different' }));
  const saved = session();
  globalThis.fetch = async url => {
    assert.equal(url, '/api/practice/session?session_id=saved-id');
    return { ok: true, json: async () => ({ activeSession: saved }) };
  };
  assert.deepEqual(await loadResumeSession(saved.id), saved);
});

test('missing/completed saved sessions and missing questions fail instead of starting random questions', async () => {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ activeSession: null }) });
  await assert.rejects(loadResumeSession(), /no longer available/);
  saveLocalSession(session({ is_completed: true }));
  await assert.rejects(loadResumeSession('saved-id'), /no longer available/);
  assert.throws(() => restoreQuestionOrder(['q4', 'missing'], [{ id: 'q4' }]), /preserved/);
});

test('late server creation preserves progress and keeps the player session identity stable', async () => {
  let resolveCreate; const writes = [];
  globalThis.fetch = async (_url, options) => {
    if (options.method === 'POST') return new Promise(resolve => { resolveCreate = resolve; });
    writes.push(JSON.parse(options.body));
    return { ok: true, json: async () => ({ success: true, session: { id: JSON.parse(options.body).session_id } }) };
  };
  const created = await initializeSession({ title: 'Practice', mode: 'instant', filters: {}, questions: [{ id: 'q1' }, { id: 'q2' }] });
  updateSessionProgress(created.id, { current_index: 1, answers: { q1: 'C' } });
  resolveCreate({ ok: true, json: async () => ({ session: { id: 'server-id' } }) });
  await tick();
  assert.equal(getLocalSession().id, created.id);
  assert.equal(getLocalSession().server_id, 'server-id');
  assert.equal(getLocalSession().current_index, 1);
  assert.deepEqual(getLocalSession().answers, { q1: 'C' });
  assert.equal(writes.at(-1).session_id, 'server-id');
});

test('late creation does not overwrite a newer active session', async () => {
  let resolveCreate;
  globalThis.fetch = async () => new Promise(resolve => { resolveCreate = resolve; });
  await initializeSession({ title: 'Old', mode: 'instant', filters: {}, questions: [{ id: 'q1' }] });
  const newer = session({ id: 'newer' }); saveLocalSession(newer);
  resolveCreate({ ok: true, json: async () => ({ session: { id: 'old-server-id' } }) });
  await tick();
  assert.deepEqual(getLocalSession(), newer);
});

test('skipping clears an answer and queued snapshots coalesce behind an in-flight write', async () => {
  saveLocalSession(session({ server_id: 'server-id' }));
  let finishFirst; const writes = [];
  globalThis.fetch = async (_url, options) => {
    writes.push(JSON.parse(options.body));
    if (writes.length === 1) return new Promise(resolve => { finishFirst = resolve; });
    return { ok: true, json: async () => ({ success: true, session: { id: JSON.parse(options.body).session_id } }) };
  };
  updateSessionProgress('saved-id', { current_index: 1 });
  await tick();
  updateSessionProgress('saved-id', { current_index: 2 });
  updateSessionProgress('saved-id', { time_spent_seconds: 17 });
  updateSessionProgress('saved-id', { current_index: 3, answers: { q4: 'A' } });
  await tick();
  assert.equal(writes.length, 1);
  assert.deepEqual(getLocalSession().answers, { q4: 'A' });
  finishFirst({ ok: true, json: async () => ({ success: true, session: { id: "server-id" } }) }); await tick();
  assert.equal(writes.length, 2);
  assert.equal(writes[1].current_index, 3);
  assert.equal(writes[1].time_spent_seconds, 17);
  assert.deepEqual(writes[1].answers, { q4: 'A' });
});


test('first answer waits for cloud creation and retains linkage after switching sessions', async () => {
  let resolveCreate; const attempts = [];
  globalThis.fetch = async (url, options) => {
    if (url.endsWith('/session') && options.method === 'POST') return new Promise(resolve => { resolveCreate = resolve; });
    if (url.endsWith('/attempt')) { attempts.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ persisted: true }) }; }
    return { ok: true, json: async () => ({ success: true, session: { id: JSON.parse(options.body).session_id } }) };
  };
  const created = await initializeSession({ title: 'Race', mode: 'instant', filters: {}, questions: [{ id: 'q1' }] });
  const answer = recordQuestionAttempt({ question: { id: 'q1' }, selectedOption: 'B', isCorrect: true, sessionId: created.id });
  await tick(); assert.equal(attempts.length, 0);
  saveLocalSession(session({ id: 'newer-race' }));
  resolveCreate({ ok: true, json: async () => ({ session: { id: 'owned-cloud-id' } }) });
  await answer;
  assert.equal(attempts[0].session_id, 'owned-cloud-id');
  assert.equal(getLocalSession().id, 'newer-race');
});

test('failed creation never sends an unlinked attempt or a local session ID', async () => {
  const calls = [];
  globalThis.fetch = async (url) => { calls.push(url); return { ok: false }; };
  const created = await initializeSession({ title: 'Failure', mode: 'instant', filters: {}, questions: [{ id: 'q1' }] });
  await assert.rejects(recordQuestionAttempt({ question: { id: 'q1' }, selectedOption: 'A', isCorrect: false, sessionId: created.id }), /creation failed/);
  assert.deepEqual(calls, ['/api/practice/session']);
  assert.equal(getLocalSession().cloud_status, 'error');
  saveLocalSession(session({ id: 'newer-failure' }));
  await assert.rejects(recordQuestionAttempt({ question: { id: 'q1' }, selectedOption: 'A', isCorrect: false, sessionId: 'sess_orphan' }), /only on this device/);
  assert.equal(calls.length, 1);
});

test('HTTP progress failures remain visible and completion cannot report saved', async () => {
  saveLocalSession(session({ id: 'progress-failure', server_id: 'cloud-progress' }));
  globalThis.fetch = async () => ({ ok: false });
  updateSessionProgress('progress-failure', { current_index: 3 });
  await tick();
  assert.equal(getLocalSession().cloud_status, 'error');
  await assert.rejects(completePracticeSession({ sessionId: 'progress-failure', questions: [{ id: 'q4', final_opt: 'A' }], answers: { q4: 'A' }, mode: 'instant', timeSpentSeconds: 5 }), /save failed/);
  assert.equal(getLocalSession().cloud_status, 'error');
});

test('attempt failures propagate and a later successful snapshot cannot mask them', async () => {
  saveLocalSession(session({ id: 'attempt-failure', server_id: 'cloud-attempt' }));
  globalThis.fetch = async (url, options) => ({ ok: !url.endsWith('/attempt'), json: async () => ({ success: true, session: { id: JSON.parse(options.body).session_id } }) });
  await assert.rejects(recordQuestionAttempt({ question: { id: 'q4' }, selectedOption: 'A', isCorrect: true, sessionId: 'attempt-failure' }), /persistence failed/);
  updateSessionProgress('attempt-failure', { current_index: 3 });
  await tick(); assert.equal(getLocalSession().cloud_status, 'error');
});

test('Full Paper completion persists owned answers before completion and retries only unsaved answers', async () => {
  saveLocalSession(session({ id: 'full-paper-test', server_id: 'cloud-paper' }));
  const calls = []; let failSecond = true;
  globalThis.fetch = async (url, options) => {
    const body = JSON.parse(options.body); calls.push({ url, body });
    if (url.endsWith('/attempt') && body.question_id === 'q2' && failSecond) return { ok: false };
    return { ok: true, json: async () => url.endsWith("/attempt") ? { persisted: true } : { success: true, session: { id: body.session_id } } };
  };
  const params = { sessionId: 'full-paper-test', mode: 'full_paper', timeSpentSeconds: 25,
    questions: [{ id: 'q1', final_opt: 'A' }, { id: 'q2', final_opt: 'C' }, { id: 'q3', final_opt: 'D' }], answers: { q1: 'A', q2: 'B' } };
  await assert.rejects(completePracticeSession(params), /persistence failed/);
  assert.equal(calls.some(c => c.body.is_completed), false);
  assert.equal(getLocalSession().submission_pending, true);
  assert.deepEqual(getLocalSession().answers, { q1: 'A', q2: 'B' });
  assert.equal(getLocalSession().time_spent_seconds, 25);
  assert.equal(getLocalSession().is_completed, false);
  failSecond = false;
  await completePracticeSession(params);
  assert.equal(getLocalSession().cloud_status, "saved");
  assert.equal(getLocalSession().submission_pending, false);
  assert.equal(getLocalSession().is_completed, true);
  assert.equal(calls.filter(c => c.body.question_id === 'q1').length, 1);
  assert.equal(calls.filter(c => c.body.question_id === 'q2').length, 2);
  const final = calls.at(-1).body;
  assert.equal(final.session_id, 'cloud-paper');
  assert.equal(final.is_completed, true);
  assert.equal(final.correct_count, 1); assert.equal(final.incorrect_count, 1);
});

test('guest creation keeps progress local without cloud PATCH writes', async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => { calls.push(options.method); return { ok: true, json: async () => ({ guest: true }) }; };
  const created = await initializeSession({ title: 'Guest', mode: 'instant', filters: {}, questions: [{ id: 'q1' }] });
  await tick();
  updateSessionProgress(created.id, { current_index: 1 });
  assert.equal(getLocalSession().cloud_status, 'local'); assert.deepEqual(calls, ['POST']);
});


test('cloud-linked local resume verifies ownership before exposing cached progress', async () => {
  saveLocalSession(session({ server_id: 'owned-by-another-account' }));
  globalThis.fetch = async () => ({ ok: false });
  await assert.rejects(loadResumeSession('saved-id'), /this account/);
});


test('expired authentication cannot turn a cloud attempt or progress write into guest success', async () => {
  saveLocalSession(session({ id: 'expired-session', server_id: 'cloud-expired' }));
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ success: true, guest: true, persisted: false }) });
  await assert.rejects(recordQuestionAttempt({ question: { id: 'q4' }, selectedOption: 'A', isCorrect: true, sessionId: 'expired-session' }), /Sign in again/);
  updateSessionProgress('expired-session', { current_index: 3 });
  await tick(); assert.equal(getLocalSession().cloud_status, 'error');
  assert.equal(getLocalSession().pending_attempts.q4.selectedOption, 'A');
});

test('completion retries an unsaved instant answer recovered from device storage', async () => {
  saveLocalSession(session({ id: 'reload-retry', server_id: 'cloud-reload', cloud_status: 'error', pending_attempts: { q4: { selectedOption: 'A', timeTakenSeconds: 3 } } }));
  const calls = [];
  globalThis.fetch = async (url, options) => {
    const body = JSON.parse(options.body); calls.push({ url, body });
    return { ok: true, json: async () => url.endsWith('/attempt') ? { persisted: true } : { success: true, session: { id: body.session_id } } };
  };
  await completePracticeSession({ sessionId: 'reload-retry', questions: [{ id: 'q4', final_opt: 'A' }], answers: { q4: 'A' }, mode: 'instant', timeSpentSeconds: 5 });
  assert.equal(calls[0].body.session_id, 'cloud-reload');
  assert.deepEqual(getLocalSession().pending_attempts, {});
  assert.equal(getLocalSession().cloud_status, 'saved');
});


test('completion waits for an in-flight first answer without duplicating the attempt', async () => {
  let resolveCreate, finishAttempt; let attemptCount = 0;
  globalThis.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    if (options.method === 'POST' && url.endsWith('/session')) return new Promise(resolve => { resolveCreate = resolve; });
    if (url.endsWith('/attempt')) { attemptCount++; return new Promise(resolve => { finishAttempt = resolve; }); }
    return { ok: true, json: async () => ({ success: true, session: { id: body.session_id } }) };
  };
  const created = await initializeSession({ title: 'Concurrent completion', mode: 'instant', filters: {}, questions: [{ id: 'q1', final_opt: 'B' }] });
  const attempt = recordQuestionAttempt({ question: { id: 'q1', final_opt: 'B' }, selectedOption: 'B', isCorrect: true, sessionId: created.id });
  resolveCreate({ ok: true, json: async () => ({ session: { id: 'cloud-concurrent' } }) });
  await tick();
  const completion = completePracticeSession({ sessionId: created.id, questions: [{ id: 'q1', final_opt: 'B' }], answers: { q1: 'B' }, mode: 'instant', timeSpentSeconds: 4 });
  await tick(); assert.equal(attemptCount, 1);
  finishAttempt({ ok: true, json: async () => ({ persisted: true }) });
  await Promise.all([attempt, completion]);
  assert.equal(attemptCount, 1); assert.equal(getLocalSession().cloud_status, 'saved');
});

test('cloud-only resume restores checked state and recorded duration without revealing an unchecked selection', async () => {
  const saved = session({ id: 'cloud-only', time_spent_seconds: 47, answers: { q4: 'A', q1: 'B' },
    checked_ids: undefined, question_times: undefined,
    filters: { subjects: ['Polity'], progress: { checked_ids: ['q4'], question_times: { q4: 12, q1: 8 } } } });
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ activeSession: saved }) });
  const resumed = await loadResumeSession('cloud-only');
  assert.deepEqual(resumed.checked_ids, ['q4']);
  assert.equal(resumed.time_spent_seconds, 47);
  assert.equal(resumed.question_times.q1, 8);
  assert.equal(resumed.answers.q1, 'B');
});

test('creation retry after a lost response reuses the stored creation ID and pending progress', async () => {
  const ids = []; let fail = true;
  globalThis.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    if (options.method === 'POST' && url.endsWith('/session')) {
      ids.push(body.creation_id);
      if (fail) throw new Error('Response lost');
      return { ok: true, json: async () => ({ session: { id: body.creation_id } }) };
    }
    return { ok: true, json: async () => ({ success: true, session: { id: body.session_id }, persisted: true }) };
  };
  const created = await initializeSession({ title: 'Retry', mode: 'instant', filters: {}, questions: [{ id: 'q1' }] });
  await tick();
  updateSessionProgress(created.id, { answers: { q1: 'C' }, checked_ids: [], time_spent_seconds: 14 });
  fail = false; await retryPracticePersistence([{ id: 'q1' }]);
  assert.equal(ids.length, 2); assert.equal(ids[0], ids[1]);
  assert.equal(getLocalSession().cloud_status, 'saved');
  assert.equal(getLocalSession().answers.q1, 'C');
  assert.equal(getLocalSession().time_spent_seconds, 14);
});

test('completion remains resumable until the final cloud save is confirmed', async () => {
  saveLocalSession(session({ id: 'confirmation', server_id: 'cloud-confirmation' }));
  let finish; let attempted = 0;
  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(options.body);
    if (body.is_completed) return new Promise(resolve => { finish = resolve; });
    attempted++;
    return { ok: true, json: async () => ({ success: true, session: { id: body.session_id } }) };
  };
  const completion = completePracticeSession({ sessionId: 'confirmation', questions: [], answers: {}, mode: 'instant', timeSpentSeconds: 20 });
  await tick(); assert.ok(attempted > 0); assert.equal(getLocalSession().is_completed, false);
  updateSessionProgress('confirmation', { time_spent_seconds: 21 });
  await tick();
  assert.equal(getLocalSession().time_spent_seconds, 20);
  finish({ ok: true, json: async () => ({ success: true, session: { id: 'cloud-confirmation' } }) });
  await completion; assert.equal(getLocalSession().is_completed, true);
  updateSessionProgress('confirmation', { time_spent_seconds: 22 });
  await tick();
  assert.equal(getLocalSession().is_completed, true);
});

test('guest Check, refresh/resume and completion stay local without attempt or PATCH requests', async () => {
  const calls = [];
  globalThis.fetch = async (_url, options) => { calls.push(options.method); return { ok: true, json: async () => ({ guest: true }) }; };
  const created = await initializeSession({ title: 'Guest', mode: 'instant', filters: {}, questions: [{ id: 'q1', final_opt: 'B' }] });
  await tick();
  updateSessionProgress(created.id, { answers: { q1: 'B' }, checked_ids: ['q1'], time_spent_seconds: 10 });
  await recordQuestionAttempt({ question: { id: 'q1', final_opt: 'B' }, selectedOption: 'B', isCorrect: true, sessionId: created.id });
  const resumed = await loadResumeSession(created.id); assert.deepEqual(resumed.checked_ids, ['q1']);
  await completePracticeSession({ sessionId: created.id, questions: [{ id: 'q1', final_opt: 'B' }], answers: resumed.answers, mode: 'instant', timeSpentSeconds: 10 });
  assert.deepEqual(calls, ['POST']); assert.equal(getLocalSession().is_completed, true);
});

test('back to a previous guest session retains pending device progress after starting another session', async () => {
  const earlier = session({ id: 'guest-earlier', cloud_status: 'local', checked_ids: ['q4'], time_spent_seconds: 31,
    pending_attempts: { q4: { selectedOption: 'A', timeTakenSeconds: 12 } } });
  saveLocalSession(earlier); saveLocalSession(session({ id: 'guest-newer', cloud_status: 'local' }));
  globalThis.fetch = () => { throw new Error('Guest resume must stay local'); };
  const restored = await loadResumeSession('guest-earlier');
  assert.equal(restored.time_spent_seconds, 31); assert.deepEqual(restored.checked_ids, ['q4']);
  assert.equal(restored.pending_attempts.q4.selectedOption, 'A');
});


test('timed practice review flags survive cloud restore and subsequent progress writes', async () => {
  const saved = session({ filters: { progress: { marked_for_review_ids: ['q4', 'q2'] } } });
  const writes = [];
  globalThis.fetch = async (_url, options) => {
    if (options?.method === 'PATCH') {
      writes.push(JSON.parse(options.body));
      return { ok: true, json: async () => ({ success: true }) };
    }
    return { ok: true, json: async () => ({ activeSession: saved }) };
  };
  const restored = await loadResumeSession(saved.id);
  assert.deepEqual(restored.marked_for_review_ids, ['q4', 'q2']);
  saveLocalSession({ ...restored, server_id: 'cloud-id' });
  updateSessionProgress(saved.id, { marked_for_review_ids: ['q2'], time_spent_seconds: 75 });
  await tick();
  assert.deepEqual(getLocalSession().marked_for_review_ids, ['q2']);
  assert.deepEqual(writes.at(-1).filters.progress.marked_for_review_ids, ['q2']);
  assert.equal(getLocalSession().time_spent_seconds, 75);
});
