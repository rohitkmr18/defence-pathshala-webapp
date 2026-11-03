# AFCAT Mock 01 — Gate 3A Editorial Specification
Status: EDITORIAL PLANNING ONLY / NOT APPROVED / DO NOT IMPORT OR PUBLISH
Prepared: 2026-11-03
Companion manifest: `content/afcat/prelaunch/full_mock_01_slot_manifest_v1.json`
Existing source draft: `content/afcat/prelaunch/full_mock_01_candidates_v0.json` (20 drafts)

## Release separation and scope

This document starts editorial planning, **not** the previously deferred Gates 1 and 2 release acceptance. Work is confined to `feature/afcat-editorial-gate3a` and non-published content files. PR #87 remains draft; no `main` merge, production migration, staging publication, learner account or paid test activation is authorized. Technical acceptance must be reopened before learner-facing release.

## Evidence hierarchy

1. Current official AFCAT notice/syllabus wins for exam mechanics and syllabus boundaries: https://www.careerairforce.gov.in/sites/default/files/inline-files/AFCAT-Cycle-02-2026-Notification.pdf (section 8); https://afcat.edcil.co.in/assets/images/guidelines/download/afcatsektsyllabus.pdf.
2. Repository blueprint `docs/afcat/FULL_MOCK_01_EDITORIAL_BLUEPRINT.md` defines DP's **proposed** topic allocation, not an official sectional distribution.
3. Archived/memory-based papers can inform style only after provenance and copyright review; they are not automatically official question papers or sources of a mandatory topic weighting.

Official mechanics: 100 English-language MCQs, 120 minutes, maximum 300 marks; +3 correct, −1 incorrect, zero unattempted. The official syllabus names English, General Awareness, Numerical Ability and Reasoning/Military Aptitude; Numerical Ability is matriculation standard, other topics graduation standard. Official score normalisation between shifts is **not** part of DP's fixed-form practice scoring. No official fixed 30/25/20/25 sectional allocation is claimed.

## DP Mock 01 draft allocation (100 slots)

| Section | Count | Group allocations |
|---|---:|---|
| English | 30 | Reading comprehension 4; cloze 3; error detection 4; sentence completion 3; synonym/antonym 4; idioms 3; one-word substitution 2; sentence rearrangement 3; analogy/homonyms/sentence transformation 4 |
| General Awareness | 25 | History 3; geography 3; polity 3; basic science and technology 4; environment 2; economy 2; sports, organisations, arts and culture 3; defence/aviation 3; current events 2 |
| Numerical Ability | 20 | Percentages and ratios 4; time/work/distance 4; profit/loss/interest 3; number system/series/HCF/LCM 2; fractions/averages 2; geometry/mensuration 2; probability/statistics 2; mixture/alligation 1 |
| Reasoning/Military Aptitude | 25 | Verbal logic/analogies/coding/directions 8; numerical/alphabetic patterns 5; original non-verbal visual reasoning 12 |
| TOTAL | **100** | 100 independently reviewed distinct items |

### Coverage safeguards

- **English:** one original passage with four independently answerable comprehension items; one cloze passage with three blanks. Reuse of a passage within its own test group is permitted, but every item has its own unique answer and rationale. Grammar questions must specify the convention when variants could legitimately differ.
- **GA:** distribute questions across time periods/regions, and include national/international organisations, personalities, sports, culture and defence—not just polity/geography. The official syllabus is wider than any one mock. Current affairs questions need as-of dates, current authoritative URLs, and an expiry/revalidation date. Aviation items must avoid operationally sensitive material.
- **Numerical:** include fractions, HCF/LCM, roots, powers, heights/distance and data summaries across the 20 slots where plausible; do not present the chosen grouping as an exclusion of official subtopics. Every calculation must be independently solved and precision/units checked.
- **Reasoning:** 12 original visual tasks with **12 unique stimuli** and four reviewed options each; test mirror-image orientation, paper folds, embedded patterns, spatial transformations, Venn classification and analogous approved non-verbal mechanisms. Existing benchmark SVGs are fixtures **not available for copying**.
- **Difficulty (editorial targets, not calibrated):** 30 foundation, 50 standard, 20 challenge, distributed by section in the companion manifest. Every rating remains provisional until timed learner calibration; graduation/matriculation levels are not interpreted as fixed easy/hard tiers.
- **Keys:** target approximate answer-key balance (20–30 A/B/C/D each); never alter a true answer or weaken distractors to force balance. Avoid long runs of one key and accidental cueing.
- **Time burden:** 120 minutes total. During editorial pilot, assess whether passages and visual problems create a disproportionate reading burden; do not promise rigid per-section timings.

## Item metadata contract

