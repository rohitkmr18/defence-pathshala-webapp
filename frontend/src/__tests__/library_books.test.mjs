import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { LIBRARY_BOOKS, getLibraryBook, libraryPageSrc, libraryOgSrc, booksForExam } from '../lib/library/books.ts';
import { LIBRARY_HOTSPOTS } from '../lib/library/hotspots.ts';
import { scoreQuiz, validateQuiz, verdictFor, NEGATIVE_MARK } from '../lib/library/quiz.ts';
import { BIOLOGY_DECODED_QUIZ } from '../lib/library/quiz-biology-decoded.ts';
import { VOCAB_DECODED_QUIZ } from '../lib/library/quiz-vocab-decoded.ts';
import { POLITY_DECODED_QUIZ } from '../lib/library/quiz-polity-decoded.ts';
import { CHEMISTRY_DECODED_QUIZ } from '../lib/library/quiz-chemistry-decoded.ts';
import { ECONOMY_DECODED_QUIZ } from '../lib/library/quiz-economy-decoded.ts';
import { PHYSICS_DECODED_QUIZ } from '../lib/library/quiz-physics-decoded.ts';

const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public');
const QUIZZES = { 'biology-decoded': BIOLOGY_DECODED_QUIZ, 'polity-decoded': POLITY_DECODED_QUIZ, 'chemistry-decoded': CHEMISTRY_DECODED_QUIZ, 'vocab-decoded': VOCAB_DECODED_QUIZ, 'economy-decoded': ECONOMY_DECODED_QUIZ, 'physics-decoded': PHYSICS_DECODED_QUIZ };

test('every reader page image exists and nothing extra is shipped (no PDF, no answer-key pages)', () => {
  for (const b of LIBRARY_BOOKS) {
    for (const p of b.readerPages) {
      assert.ok(existsSync(path.join(publicDir, libraryPageSrc(b.slug, p))), `missing page ${p} of ${b.slug}`);
    }
    const files = readdirSync(path.join(publicDir, 'library', b.slug));
    assert.equal(files.length, b.readerPages.length, `unexpected files in ${b.slug}`);
    assert.ok(files.every((f) => f.endsWith('.webp')), 'only page images may be published (no PDF)');
  }
});

test('reader pages are ordered, unique and within the book', () => {
  for (const b of LIBRARY_BOOKS) {
    assert.deepEqual([...b.readerPages].sort((x, y) => x - y), b.readerPages);
    assert.equal(new Set(b.readerPages).size, b.readerPages.length);
    assert.ok(b.readerPages.every((p) => p >= 1 && p <= b.pageCount));
  }
});

test('sections point at reader pages (or 0 = practice) and are in order', () => {
  for (const b of LIBRARY_BOOKS) {
    let prev = 0;
    for (const s of b.sections) {
      if (s.page === 0) continue;
      assert.ok(b.readerPages.includes(s.page), `${b.slug}: ${s.title} not a reader page`);
      assert.ok(s.page > prev, `${b.slug}: ${s.title} out of order`);
      prev = s.page;
    }
    assert.ok(b.sections.some((s) => s.page === 0), `${b.slug} has no practice entry`);
  }
});

test('hotspots stay inside the page and point at reader pages or the practice', () => {
  for (const b of LIBRARY_BOOKS) {
    const spots = LIBRARY_HOTSPOTS[b.slug];
    assert.ok(spots && spots.length > 0, `${b.slug} has no hotspots`);
    for (const h of spots) {
      assert.ok(h.left >= 0 && h.top >= 0 && h.left + h.width <= 100.01 && h.top + h.height <= 100.01, `${b.slug} p${h.page} out of box`);
      assert.ok(b.readerPages.includes(h.page), `${b.slug}: hotspot on hidden page ${h.page}`);
      assert.ok(h.href ? /^\/pyq\/[A-Za-z0-9_]+$/.test(h.href) : (h.target === 0 || b.readerPages.includes(h.target)), `${b.slug}: hotspot to hidden page ${h.target}`);
    }
  }
});

test('quizzes are valid, match book metadata and revise-links land on reader pages', () => {
  for (const b of LIBRARY_BOOKS) {
    const quiz = QUIZZES[b.slug];
    assert.ok(quiz, `${b.slug} has no quiz`);
    assert.deepEqual(validateQuiz(quiz, b.pageCount), []);
    assert.equal(quiz.questions.length, b.mcqCount);
    assert.equal(quiz.questions.filter((q) => q.source.kind === 'pyq').length, b.pyqCount);
    for (const q of quiz.questions) assert.ok(b.readerPages.includes(q.page), `${b.slug} Q${q.n} revise page hidden`);
    for (const t of quiz.topics) assert.ok(b.readerPages.includes(t.page), `${b.slug} topic ${t.id} page hidden`);
  }
});

