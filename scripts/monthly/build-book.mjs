// Offline generic snapshot -> PDF build. Never approves, publishes or grants access.
import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {render} from './render.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
export async function buildBook(snapshot,out) {
  mkdirSync(out,{recursive:true});
  const python=process.env.DP_PDF_PYTHON || path.join(here,'../../.monthly-venv/bin/python');
  for(const directory of [out,out+'-repeat']) {
    await render(snapshot,directory);
    const result=spawnSync(python,[path.join(here,'pdf-qa.py'),directory],{stdio:'inherit'});
    if(result.status!==0) throw new Error('Document QA failed; artifact must not be distributed');
  }
  const qa=JSON.parse(readFileSync(path.join(out,'qa.json')));
  const repeat=JSON.parse(readFileSync(path.join(out+'-repeat','qa.json')));
  if(qa.sha256!==repeat.sha256) throw new Error('Artifact is not reproducible');
  qa.reproducible=true;
  writeFileSync(path.join(out,'qa.json'),JSON.stringify(qa,null,2)+'\n');
  return qa;
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  if(!process.argv[2] || !process.argv[3]) throw new Error('Usage: node scripts/monthly/build-book.mjs PRIVATE_SNAPSHOT.json PRIVATE_OUTPUT_DIR');
  await buildBook(JSON.parse(readFileSync(process.argv[2],'utf8')),path.resolve(process.argv[3]));
}
