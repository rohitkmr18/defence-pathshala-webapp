import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { liveDbPaperValues, EXAM_REGISTRY } from '../lib/exam-registry.ts';

test('only live registry papers are in the learner-facing paper scope', () => {
  const scope = liveDbPaperValues();
  assert.ok(scope.includes('General Knowledge'));
  assert.ok(scope.includes('Paper I'));
  // coming-soon papers (staged English / Maths) must never leak into practice
  assert.ok(!scope.includes('Elementary Mathematics'));
  assert.ok(!scope.includes('English'));
  assert.ok(!scope.includes('Mathematics'));
});

test('flipping a paper live in the registry is the only way it enters the scope', () => {
  const maths = EXAM_REGISTRY.flatMap((e) => e.papers).find((p) => p.id === 'cds-maths');
  assert.equal(maths.status, 'coming_soon');
  for (const v of maths.dbPaperValues) assert.ok(!liveDbPaperValues().includes(v));
});

test('every learner-facing question read applies the live-paper scope', () => {
  const files = [
    'app/api/practice/questions/route.ts', 'app/api/practice/count/route.ts', 'app/api/practice/filters/route.ts',
    'app/api/practice/distribution/route.ts', 'app/api/question-bank/route.ts', 'lib/question-bank.ts', 'lib/seo-data.ts',
  ];
  for (const f of files) {
    const src = readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
    const reads = (src.match(/\.eq\("content_eligible", true\)/g) || []).length;
    const scoped = (src.match(/\.eq\("content_eligible", true\)\.in\("paper", liveDbPaperValues\(\)\)/g) || []).length;
    assert.ok(reads > 0, `${f} reads the view`);
    assert.equal(scoped, reads, `${f}: every content_eligible read must also apply the live-paper scope`);
  }
});
