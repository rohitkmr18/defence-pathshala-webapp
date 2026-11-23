const {test} = require("node:test");
const assert = require("node:assert/strict");
const {reconcile,SERIES_A_KEY}=require("./seo/capf-2025-series-a-audit.cjs");
const row=(q,opt)=>({exam:"CAPF-AC",year:2025,paper:"Paper I",q_num:q,question_id:"CAPF_2025_P1_"+String(q).padStart(3,"0"),final_opt:opt,verified_status:"Verified"});
test("transcribed Series A key includes all 125 positions and Q98 marked dropped",()=>{
  assert.equal(Object.keys(SERIES_A_KEY).length,125);
  assert.equal(SERIES_A_KEY[98],"X");
});
test("2025 source snapshot: first 20 match, dropped Q98 is incorrectly marked scored",()=>{
  const first20="ACACABDBBCCACBAACBAA".split("");
  assert.equal(first20.length,20);
  const found=reconcile([...first20.map((option,i)=>row(i+1,option)),row(62,"C"),row(98,"C"),row(108,"C")]);
  assert.equal(found.filter(x=>x.finding==="MATCH").length,20);
  assert.deepEqual(found.filter(x=>x.finding!=="MATCH").map(x=>({q:x.q_num,finding:x.finding})),[{q:62,finding:"ANSWER_MISMATCH"},{q:98,finding:"DROPPED_ITEM_HAS_SCORABLE_ANSWER"},{q:108,finding:"ANSWER_MISMATCH"}]);
});
test("no claim about other years, series or beyond 125 key entries",()=>{
  const found=reconcile([row(126,"A"),{...row(98,"C"),year:2024},{...row(98,"C"),paper:"Paper II"},{...row(1,"D"),exam:"CDS"}]);
  assert.equal(found.length,0);
});
test("incorrect normal answer is reported rather than silently accepted",()=>{
  assert.equal(reconcile([row(2,"A")])[0].finding,"ANSWER_MISMATCH");
  assert.equal(reconcile([row(98,null)])[0].finding,"DROPPED_ITEM_REQUIRES_REVIEW");
});

test("full 125-key self-consistency flags only one dropped item",()=>{
  const rows=Object.entries(SERIES_A_KEY).map(([q,key])=>row(Number(q), key));
  const found=reconcile(rows);
  assert.equal(found.length,125);
  assert.equal(found.filter(x=>x.finding==="MATCH").length,124);
  assert.deepEqual(found.filter(x=>x.finding!=="MATCH").map(x=>x.q_num),[98]);
});
