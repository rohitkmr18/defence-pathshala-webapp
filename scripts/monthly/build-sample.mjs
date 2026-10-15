import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sampleInput, sampleManifest } from './cli.mjs';
import { compile, transition, canonical } from './core.mjs';
import { render } from './render.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
process.chdir(root);
const snapshot=transition(compile(sampleInput(),sampleManifest()),'VALIDATED');
const out=path.resolve('.monthly-build/sample');
mkdirSync(out,{recursive:true});
writeFileSync(path.join(out,'snapshot.json'),canonical(snapshot)+'\n');
const python=process.env.DP_PDF_PYTHON || path.join(root,'.monthly-venv/bin/python');
for (const directory of [out,out+'-repeat']) {
  await render(snapshot,directory);
  const result=spawnSync(python,['scripts/monthly/pdf-qa.py',directory],{stdio:'inherit'});
  if(result.status!==0) process.exit(result.status || 1);
}
const qa=JSON.parse(readFileSync(path.join(out,'qa.json')));
const repeated=JSON.parse(readFileSync(path.join(out+'-repeat','qa.json')));
if(qa.sha256!==repeated.sha256) throw new Error('Artifact is not reproducible');
qa.reproducible=true;
writeFileSync(path.join(out,'qa.json'),JSON.stringify(qa,null,2)+'\n');
// Publication is an explicit local packaging operation after the visual review gate.
if(process.argv.includes('--package-reviewed-sample')) {
  const safe=path.join(root,'frontend/src/content/monthly');
  const publicDir=path.join(root,'frontend/public/monthly');
  const evidence=path.join(root,'docs/monthly-compilation/sample');
  for(const directory of [safe,publicDir,evidence]) mkdirSync(directory,{recursive:true});
  writeFileSync(path.join(safe,'2026-10-sample.json'),canonical(snapshot)+'\n');
  copyFileSync(path.join(out,'sample.pdf'),path.join(publicDir,'2026-10-free-sample.pdf'));
  for(const file of ['qa.json','parity.json']) copyFileSync(path.join(out,file),path.join(evidence,file));
  for(const file of readdirSync(path.join(out,'pages'))) copyFileSync(path.join(out,'pages',file),path.join(evidence,file));
}
console.log('Reproducible single-story sample passed; no monthly approval or release performed.');
