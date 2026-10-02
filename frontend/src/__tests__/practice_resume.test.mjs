import test, { beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadResumeSession, restoreQuestionOrder, initializeSession,
  updateSessionProgress, getLocalSession, saveLocalSession,
} from '../lib/practice-session-client.ts';

const originalFetch = globalThis.fetch;
const originalWindow = globalThis.window;
const originalStorage = globalThis.localStorage;
const session = (overrides = {}) => ({
  id: 'saved-id', title: 'Four polity questions', mode: 'attempt',
  filters: { subjects: ['Polity'] }, question_ids: ['q4', 'q1', 'q3', 'q2'],
  current_index: 2, answers: { q4: 'A', q1: 'B' }, is_completed: false,
  total_questions: 4, correct_count: 0, incorrect_count: 0, time_spent_seconds: 0,
  started_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...overrides,
});
const tick = () => new Promise(resolve => setImmediate(resolve));

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
    return { ok: true };
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

test('skipping clears an answer and progress snapshots are written in interaction order', async () => {
  saveLocalSession(session({ server_id: 'server-id' }));
  let finishFirst; const writes = [];
  globalThis.fetch = async (_url, options) => {
    writes.push(JSON.parse(options.body));
    if (writes.length === 1) return new Promise(resolve => { finishFirst = resolve; });
    return { ok: true };
  };
  updateSessionProgress('saved-id', { current_index: 1 });
  updateSessionProgress('saved-id', { current_index: 3, answers: { q4: 'A' } });
  await tick();
  assert.equal(writes.length, 1);
  assert.deepEqual(getLocalSession().answers, { q4: 'A' });
  finishFirst({ ok: true }); await tick();
  assert.equal(writes.length, 2);
  assert.equal(writes[1].current_index, 3);
  assert.deepEqual(writes[1].answers, { q4: 'A' });
});
