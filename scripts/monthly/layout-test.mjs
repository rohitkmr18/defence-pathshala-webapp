// Private rendering stress fixture. Reuses approved prose; never packaged as editorial content.
import {writeFileSync,mkdirSync} from 'node:fs';
import {sampleInput,sampleManifest} from './cli.mjs';
import {compile,transition,sha256,canonical} from './core.mjs';
import {buildBook} from './build-book.mjs';
const snapshot=transition(compile(sampleInput(),sampleManifest()),'VALIDATED');
snapshot.kind='MONTHLY'; snapshot.title='Private monthly typography review';
const story=snapshot.stories[0];
const original=story.content.editorialMarkdown;
story.content.editorialMarkdown='## PRIVATE TYPOGRAPHY QA · NOT EDITORIAL CONTENT\n\nUnicode QA: भारत · नेपाल · ₹79 · CO₂ · 10⁶ · α β Δ ± × ≤ ≥.\n\n| Symbol | Name |\n| --- | --- |\n| CO₂ | Carbon notation (typography test) |\n| भारत | Unicode rendering test |\n\n'+Array(4).fill(original).join('\n\n');
story.mcqs[0].content.explanation=Array(12).fill(story.mcqs[0].content.explanation).join('\n\n');
const core=Object.fromEntries(Object.entries(snapshot).filter(([key])=>!['content_hash','status','approval_metadata','release_metadata','generated_artifacts'].includes(key)));
snapshot.content_hash=sha256(core);
const out='.monthly-build/layout-stress';mkdirSync(out,{recursive:true});
writeFileSync(out+'/snapshot.json',canonical(snapshot));
const report=await buildBook(snapshot,out);
if(report.pages<15) throw new Error('Multi-page stress did not execute');
console.log('Private Unicode, tables, multi-page chapter and long explanation checks passed.');
