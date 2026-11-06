import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { liveDbPaperValues, paperTabDbValues, parsePaperTab, visiblePaperTabs, EXAM_REGISTRY } from '../lib/exam-registry.ts';

test('only live registry papers are in the learner-facing paper scope', () => {
  const scope = liveDbPaperValues();
  assert.ok(scope.includes('General Knowledge'));
  assert.ok(scope.includes('Paper I'));
  for (const p of EXAM_REGISTRY.flatMap((e) => e.papers)) {
    for (const v of p.dbPaperValues) assert.equal(scope.includes(v), p.status === 'live', `${p.id}:${v}`);
  }
});

test('GS tab never contains Maths or English, whatever their status', () => {
  const gs = paperTabDbValues(null);
  assert.ok(gs.includes('General Knowledge'));
  for (const v of ['Elementary Mathematics', 'English']) assert.ok(!gs.includes(v));
  assert.deepEqual(paperTabDbValues('bogus'), gs);
  assert.equal(parsePaperTab('maths'), 'maths');
  assert.equal(parsePaperTab('x'), 'gs');
});

test('Maths and English tabs are empty and hidden until their paper is live', () => {
  const byId = Object.fromEntries(EXAM_REGISTRY.flatMap((e) => e.papers).map((p) => [p.id, p]));
  const tabs = visiblePaperTabs().map((t) => t.id);
  assert.ok(tabs.includes('gs'));
  for (const [tab, id] of [['maths', 'cds-maths'], ['english', 'cds-english']]) {
    const live = byId[id].status === 'live';
    assert.equal(tabs.includes(tab), live);
    assert.deepEqual(paperTabDbValues(tab), live ? byId[id].dbPaperValues : []);
  }
});

test('every learner-facing question read applies the live-paper scope', () => {
  const files = [
    'app/api/practice/questions/route.ts', 'app/api/practice/count/route.ts', 'app/api/practice/filters/route.ts',
    'app/api/practice/distribution/route.ts', 'app/api/question-bank/route.ts', 'lib/question-bank.ts', 'lib/seo-data.ts',
  ];
  for (const f of files) {
    const src = readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
    const reads = (src.match(/\.eq\("content_eligible", true\)/g) || []).length;
    const scoped = (src.match(/\.eq\("content_eligible", true\)\.in\("paper", [^;\n]*(?:liveDbPaperValues|paperTabDbValues)\(/g) || []).length;
    assert.ok(reads > 0, `${f} reads the view`);
    assert.equal(scoped, reads, `${f}: every content_eligible read must also apply the live-paper scope`);
  }
});
