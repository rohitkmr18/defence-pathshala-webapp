import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '../../frontend/node_modules/@electric-sql/pglite/dist/index.js';
import { initialize, ingest } from './import.mjs';
import { offlineEnvironment } from './check.mjs';
import { localReadsEnabled, readCorpus } from '../../frontend/src/lib/capf-p2/read-contract.ts';
const hash = 'a'.repeat(64);
const sourceUrl = 'https://www.upsc.gov.in/synthetic-test.pdf';
const fixture = {
  mapping_version:'package-a-0.2-to-b1-v1',manifest_hash:hash,files:{synthetic:true},validation:{synthetic:true},
  sources:Array.from({length:7},(_,i)=>({year:2020+i,official_pdf_url:sourceUrl})),
  taxonomy:{version:'synthetic-v1',domains:{society:'Synthetic domain'},demand_tags:['analyse']},
  rubric:{version:'synthetic-rubric'},anchors:{synthetic:true},
  records:Array.from({length:56},(_,i)=>({
    record_id:'CAPF-P2-'+(2020+Math.floor(i/8))+'-Q'+(i%8<6?'1':'2')+'-'+String.fromCharCode(97+(i%8<6?i%8:i%8-6)),
    year:2020+Math.floor(i/8),section:i%8<6?'Q1_ESSAY':'Q2_ARGUMENT',
    original_label:String(i%8),prompt:'Synthetic test prompt '+i,marks:20,selection_rule:'Synthetic rule',
    word_limit:i%8<6?300:null,word_limit_status:i%8<6?'REPORTED_APPROXIMATE':'NOT_SPECIFIED_IN_RESEARCH',
    primary_domain:'society',secondary_tags:[],demand_tags:['analyse'],demand_card:{synthetic:true},
    source_url:sourceUrl,source_page_reported:'2',content_hash:hash,raw_record:{synthetic:true},
  })),
};
let db;
before(async()=>{db=new PGlite();await initialize(db);});
after(async()=>{await db?.close();});

