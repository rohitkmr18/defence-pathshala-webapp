const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const fixture=spawn(process.execPath,['scripts/test-support/seo-upstream.cjs'],{stdio:'ignore'});
const app=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','4558'],{cwd:'frontend',stdio:'ignore',env:{...process.env,NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:4557',NEXT_PUBLIC_SUPABASE_ANON_KEY:'synthetic-anon',SUPABASE_SERVICE_ROLE_KEY:'synthetic-service'}});
(async()=>{
 try{
  let ready=false;for(let i=0;i<40;i++){try{await fetch('http://127.0.0.1:4558/robots.txt');ready=true;break}catch{}await new Promise(r=>setTimeout(r,250))}
  assert.ok(ready,'local server ready');
  const evidence=[];
  for(const exam of ['cds','capf']) {
   const r=await fetch(`http://127.0.0.1:4558/pyqs/${exam}`);const html=await r.text();assert.equal(r.status,200);
   assert.ok(html.includes(`https://www.defencepathshala.in/pyqs/${exam}`));assert.ok(html.includes(`seo_${exam}_archive`));assert.ok(html.includes('12'));assert.ok(html.includes('BreadcrumbList'));assert.ok(html.includes('Explore exams and PYQs'));
   evidence.push({path:`/pyqs/${exam}`,status:r.status,title:html.match(/<title>(.*?)<\/title>/)?.[1],bytes:html.length});
  }
  for(const path of ['/pyqs/unsupported','/pyqs/cds/9999','/pyqs/cds/not-a-subject']){
   const r=await fetch('http://127.0.0.1:4558'+path);assert.equal(r.status,404);assert.match(await r.text(),/noindex/);evidence.push({path,status:r.status});
  }
  const r=await fetch('http://127.0.0.1:4558/sitemap.xml');assert.equal(r.status,200);const xml=await r.text();assert.ok(xml.includes('/pyqs/cds</loc>'));assert.ok(xml.includes('/pyqs/capf</loc>'));assert.ok(!xml.includes('/dashboard/'));
  assert.equal((await fetch('http://127.0.0.1:4558/api/admin/seo/search-console?action=performance')).status,401);
  fs.writeFileSync('docs/seo/evidence/built-http.json',JSON.stringify(evidence,null,2));console.log('PASS: both SSR archives, metadata, canonical, schema, origin, 404/noindex, sitemap, protected admin API');
 }finally{app.kill();fixture.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
