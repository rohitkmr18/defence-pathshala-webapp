const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PGlite } = require('../frontend/node_modules/@electric-sql/pglite');
const history = require('../docs/auth/production-migration-history.json');
const directory = 'supabase/migrations';

test('every observed applied production migration has its exact recorded version and SQL', () => {
  const files = fs.readdirSync(directory).filter(name => name.endsWith('.sql')).sort();
  const applied = history.migrations.map(row => `${row.version}_${row.name}.sql`);
  assert.deepEqual(files, applied.sort());
  for (const row of history.migrations) {
    assert.equal(fs.readFileSync(`${directory}/${row.version}_${row.name}.sql`, 'utf8').trim(), row.statements.join('\n').replace(/[ \t]+$/gm, '').trim());
  }
  assert.equal(history.migrations.at(-1).version, '20261007121502');
  const config = fs.readFileSync('supabase/config.toml', 'utf8');
  assert.match(config, /\[db\.migrations\][\s\S]*?enabled = false\s+schema_paths = \[\]/);
  assert.match(config, /\[db\.seed\][\s\S]*?enabled = false[\s\S]*?sql_paths = \[\]/);
  assert.equal(config.includes('schemas = ["public", "graphql_public"]'), true);
});

test('fresh schema reconstruction includes Phase 0, actual Phase 2 history and atomic onboarding without resetting completed users', async () => {
  const db = new PGlite();
  try {
    const paths = ['supabase/reconstruction/platform-test-stubs.sql',
      ...fs.readdirSync('supabase/reconstruction/bootstrap').sort().map(name => `supabase/reconstruction/bootstrap/${name}`),
      'supabase/reconstruction/legacy-prerequisites.sql',
      ...history.migrations.map(row => `${directory}/${row.version}_${row.name}.sql`),
      'supabase/reconstruction/observed-grants.sql'];
    for (const path of paths) {
      // PGlite has built-in gen_random_uuid but not pgcrypto. No other SQL is altered.
      await db.exec(fs.readFileSync(path, 'utf8').replace('create extension if not exists pgcrypto;', ''));
    }
    const id = '11111111-1111-4111-8111-111111111111';
    await db.exec(`insert into auth.users(id) values ('${id}');
      update public.profiles set full_name='Existing', onboarding_completed=true where id='${id}';
      insert into public.user_exam_preferences(user_id,exam) values ('${id}','NDA');`);
    await db.exec(fs.readFileSync('supabase/reconstruction/synthetic-lineage-check.sql', 'utf8'));
    await db.exec(`select set_config('request.jwt.claim.sub', '${id}', false); set role authenticated;`);
    const { rows } = await db.query("select public.complete_onboarding('Overwrite',2028,array['CDS']) as profile");
    assert.equal(rows[0].profile.full_name, 'Existing');
    assert.deepEqual(rows[0].profile.target_exams, ['NDA']);
    assert.equal(rows[0].profile.onboarding_completed, true);
    await assert.rejects(db.exec("update public.profiles set role='admin'"), /role|permission/i);
    const own = await db.query('select id from public.profiles');
    assert.equal(own.rows.length, 1);
    const tier = await db.query("select column_name from information_schema.columns where table_name='v_dp_question_intelligence_v2' and column_name='intelligence_trust_tier'");
    assert.equal(tier.rows.length, 1);
  } finally { await db.close(); }
});
