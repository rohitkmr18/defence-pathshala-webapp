import test from 'node:test';
import assert from 'node:assert/strict';
import { safeAuthNext, completeAuthCallback } from '../lib/auth-redirect.ts';

test('OAuth and password redirects reject external and browser-normalized external destinations', () => {
  for (const value of [null, '', 'https://evil.test', '//evil.test', '/\\evil.test', '/\nevil.test', '/a/..//evil.test']) {
    assert.equal(safeAuthNext(value), '/dashboard');
  }
  assert.equal(safeAuthNext('/dashboard/practice?exam=CDS#start'), '/dashboard/practice?exam=CDS#start');
});

test('successful callback exchanges the code before returning to the requested page', async () => {
  const params = new URLSearchParams({ code: 'test-code', next: '/dashboard/practice' });
  let exchanged = false;
  assert.equal(await completeAuthCallback(params, async code => {
    assert.equal(code, 'test-code'); exchanged = true; return { error: null };
  }), '/dashboard/practice');
  assert.equal(exchanged, true);
});

test('provider denial or missing code returns to login without exchanging a session', async () => {
  for (const params of [new URLSearchParams(), new URLSearchParams({ error: 'access_denied', code: 'ignored' })]) {
    assert.equal(await completeAuthCallback(params, () => { throw new Error('Must not be called'); }), '/auth/login?error=oauth_failed');
  }
});

test('expired code and network failure cannot be mistaken for successful sign-in', async () => {
  const params = new URLSearchParams({ code: 'expired' });
  assert.equal(await completeAuthCallback(params, async () => ({ error: { message: 'expired' } })), '/auth/login?error=oauth_failed');
  assert.equal(await completeAuthCallback(params, async () => { throw new Error('network'); }), '/auth/login?error=oauth_failed');
});
