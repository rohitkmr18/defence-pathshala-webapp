# Batch 3D — Evidence audit and release gate (23 November 2026)

## Scope and status
**Read-only source/database investigation. No production or staging database mutations.**
Issue [#202](https://github.com/rohitkmr18/defence-pathshala-webapp/issues/202) is a **P0 student-answer-integrity defect**, not an SEO tweak. The task should block broad claims that every eligible PYQ answer is officially verified.

### Evidence 1 — Official answer key
UPSC CAPF AC 2025 General Ability & Intelligence official key:
https://www.upsc.gov.in/uploads/2026/08/AnsKey-CAPFACs-Exam-2025-GAI-110826.pdf

UPSC extracted PDF text states: **Series A, 125 questions, 1 dropped, 124 scored**; question **98 = X**. Series B Q23 = X; C Q103 = X; D Q48 = X. This is a dropped question, NOT answer option X. The screenshot request for the official PDF failed due to a cache miss; **a human should also visually inspect the original key** before editing permanent records.

### Evidence 2 — Production read-only SQL
Queried `public.v_dp_question_intelligence_v2` in production project `afhwegrxnvgsqbqadvwr` using SELECT only, filtered `content_eligible=true`. All 125 CAPF-AC 2025 Paper I stored answer positions were compared to the transcribed Series A key using an authorized read-only SQL join. **122 entries match and 3 disagree**: Q62 official A versus stored C, Q98 official X (dropped) versus stored C, and Q108 official A versus stored C. The first 20 match exactly 20/20. `CAPF_2025_P1_098` stores `final_opt='C'`, `verified_status='Verified'`, source `DP reconstructed from UPSC CAPF 2025 dropped item; NCERT...`. A publicly indexed DP Science page describes the question as *reworded*, contradicting its presentation as an unchanged official PYQ.

This comparison does **not** establish all 125 question texts, series alignment or explanations as verified; it is a key-position comparison, not source-booklet text matching. Do not auto-rewrite historical scores.

### Evidence 3 — Editorial-status completeness vs official checking
Production status groupings observed:
- CAPF 2025 Paper I: **125 Verified**; Q98 still incorrect for the official dropped key.
- CAPF 2026 Paper I: 114 Verified, 11 Needs Review.
- CAPF 2024, 2023 and 2020 Paper I: 125 Draft per year.
- CDS 2025 GK: 237 Verified, 3 Needs Review; CDS 2026 GK: 220 Verified, 20 Needs Review.
- CDS 2024, 2023 and 2020 GK: 240 Draft per year.

Every row in these selected exam-year groups had populated `source`, `explanation` and A/B/C/D `final_opt`. **Presence of fields is not independent official-key reconciliation.**


### Editorial refinement: these are intentionally modified practice questions
Full production question text and explanations establish intentional changes:
- Q62: DP adds the qualifying words **“of correct time”**; its Option C is explained as 19:55 for the altered scenario.
- Q98: UPSC dropped the printed question; DP replaces statement 1 and offers a new Option C.
- Q108: DP rewrites answer option C to accurately describe hysteresis-loop energy loss.

**Important: 122 matching official key positions and 3 differing positions do NOT imply 3 conceptually wrong DP answers.** The 3 questions have been adapted, so the core integrity problem is inclusion in a purported official PYQ corpus and potential marking in official-mode attempts. Never replace Option C with official A without restoring and independently checking original question wording and option order. Separate adapted practice from verbatim official PYQs.

Read-only downstream impact: Q62 has 1 practice attempt and occurs in 1 practice session, Q98 occurs in 1 practice session but has no recorded answer row, and Q108 has no rows in those inspected tables. These are database rows, not confirmed unique learners.

## Operational recommendation
1. **P0**: Editorial QA inspects Series A question paper and the three adapted DP copies. Reclassify adapted examples, correct any truly verbatim official versions separately, and review scoring as a coordinated staging change, not a blind `final_opt` update.
2. Visually verify the manually transcribed 125-item CAPF 2025 Series A key and booklet option text, prioritizing Q62, Q98 and Q108, then reconcile every recorded question and dropped item. Extend to CDS and other years with **their own** official keys and cycle/series metadata.
3. Public pages and practice APIs must not treat adapted/reconstructed questions as verbatim official UPSC PYQs, and should not score a dropped item against students.
4. Preserve existing historical attempt records and publish clear treatment of deleted/reclassified items.
5. After correction and staging acceptance, request founder approval for a **separate remediation PR or carefully controlled data migration**.

## Reproducible spot-check
`node --test scripts/test-capf-2025-key-audit.cjs`

Optional authorized JSON export can be checked with:
`node scripts/seo/capf-2025-series-a-audit.cjs /secure/local/authorized-rows.json`

All 125 Series A answer positions are transcribed into the audit script; the PDF screenshot failed so human visual cross-check and matching each printed booklet question/option to DP are still required before any production data edits.

## GEO/AEO measured baseline — **NOT YET MEASURED**
The 12-prompt benchmark from `docs/seo/batch3c-aeo-geo-provenance-20261123.md` remains the canonical evaluation set. No cross-model citation-capable browsing sessions are available in this workflow. Ordinary public web search is **not equivalent to** AI-answer citation measurement.

Minimum evaluation log fields:
`run_date_utc,engine,model_version,prompt_id,prompt_text,raw_answer,mentions_dp,dp_clickable_citation_urls,all_citation_urls,answer_factual_issues,citation_supports_claim,reviewer,notes`.

Do not backfill missing observations as zero. Label them `unmeasured`. Run three sessions per prompt/engine, randomize order, independently verify URLs and supporting cited claims, and capture prompt/engine version/date. Later calculate citation rate from **completed, valid** observations only.

## No-go criterion
**Do not merge a change that asserts every `Verified` database answer is UPSC-officially reconciled.** The discrepancy in Issue #202 disproves that shortcut.
