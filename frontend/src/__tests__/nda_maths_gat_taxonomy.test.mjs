import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const load = (n) => JSON.parse(readFileSync(fileURLToPath(new URL(`../../../data/ingestion/taxonomy/${n}`, import.meta.url)), 'utf8'));
const tax = load('nda_maths_gat_v1.json');
const cds = load('cds_english_maths_v1.json');
const NUMBERED = /^\s*\d+(\.\d+)+\s+/; // same rule as public.validate_question_taxonomy_contract()
const PROD_PATTERNS = ['Assertion-Reason', 'Chronology', 'Statement Count', 'Single MCQ', 'Match the Following',
  'Ordering/Sequence', '2-Statement Combination', '3-Statement Combination', '4-Statement Combination'];
const GK_SUBJECTS = ['History', 'Geography', 'Polity', 'Economy', 'Science & Technology', 'Environment',
  'Current Affairs', 'International Relations', 'Security', 'Science', 'General Mental Ability'];
const maths = tax.papers['nda-maths'];

test('approved sizes: Maths 9 subjects / 35 topics', () => {
  assert.equal(maths.taxonomy.length, 9);
  assert.equal(maths.taxonomy.reduce((n, s) => n + s.topics.length, 0), 35);
});

test('no numbered, blank or padded labels', () => {
  for (const s of maths.taxonomy) {
    for (const label of [s.subject, ...s.topics.flatMap((t) => [t.topic, ...t.subtopics])]) {
      assert.ok(label && label.trim() === label, `blank or padded: "${label}"`);
      assert.ok(!NUMBERED.test(label), `numbered label: ${label}`);
    }
  }
});

test('topics unique in paper, subtopics unique in topic, subjects do not collide with GK', () => {
  const topics = maths.taxonomy.flatMap((s) => s.topics.map((t) => t.topic));
  assert.equal(new Set(topics).size, topics.length);
  for (const s of maths.taxonomy) {
    assert.ok(!GK_SUBJECTS.includes(s.subject), `${s.subject} collides with GK`);
    for (const t of s.topics) assert.equal(new Set(t.subtopics).size, t.subtopics.length, `${t.topic} duplicate subtopic`);
  }
});

test('patterns are existing dictionary labels or the one approved addition', () => {
  const extra = tax.allowed_patterns.filter((p) => !PROD_PATTERNS.includes(p));
  assert.deepEqual(extra, Object.keys(tax.pending_patterns));
});

test('English and GK inherit approved/production nodes and use registry section ids', () => {
  assert.equal(cds.papers['cds-english'].taxonomy.length, 4);
  assert.equal(tax.papers['nda-gat-english'].section_id, 'nda-gat:english');
  assert.equal(tax.papers['nda-gat-gk'].section_id, 'nda-gat:gk');
  assert.equal(tax.papers['nda-maths'].section_id, 'nda-maths:maths');
});

test('papers line up with the exam registry', async () => {
  const { getPaper } = await import('../lib/exam-registry.ts');
  assert.ok(getPaper('nda-maths').dbPaperValues.includes(maths.paper));
  assert.ok(getPaper('nda-gat').dbPaperValues.includes(tax.papers['nda-gat-gk'].paper));
});

test('NDA English adds the founder-approved Parts of Speech node (NDA only)', () => {
  const eng = tax.papers['nda-gat-english'];
  const node = (eng.added_nodes || []).find((n) => n.topic === 'Parts of Speech');
  assert.ok(node, 'Parts of Speech node missing');
  assert.equal(node.subject, 'Grammar and Usage');
  assert.deepEqual(node.subtopics, ['Word Class']);
  assert.equal(node.approved_by, 'founder');
});
