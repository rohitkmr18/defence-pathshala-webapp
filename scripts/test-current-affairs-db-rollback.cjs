const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PGlite } = require('../frontend/node_modules/@electric-sql/pglite');

// Isolated real PostgreSQL engine. The synthetic tables mirror the publisher's
// required columns and uniqueness rules; no live Supabase project is touched.
const schema = `
create role service_role;
create role authenticated;
create role anon;
create table public.current_affairs_posts (
 id uuid primary key default gen_random_uuid(), date date not null unique,
 slug text unique, title text, summary text, total_stories int, total_slides int,
 published boolean not null default false
);
create table public.current_affairs_stories (
 id uuid primary key default gen_random_uuid(), post_id uuid not null references public.current_affairs_posts(id),
 story_number int, headline text, summary text, category text, subject text,
 topic text, subtopic text, theme text, exam_relevance text, future_angle text,
 keywords text[], what_happened text, why_it_matters text, key_facts jsonb,
 conceptual_linkage text, static_link text, exam_tags text[], source_name text,
 source_url text, source_date date, content_hash text unique, dp_score smallint,
 unique(post_id, story_number)
);
create table public.current_affairs_mcqs (
 id uuid primary key default gen_random_uuid(), story_id uuid not null references public.current_affairs_stories(id),
 question_number int, question text, option_a text, option_b text, option_c text, option_d text,
 correct_option char(1), explanation text, difficulty text, subject text, topic text,
 subtopic text, concept text, exam_tags text[], question_type text, exam_edge text,
 mock_eligible boolean, content_status text, source_url text,
 unique(story_id, question_number)
);
grant usage on schema public to service_role;
grant select,insert,update on public.current_affairs_posts,public.current_affairs_stories,public.current_affairs_mcqs to service_role;
`;
function edition(date, count=4) {
 return {date,title:'QA edition',summary:'Isolated transaction test',stories:Array.from({length:count},(_,i)=>({
 headline:'Test story '+date+' '+i, whatHappened:'Verified event',keyFacts:['Fact'],
 sourceUrl:'https://example.org/'+date+'/'+i,sourceDate:date,subject:'Economy',
 mcqs:[{question:'Question '+i+'?',options:{A:'One',B:'Two',C:'Three',D:'Four'},
 correctOption:'B',explanation:'Supported explanation',examEdge:'Exam relevance',
 contentStatus:'VERIFIED',sourceUrl:'https://example.org/source'}]
 }))};
}
test('atomic publisher: successful publish, duplicate rejection, invalid MCQ and late failure roll back', async () => {
 const db=new PGlite();
 try {
  try { await db.exec(schema); } catch (e) { e.message = 'Test fixture schema: ' + e.message; throw e; }
  try { await db.exec(fs.readFileSync('supabase/migrations/20261008060157_atomic_current_affairs_publish.sql','utf8')); } catch (e) { e.message = 'Publisher migration SQL: ' + e.message; throw e; }
  const call=async p=>db.query('select public.publish_current_affairs_edition_atomic($1::jsonb) as id',[JSON.stringify(p)]);
  await assert.rejects(call(edition('2026-10-07')),/Only service_role may publish/);
  await db.exec('set role service_role');
  await call(edition('2026-10-07'));
  const counts=async()=> (await db.query(`select
   (select count(*)::int from public.current_affairs_posts) posts,
   (select count(*)::int from public.current_affairs_stories) stories,
   (select count(*)::int from public.current_affairs_mcqs) mcqs,
   (select count(*)::int from public.current_affairs_posts where published) published`)).rows[0];
  const baseline={posts:1,stories:4,mcqs:4,published:1};
  assert.deepEqual(await counts(),baseline);
  await assert.rejects(call(edition('2026-10-07')),/duplicate key|unique constraint/i);
  assert.deepEqual(await counts(),baseline);
  const invalid=edition('2026-10-08');
  invalid.stories[2].mcqs[0].contentStatus='DRAFT';
  await assert.rejects(call(invalid),/Unverified or invalid MCQ/);
  assert.deepEqual(await counts(),baseline);
  const late=edition('2026-10-08');
  late.stories[3].headline=late.stories[0].headline;
  late.stories[3].sourceUrl=late.stories[0].sourceUrl;
  await assert.rejects(call(late),/duplicate key|unique constraint/i);
  assert.deepEqual(await counts(),baseline);
  await call(edition('2026-10-08'));
  assert.deepEqual(await counts(),{posts:2,stories:8,mcqs:8,published:2});
  assert.equal((await db.query("select count(*)::int as n from public.current_affairs_posts where date='2026-10-07' and published")).rows[0].n,1);
 } finally {await db.close();}
});
