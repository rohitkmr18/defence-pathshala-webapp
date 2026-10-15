// Metadata-only October pilot. Source payload stays in ignored local build space.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {audit,compile,canonical,writeImmutable} from './core.mjs';
const input=JSON.parse(readFileSync(process.argv[2], 'utf8'));
const report=audit(input,'2026-10');
const available=report.records.filter(r=>r.quality==='APPROVED_SOURCE_AVAILABLE');
const manifest={edition_id:'2026-10',edition_version:1,kind:'MONTHLY',title:'October 2026 · Partial editorial compilation',coverage_start:'2026-10-01',coverage_end:input.as_of,
 sources:available.map(r=>({edition_id:r.edition_id,source_hash:r.source_hash,approved_source_version:1})),
 taxonomy:[...new Set(available.flatMap(r=>r.stories.map(s=>s.subject)))].sort(),exams:['CDS','CAPF-AC','NDA','AFCAT'],include_story_ids:available.flatMap(r=>r.stories.map(s=>s.id)),exclusions:{},editorial_decisions:[]};
manifest.ordering={rule:'subject-date-source-ordinal',subjects:manifest.taxonomy};
const snapshot=compile(input,manifest);
writeImmutable('.monthly-build/pilot',snapshot);
mkdirSync('docs/monthly-compilation',{recursive:true});
for(const [file,value] of Object.entries({'pilot-manifest.json':manifest,'coverage.json':{edition_id:snapshot.edition_id,status:snapshot.status,content_hash:snapshot.content_hash,coverage_complete:snapshot.coverage_complete,...snapshot.coverage_manifest,excluded_editions:report.records.filter(r=>r.quality!=='APPROVED_SOURCE_AVAILABLE').map(r=>({id:r.edition_id,reason:r.quality}))},'editorial-decisions.json':{decision_queue:snapshot.decision_queue,release_blockers:report.release_blockers,missing_dates:report.missing_publication_dates}})) writeFileSync('docs/monthly-compilation/'+file,canonical(value)+'\n');
console.log(`DRAFT only: ${snapshot.stories.length} stories, ${snapshot.mcq_ids.length} MCQs, ${snapshot.decision_queue.length} unresolved decisions`);