test('atomic local ingestion imports 56 held records, preserves raw rows and is idempotent',async()=>{
  assert.equal((await ingest(db,fixture)).imported,56);
  assert.equal((await ingest(db,fixture)).duplicate,true);
  assert.equal((await db.query('select count(*)::int as n from capf_p2_private.raw_records')).rows[0].n,56);
  assert.equal((await db.query("select count(*)::int as n from public.capf_p2_question_revisions where state='DRAFT'")).rows[0].n,56);
});
test('invalid import rolls back the entire batch and new revisions',async()=>{
  const bad=structuredClone(fixture);bad.manifest_hash='b'.repeat(64);
  bad.records[0].content_hash='c'.repeat(64);bad.records[1].marks=99;bad.records[1].content_hash='d'.repeat(64);
  await assert.rejects(ingest(db,bad));
  assert.equal((await db.query('select count(*)::int as n from capf_p2_private.import_batches')).rows[0].n,1);
  assert.equal((await db.query('select count(*)::int as n from public.capf_p2_question_revisions')).rows[0].n,56);
});
test('anon and authenticated cannot read drafts/raw/rubrics or mutate corpus',async()=>{
  for(const role of ['anon','authenticated']){
    await db.exec('set role '+role);
    try {
      for(const table of ['capf_p2_questions','capf_p2_question_revisions','capf_p2_published_questions'])
        assert.equal((await db.query('select * from public.'+table)).rows.length,0);
      await assert.rejects(db.query('select * from capf_p2_private.raw_records'));
      await assert.rejects(db.query('select * from public.capf_p2_rubric_versions'));
      await assert.rejects(db.query("update public.capf_p2_question_revisions set state='PUBLISH_APPROVED'"));
      await assert.rejects(db.query("insert into public.capf_p2_questions(record_id,year,section,original_label) values('bad',2020,'Q1_ESSAY','bad')"));
      await assert.rejects(db.query('delete from public.capf_p2_questions'));
    } finally {await db.exec('reset role');}
  }
});
test('owner cannot bypass review stages or publish a draft by pointer',async()=>{
  const r=(await db.query('select * from public.capf_p2_question_revisions limit 1')).rows[0];
  await assert.rejects(db.query("update public.capf_p2_question_revisions set state='PUBLISH_APPROVED' where id=$1",[r.id]),/CAPF_INVALID_TRANSITION/);
  await assert.rejects(db.query("update public.capf_p2_question_revisions set state='SOURCE_MATCHED' where id=$1",[r.id]),/CAPF_REVIEW_REQUIRED/);
  await db.query("insert into capf_p2_private.academic_reviews(revision_id,content_hash,stage,reviewer,decision,notes) values($1,$2,'SOURCE_MATCHED','synthetic-reviewer','APPROVE','Synthetic missing PDF test')",[r.id,hash]);
  await assert.rejects(db.query("update public.capf_p2_question_revisions set state='SOURCE_MATCHED' where id=$1",[r.id]),/CAPF_SOURCE_REQUIRED/);
  await assert.rejects(db.query("update public.capf_p2_questions set active_revision_id=$1 where id=$2",[r.id,r.question_id]),/CAPF_PUBLICATION_REQUIRED/);
});
let published;
test('synthetic exact-hash source and independent academic review allow publication',async()=>{
  const old=(await db.query('select * from public.capf_p2_question_revisions limit 1')).rows[0];
  await db.query('update capf_p2_private.sources set verified=true,pdf_sha256=$1,retrieved_at=now() where id=$2',[hash,old.source_id]);
  const tax=(await db.query("insert into public.capf_p2_taxonomy_versions(version,ontology,approved,approved_by,approved_at) values($1,$2,true,'synthetic-editor',now()) returning id",
    ['approved-synthetic',fixture.taxonomy])).rows[0].id;
  published=(await db.query(`insert into public.capf_p2_question_revisions
    (question_id,revision,source_id,taxonomy_id,prompt,printed_directions,marks,selection_rule,
     word_limit,word_limit_status,language_rule,primary_domain,secondary_tags,demand_tags,demand_card,
     source_url,printed_page,pdf_page_index,pdf_sha256,content_hash)
     values($1,2,$2,$3,'Synthetic approved prompt','Synthetic directions',20,'Synthetic selection',300,
     'REPORTED_APPROXIMATE','English','society','[]','["analyse"]','{"synthetic":true}',$4,'2',1,$5,$5) returning *`,
    [old.question_id,old.source_id,tax,sourceUrl,hash])).rows[0];
  const review=async(stage,reviewer,h=hash)=>db.query(
    'insert into capf_p2_private.academic_reviews(revision_id,content_hash,stage,reviewer,decision,notes) values($1,$2,$3,$4,$5,$6)',
    [published.id,h,stage,reviewer,'APPROVE','Synthetic evidence only']);
  await review('SOURCE_MATCHED','source-reviewer','b'.repeat(64));
  await assert.rejects(db.query("update public.capf_p2_question_revisions set state='SOURCE_MATCHED' where id=$1",[published.id]),/CAPF_REVIEW_REQUIRED/);
  await review('SOURCE_MATCHED','source-reviewer');
  await db.query("update public.capf_p2_question_revisions set state='SOURCE_MATCHED' where id=$1",[published.id]);
  await review('ACADEMIC_REVIEWED','academic-reviewer');
  await db.query("update public.capf_p2_question_revisions set state='ACADEMIC_REVIEWED' where id=$1",[published.id]);
  await review('PUBLISH_APPROVED','publisher');
  await db.query("update public.capf_p2_question_revisions set state='PUBLISH_APPROVED' where id=$1",[published.id]);
  await db.query('update public.capf_p2_questions set active_revision_id=$1 where id=$2',[published.id,published.question_id]);
  for(const role of ['anon','authenticated']) {
    await db.exec('set role '+role);
    try {
      const rows=(await db.query('select * from public.capf_p2_published_questions')).rows;
      assert.equal(rows.length,1);assert.equal(rows[0].prompt,'Synthetic approved prompt');
      assert.equal('raw_record' in rows[0],false);assert.equal('content_hash' in rows[0],false);
    } finally {await db.exec('reset role');}
  }
});
test('published content, taxonomy and signed review cannot be overwritten',async()=>{
  await assert.rejects(db.query("update public.capf_p2_question_revisions set prompt='changed' where id=$1",[published.id]),/CAPF_IMMUTABLE_REVISION/);
  await assert.rejects(db.query('delete from public.capf_p2_question_revisions where id=$1',[published.id]),/CAPF_IMMUTABLE_REVISION/);
  await assert.rejects(db.query('update public.capf_p2_taxonomy_versions set approved=true'),/CAPF_APPEND_ONLY/);
  await assert.rejects(db.query("update capf_p2_private.academic_reviews set reviewer='changed'"),/CAPF_APPEND_ONLY/);
  await assert.rejects(db.query('update public.capf_p2_questions set active_revision_id=$1 where id<>$2',[published.id,published.question_id]));
});
test('a single reviewer cannot approve both source and academic review',async()=>{
  const copy=(await db.query(`insert into public.capf_p2_question_revisions
    (question_id,revision,source_id,taxonomy_id,prompt,printed_directions,marks,selection_rule,word_limit,
     word_limit_status,language_rule,primary_domain,secondary_tags,demand_tags,demand_card,
     source_url,printed_page,pdf_page_index,pdf_sha256,content_hash)
    select question_id,3,source_id,taxonomy_id,prompt,printed_directions,marks,selection_rule,word_limit,
     word_limit_status,language_rule,primary_domain,secondary_tags,demand_tags,demand_card,
     source_url,printed_page,pdf_page_index,pdf_sha256,content_hash
    from public.capf_p2_question_revisions where id=$1 returning id`,[published.id])).rows[0].id;
  for(const stage of ['SOURCE_MATCHED','ACADEMIC_REVIEWED'])
    await db.query('insert into capf_p2_private.academic_reviews(revision_id,content_hash,stage,reviewer,decision,notes) values($1,$2,$3,$4,$5,$6)',
      [copy,hash,stage,'same-reviewer','APPROVE','Synthetic independent review test']);
  await db.query("update public.capf_p2_question_revisions set state='SOURCE_MATCHED' where id=$1",[copy]);
  await assert.rejects(db.query("update public.capf_p2_question_revisions set state='ACADEMIC_REVIEWED' where id=$1",[copy]),/CAPF_INDEPENDENT_REVIEW_REQUIRED/);
});
test('local API gating rejects hosted config and cannot call the reader while disabled',async()=>{
  assert.equal(localReadsEnabled({CAPF_P2_LOCAL_READS:'1',NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:54321'}),true);
  for(const url of ['https://production.supabase.co','http://localhost.evil.test','http://user:pass@localhost','http://127.0.0.1/path'])
    assert.equal(localReadsEnabled({CAPF_P2_LOCAL_READS:'1',NEXT_PUBLIC_SUPABASE_URL:url}),false);
  assert.equal(localReadsEnabled({CAPF_P2_LOCAL_READS:'1',NEXT_PUBLIC_SUPABASE_URL:'http://localhost:54321',VERCEL:'1'}),false);
  const res=await readCorpus(new Request('http://localhost/api'),()=>{throw new Error('must not run');},false);
  assert.equal(res.status,404);
});
test('read API validates pagination and filters and never reflects database errors',async()=>{
  for(const query of ['limit=0','limit=51','year=2019','section=Q3','state=DRAFT','limit=2&limit=3','offset=-1']){
    const result=await readCorpus(new Request('http://localhost/api?'+query),()=>{throw new Error('must not run');},true);
    assert.equal(result.status,400);
  }
  const result=await readCorpus(new Request('http://localhost/api'),async()=>{throw new Error('SECRET_DATABASE_DETAIL');},true);
  assert.equal(result.status,503);assert.equal((await result.text()).includes('SECRET'),false);
});
test('read API uses published SQL projection for lists and detail; drafts are indistinguishable from absent',async()=>{
  const reader=async f=>{
    await db.exec('set role anon');
    try{
      const all=(await db.query('select * from public.capf_p2_published_questions')).rows;
      const rows=all.filter(r=>(!f.recordId||r.record_id===f.recordId)&&(!f.year||r.year===f.year)&&(!f.section||r.section===f.section));
      return {data:rows.slice(f.offset,f.offset+f.limit),count:rows.length};
    }finally{await db.exec('reset role');}
  };
  const list=await readCorpus(new Request('http://localhost/api?limit=1'),reader,true);
  assert.equal(list.headers.get('cache-control'),'no-store');
  const body=await list.json();assert.equal(body.total,1);assert.equal(body.scoring_enabled,false);
  const detail=await readCorpus(new Request('http://localhost/api'),reader,true,body.questions[0].record_id);
  assert.equal(detail.status,200);
  const draft=await readCorpus(new Request('http://localhost/api'),reader,true,'CAPF-P2-2026-Q2-b');
  assert.equal(draft.status,404);
});
test('offline runner strips inherited credentials and disables write-capable hook',()=>{
  const env=offlineEnvironment({PATH:'bin',SUPABASE_SERVICE_ROLE_KEY:'secret',DATABASE_URL:'postgres://host',CDS_ENGLISH_PROD_LOAD:'1',GROQ_API_KEY:'secret'});
  assert.equal(env.SUPABASE_SERVICE_ROLE_KEY,'');assert.equal(env.DATABASE_URL,'');
  assert.equal(env.CDS_ENGLISH_PROD_LOAD,'0');assert.equal(env.GROQ_API_KEY,undefined);
});
