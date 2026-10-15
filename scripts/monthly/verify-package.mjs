import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {sampleInput,sampleManifest} from './cli.mjs';
import {compile,transition,canonical,sha256,projection} from './core.mjs';
const root=new URL('../../',import.meta.url);
const json=file=>JSON.parse(readFileSync(new URL(file,root),'utf8'));
const expected=transition(compile(sampleInput(),sampleManifest()),'VALIDATED');
const packaged=json('frontend/src/content/monthly/2026-10-sample.json');
assert.equal(canonical(expected),canonical(packaged),'Snapshot must be reproducible from exact approved source');
const qa=json('docs/monthly-compilation/sample/qa.json');
const parity=json('docs/monthly-compilation/sample/parity.json');
assert.equal(qa.status,'PASSED');assert.equal(qa.reproducible,true);assert.equal(qa.content_hash,expected.content_hash);
assert.equal(qa.sha256,sha256(readFileSync(new URL('frontend/public/monthly/2026-10-free-sample.pdf',root))));
assert.equal(canonical(parity.projection),canonical(projection(packaged)));
const loader=(await import('../test-support/load-ts.cjs')).default;
const api=loader({'server-only':{}})(fileURLToPath(new URL('frontend/src/lib/monthly-snapshot.ts',root)));
assert.equal(canonical(api.getPublicMonthlySnapshot()),canonical(expected));
// No other daily story or full-edition manuscript is in the public content tree.
assert.equal(packaged.stories.length,1);
console.log('Packaged snapshot/PDF checksum, actual server allowlist and web/PDF projection match.');
for (const mutate of [s=>s.kind='MONTHLY',s=>s.status='DRAFT',s=>s.edition_id='2026-11',s=>s.edition_version=2,s=>s.stories.push(s.stories[0]),s=>s.stories[0].content.editorialMarkdown+='unapproved',s=>s.content_hash='a'.repeat(64)]) {
 const bad=structuredClone(packaged);mutate(bad);
 const guarded=loader({'server-only':{},'@/content/monthly/2026-10-sample.json':bad})(fileURLToPath(new URL('frontend/src/lib/monthly-snapshot.ts',root)));
 assert.throws(()=>guarded.getPublicMonthlySnapshot(),/integrity/);
}
console.log('Draft/full/other-month/revised/tampered public snapshots rejected.');
