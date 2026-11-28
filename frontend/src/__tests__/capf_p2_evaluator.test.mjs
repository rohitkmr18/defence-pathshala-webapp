import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';

// The app imports sibling modules without ".ts" (Next resolves them); teach Node to do the same here.
register('data:text/javascript,' + encodeURIComponent(`
export async function resolve(specifier, context, next) {
  try { return await next(specifier, context); }
  catch (e) { if (specifier.startsWith('.') && !/\\.[cm]?[jt]s$/.test(specifier)) return next(specifier + '.ts', context); throw e; }
}`));

const {
  ESSAY_RUBRIC, ARGUMENT_RUBRIC, MAX_MARKS_PER_ITEM, findTarget, countWords, bandFor, normaliseEvaluation,
  validateTypedAnswer, validateImages, evaluationTool, userPrompt, systemPrompt, istDayStart, CAPF_P2_LIMITS,
} = await import('../lib/capf-p2-evaluator.ts');

const sum = (r) => r.reduce((n, c) => n + c.max, 0);

test('both rubrics total exactly 20 marks with unique criterion ids', () => {
  assert.equal(sum(ESSAY_RUBRIC), MAX_MARKS_PER_ITEM);
  assert.equal(sum(ARGUMENT_RUBRIC), MAX_MARKS_PER_ITEM);
  for (const r of [ESSAY_RUBRIC, ARGUMENT_RUBRIC]) assert.equal(new Set(r.map((c) => c.id)).size, r.length);
});

test('findTarget resolves only real questions', () => {
  const t = findTarget(2024, 1, 'c');
  assert.equal(t.item.en, 'Tribal resistance to colonial rule');
  assert.equal(findTarget('2021', '2', 'b').item.en, 'Farmer protests are politically motivated.');
  assert.equal(findTarget(2019, 1, 'a'), null);
  assert.equal(findTarget(2024, 3, 'a'), null);
  assert.equal(findTarget(2024, 2, 'c'), null);
  assert.equal(findTarget(2024, 1, "a' or 1=1"), null);
});

test('word count handles English and Hindi', () => {
  assert.equal(countWords('  India is a democracy.  '), 4);
  assert.equal(countWords('भारत एक लोकतंत्र है ।'), 4);
  assert.equal(countWords(''), 0);
});

test('bands follow the founder calibration: average 6–8, good 8–11, excellent 11–15', () => {
  assert.equal(bandFor(5.5), 'Needs work');
  assert.equal(bandFor(6), 'Average');
  assert.equal(bandFor(7.5), 'Average');
  assert.equal(bandFor(8), 'Good');
  assert.equal(bandFor(10.5), 'Good');
  assert.equal(bandFor(11), 'Excellent');
  assert.match(systemPrompt(), /average answer earns 6–8 of 20, a good answer 8–11, an excellent answer 11–15/);
});

const essayRaw = (scores, extra = {}) => ({
  answer_language: 'en', word_count: 310, off_topic: false, unreadable: false,
  criteria: ESSAY_RUBRIC.map((c, i) => ({ id: c.id, score: scores[i], comment: `c${i}` })),
  strengths: ['a', 'b', 'c', 'd'], improvements: ['x'], model_outline: ['Intro'], examiner_note: 'ok', ...extra,
});

test('normalise clamps scores, rounds to half marks and recomputes the total itself', () => {
  const e = normaliseEvaluation(essayRaw([9, 3.3, 4, 2, 2.74, 1]), 1, { typedWordCount: 305 });
  assert.deepEqual(e.criteria.map((c) => c.score), [4, 3.5, 4, 2, 2.5, 1]);
  assert.equal(e.total, 17);
  assert.equal(e.band, 'Excellent');
  assert.equal(e.wordCount, 305, 'typed word count wins over the model estimate');
  assert.equal(e.strengths.length, 3);
});

test('normalise rejects a result with a missing criterion', () => {
  const raw = essayRaw([1, 1, 1, 1, 1, 1]);
  raw.criteria.pop();
  assert.throws(() => normaliseEvaluation(raw, 1, { typedWordCount: 300 }), /Missing criterion/);
  assert.throws(() => normaliseEvaluation(null, 1, { typedWordCount: 300 }));
});

test('Q2 answers not in English are capped at 10 even if the model forgot', () => {
  const raw = {
    answer_language: 'hi', word_count: 200, off_topic: false, unreadable: false,
    criteria: ARGUMENT_RUBRIC.map((c) => ({ id: c.id, score: c.max, comment: '' })),
    strengths: [], improvements: [], model_outline: [], examiner_note: '',
  };
  assert.equal(normaliseEvaluation(raw, 2, { typedWordCount: 200 }).total, 10);
  assert.equal(normaliseEvaluation({ ...raw, answer_language: 'en' }, 2, { typedWordCount: 200 }).total, 20);
});

test('photo results use the transcription for word count', () => {
  const e = normaliseEvaluation(essayRaw([2, 2, 2, 1, 1, 0], { transcription: 'one two three four five' }), 1, { typedWordCount: null });
  assert.equal(e.wordCount, 5);
  assert.equal(e.transcription, 'one two three four five');
});

