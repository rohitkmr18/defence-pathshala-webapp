const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PGlite } = require('../frontend/node_modules/@electric-sql/pglite');
const { approve, edition } = require('./test-support/editorial-fixture.cjs');
const load = require('./test-support/load-ts.cjs')();
const { validateEditorialEdition } = load('frontend/src/lib/current-affairs/editorial-validation.ts');
const { resolveAuthDestination } = load('frontend/src/lib/auth-redirect.ts');
const { questionBeforeAttempt, EXACT_PYQ_ID } = load('frontend/src/lib/exact-pyq.ts');

test('approved source rejects truncation, drift, changed hash, duplicate JSON keys and omitted references', () => {
  validateEditorialEdition(edition());
  const p = edition(); p.stories[0].editorialMarkdown = 'Truncated';
  assert.throws(() => validateEditorialEdition(p), /differ/);
  const hash = edition(); hash.approvedEditorial.sha256 = '0'.repeat(64);
  assert.throws(() => validateEditorialEdition(hash), /SHA-256/);
  for (const mutate of [p => delete p.approvedEditorial, p => delete p.stories[0].editorialMarkdown,
    p => delete p.stories[0].linkedPyqIds, p => p.stories[0].linkedPyqIds.push('../random')]) {
    const p = edition(); mutate(p); assert.throws(() => validateEditorialEdition(p.approvedEditorial ? approve(p) : p));
  }
  const duplicate = edition();
  duplicate.approvedEditorial.source = duplicate.approvedEditorial.source.replace('"date":', '"date":"omitted content","date":');
  duplicate.approvedEditorial.sha256 = require('node:crypto').createHash('sha256').update(duplicate.approvedEditorial.source).digest('hex');
  assert.throws(() => validateEditorialEdition(duplicate), /canonical/);
  const unknown = edition(); unknown.stories[0].unrenderedSection = 'Must never silently disappear';
  assert.throws(() => validateEditorialEdition(approve(unknown)), /Unsupported editorial field/);
});

test('reader uses the immutable complete source, not compressed or subsequently changed derived text', async () => {
  const p = edition(); const s = p.stories[0];
  const row = { id: 'post', date: p.date, title: 'Compressed title', summary: 'Compressed summary',
    total_stories: 1, approved_editorial_source: p.approvedEditorial.source,
    approved_editorial_sha256: p.approvedEditorial.sha256,
    current_affairs_stories: [{ id: 'story', story_number: 1, headline: 'Compressed headline',
      what_happened: 'Compressed event', key_facts: ['Compressed fact'],
      current_affairs_mcqs: [{ id: 'mcq', question_number: 1, question: 'Compressed MCQ',
        explanation: 'Compressed explanation', option_a: '1', option_b: '2', option_c: '3', option_d: '4', exam_tags: [] }] }] };
  const query = { select() { return this; }, eq() { return this; }, async maybeSingle() { return { data: row }; } };
  const reader = require('./test-support/load-ts.cjs')({ '@/lib/supabase/server': { createClient: async () => ({ from: () => query }) } })('frontend/src/lib/current-affairs.ts');
  const post = await reader.getCurrentAffairsByDate(p.date);
  assert.equal(post.title, p.title); assert.equal(post.summary, p.summary);
  const story = post.stories[0];
  for (const field of ['headline', 'whatHappened', 'whyItMatters', 'conceptualLinkage', 'staticLink', 'examRelevance', 'futureAngle', 'editorialMarkdown', 'subject', 'topic', 'subtopic', 'theme', 'sourceUrl']) assert.equal(story[field], s[field]);
  assert.equal(JSON.stringify(story.keyFacts), JSON.stringify(s.keyFacts));
  assert.equal(JSON.stringify(story.linkedPyqIds), JSON.stringify(s.linkedPyqIds));
  assert.equal(story.mcqs[0].question, s.mcqs[0].question);
  assert.equal(story.mcqs[0].explanation, s.mcqs[0].explanation);
});

test('exact prompt allowlist has no answer/explanation/source hints; auth keeps the target and edition', () => {
  const prompt = questionBeforeAttempt({ id: 'uuid', question_id: 'CDS_II_2026_GK_011',
    final_opt: 'B', official_opt: 'B', llm_opt: 'B', explanation: 'Secret explanation', concept: 'Answer hint', source: 'hint' });
  assert.equal(prompt.question_id, 'CDS_II_2026_GK_011');
  assert.ok(!Object.hasOwn(prompt, 'final_opt') && !Object.hasOwn(prompt, 'explanation') && !Object.hasOwn(prompt, 'concept'));
  assert.equal(EXACT_PYQ_ID.test('../random'), false);
  const target = '/pyq/CDS_II_2026_GK_011?edition=2030-01-01';
  for (const state of ['guest', 'incomplete']) assert.equal(new URL(resolveAuthDestination(state, target), 'https://local').searchParams.get('next'), target);
  assert.equal(resolveAuthDestination('complete', target), target);
});

