const { test } = require('node:test');
const assert = require('node:assert/strict');
const createLoader = require('./test-support/load-ts.cjs');
function setup({ rows = [], failAt = -1, key = 'fixture' } = {}) {
  let page = 0;
  const client = { from() {
    const q = { select(){return q}, eq(){return q}, in(){return q}, order(){return q}, ilike(){return q},
      range(){ const i=page++; return Promise.resolve(i === failAt ? {error: new Error('private upstream detail')} : {data: rows.slice(i*1000,(i+1)*1000)}); } };
    return q;
  } };
  return createLoader({ 'next/cache': { unstable_cache: fn => fn }, '@supabase/supabase-js': { createClient: () => client } },
    { process: {env: {NEXT_PUBLIC_SUPABASE_ANON_KEY: key}} })('frontend/src/lib/seo-data.ts');
}
const row = (extra={}) => ({exam:'CDS',year:2026,subject:'History',topic:'Modern History',...extra});
test('sitemap excludes unsupported exams, invalid years, empty/numeric slugs and deduplicates',()=>{
  const api=setup();
  const routes=api.eligibleSeoRoutesFromRows([row(), row(), row({exam:'NDA'}), row({exam:'CAPF AC'}), row({year:NaN}),row({year:12}),row({subject:'!!!'}),row({subject:'2026'})]);
  assert.equal(new Set(routes.map(r=>r.path)).size,routes.length);
  assert.deepEqual(Array.from(routes,r=>r.path).sort(),['/exams/cds','/pyqs/cds','/pyqs/cds/2026','/pyqs/cds/2026/history','/pyqs/cds/history'].sort());
});
test('topic threshold is retained and punctuation-only topics excluded',()=>{
  const paths=setup().eligibleSeoRoutesFromRows([...Array.from({length:10},()=>row()), ...Array.from({length:10},()=>row({topic:'!!!'}))]).map(r=>r.path);
  assert.ok(paths.includes('/pyqs/cds/history/modern-history'));
  assert.ok(!paths.some(p=>p.endsWith('/')));
  assert.ok(!setup().eligibleSeoRoutesFromRows([row()]).some(r=>r.path.endsWith('/modern-history')));
});
test('metadata read fails closed on first or later page and missing credentials',async()=>{
  await assert.rejects(setup({failAt:0}).getCachedQuestionsMeta(),/query failed/);
  await assert.rejects(setup({rows:Array.from({length:1000},()=>row()),failAt:1}).getCachedQuestionsMeta(),/query failed/);
  await assert.rejects(setup({key:''}).getCachedQuestionsMeta(),/unavailable/);
});
test('subject archive cannot publish a partial successful page',async()=>{
  await assert.rejects(setup({rows:Array.from({length:1000},()=>row()),failAt:1}).getSubjectArchive('CDS','History'),/query failed/);
});
test('sitemap propagates PYQ failure instead of publishing static-only success',async()=>{
 const load=createLoader({'@/lib/seo-data':{getAllEligibleSeoRoutes:async()=>{throw Error('unavailable')}},'@/lib/current-affairs-sitemap':{getPublishedCurrentAffairsEditions:async()=>[],toLastModified:()=>undefined}});
 await assert.rejects(load('frontend/src/app/sitemap.ts').default(),/unavailable/);
});
test('page metadata gives matching canonical and social identity',()=>{
 const {pageMetadata}=createLoader()('frontend/src/lib/seo-metadata.ts');
 for(const exam of ['cds','capf']) {
  const m=pageMetadata({title:'PYQs',description:'Available questions',path:`/pyqs/${exam}`});
  assert.equal(m.alternates.canonical,`/pyqs/${exam}`);assert.equal(m.openGraph.title,m.twitter.title);assert.equal(m.description,m.twitter.description);
 }
});
test('reporting supports exact page/query/device and rejects malformed filters',()=>{
 const {searchConsoleOptions:f}=createLoader()('frontend/src/lib/search-console-options.ts');
 const options=f(new URLSearchParams('dimensions=query,device&page_equals=https://www.defencepathshala.in/pyqs/cds&start_date=2026-10-01&end_date=2026-10-28&start_row=1000'));
 assert.equal(options.pageContains,undefined);assert.equal(options.startRow,1000);assert.deepEqual(Array.from(options.dimensions),['query','device']);
 for(const input of ['dimensions=query,query','dimensions=secret','page_equals=https://evil.test/','start_date=2026-02-30&end_date=2026-03-02','start_date=2026-10-01','start_row=-1'])assert.throws(()=>f(new URLSearchParams(input)));
});

test('prototype names are not supported exam routes',()=>{
 const api=setup();for(const value of ['__proto__','constructor','toString','nda'])assert.equal(api.slugToExam(value),null);
});
