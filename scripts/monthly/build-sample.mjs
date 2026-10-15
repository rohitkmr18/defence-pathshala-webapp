import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sampleInput, sampleManifest } from './cli.mjs';
import { compile, transition, canonical } from './core.mjs';
import { buildBook } from './build-book.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
process.chdir(root);
const snapshot=transition(compile(sampleInput(),sampleManifest()),'VALIDATED');
const out=path.resolve('.monthly-build/sample');
mkdirSync(out,{recursive:true});
writeFileSync(path.join(out,'snapshot.json'),canonical(snapshot)+'\n');
await buildBook(snapshot,out);
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