test('new atomic RPC preserves source bytes and every section, rejects invalid corpus IDs, preserves legacy and rolls back', async () => {
  const db = new PGlite();
  try {
    const schema = fs.readFileSync('scripts/test-current-affairs-db-rollback.cjs', 'utf8').match(/const schema = `([\s\S]*?)`;/)[1];
    await db.exec(schema);
    await db.exec(`create table public.questions(id uuid primary key, question_id text unique, is_active boolean, content_eligible boolean);
      create view public.v_dp_question_intelligence_v2 as select * from public.questions where is_active;
      grant select,update on public.questions to service_role;
      grant select on public.v_dp_question_intelligence_v2 to service_role;
      insert into public.questions values ('11111111-1111-4111-a111-111111111111','CDS_II_2026_GK_011',true,true);
      insert into public.current_affairs_posts(date,title,published) values ('2026-10-07','Untouched legacy edition',true);`);
    const before = (await db.query("select * from current_affairs_posts where date='2026-10-07'")).rows[0];
    await db.exec(fs.readFileSync('supabase/migrations/20261008050000_atomic_current_affairs_publish.sql', 'utf8'));
    await db.exec(fs.readFileSync('supabase/migrations/20261009052951_approved_editorial_source.sql', 'utf8'));
    const call = p => db.query('select public.publish_current_affairs_edition_atomic($1::jsonb) id', [JSON.stringify(p)]);
    await assert.rejects(call(edition()), /Only service_role/);
    await db.exec('set role service_role');
    const p = approve({ ...edition(), title: '  Exact approved title  ', summary: '  Exact approved summary  ' }); await call(p);
    const stored = (await db.query("select * from current_affairs_posts where date='2030-01-01'")).rows[0];
    assert.equal(stored.title, p.title); assert.equal(stored.summary, p.summary);
    assert.equal(stored.approved_editorial_source, p.approvedEditorial.source);
    assert.equal(stored.approved_editorial_sha256, p.approvedEditorial.sha256);
    assert.deepEqual(JSON.parse(stored.approved_editorial_source), JSON.parse(p.approvedEditorial.source));
    const rows = (await db.query('select * from current_affairs_stories order by story_number')).rows;
    assert.equal(rows[0].what_happened, p.stories[0].whatHappened);
    assert.equal(rows[0].future_angle, p.stories[0].futureAngle);
    const mcqs = (await db.query('select * from current_affairs_mcqs order by question_number')).rows;
    assert.equal(mcqs[0].question, p.stories[0].mcqs[0].question);
    assert.equal(mcqs[0].explanation, p.stories[0].mcqs[0].explanation);
    await assert.rejects(call(p), /duplicate key/);
    const baseline = (await db.query('select * from current_affairs_posts order by date')).rows;
    for (const change of [p => p.stories[2].linkedPyqIds.push('MISSING'), p => p.stories[2].mcqs[0].contentStatus = 'DRAFT',
      p => { p.stories[2].headline = p.stories[0].headline; p.stories[2].sourceUrl = p.stories[0].sourceUrl; }]) {
      const bad = edition('2030-01-02'); change(bad); await assert.rejects(call(approve(bad)));
      assert.deepEqual((await db.query('select * from current_affairs_posts order by date')).rows, baseline);
    }
    await db.exec('reset role; update questions set content_eligible=false; set role service_role');
    await assert.rejects(call(edition('2030-01-02')), /PYQ unavailable/);
    await db.exec('reset role; update questions set is_active=false; set role service_role');
    await assert.rejects(call(edition('2030-01-02')), /PYQ inactive/);
    await assert.rejects(db.query("update current_affairs_posts set approved_editorial_source='{}' where date='2030-01-01'"), /immutable/);
    const legacy = (await db.query("select * from current_affairs_posts where date='2026-10-07'")).rows[0];
    for (const [key, value] of Object.entries(before)) assert.deepEqual(legacy[key], value);
    assert.equal(legacy.approved_editorial_source, null);
    await db.exec('reset role; set role authenticated');
    await assert.rejects(call(p), /permission denied/);
  } finally { await db.close(); }
});
