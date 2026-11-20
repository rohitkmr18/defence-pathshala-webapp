const { test } = require('node:test');
const assert = require('node:assert/strict');
const store = {};
const localStorage = { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; }, removeItem: (k) => { delete store[k]; } };
const load = require('./test-support/load-ts.cjs')({}, { setTimeout, clearTimeout, localStorage });
const Q = load('frontend/src/lib/mock/save-queue.ts');

const tick = () => new Promise((r) => setImmediate(r));
const p = (id, selected, extra = {}) => ({ questionId: id, selected, markedForReview: false, ...extra });

test('saves in order and only the latest unsent state per question is sent', async () => {
  const sent = []; let release;
  const q = new Q.MockSaveQueue({ send: async (x) => { sent.push(x.questionId + ':' + x.selected); if (!release) await new Promise((r) => { release = r; }); }, sleep: async () => {} });
  q.enqueue(p('q1', 'A'));           // goes in flight and waits
  q.enqueue(p('q2', 'B'));
  q.enqueue(p('q2', 'C'));           // replaces unsent q2:B
  q.enqueue(p('q3', 'D'));
  await tick(); release();
  assert.equal(await q.flush(1000), true);
  assert.deepEqual(sent, ['q1:A', 'q2:C', 'q3:D']);
  assert.equal(q.state().pending, 0);
});

test('transient failures (timeouts, 503) retry with backoff and never become fatal', async () => {
  let calls = 0; const waits = [];
  const q = new Q.MockSaveQueue({
    send: async () => { calls++; if (calls < 4) throw calls === 1 ? new Q.MockSaveError('Network unavailable') : new Q.MockSaveError('busy', 503); },
    sleep: async (ms) => { waits.push(ms); }, delays: [10, 20, 30],
  });
  q.enqueue(p('q1', 'A'));
  assert.equal(await q.flush(1000), true);
  assert.equal(calls, 4);
  assert.deepEqual(waits, [10, 20, 30]);
  assert.equal(q.state().fatal, null);
});

test('a newer answer given during a failed request is the one retried', async () => {
  const sent = []; let first = true;
  const q = new Q.MockSaveQueue({
    send: async (x) => { sent.push(x.selected); if (first) { first = false; q.enqueue(p('q1', 'B')); throw new Q.MockSaveError('timeout'); } },
    sleep: async () => {},
  });
  q.enqueue(p('q1', 'A'));
  assert.equal(await q.flush(1000), true);
  assert.deepEqual(sent, ['A', 'B']);
});

test('401/409 stop the queue, keep the unsent answer and fail flush', async () => {
  const q = new Q.MockSaveQueue({ send: async () => { throw new Q.MockSaveError('Time expired', 409); }, sleep: async () => {} });
  q.enqueue(p('q1', 'A'));
  assert.equal(await q.flush(1000), false);
  assert.equal(q.state().fatal, 'Time expired');
  assert.equal(q.snapshot().length, 1);
  q.enqueue(p('q2', 'B')); // ignored after a fatal error
  assert.equal(q.snapshot().length, 1);
});

test('offline pauses sending; kick() on reconnect drains the queue', async () => {
  let online = false; const sent = [];
  const q = new Q.MockSaveQueue({ send: async (x) => { sent.push(x.questionId); }, isOnline: () => online, sleep: async () => {} });
  q.enqueue(p('q1', 'A')); q.enqueue(p('q2', 'B'));
  await tick();
  assert.deepEqual(sent, []);
  assert.equal(q.state().pending, 2);
  assert.equal(await q.flush(50), false);
  online = true; q.kick();
  assert.equal(await q.flush(1000), true);
  assert.deepEqual(sent, ['q1', 'q2']);
});

test('local backup round-trips and drops malformed or foreign entries', () => {
  Q.backupUnsaved('s1', [p('q1', 'A', { timeSpentSeconds: 12 }), p('qX', 'B')]);
  store['mock-unsaved:s1'] = store['mock-unsaved:s1'].replace(']', ',{"questionId":"q2","selected":"E","markedForReview":false}]');
  const back = JSON.parse(JSON.stringify(Q.readUnsaved('s1', new Set(['q1', 'q2']))));
  assert.deepEqual(back, [p('q1', 'A', { timeSpentSeconds: 12 })]);
  Q.backupUnsaved('s1', []);
  assert.equal(store['mock-unsaved:s1'], undefined);
});
