// Real PostgreSQL engine, isolated in-process database; NOT an OTP/browser test.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PGlite } = require('../frontend/node_modules/@electric-sql/pglite');
test('AFCAT SQL: 100 questions, saves, clear/review, scoring, expiry, ownership and idempotency', async () => {
 const db = new PGlite();
 try {
 await db.exec(fs.readFileSync('scripts/test-support/onboarding-schema.sql','utf8'));
 for (const name of ['20261023131000_afcat_p12_isolated_foundation.sql','20261023221000_afcat_staging_score_transaction.sql','20261025170000_afcat_staging_deadline_guard.sql']) await db.exec(fs.readFileSync('supabase/prelaunch/afcat/'+name,'utf8'));
 const user='11111111-1111-4111-8111-111111111111', other='22222222-2222-4222-8222-222222222222';
 await db.query('insert into auth.users(id) values ($1),($2)',[user,other]);
 const t=(await db.query(`insert into afcat_tests(code,kind,title,duration_seconds,expected_questions,max_marks) values ('QA','FULL_MOCK','Synthetic QA',7200,100,300) returning id`)).rows[0].id;
 const ids=[];
 for(let n=1;n<=100;n++) {
  const section=n<=30?'ENGLISH':n<=55?'GENERAL_AWARENESS':n<=75?'NUMERICAL_ABILITY':'REASONING_MILITARY_APTITUDE';
  const q=(await db.query(`insert into afcat_questions(external_id,pool_type,section,topic,stem,options,correct_option,explanation,difficulty,source_kind,fingerprint_sha256,editorial_status) values ($1,'FULL_MOCK',$2,'QA','{"text":"Synthetic"}','["1","2","3","4"]','A','{}','EASY','ORIGINAL',$3,'APPROVED') returning id`,['qa-'+n,section,n.toString(16).padStart(64,'0')])).rows[0].id;
  ids.push(q); await db.query('insert into afcat_test_items values ($1,$2,$3,1)',[t,q,n]);
 }
 await db.query("update afcat_tests set status='PUBLISHED' where id=$1",[t]);
 const start=async(uid,expired=false)=>(await db.query(`insert into afcat_sessions(user_id,test_id,test_release_version,started_at) values ($1,$2,1,now()-make_interval(secs=>$3)) returning id`,[uid,t,expired?7201:0])).rows[0].id;
 const session=await start(user);
 await assert.rejects(start(user),/unique/i);
 const save=async(q,selected,review=false)=>db.query(`insert into afcat_responses(session_id,user_id,question_id,selected_option,marked_for_review) values ($1,$2,$3,$4,$5) on conflict(session_id,question_id) do update set selected_option=excluded.selected_option,marked_for_review=excluded.marked_for_review`,[session,user,q,selected,review]);
 await save(ids[0],'A',true); await save(ids[1],'B'); await save(ids[2],'C'); await save(ids[2],null,true);
 const saved=(await db.query('select * from afcat_responses where session_id=$1',[session])).rows;
 assert.equal(saved.length,3); assert.equal(saved.find(x=>x.question_id===ids[2]).selected_option,null); assert.equal(saved.find(x=>x.question_id===ids[2]).marked_for_review,true);
 await assert.rejects(db.query('select * from afcat_finalize_session($1,$2)',[session,other]),/not found/i);
 const result=(await db.query('select * from afcat_finalize_session($1,$2)',[session,user])).rows[0];
 assert.deepEqual(result,{status:'SUBMITTED',correct_count:1,incorrect_count:1,unanswered_count:98,score:2,max_marks:300});
 assert.deepEqual((await db.query('select * from afcat_finalize_session($1,$2)',[session,user])).rows[0],result);
 await assert.rejects(save(ids[0],'B'),/closed/i);
 await assert.rejects(db.query("update afcat_sessions set status='IN_PROGRESS' where id=$1",[session]),/immutable/i);
 const expired=await start(other,true);
 await assert.rejects(db.query('insert into afcat_responses(session_id,user_id,question_id,selected_option) values ($1,$2,$3,\'A\')',[expired,other,ids[0]]),/deadline/i);
 assert.equal((await db.query('select * from afcat_finalize_session($1,$2)',[expired,other])).rows[0].status,'EXPIRED');
 await db.exec(`grant usage on schema public to authenticated; select set_config('request.jwt.claim.sub','${other}',false); set role authenticated;`);
 assert.equal((await db.query('select id from afcat_sessions where id=$1',[session])).rows.length,0);
 assert.equal((await db.query('select * from afcat_session_results where session_id=$1',[session])).rows.length,0);
 await assert.rejects(db.query('select correct_option from afcat_questions'),/permission denied/i);
 await assert.rejects(db.query('select * from afcat_finalize_session($1,$2)',[session,user]),/permission denied/i);
 await db.exec(`reset role; select set_config('request.jwt.claim.sub','${user}',false); set role authenticated;`);
 assert.equal((await db.query('select id from afcat_sessions where id=$1',[session])).rows.length,1);
 await db.exec('reset role; set role anon;');
 await assert.rejects(db.query('select * from afcat_sessions'),/permission denied/i);
 } finally { await db.close(); }
});
