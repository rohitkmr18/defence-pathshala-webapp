const { test } = require("node:test");
const assert = require("node:assert/strict");
const load = require("./test-support/load-ts.cjs")();
const { buildAfcatPerformanceV2 } = load("frontend/src/lib/afcat/performance-v2.ts");
const obj = (v) => JSON.parse(JSON.stringify(v));
function question(n, section, topic, subtopic, selected, timeSpentSeconds = null) {
  return { questionId:`q${n}`, position:n, section, topic, subtopic,
    selected, correct:"A", explanation:null, difficulty:"MODERATE",
    timeSpentSeconds };
}
function attempt(id, score, correct, incorrect, unanswered, when) {
  return { sessionId:id,title:`Mock ${id}`,status:"SUBMITTED",completedAt:when,
    score,maxMarks:300,correct,incorrect,unanswered };
}
test("B2 separates attempt accuracy from assignment attempt rate and preserves negative marking", () => {
  const review = [
    question(1,"ENGLISH","Grammar","Tenses","A",12),
    question(2,"ENGLISH","Grammar","Tenses","B",25),
    question(3,"ENGLISH","Grammar","Tenses",null),
    question(4,"ENGLISH","Grammar","Tenses",null),
    question(5,"ENGLISH","Grammar","Tenses","A",8),
  ];
  const d = buildAfcatPerformanceV2(review,[attempt("a",5,2,1,2,"2026-11-10T00:00:00Z")]);
  const e = d.sections.find(x=>x.section==="ENGLISH");
  assert.equal(e.accuracyPercent,66.67);
  assert.equal(e.attemptRatePercent,60);
  assert.deepEqual(obj([e.marks,e.maximumMarks,e.marksLost,e.negativePenalty]),[5,15,10,1]);
  assert.deepEqual(obj([e.total,e.correct,e.incorrect,e.unanswered]),[5,2,1,2]);
  assert.equal(d.topics[0].evidence,"SUFFICIENT");
  assert.equal(d.subtopics[0].subtopic,"Tenses");
  assert.equal(d.overview.questionTimeSeconds,45);
});
test("B2 reports limited evidence, unknown timing and unattempted accuracy truthfully", () => {
  const review = [question(1,"GENERAL_AWARENESS","Polity",null,null),
    question(2,"GENERAL_AWARENESS","Polity",null,null)];
  const d = buildAfcatPerformanceV2(review,[attempt("a",0,0,0,2,"2026-11-10T00:00:00Z")]);
  assert.equal(d.sections[0].accuracyPercent,null);
  assert.equal(d.sections[0].attemptRatePercent,0);
  assert.equal(d.overview.overallAccuracyPercent,null);
  assert.equal(d.overview.questionTimeSeconds,null);
  assert.equal(d.topics[0].evidence,"LIMITED");
  assert.deepEqual(obj(d.priorities),[]);
  assert.equal(d.trend.length,1);
});
test("B2 uses only scored attempts for score trends and does not mix missing results", () => {
  const attempts=[
    attempt("latest",12,4,0,96,"2026-11-10T12:00:00Z"),
    attempt("older",-2,0,2,98,"2026-11-09T12:00:00Z"),
    {...attempt("no-result",0,0,0,100,"2026-11-08T12:00:00Z"),score:null},
  ];
  const d=buildAfcatPerformanceV2([],attempts);
  assert.equal(d.overview.completedMocks,2);
  assert.equal(d.overview.latestScore,12);
  assert.equal(d.overview.bestScore,12);
  assert.equal(d.overview.averageScore,5);
  assert.deepEqual(obj(d.trend.map(x=>x.sessionId)),["older","latest"]);
  assert.equal(d.trend[0].percentOfMax,-0.67);
  assert.equal(d.priorities.length,0);
});
test("B2 keeps same-named topics separated across sections and subtopics",()=>{
  const review=[question(1,"ENGLISH","Comprehension","Inference","A"),
    question(2,"GENERAL_AWARENESS","Comprehension","Inference","B"),
    question(3,"ENGLISH","Comprehension","Meaning",null)];
  const d=buildAfcatPerformanceV2(review,[attempt("a",2,1,1,1,"2026-11-10T00:00:00Z")]);
  assert.equal(d.topics.length,2);
  assert.equal(d.subtopics.length,3);
});
