import test from 'node:test';
import assert from 'node:assert/strict';
import { authEntryDestination, authUrl, resolveAuthDestination, safeAuthNext, completeAuthCallback } from '../lib/auth-redirect.ts';
import { readAuthState, readProfile } from '../lib/profile-store.ts';
import { fullPaperDestination } from '../lib/full-paper-intent.ts';
import { createSetupSaver } from '../lib/onboarding-save.ts';

const intent = '/dashboard/practice/full-paper?exam=CDS&year=2024&cycle=II';
const nextOf = (url) => new URL(url, 'https://local.test').searchParams.get('next');

test('guest Explore and targeted practice remain public; authenticated incomplete entries go to setup', () => {
  for (const path of ['/dashboard/question-bank', '/dashboard/practice', '/dashboard/practice/session']) {
    assert.equal(authEntryDestination('guest', path, null, path + '?exam=CDS'), null);
    assert.equal(nextOf(authEntryDestination('incomplete', path, null, path + '?exam=CDS')), path + '?exam=CDS');
  }
});

test('direct login/signup/setup entry respects state and completed legacy users bypass setup', () => {
  for (const path of ['/auth/login', '/auth/signup']) {
    assert.equal(authEntryDestination('guest', path, intent, path), null);
    assert.equal(authEntryDestination('incomplete', path, intent, path), authUrl('/onboarding', intent));
    assert.equal(authEntryDestination('complete', path, intent, path), intent);
  }
  assert.equal(authEntryDestination('guest', '/onboarding', intent, '/onboarding'), authUrl('/auth/login', intent));
  assert.equal(authEntryDestination('incomplete', '/onboarding', intent, '/onboarding'), null);
  assert.equal(authEntryDestination('complete', '/onboarding', intent, '/onboarding'), intent);
  assert.equal(resolveAuthDestination('complete'), '/dashboard');
});

test('next survives login/signup switches, Google callback, setup and recovery; returnTo stays separate', async () => {
  const targeted = '/dashboard/practice/session?exam=CAPF-AC&returnTo=%2Fdashboard%2Fquestion-bank%3Fyear%3D2024';
  for (const path of ['/auth/login', '/auth/signup', '/onboarding', '/auth/recovery']) {
    assert.equal(nextOf(authUrl(path, targeted)), targeted);
  }
  assert.equal(nextOf(await completeAuthCallback(new URLSearchParams({ code: 'test', next: targeted }), async () => ({ error: null }))), targeted);
  assert.equal(nextOf(await completeAuthCallback(new URLSearchParams({ error: 'denied', next: targeted }), async () => { throw Error(); })), targeted);
  assert.equal(resolveAuthDestination('complete', targeted), targeted);
  assert.equal(nextOf(resolveAuthDestination('error', targeted)), targeted);
});

test('rejects recursive auth/setup, encoded bypasses and external destinations', () => {
  for (const value of ['/auth/login?next=/auth/login', '/auth/signup', '/auth/callback', '/auth/continue', '/auth/recovery', '/onboarding', '/onboarding/extra', '/AUTH/Login', '/%61uth/login', '/%2561uth/login', '/x/%252e%252e/auth/login', '/%2f%2fevil.test', '/%5cevil.test', '/%00x', '/%', '//evil.test', 'https://evil.test']) {
    assert.equal(safeAuthNext(value), '/dashboard', value);
  }
  assert.equal(safeAuthNext(intent), intent);
});

function db({ completed = false, missing = false, fail, user = { id: 'owner', user_metadata: { name: 'Prefilled' } }, authError } = {}) {
  return { auth: { getUser: async () => ({ data: { user }, error: authError }) },
    from(table) {
      const result = { data: table === 'profiles' ? (missing ? null : { id: 'owner', full_name: null, target_year: null, onboarding_completed: completed }) : [], error: table === fail ? Error('read failed') : null };
      return { select() { return this; }, eq(_, id) { assert.equal(id, 'owner'); return this; }, maybeSingle: async () => result, then: (resolve) => Promise.resolve(result).then(resolve) };
    } };
}
test('missing profile is incomplete; read failures are recoverable and never invent completion', async () => {
  assert.equal(await readAuthState(db({ missing: true })), 'incomplete');
  assert.equal((await readProfile(db({ missing: true }), { id: 'owner', user_metadata: { name: 'Prefilled' } })).full_name, 'Prefilled');
  for (const fail of ['profiles', 'user_exam_preferences']) assert.equal(await readAuthState(db({ completed: true, fail })), 'error');
  assert.equal(await readAuthState(db({ completed: true })), 'complete');
  assert.equal(await readAuthState(db({ user: null })), 'guest');
  assert.equal(await readAuthState(db({ user: null, authError: { status: 500 } })), 'error');
  assert.equal(await readAuthState(db({ user: null, authError: { status: 401 } })), 'guest');
});

test('full-paper intent is the exact selection through the entire auth/setup flow', () => {
  for (const paper of [{ exam: 'CDS', year: 2024, cycle: 'II' }, { exam: 'CAPF-AC', year: 2023 }]) {
    const destination = fullPaperDestination(paper);
    const requested = nextOf(authUrl('/auth/login', destination));
    const setup = resolveAuthDestination('incomplete', requested);
    const recovered = resolveAuthDestination('error', nextOf(setup));
    assert.equal(resolveAuthDestination('complete', nextOf(recovered)), destination);
    const query = new URL(destination, 'https://local.test').searchParams;
    assert.equal(query.get('exam'), paper.exam);
    assert.equal(query.get('year'), String(paper.year));
    assert.equal(query.get('cycle'), paper.cycle ?? null);
  }
});

test('duplicate client submits share one request; failed save permits retry without mutating inputs', async () => {
  let requests = 0;
  let release;
  let fail = true;
  const save = createSetupSaver(async () => {
    requests++;
    await new Promise(resolve => { release = resolve; });
    return { ok: !fail, json: async () => fail ? { error: 'Retry' } : { onboarding_completed: true } };
  });
  const input = { full_name: 'Aspirant', target_year: '', target_exams: ['CDS'] };
  const before = structuredClone(input);
  const first = save(input);
  assert.equal(save(input), first);
  release();
  await assert.rejects(first, /Retry/);
  assert.equal(requests, 1);
  assert.deepEqual(input, before);
  fail = false;
  const retry = save(input); release();
  assert.equal((await retry).onboarding_completed, true);
  assert.equal(requests, 2);
});
