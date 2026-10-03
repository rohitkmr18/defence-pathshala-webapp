const { test } = require('node:test');
const assert = require('node:assert/strict');
const createLoader = require('./test-support/load-ts.cjs');

function setup(state) {
  function response(destination) {
    const values = new Map();
    return { destination, headers: new Map(), cookies: {
      set(cookie, value, options) {
        if (typeof cookie === "string") cookie = { name: cookie, value, ...options };
        values.set(cookie.name, cookie);
      }, getAll() { return [...values.values()]; },
    } };
  }
  const load = createLoader({
    'next/server': { NextResponse: { next: () => response(null), redirect: url => response(url) } },
    '@supabase/ssr': { createServerClient(_url, _key, options) {
      return { auth: { async getUser() {
        options.cookies.setAll([{ name: 'session', value: 'refreshed-fixture', options: { httpOnly: true } }]);
        return { data: { user: state === 'guest' ? null : { id: 'owner', user_metadata: {} } } };
      } }, from(table) {
        const result = { error: state === 'error' ? Error('profile load failed') : null,
          data: table === 'profiles' ? { onboarding_completed: state === 'complete' } : [] };
        const query = { select() { return query; }, eq() { return query; }, maybeSingle: async () => result,
          then: resolve => Promise.resolve(result).then(resolve) };
        return query;
      } };
    } },
  }, { process: { env: {} } });
  return load('frontend/src/lib/supabase/middleware.ts').updateSession;
}
function request(path) {
  return { url: `https://local.test${path}`, nextUrl: new URL(`https://local.test${path}`),
    cookies: { getAll: () => [], set() {} } };
}

test('route guard preserves exact next and refreshed cookies on incomplete-user redirects', async () => {
  const path = '/dashboard/practice/full-paper?exam=CDS&year=2024&cycle=II';
  const response = await setup('incomplete')(request(path));
  assert.equal(response.destination.pathname, '/onboarding');
  assert.equal(response.destination.searchParams.get('next'), path);
  assert.equal(response.cookies.getAll()[0].value, 'refreshed-fixture');
  assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
});

test('completed direct signup/onboarding redirect to intended paper with the session intact', async () => {
  const next = '/dashboard/practice/full-paper?exam=CAPF-AC&year=2023';
  for (const path of ['/auth/signup', '/onboarding']) {
    const response = await setup('complete')(request(`${path}?next=${encodeURIComponent(next)}`));
    assert.equal(response.destination.pathname + response.destination.search, next);
    assert.equal(response.cookies.getAll().length, 1);
  }
});

test('guest Explore is public and read failures route to recovery instead of inventing completion', async () => {
  const path = '/dashboard/question-bank?exam=CDS';
  assert.equal((await setup('guest')(request(path))).destination, null);
  const failed = await setup('error')(request(path));
  assert.equal(failed.destination.pathname, '/auth/recovery');
  assert.equal(failed.destination.searchParams.get('next'), path);
});
