import test from 'node:test';
import assert from 'node:assert/strict';
import { CAPF_P2_YEARS, CAPF_P2_PATH, capfP2Stats, capfP2ThemeCounts, capfP2Anchor } from '../lib/capf-paper2-pyqs.ts';
import { getPaper, liveDbPaperValues, paperTabDbValues } from '../lib/exam-registry.ts';

test('covers every CAPF AC paper from 2020 to 2026 once, newest first', () => {
  assert.deepEqual(CAPF_P2_YEARS.map((y) => y.year), [2026, 2025, 2024, 2023, 2022, 2021, 2020]);
});

test('each year has Q1 with six bilingual essay topics (a–f) and Q2 with two English statements (a–b)', () => {
  for (const y of CAPF_P2_YEARS) {
    assert.equal(y.q1.number, 1);
    assert.equal(y.q1.kind, 'essay');
    assert.deepEqual(y.q1.items.map((i) => i.part), ['a', 'b', 'c', 'd', 'e', 'f'], `${y.year} Q1 parts`);
    for (const i of y.q1.items) assert.ok(i.hi && /[ऀ-ॿ]/.test(i.hi), `${y.year} Q1(${i.part}) needs Hindi text`);
    assert.equal(y.q2.number, 2);
    assert.equal(y.q2.kind, 'argument');
    assert.deepEqual(y.q2.items.map((i) => i.part), ['a', 'b'], `${y.year} Q2 parts`);
    for (const i of y.q2.items) assert.equal(i.hi, undefined, `${y.year} Q2 is printed in English only`);
  }
});

test('marking and limits match the printed papers: 4×20 essays at ~300 words, 2×20 arguments with no stated limit', () => {
  for (const y of CAPF_P2_YEARS) {
    assert.equal(y.q1.marks, '20×4=80');
    assert.equal(y.q1.totalMarks, 80);
    assert.equal(y.q1.attempt, 4);
    assert.equal(y.q1.wordLimit, 300);
    assert.equal(y.q2.marks, '20×2=40');
    assert.equal(y.q2.totalMarks, 40);
    assert.equal(y.q2.attempt, 2);
    assert.equal(y.q2.wordLimit, null);
  }
});

test('question text is clean and never duplicated across the archive', () => {
  const all = CAPF_P2_YEARS.flatMap((y) => [...y.q1.items, ...y.q2.items]);
  for (const i of all) {
    assert.equal(i.en, i.en.trim());
    assert.ok(!/\s{2,}/.test(i.en), `double space in "${i.en}"`);
    assert.ok(i.en.length >= 10, `suspiciously short: "${i.en}"`);
  }
  assert.equal(new Set(all.map((i) => i.en.toLowerCase())).size, all.length);
});

test('stats, theme counts and anchors are consistent', () => {
  const s = capfP2Stats();
  assert.deepEqual(s, { years: 7, firstYear: 2020, lastYear: 2026, essays: 42, arguments: 14, total: 56 });
  const themes = capfP2ThemeCounts();
  assert.equal(themes.reduce((n, t) => n + t.total, 0), 56);
  assert.equal(themes.reduce((n, t) => n + t.essays, 0), 42);
  for (let k = 1; k < themes.length; k++) assert.ok(themes[k - 1].total >= themes[k].total);
  const anchors = CAPF_P2_YEARS.flatMap((y) => [
    ...y.q1.items.map((i) => capfP2Anchor(y.year, 1, i.part)),
    ...y.q2.items.map((i) => capfP2Anchor(y.year, 2, i.part)),
  ]);
  assert.equal(new Set(anchors).size, 56);
  assert.equal(capfP2Anchor(2024, 1, 'c'), '2024-q1-c');
  assert.equal(CAPF_P2_PATH, '/pyqs/capf/paper-2');
});

test('the read-only archive never enters MCQ practice, mocks or scoring', () => {
  assert.equal(getPaper('capf-p2').status, 'coming_soon');
  assert.equal(getPaper('capf-p2').marking, null);
  assert.ok(!liveDbPaperValues().includes('Paper II'));
  assert.ok(!paperTabDbValues('gs').includes('Paper II'));
});
