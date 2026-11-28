import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, writeFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { persistDraft, loadDraft, approvedEnvelope } from './current-affairs-private-draft.mjs';

const fields = { date: '2026-11-28', title: 'Synthetic test only', stories: [{ editorialMarkdown: '### What Happened?\n\nExact UTF-8 — संविधान\n\n| A | B |\n|---|---|\n| 1 | 2 |', mcqs: [{ question: 'Synthetic question' }], linkedPyqIds: [] }] };
const validate = async () => {}; // Adapter unit tests only; not editorial acceptance.
async function isolated(fn) {
  const dir = await mkdtemp(join(tmpdir(), 'dp-draft-'));
  try { await fn(dir); } finally { await rm(dir, { recursive: true, force: true }); }
}
test('exact round trip and concurrent idempotency', () => isolated(async dir => {
  const [a,b] = await Promise.all([persistDraft(dir, fields, validate), persistDraft(dir, fields, validate)]);
  assert.equal(a.id,b.id);
  assert.deepEqual(await loadDraft(dir,a.id),a.edition);
  assert.deepEqual(JSON.parse(a.edition.approvedEditorial.source),fields);
  assert.deepEqual(await readdir(dir),[a.id+'.json']);
}));
test('validation failure creates no draft', () => isolated(async dir => {
  await assert.rejects(persistDraft(dir,fields,async()=>{throw new Error('invalid');}),/invalid/);
  await assert.rejects(persistDraft(dir,fields),/validator/);
  assert.deepEqual(await readdir(dir),[]);
}));
test('tampering and path traversal reject', () => isolated(async dir => {
  const a=await persistDraft(dir,fields,validate);
  const path=join(dir,a.id+'.json');
  const data=JSON.parse(await readFile(path,'utf8'));
  data.title='changed';
  await writeFile(path,JSON.stringify(data));
  await assert.rejects(loadDraft(dir,a.id),/integrity/);
  await assert.rejects(loadDraft(dir,'../escape'),/Invalid draft ID/);
}));
test('approval must match exact immutable draft', () => isolated(async dir => {
  const a=await persistDraft(dir,fields,validate);
  const b=await persistDraft(dir,{...fields,title:'revision'},validate);
  const approval={approved:true,draftId:a.id,sha256:a.sha256};
  assert.throws(()=>approvedEnvelope(a.edition,undefined),/approval/);
  assert.throws(()=>approvedEnvelope(a.edition,{...approval,approved:false}),/approval/);
  assert.throws(()=>approvedEnvelope(b.edition,approval),/approval/);
  assert.deepEqual(approvedEnvelope(a.edition,approval),{schemaVersion:1,operation:'publish',approved:true,edition:a.edition});
}));
