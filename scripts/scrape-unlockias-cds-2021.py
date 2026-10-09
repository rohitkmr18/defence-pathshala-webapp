#!/usr/bin/env python3
import csv
import hashlib
import json
import re
import time
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

BASES = [
    ("CAPF_AC_2021_I_GAI", "https://www.unlockias.in/capf-2021-general-ability", 125),
    ("CDS_2021_I_GK", "https://www.unlockias.in/cds-2021-i-general-knowledge", 120),
    ("CDS_2021_II_GK", "https://www.unlockias.in/cds-2021-ii-general-knowledge", 120),
]

OUT_DIR = Path("data/ingestion")
OUT_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "User-Agent": "DefencePathshala-PYQ-Ingestion/1.0 (+https://defencepathshala.in)"
}

def fetch(url, attempts=4):
    last = None
    for i in range(attempts):
        try:
            r = requests.get(url, headers=HEADERS, timeout=30)
            r.raise_for_status()
            return r.text
        except Exception as e:
            last = e
            time.sleep(1.5 * (i + 1))
    raise RuntimeError(f"fetch failed: {url}: {last}")

def clean_space(s):
    return re.sub(r"\s+", " ", s or "").strip()

def option_label_and_text(text):
    text = clean_space(text)
    m = re.match(r"^(?:\(\s*([a-dA-D])\s*\)|([a-dA-D]))[\s.:-]*(.*)$", text)
    if m:
        label = (m.group(1) or m.group(2)).upper()
        return label, clean_space(m.group(3))
    return None, text

def extract_question_links(summary_html, base_url):
    soup = BeautifulSoup(summary_html, "html.parser")
    links = {}
    base_path = base_url.rstrip("/")
    for a in soup.find_all("a", href=True):
        href = urljoin(base_url, a["href"])
        if not href.startswith(base_path + "/q"):
            continue
        m = re.search(r"/q(\d+)-", href)
        if not m:
            continue
        qn = int(m.group(1))
        links.setdefault(qn, href)
    return links

def extract_page(html, page_url):
    soup = BeautifulSoup(html, "html.parser")
    h1 = soup.find("h1")
    if not h1:
        raise ValueError("missing h1")

    question = clean_space(h1.get_text(" ", strip=True))

    answer_heading = None
    for h in soup.find_all(["h2", "h3"]):
        if clean_space(h.get_text(" ", strip=True)).lower() == "answer":
            answer_heading = h
            break
    if not answer_heading:
        raise ValueError("missing Answer heading")

    options = {}
    for el in h1.find_all_next():
        if el is answer_heading:
            break
        if getattr(el, "name", None) == "li":
            lab, txt = option_label_and_text(el.get_text(" ", strip=True))
            if lab in {"A","B","C","D"} and lab not in options:
                options[lab] = txt

    # Fallback: first four list items after h1, before answer.
    if len(options) != 4:
        candidates = []
        for el in h1.find_all_next("li"):
            if answer_heading and answer_heading in el.find_all_previous():
                pass
            candidates.append(clean_space(el.get_text(" ", strip=True)))
            if len(candidates) >= 4:
                break
        if len(candidates) == 4:
            options = {}
            for idx, txt in enumerate(candidates):
                lab, cleaned = option_label_and_text(txt)
                options[lab or "ABCD"[idx]] = cleaned

    answer_raw = ""
    node = answer_heading.find_next()
    while node:
        if getattr(node, "name", None) in {"h2","h3"}:
            break
        txt = clean_space(node.get_text(" ", strip=True)) if hasattr(node, "get_text") else ""
        if txt:
            answer_raw = txt
            break
        node = node.find_next()

    explanation_raw = ""
    explanation_heading = None
    for h in soup.find_all(["h2","h3","h4"]):
        label = clean_space(h.get_text(" ", strip=True)).lower()
        if label in {"why","explanation","solution"} or "explanation" in label or "solution" in label:
            explanation_heading = h
            break
    if explanation_heading:
        parts = []
        for node in explanation_heading.find_all_next():
            if node is explanation_heading:
                continue
            if getattr(node, "name", None) in {"h2","h3","h4"}:
                break
            if getattr(node, "name", None) in {"p","li"}:
                txt = clean_space(node.get_text(" ", strip=True))
                if txt and txt not in parts:
                    parts.append(txt)
        explanation_raw = clean_space(" ".join(parts))

    ans_match = re.search(r"\b([A-D])\b", answer_raw.upper())
    if "CANCEL" in answer_raw.upper():
        key = "X"
    elif ans_match:
        key = ans_match.group(1)
    else:
        key = None

    source_difficulty = None
    for node in soup.find_all(string=True):
        t = clean_space(str(node)).lower()
        if t in {"easy","moderate","difficult","hard"}:
            source_difficulty = "Hard" if t in {"difficult","hard"} else t.title()
            break

    topic_hints = []
    for a in soup.find_all("a", href=True):
        label = clean_space(a.get_text(" ", strip=True))
        m = re.match(r"^More\s+(?:CDS|CAPF)\s+(.+?)\s+questions$", label, flags=re.I)
        if m:
            hint = clean_space(m.group(1))
            if hint and hint not in topic_hints:
                topic_hints.append(hint)

    return {
        "question": question,
        "opt_a": options.get("A"),
        "opt_b": options.get("B"),
        "opt_c": options.get("C"),
        "opt_d": options.get("D"),
        "source_key_opt": key,
        "source_answer_raw": answer_raw,
        "source_explanation_raw": explanation_raw,
        "source_url": page_url,
        "source_topic_hints": topic_hints,
        "source_difficulty": source_difficulty,
    }

