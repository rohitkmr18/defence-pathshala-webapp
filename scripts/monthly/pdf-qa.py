"""Normalize Chromium timestamps/IDs, then independently inspect the actual PDF."""
import sys, json, hashlib, re, unicodedata
from pathlib import Path
from collections import Counter
import fitz
from pypdf import PdfReader
out = Path(sys.argv[1])
parity = json.loads((out/'parity.json').read_text())
edition = parity['edition']
pdf_file = 'sample.pdf' if edition['kind'] == 'SAMPLE' else 'edition.pdf'
pdf_date = 'D:'+edition['source_as_of'].replace('-','')+'000000Z'
source = fitz.open(out/'raw.pdf')
source.set_metadata({'title':'Defence Pathshala Monthly Intelligence — Free Sample' if edition['kind']=='SAMPLE' else edition['title'],'author':'Defence Pathshala','creator':parity['generator_version'],'producer':'DP reproducible PDF pipeline','creationDate':pdf_date,'modDate':pdf_date})
identity = parity['content_hash'][:32]
source.xref_set_key(-1, 'ID', f'[<{identity}><{identity}>]')
source.save(out/pdf_file, no_new_id=True, garbage=0, deflate=True)
source.close()
doc = fitz.open(out/pdf_file)
errors = []
reader = PdfReader(out/pdf_file)
if len(reader.pages) != len(doc): errors.append('Independent parser page mismatch')
original = fitz.open(out/'raw.pdf')
for i,page in enumerate(doc):
    if page.get_pixmap().samples != original[i].get_pixmap().samples: errors.append(f'Normalization changed visible pixels page {i+1}')
original.close()
def norm(text): return re.sub(r'\s+','',unicodedata.normalize('NFKC',text)).replace('\u00ad','')
text = '\n'.join(p.get_text(sort=True) for p in doc)
expected = Counter(norm(b.get('expected_pdf_text',b['expected_text'])) for b in parity['blocks'] if b['expected_text'])
body_text = '\n'.join(p.get_text(clip=fitz.Rect(0, 45, p.rect.width, p.rect.height-45), sort=True) for p in doc)
flat = norm(body_text)
if flat != norm(parity["expected_body_text"]):
    expected_full=norm(parity["expected_body_text"])
    index=next((i for i,(a,b) in enumerate(zip(flat,expected_full)) if a!=b),min(len(flat),len(expected_full)))
    errors.append("Full-document text drift (missing/duplicated/changed text) at "+str(index)+": "+flat[index:index+80]+" / expected "+expected_full[index:index+80])
for passage, count in expected.items():
    if flat.count(passage) < count: errors.append('Missing passage: '+passage[:100])
links = 0
min_font = 100
for i,page in enumerate(doc):
    if len(page.get_text().strip()) < 50: errors.append(f'Blank page {i+1}')
    if f'{i+1} / {len(doc)}' not in page.get_text(): errors.append(f'Missing page number {i+1}')
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines',[]):
            for span in line['spans']:
                x0,y0,x1,y1=span['bbox']; size=span['size']; min_font=min(min_font,size)
                if x0 < 0 or x1 > page.rect.width+1 or y0 < 0 or y1 > page.rect.height+1: errors.append(f'Clipped text page {i+1}: {span["text"][:40]}')
                if size < 8: errors.append(f'Tiny font page {i+1}')
                if 45 < y0 < page.rect.height-45 and (x0 < 48 or x1 > page.rect.width-48): errors.append(f'Text exceeds body margins page {i+1}')
                if '\ufffd' in span['text']: errors.append(f'Missing glyph page {i+1}')
    for link in page.get_links():
        links += 1
        if link['kind'] == fitz.LINK_GOTO and not 0 <= link.get('page',-1) < len(doc): errors.append('Broken internal link')
        if link['kind'] == fitz.LINK_URI and not re.match(r'^https://[^\s/]+(?:/[^\s]*)?$',link['uri']): errors.append('Invalid external URL')
if not doc.get_toc(): errors.append('Missing bookmarks')
if links < len(parity['toc']): errors.append('Missing contents links')
for level,title,page in doc.get_toc():
    if not 1 <= page <= len(doc): errors.append('Broken bookmark: '+title)
(out/'pages').mkdir(exist_ok=True)
for i,page in enumerate(doc): page.get_pixmap(matrix=fitz.Matrix(1.2,1.2),alpha=False).save(out/'pages'/f'page-{i+1:02}.png')
(out/'extracted.txt').write_text(text)
report={'pdf_file':pdf_file,'status':'FAILED' if errors else 'PASSED','content_hash':parity['content_hash'],'sha256':hashlib.sha256((out/pdf_file).read_bytes()).hexdigest(),'pages':len(doc),'links':links,'bookmarks':len(doc.get_toc()),'minimum_font_pt':round(min_font,2),'checked_passages':len(parity['blocks']),'errors':errors}
(out/'qa.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
if errors: sys.exit(1)
