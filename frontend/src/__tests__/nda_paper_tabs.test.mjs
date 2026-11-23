import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PAPER_TABS, paperTabDbValues, parsePaperTab, parseSeparatePaperTab, tabMode, visiblePaperTabs,
  ndaModeLive, defaultTabForMode, paperTabInfo,
} from '../lib/exam-registry.ts';
import { SEPARATE_PAPER_TAB_IDS, parseFiltersFromSearchParams, buildPracticeUrl } from '../lib/question-filters.ts';
import { getScoringRules } from '../lib/examScoring.ts';
import { expectedPaperQuestions } from '../lib/content-quality.ts';

test('question-filters tab list matches the registry', () => {
  assert.deepEqual([...SEPARATE_PAPER_TAB_IDS].sort(), PAPER_TABS.filter((t) => t.id !== 'gs').map((t) => t.id).sort());
});

test('NDA mode shows Maths then GAT; CDS/CAPF mode keeps GS / Maths / English', () => {
  assert.deepEqual(visiblePaperTabs('nda').map((t) => t.id), ['nda-maths', 'nda-gat']);
  assert.deepEqual(visiblePaperTabs('nda').map((t) => t.label), ['Maths', 'GAT']);
  assert.deepEqual(visiblePaperTabs().map((t) => t.id), ['gs', 'maths', 'english']);
  assert.equal(ndaModeLive(), true);
  assert.equal(defaultTabForMode('nda'), 'nda-maths');
  assert.equal(defaultTabForMode('cds'), 'gs');
});

test('each tab reads only its own paper; GS never includes NDA or CDS Maths/English', () => {
  assert.deepEqual(paperTabDbValues('nda-maths'), ['Mathematics']);
  assert.deepEqual(paperTabDbValues('nda-gat'), ['General Ability Test']);
  const gs = paperTabDbValues(null);
  for (const v of ['Mathematics', 'General Ability Test', 'Elementary Mathematics', 'English']) assert.ok(!gs.includes(v), v);
  assert.ok(gs.includes('General Knowledge') && gs.includes('Paper I'));
});

test('tab parsing and mode', () => {
  assert.equal(parsePaperTab('nda-gat'), 'nda-gat');
  assert.equal(parseSeparatePaperTab('gs'), null);
  assert.equal(parseSeparatePaperTab('NDA-GAT'), null);
  assert.equal(tabMode('nda-maths'), 'nda');
  assert.equal(tabMode('maths'), 'cds');
  assert.equal(tabMode(null), 'cds');
  assert.equal(paperTabInfo('nda-gat').fullLabel, 'NDA GAT');
});

test('NDA paper param survives the practice URL round trip', () => {
  const f = parseFiltersFromSearchParams(new URLSearchParams('paper=nda-gat&exam=NDA'));
  assert.equal(f.paper, 'nda-gat');
  assert.match(buildPracticeUrl(f), /paper=nda-gat/);
});

test('NDA scoring and expected counts per paper', () => {
  const maths = getScoringRules('NDA', 'Mathematics');
  assert.equal(maths.totalQuestions, 120); assert.equal(maths.correctMarks, 2.5);
  const gat = getScoringRules('NDA', 'General Ability Test');
  assert.equal(gat.totalQuestions, 150); assert.equal(gat.totalMarks, 600); assert.equal(gat.correctMarks, 4);
  assert.ok(Math.abs(gat.penaltyMarks - 4 / 3) < 1e-9);
  assert.equal(expectedPaperQuestions('NDA', 'Mathematics'), 120);
  assert.equal(expectedPaperQuestions('NDA', 'General Ability Test'), 150);
});
