const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./test-support/load-ts.cjs')();
const { scoreAfcat, isAfcatExpired, validateAfcatResponses } = load('frontend/src/lib/afcat/engine.ts');
const { sanitizeAfcatQuestion } = load('frontend/src/lib/afcat/serialize.ts');

test('AFCAT scoring uses +3 / -1 and excludes unanswered questions', () => {
  const keys = new Map([['q1','A'],['q2','B'],['q3','C'],['q4','D']]);
  const responses = new Map([['q1','A'],['q2','C'],['q3',null]]);
  const result = scoreAfcat(keys,responses);
  assert.deepEqual(
    [result.correct,result.incorrect,result.unanswered,result.marks,result.maximumMarks,result.accuracyPercent],
    [1,1,2,2,12,50],
  );
});

test('AFCAT deadline is determined by trusted time and expiry boundary', () => {
  const start = '2026-10-23T10:00:00.000Z';
  assert.equal(isAfcatExpired(start,7200,Date.parse('2026-10-23T11:59:59.999Z')),false);
  assert.equal(isAfcatExpired(start,7200,Date.parse('2026-10-23T12:00:00.000Z')),true);
  assert.throws(() => isAfcatExpired('invalid',7200));
  assert.throws(() => isAfcatExpired(start,0));
});

test('AFCAT answer validation rejects unassigned, duplicated and invalid options', () => {
  assert.doesNotThrow(() => validateAfcatResponses(['q1','q2'],
    [{questionId:'q1',selected:'B',markedForReview:true}]));
  assert.throws(() => validateAfcatResponses(['q1'],
    [{questionId:'other',selected:'A',markedForReview:false}]));
  assert.throws(() => validateAfcatResponses(['q1'],
    [{questionId:'q1',selected:'A',markedForReview:false},
     {questionId:'q1',selected:'B',markedForReview:false}]));
  assert.throws(() => validateAfcatResponses(['q1'],
    [{questionId:'q1',selected:'E',markedForReview:false}]));
});

test('AFCAT learner serializer strictly omits answer keys and explanations', () => {
  const stem = { text:'Test question', answer:'secret', explanation:'secret' };
  const options = ['One','Two','Three','Four'];
  const result = sanitizeAfcatQuestion('q1',1,stem,options);
  assert.equal(result.stem.text,'Test question');
  assert.equal(Array.from(result.options, x => x.key).join(','),'A,B,C,D');
  assert.equal(JSON.stringify(result).includes('secret'),false);
  assert.equal(JSON.stringify(result).includes('correct_option'),false);
  assert.throws(() => sanitizeAfcatQuestion('q1',1,stem,['One','Two']));
  assert.throws(() => sanitizeAfcatQuestion('q1',1,{html:'<script>'},options));
});

test('AFCAT learner serializer shows a shared passage above its question', () => {
  const options = ['One','Two','Three','Four'];
  const result = sanitizeAfcatQuestion('q1',1,{ text:'Fill blank (1).', passage:'The sky is (1) ___ to carelessness.' },options);
  assert.equal(result.stem.text,'Passage:\nThe sky is (1) ___ to carelessness.\n\nFill blank (1).');
  assert.throws(() => sanitizeAfcatQuestion('q1',1,{ text:'Q', passage:'   ' },options));
  assert.throws(() => sanitizeAfcatQuestion('q1',1,{ text:'Q', passage:{ html:'<b>' } },options));
});

const analytics = load('frontend/src/lib/afcat/results-analytics.ts');
// Modules run in a separate VM realm; compare plain copies.
const plain = (v) => JSON.parse(JSON.stringify(v));
const SECTIONS = ['GENERAL_AWARENESS','ENGLISH','NUMERICAL_ABILITY','REASONING_MILITARY_APTITUDE'];
function row(i, section, outcome, extra = {}) {
  const selected = outcome === 'C' ? 'A' : outcome === 'W' ? 'B' : null;
  return { questionId:`q${i}`, position:i, section, selected, correct:'A', explanation:null,
    topic:'T', difficulty:'MODERATE', timeSpentSeconds:0, markedForReview:false, ...extra };
}

