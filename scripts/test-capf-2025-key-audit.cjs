const {test} = require("node:test");
const assert = require("node:assert/strict");
const {reconcile,SERIES_A_KEY}=require("./seo/capf-2025-series-a-audit.cjs");
const row=(q,opt)=>({exam:"CAPF-AC",year:2025,paper:"Paper I",q_num:q,question_id:"CAPF_2025_P1_"+String(q).padStart(3,"0"),final_opt:opt,verified_status:"Verified"});
test("spot-checked Series A key includes 20 numbered answers and Q98 marked dropped",()=>{
  assert.equal(Object.keys(SERIES_A_KEY).length,21);
  assert.equal(SERIES_A_KEY[98],"X");
});
test("2025 source snapshot: first 20 match, dropped Q98 is incorrectly marked scored",()=>{
  const first20="ACACABDBBCCACBAACBAA".split("");
  assert.equal(first20.length,20);
  const found=reconcile([...first20.map((option,i)=>row(i+1,option)),row(98,"C")]);
  assert.equal(found.filter(x=>x.finding==="MATCH").length,20);
  assert.deepEqual(found.filter(x=>x.finding!=="MATCH").map(x=>({q:x.q_num,finding:x.finding})),[{q:98,finding:"DROPPED_ITEM_HAS_SCORABLE_ANSWER"}]);
});
test("no claim about other years, series or untranscribed key entries",()=>{
  const found=reconcile([row(21,"A"),{...row(98,"C"),year:2024},{...row(98,"C"),paper:"Paper II"},{...row(1,"D"),exam:"CDS"}]);
  assert.equal(found.length,0);
});
test("incorrect normal answer is reported rather than silently accepted",()=>{
  assert.equal(reconcile([row(2,"A")])[0].finding,"ANSWER_MISMATCH");
  assert.equal(reconcile([row(98,null)])[0].finding,"DROPPED_ITEM_REQUIRES_REVIEW");
});