Canonical editorial record (not yet a database migration):
- `external_id`: unique stable identifier, immutable once assigned; `mock_id`, `slot_id`, `section`, `topic`, `subtopic`, `skill`, `cognitive_operation`, `difficulty_target`.
- `stem`: UTF-8 text and optional vetted `assets[]`; `options`: exactly four A/B/C/D, no duplicate/semantically equivalent choices; `correct_option` one of A/B/C/D; `explanation`: worked and discriminating rationale; `distractor_rationales` for distractors where useful.
- `source_kind` = `ORIGINAL_DP_AUTHORED`; `source_evidence[]` = citation title, issuing institution, URL, accessed-at and exact claim supported; `as_of_date` and `recheck_on` for time-sensitive claims.
- `asset_manifest[]`: original SVG/PNG/WebP asset ID, accessible alt, size, license, hash, QA evidence; maintain immutable reviewed figure and option order.
- `content_version`, `author_id`, `fact_reviewer_id`, `solution_reviewer_id`, `copy_reviewer_id`, review timestamps and `review_log[]`.
- `editorial_status`: DRAFT -> FACT_REVIEW -> SOLUTION_REVIEW -> TECHNICAL_REVIEW -> APPROVED_EDITORIAL -> PACKAGE_READY; REJECTED or NEEDS_REVISION as side paths. Author may not approve own question. `APPROVED_EDITORIAL` is not `PUBLISHED`.
- Avoid storing confidential keys or assigning Supabase IDs in editorial drafts. Convert to database row shape only in a separate import-preparation artifact after independent QA.

## Scoring rubric per item (0–4 each; 7 criteria, maximum 28)

| Criterion | 4/4 requirement | Hard reject |
|---|---|---|
| Factual validity | Verified from trustworthy primary evidence or reproducible reasoning | Incorrect, untraceable, obsolete claim |
| Key uniqueness | Exactly one indisputably correct answer | Multiple defensible keys or no key |
| Explanation | Independently reproducible, addresses decisive logic and key distractors | Circular or factually flawed explanation |
| Syllabus fit | Direct syllabus/topic mapping and appropriate standard | Off-syllabus or gratuitously advanced |
| Distractor quality | Plausible, parallel, non-trivial and mutually distinct options | Giveaway wording, duplicated options |
| Language/accessibility | Precise grammar, usable on small screens and screen readers | Misleading ambiguity or inaccessible visual |
| Originality/provenance | Original phrasing/figure and auditable sources/license | Copied protected paper, unlicensed asset |

A candidate passes item editorial QA only if **no hard reject**, each score >=3/4 and total >=24/28, with distinct fact and key reviewers and written sign-off. Rubric values are DP policy, not an official AFCAT scoring standard.

## Release-level quality gates

- Precisely 100 assigned slots; sections = 30/25/20/25; all unique IDs; exactly four options and a unique correct key; no missing/placeholder assets.
- 12 reviewed and distinct visual stimuli; four visually distinguishable alternatives each; alt text must not reveal the key.
- All calculations independently recomputed (record working); fact claims and current-affairs dates sourced; 100/100 evidence and review trails present.
- Exact/normalised text duplicates, near semantic duplicates and perceptual figure duplicates screened against pilot, other DP drafts and planned 1,000-question bank; similarity findings sent for manual resolution.
- Key distribution, difficultly distribution, reading-time and section coverage audited without forcing misleading conformity.
- Render checks at 320px, 390px, desktop; mathematical notation, line breaks, image crop, keyboard order and assistive text.
- Generate an immutable manifest checksum once approved; editorial revisions require version increment and re-review.
- No import, publishing, keys served to unauthenticated clients or production use until independent security/regression acceptance reopens and passes.

## First-pass audit of existing 20 drafts

Source inventory: English 6, GA 5, Numerical 4, Reasoning 5; **zero visual reasoning assets**. All have `DRAFT_UNVERIFIED` and `requires_independent_review=true`. Surface-level reading suggests plausible solutions, but **none has independent verified key, provenance and review log**. Draft 003 (neither...were) and 006 (mandative subjunctive) especially need grammar-standard/ambiguity review; no automatic approval. Draft 007 requires precise citation to Article 15(1) and the 'citizens' qualification; draft 010 and all future historical claims need primary/credible references. These are review prompts, not defect verdicts.

## Work packets and responsibilities

1. **WP-A:** Lock slot manifest and primary-source policy; approve DP allocation or document changes.
2. **WP-B:** Review the 20 existing drafts with separate key and fact reviewers; record disposition and assign to manifest slots only if passing.
3. **WP-C:** Author remaining 80 distinct original questions (plus original figure assets) in batches of at most 20, preserving draft status.
4. **WP-D:** Run automated schema, duplicate, count, key, readability, asset, licensing and hash checks, then independent human review.
5. **WP-E:** Prepare non-published import package; hand it to a separate release acceptance exercise. No staging content publication during this workstream.

## Decision / risk register

- Editorial 30/25/20/25 weighting needs founder approval as a proposed mock blueprint; official IAF does not fix it.
- 12 visuals is a DP quality aspiration, not a published AFCAT requirement.
- 20 preexisting questions and absence of references mean 0 currently editorial-approved items.
- Test-player final-commit authenticated/cross-user acceptance was deferred; that hold remains in force for any learner-facing release.