test('AFCAT analysis sums sections, negative marks and accuracy from the review', () => {
  const review = [row(1,'ENGLISH','C'), row(2,'ENGLISH','W'), row(3,'ENGLISH','S'), row(4,'GENERAL_AWARENESS','C')];
  const a = analytics.analyzeAfcatAttempt(review);
  const en = a.sections.find(s => s.section === 'ENGLISH');
  assert.deepEqual([en.correct,en.incorrect,en.unanswered,en.marks,en.maximumMarks,en.negativeMarks,en.accuracyPercent],
    [1,1,1,2,9,1,50]);
  assert.deepEqual([a.overall.marks,a.overall.negativeMarks,a.overall.attempted], [5,1,3]);
  assert.deepEqual(plain(a.sections.map(s => s.section)), SECTIONS, 'paper order');
});

test('AFCAT topic summary ranks by marks lost, counting skipped questions', () => {
  const review = [
    row(1,'ENGLISH','C',{topic:'Idioms'}), row(2,'ENGLISH','S',{topic:'Cloze'}), row(3,'ENGLISH','W',{topic:'Cloze'}),
    row(4,'ENGLISH','W',{topic:'Idioms'}),
  ];
  const topics = analytics.summarizeAfcatTopics(review);
  assert.deepEqual(plain(topics.map(t => [t.topic,t.marksLost])), [['Cloze',7],['Idioms',4]]);
});

test('AFCAT time summary ignores missing time and flags slow and costly answers', () => {
  assert.equal(analytics.summarizeAfcatTime([row(1,'ENGLISH','C')]).recorded, false);
  const t = analytics.summarizeAfcatTime([
    row(1,'ENGLISH','W',{timeSpentSeconds:200}), row(2,'ENGLISH','C',{timeSpentSeconds:30}),
    row(3,'ENGLISH','W',{timeSpentSeconds:80}), row(4,'ENGLISH','S',{timeSpentSeconds:Number.NaN}),
  ]);
  assert.deepEqual([t.recorded,t.totalSeconds,t.costlyMisses], [true,310,2]);
  assert.deepEqual(plain(t.slowQuestions.map(q => [q.position,q.outcome])), [[1,'INCORRECT']]);
});

test('AFCAT recommendations: at most three, each backed by the attempt', () => {
  // Heavy guessing: 20 wrong of 30 attempted, weak English, many skipped.
  const review = [];
  let i = 1;
  for (const s of SECTIONS) for (let k = 0; k < 25; k++) {
    const outcome = s === 'ENGLISH' ? (k < 15 ? 'W' : 'S') : (k < 5 ? 'W' : k < 15 ? 'C' : 'S');
    review.push(row(i++, s, outcome, { topic: s === 'ENGLISH' ? 'Cloze' : 'Other', timeSpentSeconds: 100 }));
  }
  const a = analytics.analyzeAfcatAttempt(review);
  assert.ok(a.recommendations.length <= 3);
  assert.equal(a.recommendations[0].kind, 'REDUCE_GUESSING');
  assert.ok(a.recommendations[0].reason.includes(`${a.overall.incorrect} wrong answers`));
  const weakest = a.recommendations.find(r => r.kind === 'WEAKEST_SECTION');
  assert.equal(weakest.section, 'ENGLISH');
  // A clean, accurate attempt gets no invented advice.
  const strong = analytics.analyzeAfcatAttempt(SECTIONS.map((s, n) => row(n + 1, s, 'C')));
  assert.deepEqual(plain(strong.recommendations), []);
});

test('AFCAT recommends attempting more only where accuracy is high', () => {
  const review = [];
  for (let k = 0; k < 25; k++) review.push(row(k + 1, 'GENERAL_AWARENESS', k < 9 ? 'C' : k < 10 ? 'W' : 'S'));
  for (let k = 0; k < 30; k++) review.push(row(k + 26, 'ENGLISH', k < 24 ? 'C' : 'W'));
  const rec = analytics.analyzeAfcatAttempt(review).recommendations.find(r => r.kind === 'ATTEMPT_MORE');
  assert.equal(rec.section, 'GENERAL_AWARENESS');
  assert.ok(rec.reason.includes('15 unanswered') && rec.reason.includes('90%'));
});
