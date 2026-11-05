import test from 'node:test';
import assert from 'node:assert/strict';
import { EXAM_REGISTRY, getExam, getPaper, resolvePaper, liveExams, scorePaper } from '../lib/exam-registry.ts';
import { EXAM_SCORING_PRESETS } from '../lib/examScoring.ts';
import { EXAM_LABEL_TO_DB } from '../lib/exams.ts';

const close = (a, b) => Math.abs(a - b) < 1e-9;

test('paper ids are unique across exams', () => {
  const ids = EXAM_REGISTRY.flatMap((e) => e.papers.map((p) => p.id));
  assert.equal(new Set(ids).size, ids.length);
});

test('registry marking matches the existing scoring presets exactly (no behaviour change)', () => {
  const pairs = [['CDS', 'cds-gk'], ['CAPF-AC', 'capf-p1'], ['NDA', 'nda-maths'], ['AFCAT', 'afcat-written']];
  for (const [preset, paperId] of pairs) {
    const p = getPaper(paperId); const r = EXAM_SCORING_PRESETS[preset];
    assert.ok(close(p.marking.correct, r.correctMarks), `${paperId} correct`);
    assert.ok(close(p.marking.wrong, r.penaltyMarks), `${paperId} wrong`);
    assert.equal(p.questions, r.totalQuestions);
    assert.equal(p.maxMarks, r.totalMarks);
  }
});

test('full marks are consistent with question count for every objective paper', () => {
  for (const e of EXAM_REGISTRY) for (const p of e.papers) {
    if (!p.marking) continue;
    assert.ok(Math.abs(p.questions * p.marking.correct - p.maxMarks) < 0.01, `${p.id} questions × marks ≠ max`);
    const sectionQs = p.sections.reduce((n, s) => n + (s.questions ?? 0), 0);
    if (p.sections.length > 0 && p.sections.every((s) => s.questions)) assert.equal(sectionQs, p.questions, `${p.id} section split`);
  }
});

test('db values agree with the legacy exam mapping', () => {
  for (const e of EXAM_REGISTRY) assert.equal(EXAM_LABEL_TO_DB[e.dbValue] ?? e.dbValue, e.dbValue);
  assert.equal(getExam('CAPF').slug, 'capf');
  assert.equal(getExam('capf-ac').slug, 'capf');
  assert.equal(getExam('unknown'), null);
});

test('resolvePaper maps today\'s stored paper values', () => {
  assert.equal(resolvePaper('CDS', 'General Knowledge').id, 'cds-gk');
  assert.equal(resolvePaper('CAPF-AC', 'Paper I').id, 'capf-p1');
  assert.equal(resolvePaper('CDS', null).id, 'cds-gk');
  assert.equal(resolvePaper('NDA', null), null, 'NDA has no live paper yet');
});

test('live/coming-soon status reflects current content', () => {
  assert.deepEqual(liveExams().map((e) => e.slug).sort(), ['afcat', 'capf', 'cds']);
  assert.equal(getPaper('cds-english').status, 'coming_soon');
  assert.equal(getPaper('nda-gat').status, 'coming_soon');
});

test('scorePaper applies negative marking', () => {
  assert.equal(scorePaper(getPaper('afcat-written'), 65, 19), 176);
  assert.ok(close(scorePaper(getPaper('nda-gat'), 100, 30), 400 - 39.9));
  assert.throws(() => scorePaper(getPaper('capf-p2'), 1, 0));
});