def canonical_hash(row):
    blob = "\n".join([
        row["question"],
        row["opt_a"] or "",
        row["opt_b"] or "",
        row["opt_c"] or "",
        row["opt_d"] or "",
    ])
    return hashlib.sha256(blob.encode("utf-8")).hexdigest()

def scrape(batch_code, base_url, expected):
    summary = fetch(base_url)
    links = extract_question_links(summary, base_url)
    if sorted(links) != list(range(1, expected + 1)):
        missing = sorted(set(range(1, expected + 1)) - set(links))
        raise RuntimeError(f"{batch_code}: expected Q1-Q{expected} links; found {len(links)}, missing={missing}")

    rows = []
    anomalies = []
    for qn in range(1, expected + 1):
        row = extract_page(fetch(links[qn]), links[qn])
        is_capf = batch_code.startswith("CAPF_AC_")
        cycle = "I" if batch_code != "CDS_2021_II_GK" else "II"
        row.update({
            "batch_code": batch_code,
            "q_num": qn,
            "question_id": (
                f"CAPF_2021_P1_{qn:03d}"
                if is_capf
                else f"CDS_{cycle}_2021_GK_{qn:03d}"
            ),
            "exam": "CAPF-AC" if is_capf else "CDS",
            "year": 2021,
            "cycle": cycle,
            "paper": "Paper I" if is_capf else "General Knowledge",
            "key_authority": "TRUSTED_SECONDARY",
            "key_source_url": base_url,
            "source_version": "UnlockIAS_2026-10-08",
            "content_hash": None,
        })
        row["content_hash"] = canonical_hash(row)

        missing_opts = [k for k in ("opt_a","opt_b","opt_c","opt_d") if not row[k]]
        if missing_opts:
            anomalies.append({"q_num": qn, "issue": "MISSING_OPTIONS", "fields": missing_opts, "url": links[qn]})
        if row["source_key_opt"] not in {"A","B","C","D","X"}:
            anomalies.append({"q_num": qn, "issue": "MISSING_OR_INVALID_KEY", "raw": row["source_answer_raw"], "url": links[qn]})
        rows.append(row)
        time.sleep(0.08)

    return rows, anomalies

def write_outputs(batch_code, rows, anomalies):
    stem = batch_code.lower()
    jp = OUT_DIR / f"{stem}_unlockias.json"
    cp = OUT_DIR / f"{stem}_unlockias.csv"
    ap = OUT_DIR / f"{stem}_anomalies.json"

    jp.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    ap.write_text(json.dumps(anomalies, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    fields = [
        "batch_code","question_id","exam","year","cycle","paper","q_num",
        "question","opt_a","opt_b","opt_c","opt_d",
        "source_key_opt","key_authority","key_source_url",
        "source_url","source_answer_raw","source_explanation_raw","source_version","source_topic_hints","source_difficulty","content_hash"
    ]
    with cp.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        for row in rows:
            out = {k: row.get(k) for k in fields}
            out["source_topic_hints"] = json.dumps(out.get("source_topic_hints") or [], ensure_ascii=False)
            w.writerow(out)

def main():
    manifest = []
    total_anomalies = 0
    for batch_code, base_url, expected in BASES:
        rows, anomalies = scrape(batch_code, base_url, expected)
        write_outputs(batch_code, rows, anomalies)
        manifest.append({
            "batch_code": batch_code,
            "source": base_url,
            "rows": len(rows),
            "cancelled": sum(r["source_key_opt"] == "X" for r in rows),
            "anomalies": len(anomalies),
            "explanations": sum(1 for r in rows if r.get("source_explanation_raw")),
            "difficulty_labels": sum(1 for r in rows if r.get("source_difficulty")),
            "difficulty_breakdown": {
                k: sum(1 for r in rows if r.get("source_difficulty") == k)
                for k in ("Easy","Moderate","Hard")
            },
            "sha256_json": hashlib.sha256(
                (OUT_DIR / f"{batch_code.lower()}_unlockias.json").read_bytes()
            ).hexdigest(),
        })
        total_anomalies += len(anomalies)

    (OUT_DIR / "cds_2021_unlockias_manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(manifest, indent=2))
    if total_anomalies:
        raise SystemExit(f"Extraction completed with {total_anomalies} structural anomalies")

if __name__ == "__main__":
    main()