test('input validation', () => {
  assert.match(validateTypedAnswer('too short'), /at least/);
  assert.equal(validateTypedAnswer('word '.repeat(300)), null);
  assert.match(validateTypedAnswer('word '.repeat(CAPF_P2_LIMITS.maxWords + 1)), /too long/);
  assert.match(validateImages([]), /at least one/);
  assert.match(validateImages([{ mediaType: 'image/gif', data: 'A'.repeat(200) }]), /JPEG/);
  assert.match(validateImages([{ mediaType: 'image/jpeg', data: 'not base64!'.repeat(20) }]), /Invalid/);
  assert.equal(validateImages([{ mediaType: 'image/jpeg', data: 'A'.repeat(200) }]), null);
  assert.match(validateImages(Array(5).fill({ mediaType: 'image/jpeg', data: 'A'.repeat(200) })), /Up to 4/);
  assert.match(validateImages([{ mediaType: 'image/jpeg', data: 'A'.repeat(CAPF_P2_LIMITS.maxImageBase64Chars + 4) }]), /too large/);
});

test('prompt and tool carry the official question and the right rubric', () => {
  const t = findTarget(2025, 2, 'a');
  const p = userPrompt(t, { mode: 'typed', wordCount: 220, answerText: 'ANSWER BODY' });
  assert.ok(p.includes('A nuclear weapon is a deterrent to warfare'));
  assert.ok(p.includes('<candidate_answer>\nANSWER BODY\n</candidate_answer>'));
  assert.ok(p.includes('- for (Arguments for, max 7)'));
  const photo = userPrompt(findTarget(2025, 1, 'b'), { mode: 'photo', wordCount: null });
  assert.ok(photo.includes('transcribe') && !photo.includes('<candidate_answer>'));
  assert.ok(photo.includes('सांस्कृतिक कूटनीति और विश्व शान्ति'));
  assert.deepEqual(evaluationTool(1).input_schema.properties.criteria.items.properties.id.enum, ESSAY_RUBRIC.map((c) => c.id));
  assert.match(systemPrompt(), /untrusted/);
});

test('IST day starts at 18:30 UTC of the previous day', () => {
  assert.equal(istDayStart(new Date('2026-11-27T10:00:00Z')), '2026-11-26T18:30:00.000Z');
  assert.equal(istDayStart(new Date('2026-11-27T19:00:00Z')), '2026-11-27T18:30:00.000Z');
});

test('migration: RLS, own-row reads and an atomic daily limit (PGlite)', async () => {
  const { PGlite } = await import('@electric-sql/pglite');
  const db = new PGlite();
  await db.exec(`
    create schema auth; create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create role anon; create role authenticated; create role service_role bypassrls;
    grant usage on schema public, auth to anon, authenticated, service_role;
    grant execute on function auth.uid() to anon, authenticated;
    insert into auth.users values ('00000000-0000-0000-0000-000000000001'), ('00000000-0000-0000-0000-000000000002');
  `);
  await db.exec(readFileSync(new URL('../../../supabase/pending/20261127083000_capf_p2_answer_evaluations.sql', import.meta.url), 'utf8'));
  await db.exec('grant all on public.capf_p2_evaluations to service_role; -- Supabase default privileges');
  const U1 = '00000000-0000-0000-0000-000000000001';
  const U2 = '00000000-0000-0000-0000-000000000002';
  const reserve = (u, limit = 2) => db.query(
    `select public.capf_p2_reserve_evaluation($1, 2024, 1::smallint, 'a', 'typed', 'v1', $2, now() - interval '1 hour') as id`, [u, limit]);

  await db.exec('set role service_role');
  const a = (await reserve(U1)).rows[0].id;
  await db.query(`update public.capf_p2_evaluations set status='COMPLETED', result='{}'::jsonb, total_score=11, completed_at=now() where id=$1`, [a]);
  const b = (await reserve(U1)).rows[0].id;
  await assert.rejects(reserve(U1), /CAPF_P2_DAILY_LIMIT/);
  await db.query(`update public.capf_p2_evaluations set status='FAILED' where id=$1`, [b]);
  await reserve(U1); // a failed attempt frees its slot
  await reserve(U2);
  await db.exec('reset role');
  await assert.rejects(db.query(`update public.capf_p2_evaluations set status='COMPLETED' where id=$1`, [b]), /check/,
    'COMPLETED requires a result and a score');

  await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${U1}', false);`);
  const own = await db.query('select user_id from public.capf_p2_evaluations');
  assert.ok(own.rows.length === 3 && own.rows.every((r) => r.user_id === U1), 'learners see only their own rows');
  await assert.rejects(db.query(`insert into public.capf_p2_evaluations (user_id, exam_year, question, part, input_mode, rubric_version) values ('${U1}', 2024, 1, 'a', 'typed', 'x')`), /permission denied/);
  await assert.rejects(reserve(U1), /permission denied/);
  await db.exec('reset role; set role anon');
  await assert.rejects(db.query('select * from public.capf_p2_evaluations'), /permission denied/);
  await db.close();
});
