// Exercise the actual route handler with database/auth responses, without credentials.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('../frontend/node_modules/typescript');
const source = fs.readFileSync('frontend/src/app/api/profile/route.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
function setup(options = {}) {
  const operations = [];
  const profile = { id: 'current-user', full_name: '', target_year: null, onboarding_completed: false };
  let exams = [];
  const db = {
    auth: { getUser: async () => ({ data: { user: options.guest ? null : { id: profile.id } } }) },
    from(table) {
      let action = 'select'; let payload;
      const query = {
        select() { return query; },
        eq(column, value) { assert.equal(value, profile.id); return query; },
        update(value) { action = 'update'; payload = value; return query; },
        delete() { action = 'delete'; return query; },
        insert(value) { action = 'insert'; payload = value; return query; },
        maybeSingle() { return run(); },
        single() { return run(); },
        then(resolve, reject) { return run().then(resolve, reject); },
      };
      async function run() {
        operations.push(`${table}:${action}`);
        if (options.fail === `${table}:${action}`) return { data: null, error: { message: 'Database rejected operation' } };
        if (table === 'profiles') {
          if (action === 'update') {
            if (options.zeroRows) return { data: null, error: null };
            Object.assign(profile, payload);
          }
          return { data: options.missing ? null : { ...profile }, error: null };
        }
        if (action === 'delete') exams = [];
        if (action === 'insert' && !options.dropExams) exams = payload;
        return { data: exams.map(({ exam }) => ({ exam })), error: null };
      }
      return query;
    },
  };
  const context = { exports: {}, console, setTimeout, clearTimeout,
    require(name) {
      if (name === 'next/server') return { NextResponse: { json: (body, init = {}) => ({ status: init.status || 200, body }) } };
      if (name === '@/lib/supabase/server') return { createClient: async () => db };
      throw new Error(name);
    }, process: { env: {} },
  };
  vm.runInNewContext(code, context);
  return { patch: context.exports.PATCH, profile, operations };
}
const valid = { full_name: ' Test Aspirant ', target_year: '2027', target_exams: ['CDS', 'CAPF-AC', 'CDS'] };
const request = (body = valid) => ({ json: async () => body });
test('persists profile and unique preferences before returning completion', async () => {
  const { patch, profile, operations } = setup(); const response = await patch(request());
  assert.equal(response.status, 200); assert.equal(response.body.onboarding_completed, true);
  assert.equal(profile.full_name, 'Test Aspirant'); assert.equal(profile.target_year, 2027);
  assert.equal(response.body.target_exams.length, 2);
  assert.equal(operations.at(-1), 'profiles:update');
});
for (const fail of ['profiles:select', 'profiles:update', 'user_exam_preferences:delete', 'user_exam_preferences:insert', 'user_exam_preferences:select']) {
  test(`does not report success when ${fail} fails`, async () => {
    const { patch, profile } = setup({ fail }); const response = await patch(request());
    assert.equal(response.status, 500); assert.ok(response.body.error); assert.equal(profile.onboarding_completed, false);
  });
}
for (const option of ['missing', 'zeroRows', 'dropExams']) {
  test(`does not report success for ${option}`, async () => {
    const { patch } = setup({ [option]: true }); assert.equal((await patch(request())).status, 500);
  });
}
test('rejects expired sessions and invalid details', async () => {
  assert.equal((await setup({ guest: true }).patch(request())).status, 401);
  for (const body of [null, {}, { ...valid, target_exams: [] }, { ...valid, target_year: 'abc' }, { ...valid, target_exams: ['admin'] }]) {
    assert.equal((await setup().patch(request(body))).status, 400);
  }
});
test('repeat submission saves consistently', async () => {
  const { patch } = setup(); assert.equal((await patch(request())).status, 200); assert.equal((await patch(request())).status, 200);
});
