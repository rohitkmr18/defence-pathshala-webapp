import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSubjectAnalysis } from '../lib/seo-subject-analysis.ts';

const base = { exam: 'CDS', subject: 'Polity' };

test('summarises counts, busiest year and top topics from the data only', () => {
  const text = buildSubjectAnalysis(
    {
      ...base,
      totalQuestions: 20,
      years: [{ year: 2024, count: 8 }, { year: 2025, count: 12 }],
      topics: [
        { topic: 'Parliament', count: 6 },
        { topic: 'Fundamental Rights', count: 5 },
        { topic: 'Constitution', count: 4 },
        { topic: 'Panchayati Raj', count: 5 },
      ],
    },
    '2024–2025',
  );
  assert.match(text, /20 CDS Polity questions across 2 years \(2024–2025\), an average of 10 per year/);
  assert.match(text, /2025 has the most, with 12 questions/);
  assert.match(text, /Parliament \(6\), Fundamental Rights \(5\), Panchayati Raj \(5\)/);
  assert.match(text, /about 80% of the questions/);
});

test('returns null when there is no data, and omits claims it cannot support', () => {
  assert.equal(buildSubjectAnalysis({ ...base, totalQuestions: 0, years: [], topics: [] }, ''), null);
  const one = buildSubjectAnalysis(
    { ...base, totalQuestions: 5, years: [{ year: 2025, count: 5 }], topics: [{ topic: 'Parliament', count: 5 }] },
    '2025',
  );
  assert.doesNotMatch(one, /has the most/);
  assert.doesNotMatch(one, /most-asked/);
});
