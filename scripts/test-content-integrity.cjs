const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PGlite } = require('../frontend/node_modules/@electric-sql/pglite');
const load = require('./test-support/load-ts.cjs');
const history = require('../docs/auth/production-migration-history.json');
const migration = 'supabase/migrations/20261006055218_question_content_integrity.sql';

test('eligibility preserves initials, None, binary zeros and legitimate dates; rejects broken options', () => {
 const { isContentEligible } = load()('frontend/src/lib/content-quality.ts');
 const good = {question:'Which?',opt_a:'A car',opt_b:'None',opt_c:'0101',opt_d:'2026-10-06',final_opt:'B'};
 assert.equal(isContentEligible(good),true);
 for (const change of [{opt_a:''},{opt_b:'#ERROR!'},{opt_c:'None'},{content_status:'WITHHELD'},{final_opt:'E'}]) {
   assert.equal(isContentEligible({...good,...change}),false);
 }
});

test('database snapshot, eligibility, revision/version and private access work on reconstructed production schema', async () => {
 const db = new PGlite();
 try {
  const paths = ['supabase/reconstruction/platform-test-stubs.sql',
   ...fs.readdirSync('supabase/reconstruction/bootstrap').sort().map(n=>`supabase/reconstruction/bootstrap/${n}`),
   'supabase/reconstruction/legacy-prerequisites.sql',
   ...history.migrations.map(r=>`supabase/migrations/${r.version}_${r.name}.sql`),
   'supabase/reconstruction/observed-grants.sql'];
  for (const p of paths) await db.exec(fs.readFileSync(p,'utf8').replace('create extension if not exists pgcrypto;',''));
  if (!history.migrations.some(r=>r.name==='question_content_integrity')) await db.exec(fs.readFileSync(migration,'utf8'));
  await db.exec(`insert into public.questions(question_id,exam,year,q_num,subject,topic,question,opt_a,opt_b,opt_c,opt_d,final_opt) values
   ('TEST_CONTENT','CDS',2025,1,'Polity','Constitution','Which?','A car','None','0101','2026-10-06','B');`);
  assert.equal((await db.query("select content_eligible from public.v_dp_question_intelligence_v2 where question_id='TEST_CONTENT'")).rows[0].content_eligible,true);
  await db.exec("update public.questions set opt_a='#ERROR!' where question_id='TEST_CONTENT'");
  assert.equal((await db.query("select content_eligible,content_version from public.v_dp_question_intelligence_v2 where question_id='TEST_CONTENT'")).rows[0].content_eligible,false);
  await db.exec("select set_config('dp.content_evidence','official booklet page 3',false); update public.questions set opt_a='A car',content_status='SOURCE_MATCHED' where question_id='TEST_CONTENT'");
  const row=(await db.query("select content_status,content_version from public.questions where question_id='TEST_CONTENT'")).rows[0];
  assert.equal(row.content_version,3); assert.equal(row.content_status,'SOURCE_MATCHED');
  const revisions=(await db.query("select before_row,after_row,evidence from dp_content_private.revisions where question_id='TEST_CONTENT' order by id")).rows;
  assert.equal(revisions.length,2); assert.equal(revisions[0].before_row.opt_a,'A car'); assert.equal(revisions[1].evidence,'official booklet page 3');
  await db.exec("select set_config('dp.content_evidence','',false); update public.questions set opt_a='Altered' where question_id='TEST_CONTENT'");
  assert.equal((await db.query("select content_status from public.questions where question_id='TEST_CONTENT'")).rows[0].content_status,'UNCHECKED');
  await db.exec('set role authenticated');
  await assert.rejects(db.query('select * from dp_content_private.revisions'),/permission/i);
 } finally {await db.close();}
});

test('full-paper validation detects missing questions, duplicates, mixed papers and corrupted choices', () => {
 const { isCompletePaper } = load()('frontend/src/lib/content-quality.ts');
 const paper=Array.from({length:120},(_,i)=>({exam:'CDS',year:2025,cycle:'I',paper:'GK',q_num:i+1,question:'Which?',opt_a:'a',opt_b:'b',opt_c:'c',opt_d:'d',final_opt:'B'}));
 assert.equal(isCompletePaper(paper),true);
 assert.equal(isCompletePaper(paper.slice(1)),false);
 for (const change of [{q_num:2},{year:2024},{opt_d:''},{content_status:'WITHHELD'}]) assert.equal(isCompletePaper([{...paper[0],...change},...paper.slice(1)]),false);
});
