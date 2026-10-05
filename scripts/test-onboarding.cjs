const { test } = require('node:test');
const assert = require('node:assert/strict');
const createLoader = require('./test-support/load-ts.cjs');
const valid = { full_name: ' Test Aspirant ', target_year: '', target_exams: ['CDS', 'CAPF-AC', 'CDS'] };
const request = (body = valid) => ({ json: async () => body });

function setup(options = {}) {
  const operations = [];
  let profile = options.missing ? null : { id: 'current-user', full_name: null, target_year: null, onboarding_completed: !!options.completed };
  let exams = options.exams || [];
  const user = { id: 'current-user', user_metadata: {} };
  const db = {
    auth: { getUser: async () => ({ data: { user: options.guest ? null : user } }) },
    async rpc(name, args) {
      operations.push({ name, args });
      if (options.rpcFailure) return { data: null, error: Error('transaction failed') };
      if (!profile?.onboarding_completed || name === 'update_preparation_profile') {
        profile = { id: user.id, full_name: args.p_full_name, target_year: args.p_target_year, onboarding_completed: true };
        exams = args.p_target_exams;
      }
      const result = { ...profile, target_exams: exams };
      if (options.unverified) result.onboarding_completed = false;
      if (options.wrongOwner) result.id = 'other-user';
      return { data: result, error: null };
    },
    from(table) {
      const query = {
        select() { return query; },
        eq(column, value) { assert.equal(value, user.id); return query; },
        maybeSingle() { return run(); },
        then(resolve, reject) { return run().then(resolve, reject); },
      };
      async function run() {
        if (options.readFailure) return { data: null, error: Error('read failed') };
        if (table === 'profiles') return { data: profile && { ...profile, onboarding_completed: options.zeroRows ? false : profile.onboarding_completed }, error: null };
        return { data: (options.dropExams ? [] : exams).map(exam => ({ exam })), error: null };
      }
      return query;
    },
  };
  const load = createLoader({
    'next/server': { NextResponse: { json: (body, init = {}) => ({ status: init.status || 200, body }) } },
    '@/lib/supabase/server': { createClient: async () => db },
  });
  return { post: load('frontend/src/app/api/onboarding/route.ts').POST,
    patch: load('frontend/src/app/api/profile/route.ts').PATCH,
    get: load('frontend/src/app/api/profile/route.ts').GET, operations,
    profile: () => profile };
}

test('setup calls one authenticated RPC, normalizes duplicates and verifies persisted state', async () => {
  const { post, operations } = setup({ missing: true });
  const response = await post(request());
  assert.equal(response.status, 200);
  assert.equal(response.body.onboarding_completed, true);
  assert.equal(response.body.full_name, 'Test Aspirant');
  assert.equal(response.body.target_year, null);
  assert.equal(response.body.target_exams.length, 2);
  assert.equal(operations.length, 1);
  assert.equal(operations[0].name, 'complete_onboarding');
});

test('name and year are optional; required exam cannot be omitted', async () => {
  assert.equal((await setup().post(request({ target_exams: ['CDS'] }))).status, 200);
  for (const body of [null, {}, { ...valid, target_exams: [] }, { ...valid, target_year: 'abc' },
    { ...valid, target_year: false }, { ...valid, target_year: [] }, { ...valid, full_name: 123 },
    { ...valid, target_exams: ['NDA'] }, { ...valid, role: 'admin' }, { ...valid, id: 'another-user' },
    { ...valid, onboarding_completed: true }]) {
    const { post, operations } = setup();
    assert.equal((await post(request(body))).status, 400);
    assert.equal(operations.length, 0);
  }
});

for (const option of ['rpcFailure', 'readFailure', 'unverified', 'wrongOwner', 'zeroRows', 'dropExams']) {
  test(`never reports setup success when ${option}`, async () => {
    const { post } = setup({ [option]: true });
    const response = await post(request());
    assert.equal(response.status, 503);
    assert.ok(response.body.error);
  });
}

test('expired sessions cannot read or write a profile', async () => {
  const { post, patch, get, operations } = setup({ guest: true });
  assert.equal((await post(request())).status, 401);
  assert.equal((await patch(request())).status, 401);
  assert.equal((await get()).status, 401);
  assert.equal(operations.length, 0);
});

test('GET distinguishes a missing row from a failed read', async () => {
  assert.equal((await setup({ missing: true }).get()).body.onboarding_completed, false);
  assert.equal((await setup({ readFailure: true }).get()).status, 503);
});

test('repeat setup returns saved data; existing legacy completed users are retained', async () => {
  const { post } = setup();
  assert.equal((await post(request())).status, 200);
  const second = await post(request({ target_exams: ['CDS'], full_name: 'Overwrite', target_year: '2030' }));
  assert.equal(second.body.full_name, 'Test Aspirant');
  const existing = setup({ completed: true, exams: ['NDA'] });
  const response = await existing.post(request());
  assert.equal(response.status, 200);
  assert.equal(response.body.target_exams[0], 'NDA');
  assert.equal(response.body.full_name, null);
});

test('existing dashboard target editor keeps working without marking setup again', async () => {
  const existing = setup({ completed: true, exams: ['NDA'] });
  const response = await existing.patch(request({ target_exams: ['AFCAT'], target_year: 2027 }));
  assert.equal(response.status, 200);
  assert.equal(existing.operations[0].name, 'update_preparation_profile');
  assert.equal(response.body.target_exams[0], 'AFCAT');
});


test('profile JWT validation retry revalidates the same owner and remains bounded', async () => {
  const { readAuthState } = createLoader()('frontend/src/lib/profile-store.ts');
  for (const scenario of ['transient', 'persistent', 'wrong-owner', 'other-error']) {
    let profileReads = 0, authReads = 0;
    const db = {
      auth: { getUser: async () => ({ data: { user: { id: ++authReads > 1 && scenario === 'wrong-owner' ? 'other-user' : 'current-user' } }, error: null }) },
      from(table) {
        const query = { select() { return query; }, eq() { return query; }, maybeSingle() { return run(); }, then(resolve, reject) { return run().then(resolve, reject); } };
        async function run() {
          if (table !== 'profiles') return { data: [], error: null };
          profileReads++;
          if (profileReads === 1 || scenario === 'persistent') return { data: null, error: { code: scenario === 'other-error' ? '42501' : 'PGRST303' } };
          return { data: { id: 'current-user', onboarding_completed: true }, error: null };
        }
        return query;
      }
    };
    assert.equal(await readAuthState(db), scenario === 'transient' ? 'complete' : 'error');
    assert.equal(profileReads, ['transient', 'persistent'].includes(scenario) ? 2 : 1);
    assert.equal(authReads, scenario === 'other-error' ? 1 : 2);
  }
});
