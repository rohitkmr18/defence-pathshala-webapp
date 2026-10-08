#!/usr/bin/env python3
import json
import re
from pathlib import Path
import requests
from bs4 import BeautifulSoup, Tag

SOURCES = [
    ("CAPF_AC_2021_I_GAI", "https://www.unlockias.in/upsc-other-exam-pyq/capf-pyq/previous-year-papers/2021", 125),
    ("CDS_2021_I_GK", "https://www.unlockias.in/upsc-other-exam-pyq/cds-pyq/previous-year-papers/2021/i", 120),
    ("CDS_2021_II_GK", "https://www.unlockias.in/upsc-other-exam-pyq/cds-pyq/previous-year-papers/2021/ii", 120),
]
OUT = Path("data/ingestion/unlockias_2021_taxonomy_hints.json")
HEADERS={"User-Agent":"DefencePathshala-PYQ-Ingestion/1.0 (+https://defencepathshala.in)"}

STOP_PREFIXES=("Answer with","View full","Report Issue","CDS 2021","CAPF 2021")
DIFF={"easy","moderate","difficult","hard"}

def clean(s):
    return re.sub(r"\s+"," ",s or "").strip()

def smallest_question_container(node):
    cur=node.parent
    chosen=None
    for _ in range(8):
        if not isinstance(cur,Tag): break
        txt=clean(cur.get_text(" ",strip=True))
        qmarks=re.findall(r"\bQ\s*\d+\b",txt,re.I)
        if len(qmarks)==1 and len(txt)<5000:
            chosen=cur
        if len(qmarks)>1:
            break
        cur=cur.parent
    return chosen or node.parent

def parse(url, expected):
    html=requests.get(url,headers=HEADERS,timeout=30).text
    soup=BeautifulSoup(html,"html.parser")
    result={}
    # Q markers are rendered as Q1, Q2... in the year page cards.
    for text_node in soup.find_all(string=re.compile(r"^\s*Q\s*\d+\s*$",re.I)):
        m=re.search(r"(\d+)",str(text_node))
        if not m: continue
        q=int(m.group(1))
        if not 1<=q<=expected: continue
        box=smallest_question_container(text_node)
        labels=[]
        for a in box.find_all("a"):
            t=clean(a.get_text(" ",strip=True))
            if not t or t.upper()==f"Q{q}" or any(t.startswith(x) for x in STOP_PREFIXES):
                continue
            if t.lower() in DIFF: continue
            if len(t)>100: continue
            labels.append(t)
        txt=clean(box.get_text(" ",strip=True)).lower()
        difficulty=next((d for d in DIFF if re.search(rf"\b{d}\b",txt)),None)
        # Prefer the shortest non-navigation label; these cards normally contain one taxonomy link.
        labels=list(dict.fromkeys(labels))
        result[q]={"labels":labels,"difficulty":difficulty}
    return result

def main():
    all_out={}
    for batch,url,expected in SOURCES:
        meta=parse(url,expected)
        all_out[batch]={"source_url":url,"expected":expected,"found":len(meta),"questions":meta}
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps(all_out,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({k:{"found":v["found"],"expected":v["expected"]} for k,v in all_out.items()},indent=2))
    # Do not fail solely for missing metadata: it is a secondary taxonomy signal.
    if sum(v["found"] for v in all_out.values()) < 300:
        raise SystemExit("Too few taxonomy hints extracted; parser needs review.")

if __name__=="__main__":
    main()
