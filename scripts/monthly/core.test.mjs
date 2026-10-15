import {test} from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPairSync,sign} from 'node:crypto';
import {mkdtempSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {sampleInput,sampleManifest} from './cli.mjs';
import {compile,transition,correction,canonical,sha256,duplicateCandidates,audit,writeImmutable,projection,verifySnapshot} from './core.mjs';
import {documentModel} from './document.mjs';
const draft=()=>compile(sampleInput(),sampleManifest());
function changedSource(input,mutate) {
 const post=input.editions[0],doc=JSON.parse(post.approved_editorial_source);mutate(doc);
 post.approved_editorial_source=JSON.stringify(doc);post.approved_editorial_sha256=sha256(post.approved_editorial_source);
 return {...sampleManifest(input),sources:[{edition_id:post.id,approved_source_version:1,source_hash:post.approved_editorial_sha256}]};
}
test('deterministic compilation and stable ordering despite input row order',()=>{
 const input=sampleInput();input.editions[0].story_rows.reverse();input.pyqs.reverse();
 assert.equal(canonical(compile(input,sampleManifest(input))),canonical(draft()));
 assert.equal(draft().status,'DRAFT');assert.equal(draft().stories.length,1);
 assert.equal(projection(draft()).stories[0].editorial,JSON.parse(sampleInput().editions[0].approved_editorial_source).stories[0].editorialMarkdown);
});
test('missing manuscripts, invalid hashes, unpublished and missing editions fail closed',()=>{
 for(const mutate of [i=>i.editions=[],i=>i.editions[0].published=false,i=>i.editions[0].approved_editorial_source=null,i=>i.editions[0].approved_editorial_source+=' ',i=>i.editions[0].story_rows.pop()]) {
  const input=sampleInput();mutate(input);assert.throws(()=>compile(input,sampleManifest()));
 }
});
test('invalid answer structures and linked PYQs cannot compile',()=>{
 const input=sampleInput();const manifest=changedSource(input,d=>d.stories[0].mcqs[0].correctOption='E');assert.throws(()=>compile(input,manifest));
 for(const change of [i=>i.pyqs=[],i=>i.pyqs[0].content_eligible=false,i=>i.pyqs[0].content_status='WITHHELD',i=>i.pyqs.push(i.pyqs[0])]) {
 const i=sampleInput();change(i);assert.throws(()=>compile(i,sampleManifest()));}
});
test('taxonomy, exam rules, exclusions and ordering are explicit',()=>{
 for(const mutate of [m=>m.taxonomy=['Other'],m=>m.exams=[],m=>m.exclusions={},m=>m.ordering.rule='random',m=>m.coverage_end='2026-10-32',m=>m.coverage_end='2026-10-31']) {const m=sampleManifest();mutate(m);assert.throws(()=>compile(sampleInput(),m));}
 assert.equal(draft().stories[0].subject,'International Relations');
});
test('duplicates and follow-ups queue decisions, while unrelated topics stay separate',()=>{
 const one=draft().stories[0],two=structuredClone(one);two.source_id='another';
 assert.equal(duplicateCandidates([one,two])[0].kind,'identical-content');
 two.content.headline+=' — follow-up';two.content.keyFacts=['New approved fact (synthetic QA only)'];two.source_date='2026-10-15';
 assert.equal(duplicateCandidates([one,two])[0].kind,'follow-up-candidate');
 two.content.headline='Unrelated astronomy discovery';two.content.sourceUrl='https://www.isro.gov.in/';assert.equal(duplicateCandidates([one,two]).length,0);
});
test('audit distinguishes legacy manuscripts, missing past dates and future dates',()=>{
 const input=sampleInput();input.editions[0].approved_editorial_source=null;
 const report=audit(input,'2026-10');assert.equal(report.legacy_without_manuscript.length,1);
 assert.ok(report.missing_publication_dates.includes('2026-10-01'));assert.ok(report.future_dates_not_yet_due.includes('2026-10-31'));
 assert.equal(report.month_closed,false);
});
const {publicKey,privateKey}=generateKeyPairSync('ed25519');
const trust={approvers:{founder:publicKey}};
function review(snapshot) {const payload={edition_id:snapshot.edition_id,edition_version:snapshot.edition_version,content_hash:snapshot.content_hash,actor:'founder',decision:'APPROVE',approved_at:'2026-11-01T00:00:00Z'};return {...payload,signature:sign(null,Buffer.from(canonical(payload)),privateKey).toString('base64')};}
test('state transitions require independent signed approval and artifact evidence',()=>{
 const initial=draft(),validated=transition(initial,'VALIDATED');assert.equal(initial.status,'DRAFT');
 assert.throws(()=>transition(initial,'APPROVED'));assert.throws(()=>transition(validated,'APPROVED'));
 const approved=transition(validated,'APPROVED',{review:review(validated),trust});
 assert.equal(validated.approval_metadata,null);assert.throws(()=>transition(approved,'RELEASED',{trust}));
 assert.throws(()=>transition(approved,'RELEASED',{trust:{}}));
 const released=transition(approved,'RELEASED',{trust,artifacts:[{content_hash:approved.content_hash,sha256:'a'.repeat(64),qa_status:'PASSED'}]});assert.equal(released.status,'RELEASED');
});
test('partial or open monthly coverage cannot gain approval',()=>{
 const m=sampleManifest();m.kind='MONTHLY';const v=transition(compile(sampleInput(),m),'VALIDATED');
 for(const now of ['2026-10-15T00:00:00Z','2026-11-01T00:00:00Z']) assert.throws(()=>transition(v,'APPROVED',{trust,review:review(v),now}),/coverage/);
});
test('corrections require new version and explicit lineage; stored snapshots immutable',()=>{
 const v=transition(draft(),'VALIDATED'),approved=transition(v,'APPROVED',{trust,review:review(v)});
 const manifest=sampleManifest();assert.throws(()=>correction(approved,sampleInput(),manifest));
 manifest.edition_version=2;manifest.correction_lineage={previous_content_hash:approved.content_hash,previous_version:1,reason:'QA correction version test'};
 const next=correction(approved,sampleInput(),manifest);assert.equal(next.status,'DRAFT');assert.notEqual(next.content_hash,approved.content_hash);
 const directory=mkdtempSync(path.join(tmpdir(),'dp-monthly-'));const file=writeImmutable(directory,approved);assert.equal(file,writeImmutable(directory,approved));
 const altered=structuredClone(approved);altered.approval_metadata.actor='tampered';assert.throws(()=>writeImmutable(directory,altered),/Immutable/);
 assert.equal(JSON.parse(readFileSync(file)).edition_version,1);
});
test('canonical web/PDF projection covers exact questions, options, keys, explanations and citations',()=>{
 const snapshot=transition(draft(),'VALIDATED'),model=documentModel(snapshot),source=snapshot.stories[0];
 assert.deepEqual(model.projection,projection(snapshot));assert.equal(model.projection.stories[0].mcqs[0].correct_option,source.mcqs[0].content.correctOption);
 assert.ok(model.html.includes('UNCHECKED'));assert.ok(model.html.includes(source.source_id));
 assert.throws(()=>documentModel(draft()));const modified=structuredClone(snapshot);modified.stories[0].content.headline='tampered';assert.throws(()=>verifySnapshot(modified));
 const otherHeadlines=JSON.parse(sampleInput().editions[0].approved_editorial_source).stories.slice(1).map(s=>s.headline);
 for(const title of otherHeadlines) assert.ok(!model.html.includes(title));
});

test('unresolved duplicate queue blocks validation; an explicit reviewed retention preserves both developments',()=>{
 const input=sampleInput(),copy=structuredClone(input.editions[0]);copy.id='synthetic-second-edition';copy.date='2026-10-15';
 const document=JSON.parse(copy.approved_editorial_source);document.date=copy.date;copy.approved_editorial_source=JSON.stringify(document);copy.approved_editorial_sha256=sha256(copy.approved_editorial_source);
 copy.story_rows.forEach(s=>{s.id='qa-'+s.id;s.mcqs.forEach(q=>q.id='qa-'+q.id);});input.editions.push(copy);
 const m=sampleManifest();m.coverage_end='2026-10-15';m.sources.push({edition_id:copy.id,approved_source_version:1,source_hash:copy.approved_editorial_sha256});m.include_story_ids.push(copy.story_rows[0].id);
 for(const row of copy.story_rows.slice(1))m.exclusions[row.id]='Outside explicit test inclusion';
 const unresolved=compile(input,m);assert.equal(unresolved.stories.length,2);assert.ok(unresolved.decision_queue.length);assert.throws(()=>transition(unresolved,'VALIDATED'),/Unresolved/);
 m.editorial_decisions=unresolved.decision_queue.map(c=>({candidate_id:c.id,action:'retain-separate',reason:'Explicit synthetic reviewer decision for queue test',reviewed_by:'qa-reviewer'}));
 const resolved=transition(compile(input,m),'VALIDATED');assert.equal(resolved.stories.length,2);assert.equal(resolved.decision_queue.length,0);
 assert.deepEqual(resolved.stories.map(s=>s.source_date),['2026-10-14','2026-10-15']);
});
