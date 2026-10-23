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
