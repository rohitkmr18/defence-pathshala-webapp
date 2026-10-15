import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '../../frontend/node_modules/playwright-core/index.mjs';
import { documentModel, normalizeText } from './document.mjs';
import { canonical, sha256, GENERATOR_VERSION } from './core.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
export async function render(snapshot, out) {
  mkdirSync(out, {recursive:true});
  const model = documentModel(snapshot);
  const fontFiles = [['DP','DP-Sans.ttf',400],['DP','DP-Sans-Bold.ttf',700],['DPDevanagari','DP-Devanagari.ttf',400],['DPSymbols','DP-Symbols.ttf',400]];
  const fonts = fontFiles.map(([name,file,weight]) => `@font-face{font-family:${name};font-weight:${weight};src:url(data:font/ttf;base64,${readFileSync(path.join(here,'fonts',file)).toString('base64')})}`).join('\n');
  const css = readFileSync(path.join(here,'book.css'),'utf8');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Defence Pathshala · Monthly Intelligence</title><style>${fonts}\n${css}</style></head><body>${model.html}</body></html>`;
  writeFileSync(path.join(out,'book.html'),html);
  const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
  try {
    const page = await browser.newPage();
    await page.route('**/*',route => route.abort());
    await page.setContent(html,{waitUntil:'load'});
    await page.evaluate(() => document.fonts.ready);
    const actual = await page.locator('[data-parity-block]').evaluateAll(nodes => nodes.map(n => ({id:n.dataset.parityBlock,text:n.innerText})));
    const failures = model.blocks.filter(b => normalizeText(actual.find(a=>a.id===b.id)?.text || '') !== b.expected_text);
    if (failures.length || actual.length !== model.blocks.length) throw new Error('DOM editorial parity failed: '+failures.map(b=>b.id).join(','));
    const identities = await page.evaluate(() => ({stories:[...document.querySelectorAll('[data-story-id]')].map(n=>n.dataset.storyId),questions:[...document.querySelectorAll('[data-question-id]')].map(n=>n.dataset.questionId),answers:[...document.querySelectorAll('[data-answer-id]')].map(n=>n.dataset.answerId),pyqs:[...document.querySelectorAll('[data-pyq-id]')].map(n=>n.dataset.pyqId),sources:[...document.querySelectorAll('[data-source-id]')].map(n=>n.dataset.sourceId)}));
    if (canonical(identities.stories)!==canonical(snapshot.stories.map(s=>s.source_id)) || canonical(identities.questions)!==canonical(snapshot.stories.flatMap(s=>s.mcqs.map(q=>q.source_id))) || canonical(identities.questions)!==canonical(identities.answers) || canonical(identities.sources)!==canonical(identities.stories) || canonical(identities.pyqs)!==canonical(snapshot.stories.flatMap(s=>s.linked_pyqs.map(q=>q.id)))) throw new Error('Identity parity failed');
    const expectedBodyText = await page.evaluate(() => {
      const markers = [];
      for (const list of document.querySelectorAll('ol')) {
        if (getComputedStyle(list).listStyleType === 'none') continue;
        [...list.children].forEach((child,index) => {
          const marker = document.createTextNode(String((list.start || 1)+index)+'. ');
          child.prepend(marker); markers.push(marker);
        });
      }
      const text = document.body.innerText;
      markers.forEach(marker => marker.remove());
      return text;
    });
    await page.pdf({path:path.join(out,'raw.pdf'),format:'A4',printBackground:true,tagged:true,outline:true,displayHeaderFooter:true,margin:{top:'19mm',bottom:'20mm',left:'19mm',right:'19mm'},headerTemplate:'<div style="font-size:12px;width:100%;padding:0 19mm;color:#475569">DEFENCE PATHSHALA / MONTHLY INTELLIGENCE</div>',footerTemplate:`<div style="font-size:12px;width:100%;padding:0 19mm;color:#475569;display:flex;justify-content:space-between"><span>${snapshot.kind === "SAMPLE" ? "Free sample" : snapshot.status === "RELEASED" ? "Monthly edition" : "Private review"} · ${snapshot.edition_id} · v${snapshot.edition_version}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`});
    const toolchain = {chromium:browser.version(), node:process.versions.node, platform:process.platform, arch:process.arch, frontend_lock_sha256:sha256(readFileSync(path.join(here,'../../frontend/package-lock.json'))), requirements_sha256:sha256(readFileSync(path.join(here,'requirements.txt')))};
    const fingerprint = sha256([GENERATOR_VERSION,canonical(toolchain),...['core.mjs','render.mjs','document.mjs','pdf-qa.py','book.css'].map(file=>sha256(readFileSync(path.join(here,file)))),css,...fontFiles.map(([,file])=>sha256(readFileSync(path.join(here,'fonts',file))))].join('\n'));
    writeFileSync(path.join(out,'parity.json'),canonical({status:'PASSED',content_hash:snapshot.content_hash,generator_version:GENERATOR_VERSION,generator_fingerprint:fingerprint,toolchain,identities,expected_body_text:expectedBodyText,blocks:model.blocks,projection:model.projection,toc:model.toc})+'\n');
  } finally { await browser.close(); }
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  await render(JSON.parse(readFileSync(process.argv[2],'utf8')),path.resolve(process.argv[3] || '.monthly-build/pdf'));
}