test('answer keys are pinned (guards against accidental edits)', () => {
  assert.equal(BIOLOGY_DECODED_QUIZ.questions.map((q) => q.answer).join(''), 'BBCDCCCAAADCDCABCCAC');
  assert.equal(POLITY_DECODED_QUIZ.questions.map((q) => q.answer).join(''), 'CAABBCCDCBCDBCBBCDCCACABBAAABB');
  assert.equal(CHEMISTRY_DECODED_QUIZ.questions.map((q) => q.answer).join(''), 'ABAACDAABAAABBDDBDCADDDADCAAAA');
  assert.equal(ECONOMY_DECODED_QUIZ.questions.map((q) => q.answer).join(''), 'CBCABCCCCDBCBCACCAABBCACADBADDBACBA');
});

test('scoring: all correct, all wrong, partial and empty attempts', () => {
  const quiz = BIOLOGY_DECODED_QUIZ;
  const all = Object.fromEntries(quiz.questions.map((q) => [q.n, q.answer]));
  const perfect = scoreQuiz(quiz, all);
  assert.equal(perfect.correct, 20);
  assert.equal(perfect.scorePercent, 100);
  assert.equal(perfect.netMarks, 20);
  assert.equal(perfect.revise.length, 0);
  assert.equal(perfect.verdict.band, 'strong');

  const wrongKey = (k) => (k === 'A' ? 'B' : 'A');
  const allWrong = scoreQuiz(quiz, Object.fromEntries(quiz.questions.map((q) => [q.n, wrongKey(q.answer)])));
  assert.equal(allWrong.correct, 0);
  assert.equal(allWrong.wrong, 20);
  assert.equal(allWrong.netMarks, Math.round(-20 * NEGATIVE_MARK * 10) / 10);
  assert.equal(allWrong.verdict.headline, 'Too many guesses are costing marks');

  // First 10 right, next 5 wrong, last 5 skipped.
  const partial = {};
  quiz.questions.forEach((q, i) => { if (i < 10) partial[q.n] = q.answer; else if (i < 15) partial[q.n] = wrongKey(q.answer); });
  const r = scoreQuiz(quiz, partial);
  assert.deepEqual([r.correct, r.wrong, r.skipped, r.attempted], [10, 5, 5, 15]);
  assert.equal(r.scorePercent, 50);
  assert.equal(r.accuracy, 67);
  assert.equal(r.netMarks, 8.3);
  assert.equal(r.topics.reduce((s, t) => s + t.total, 0), 20);
  assert.equal(r.bySource.pyq.total + r.bySource.original.total, 20);
  assert.ok(r.revise.every((t) => t.correct < t.total));
  assert.ok(r.revise.every((t, i, arr) => i === 0 || arr[i - 1].score <= t.score), 'weakest topic first');

  const empty = scoreQuiz(quiz, {});
  assert.deepEqual([empty.correct, empty.attempted, empty.accuracy], [0, 0, 0]);
  assert.equal(empty.verdict.band, 'start');
});

test('verdict bands', () => {
  assert.equal(verdictFor(85, 85, 20, 20).band, 'strong');
  assert.equal(verdictFor(65, 70, 18, 20).band, 'good');
  assert.equal(verdictFor(30, 60, 10, 20).headline, 'Revise before you practise more');
});

test('lookups and exam filter', () => {
  assert.equal(getLibraryBook('polity-decoded').subject, 'Polity');
  assert.equal(getLibraryBook('nope'), null);
  assert.equal(booksForExam('AFCAT').length, 6);
  assert.equal(booksForExam(null).length, LIBRARY_BOOKS.length);
});

test('each book has a 1200x630 JPEG link-preview card outside its page folder', () => {
  for (const b of LIBRARY_BOOKS) {
    const file = path.join(publicDir, libraryOgSrc(b.slug));
    assert.ok(existsSync(file), `missing link preview for ${b.slug}`);
    const bytes = readFileSync(file);
    assert.equal(bytes[0], 0xff, 'preview must be JPEG');
    assert.equal(bytes[1], 0xd8, 'preview must be JPEG');
  }
});
