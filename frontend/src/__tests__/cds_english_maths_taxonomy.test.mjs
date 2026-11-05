import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const file = fileURLToPath(new URL('../../../data/ingestion/taxonomy/cds_english_maths_v1.json', import.meta.url));
const tax = JSON.parse(readFileSync(file, 'utf8'));
// Same rule as public.validate_question_taxonomy_contract()
const NUMBERED = /^\s*\d+(\.\d+)+\s+/;
// Active labels in production dp_pattern_dictionary (5 Nov 2026) + approved pending label
const PROD_PATTERNS = ['Assertion-Reason', 'Chronology', 'Statement Count', 'Single MCQ', 'Match the Following',
  'Ordering/Sequence', '2-Statement Combination', '3-Statement Combination', '4-Statement Combination'];
const GK_SUBJECTS = ['History', 'Geography', 'Polity', 'Economy', 'Science & Technology', 'Environment',
  'Current Affairs', 'International Relations', 'Security', 'Science', 'General Mental Ability'];

const papers = Object.entries(tax.papers);
const count = (p) => [p.taxonomy.length, p.taxonomy.reduce((n, s) => n + s.topics.length, 0)];

test('approved sizes: Maths 6 subjects / 33 topics, English 4 / 12', () => {
  assert.deepEqual(count(tax.papers['cds-maths']), [6, 33]);
  assert.deepEqual(count(tax.papers['cds-english']), [4, 12]);
});

test('no numbered labels (DB taxonomy contract) and no blanks', () => {
  for (const [, p] of papers) for (const s of p.taxonomy) {
    for (const label of [s.subject, ...s.topics.flatMap((t) => [t.topic, ...t.subtopics])]) {
      assert.ok(label && label.trim() === label, `blank or padded: "${label}"`);
      assert.ok(!NUMBERED.test(label), `numbered label: ${label}`);
    }
  }
});

test('topics are unique within a paper and subjects do not collide with GK subjects', () => {
  for (const [id, p] of papers) {
    const topics = p.taxonomy.flatMap((s) => s.topics.map((t) => t.topic));
    assert.equal(new Set(topics).size, topics.length, `${id} duplicate topic`);
    for (const s of p.taxonomy) assert.ok(!GK_SUBJECTS.includes(s.subject), `${s.subject} collides with GK`);
  }
});

test('patterns are existing dictionary labels or the one approved addition', () => {
  const extra = tax.allowed_patterns.filter((p) => !PROD_PATTERNS.includes(p));
  assert.deepEqual(extra, Object.keys(tax.pending_patterns));
});

test('papers line up with the exam registry ids', async () => {
  let getPaper;
  try { ({ getPaper } = await import('../lib/exam-registry.ts')); } catch { return; } // registry lands in PR #111
  for (const [id, p] of papers) {
    const reg = getPaper(id);
    if (!reg) continue; // registry lands in PR #111; enforced once both are on main
    assert.ok(reg.dbPaperValues.includes(p.paper), `${id} paper value`);
    assert.equal(`${id}:${reg.sections[0].id}`, p.section_id);
  }
});
