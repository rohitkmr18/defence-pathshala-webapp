const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fixture = require('./test-support/monthly-public-fixture.json');
const loader = require('./test-support/load-ts.cjs');

function setup({ post = fixture, eligible = true, duplicate = false, user = null } = {}) {
  const calls = [];
  const pyq = id => ({ question_id: id, exam: id.startsWith('CDS') ? 'CDS' : 'CAPF-AC', year: 2026, q_num: 99,
    content_eligible: eligible, content_status: 'UNCHECKED', question: 'Synthetic prompt', opt_a: 'One', opt_b: 'Two',
    opt_c: 'Three', opt_d: 'Four', final_opt: 'A', private_learner: 'never serialize' });
  const client = { auth: { getUser: async () => ({ data: { user } }) }, from(table) {
    const q = { select(value) { calls.push([table, 'select', value]); return this; },
      eq(key, value) { calls.push([table, key, value]); return this; },
      in(key, value) { calls.push([table, key, value]); return this; },
      maybeSingle: async () => ({ data: post }),
      then(resolve) { const rows = ['CDS_I_2026_GK_099', 'CAPF_2022_P1_125'].map(pyq);
        if (duplicate) rows.push(rows[0]); return Promise.resolve({ data: rows }).then(resolve); } };
    return q;
  } };
  const load = loader({ 'server-only': {}, '@/lib/supabase/server': { createClient: async () => client },
    '@supabase/supabase-js': { createClient: () => client } },
    { process: { env: { VERCEL_ENV: 'preview', SUPABASE_SERVICE_ROLE_KEY: 'synthetic-service', NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:4547' } } });
  return { ...load('frontend/src/lib/monthly-current-affairs.ts'), calls };
}

test('public sample uses exact approved source and MCQ, reads published edition and serializes only eligible PYQ identity', async () => {
  const api = setup();
  const sample = await api.getMonthlySample();
  const source = JSON.parse(fixture.approved_editorial_source).stories[0];
  assert.equal(createHash('sha256').update(fixture.approved_editorial_source).digest('hex'), fixture.approved_editorial_sha256);
  assert.equal(sample.story.editorialMarkdown, source.editorialMarkdown);
  assert.equal(sample.story.headline, source.headline);
  assert.equal(sample.questions[0].question, source.mcqs[0].question);
  assert.equal(sample.questions[0].explanation, source.mcqs[0].explanation);
  assert.equal(JSON.stringify(sample.questions[0].options.map(o => o.text)), JSON.stringify(Object.values(source.mcqs[0].options)));
  assert.equal(sample.pyqs.length, 2);
  assert.equal(Object.hasOwn(sample.pyqs[0], 'final_opt'), false);
  assert.equal(Object.hasOwn(sample.pyqs[0], 'private_learner'), false);
  assert.ok(api.calls.some(c => c[0] === 'current_affairs_posts' && c[1] === 'published' && c[2] === true));
  assert.ok(api.calls.some(c => c[0] === 'v_dp_question_intelligence_v2' && c[1] === 'content_eligible' && c[2] === true));
});

test('wrong edition, story identity, subject and unapproved revision fail closed', async () => {
  for (const mutate of [
    p => p.id = 'other-post',
    p => p.approved_editorial_sha256 = null,
    p => p.approved_editorial_sha256 = '0'.repeat(64),
    p => p.current_affairs_stories[0].id = 'other-story',
    p => { const s = JSON.parse(p.approved_editorial_source); s.stories[0].subject = 'Other'; p.approved_editorial_source = JSON.stringify(s); },
    p => { const s = JSON.parse(p.approved_editorial_source); delete s.stories[0].editorialMarkdown; p.approved_editorial_source = JSON.stringify(s); },
  ]) {
    const post = structuredClone(fixture); mutate(post);
    assert.equal(await setup({ post }).getMonthlySample(), null);
  }
  const api = setup();
  assert.equal(api.isMonthlyEdition('2026-10'), true);
  for (const id of ['2026-13', '2026-09', '../2026-10', '2026-10?draft=1', '2026-1', '2027-10']) assert.equal(api.isMonthlyEdition(id), false);
});

test('ineligible and ambiguous canonical PYQs never get working public links', async () => {
  assert.equal((await setup({ eligible: false }).getMonthlySample()).pyqs.length, 0);
  assert.equal((await setup({ duplicate: true }).getMonthlySample()).pyqs.length, 1);
});

test('analytics context contains environment and authentication state, no learner identity', async () => {
  for (const user of [null, { id: 'private-user', email: 'private@example.invalid' }]) {
    const context = await setup({ user }).monthlyEventContext('monthly_sample');
    assert.equal(context.auth_state, user ? 'authenticated' : 'guest');
    assert.equal(context.deployment_environment, 'preview');
    assert.equal(context.edition_id, '2026-10');
    assert.equal(Object.hasOwn(context, 'user_id'), false);
    assert.equal(JSON.stringify(context).includes('private'), false);
  }
});

test('monthly PYQ return allowlist preserves only the released sample destination', () => {
  const { safeLearningReturn } = loader()('frontend/src/lib/learning-navigation.ts');
  assert.equal(safeLearningReturn('/current-affairs/monthly/2026-10/sample'), '/current-affairs/monthly/2026-10/sample');
  for (const destination of ['/current-affairs/monthly/2026-11/sample', '//evil.invalid', 'https://evil.invalid', '/current-affairs/monthly/2026-10/private']) {
    assert.equal(safeLearningReturn(destination), '/dashboard/practice');
  }
});
