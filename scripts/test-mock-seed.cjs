const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = () => import('../frontend/scripts/seed-mock-cds-gk-demo.mjs');

test('seed refuses production and non-staging hosts', async () => {
  const { assertStaging } = await load();
  assert.throws(() => assertStaging('https://afhwegrxnvgsqbqadvwr.supabase.co'), /PRODUCTION/);
  assert.throws(() => assertStaging('https://example.supabase.co'), /not the staging/);
  assert.throws(() => assertStaging('http://127.0.0.1:54321'), /not the staging/);
  assert.throws(() => assertStaging(undefined), /missing or invalid/);
  assert.doesNotThrow(() => assertStaging('https://pxfstrzceyxnweeaydvz.supabase.co'));
});
test('seed content: 120 unique DUMMY approved questions in the blueprint', async () => {
  const { buildDemoQuestions, BLUEPRINT } = await load();
  const q = buildDemoQuestions();
  assert.equal(q.length, 120);
  assert.equal(Object.values(BLUEPRINT).reduce((a, b) => a + b, 0), 120);
  assert.equal(new Set(q.map((x) => x.external_id)).size, 120);
  assert.equal(new Set(q.map((x) => x.fingerprint_sha256)).size, 120);
  for (const [subject, n] of Object.entries(BLUEPRINT)) assert.equal(q.filter((x) => x.subject === subject).length, n, subject);
  assert.ok(q.every((x) => x.editorial_status === 'APPROVED' && x.stem.text.startsWith('[DUMMY]') && x.external_id.startsWith('DUMMY-')));
  assert.ok(q.every((x) => x.options.length === 4 && /^[ABCD]$/.test(x.correct_option) && /^[a-f0-9]{64}$/.test(x.fingerprint_sha256)));
  assert.ok(q.some((x) => x.stem.statements));
  assert.deepEqual(JSON.parse(JSON.stringify(buildDemoQuestions())), JSON.parse(JSON.stringify(q)), 'deterministic');
});
