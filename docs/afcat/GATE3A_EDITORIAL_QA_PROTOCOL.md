# Gate 3A — AFCAT Question Editorial QA & Acceptance Protocol

**Scope:** offline / unpublished question production. Applies to Full Mock 01 (100 items), then to 5 mocks and 20 sectionals. **No approved questions or learner publication are implied by this document.**

## Workflow and reviewer separation

`DRAFT_UNVERIFIED → FACT_CHECK → KEY_CHECK → LANGUAGE_REVIEW → (VISUAL_REVIEW if applicable) → APPROVED_FOR_PACKAGING`

Alternate routes: `REQUIRES_REVISION` returns to author with a new version and re-review; `REJECTED` is permanently withheld; `APPROVED_FOR_PACKAGING` is an **editorial status only**, not a DB publication command.

- **Author:** creates original stem/options/key/explanation and provenance, estimates time and difficulty; cannot self-approve.
- **Subject reviewer (independent):** solves the question *without seeing the proposed key first*, documents derivation/source, checks all options for alternative keys.
- **Language editor:** grammar, precision, accessibility, English-only consistency, absence of hidden assumptions.
- **Visual QA reviewer (if any):** figure consistency, visual invariance, options, SVG/mobile render, description and licensing.
- **Final editor:** arbitrates disagreements, records a specific approval decision plus version and sources; never substitutes an AI self-score for human review.

## Weighted rubric (100 points, secondary to hard gates)

| Dimension | Points | Verification question |
|---|---:|---|
| Factual/mathematical correctness | 25 | Can a reviewer reproduce and independently source the result? |
| Single unambiguous correct option | 20 | Are distractors indisputably wrong under the stated assumptions? |
| Syllabus relevance and appropriate standard | 15 | Does it map directly to official AFCAT topics, with numerical at matriculation level? |
| Distractor plausibility and discrimination | 10 | Are distractors plausible without being misleading or ambiguous? |
| Explanation quality | 10 | Is reasoning teachable, complete and sufficient to exclude alternatives? |
| Language, clarity and examination readability | 8 | Can a learner parse it without irrelevant text or accidental clues? |
| Difficulty calibration / solving time | 5 | Is the rating internally consistent and the time demand reasonable? |
| Provenance, copyright and currency | 5 | Are sources, rights and as-of dates verifiable? |
| Accessibility and rendering | 2 | Can the item be read and operated on small screens? |
| **TOTAL** | **100** | |

**Provisional thresholds:** 90–100 editorial candidate PASS (only if all hard gates pass); 75–89 revision; below 75 reject/re-author. These are DP-internal rubric thresholds, NOT statistical item-quality estimates. A perfect score cannot override any hard gate.

## Hard gates: every one mandatory

1. **Correct answer:** exactly one valid key among A–D; independent solution supports it. Reject multiple reasonable interpretations, overlooked units, unprovided assumptions or conditional answers.
2. **Scope:** direct syllabus mapping; original, non-official wording; no trick questions based on controversy or narrow personal preference.
3. **Options:** exactly four, mutually exclusive, meaningful, no duplicate paraphrases, no answer-length leakage or answer-letter bias in assembled paper.
4. **Evidence:** retain authoritative reference, retrieval date, fact validity date for live/current events; do not accept an unattributed web summary as a source. Prefer primary Indian government/IAF, official texts, published academic references or reputable institutions.
5. **Numerical:** second calculation by a separate method or reviewer; enforce units, rounding and answer uniqueness; check that a hidden shortcut does not make another option valid.
6. **Visual:** independent recomputation of transformations; four distinct visible alternatives; scale/rotation/mirror labels explicitly correct; 320px and 390px screenshot inspection; non-decorative figure alt text; original asset/source hash.
7. **Rights and deduplication:** no unlicensed reproductions of official papers, textbook passages, commercially sourced images or third-party question sets; use similarity checks for stems, concepts, distractors and mirrored/rotated figures across all final 1,000 items. Any suspected duplicate returns to review.
8. **Machine validity:** source JSON parses and matches the editorial taxonomy; valid IDs/enum types; exact 4 option keys A/B/C/D; explanation not empty; no malformed characters; asset paths/hashes exist.
9. **Import safety:** database adapter **must reject** missing `difficulty`, blank `source_rights_status`, absent fingerprint hash, or non-approved editorial status; do not simply load the existing candidate JSON directly into `afcat_questions`.
10. **Security/release:** answer keys and explanations must never be exposed to clients before authoritative submission; content publication or learner activation is separate, explicit authorization after deferred Gate 1/2 acceptance is completed.

## Editorial review ledger (one entry per version)

```json
{
  "external_id": "AFCAT-FM01-CAND-001",
  "version": 1,
  "section": "ENGLISH",
  "topic_key": "synonym_antonym",
  "difficulty": "EASY",
  "author": "assigned-editor",
  "subject_reviewer": "independent-reviewer",
  "language_reviewer": "assigned-editor",
  "visual_reviewer": null,
  "reviewed_at": null,
  "independent_key": null,
  "proposed_key": "B",
  "source_urls": [],
  "source_retrieved_on": null,
  "rights_status": "REVIEW_REQUIRED",
  "rubric": {
    "correctness": null, "single_key": null, "syllabus": null,
    "distractors": null, "explanation": null, "clarity": null,
    "difficulty": null, "provenance": null, "rendering": null
  },
  "hard_gate_failures": [],
  "decision": "DRAFT_UNVERIFIED",
  "comments": "No independent editorial sign-off yet"
}
```

Actual name/role/time must be captured at review time, not invented. A blank review ledger is more accurate than a claimed PASS.

## Assembly/acceptance matrix

| Gate | Acceptance condition | Current |
|---|---|---|
| Q1 Corpus completeness | 100 distinct items, quotas 30/25/20/25 | 20 drafts, 80 absent |
| Q2 Independent answer review | 100 independently validated answer keys | BLOCKED |
| Q3 Rubric pass | All 100 scores ≥90, no hard-gate failures | BLOCKED |
| Q4 Visual inspection | 12 original visual questions + 320px/390px checks | BLOCKED |
| Q5 Source and copyright | Every factual/date-sensitive claim referenced and rights cleared | BLOCKED |
| Q6 Deduplication | Exact and semantic scans across complete 1,000-item portfolio | BLOCKED |
| Q7 Import/package | Schema-conforming non-published package, hash+version pinned | BLOCKED |
| Q8 Publication | Separate founder approval plus outstanding auth/security acceptance | NOT AUTHORIZED |

## Editorial sample review findings (NOT approvals)
- Existing draft set: 20 items distributed 6/5/4/5 across English, GA, Numerical, Reasoning.
- Existing draft uses editorial `ORIGINAL_DP_AUTHORED` vs DB `ORIGINAL`; `DRAFT_UNVERIFIED` vs DB `DRAFT`. Requires explicit adapter, not silent metadata replacement.
- Candidate 018 includes option text `VHM F`, an apparent spacing artifact in a distractor. Verify whether intended before approval; preserve draft evidence.
- Candidate 020 states its conclusion directly as one of its answer options; this can be valid as a logical consequence but is potentially trivially obvious and deserves distractor/cognitive-demand review.
- The current bundle has **zero independent reviewer signatures**; none is marked approved.

## Next editorial work order
1. Build a static validator and blank review ledger for the 20 drafts, without changing their status.
2. Subject-review the 20 original drafts with independent answers, citations and rubric; publish a defects register.
3. Author the 80 missing original items and 12 original figure packages according to taxonomy; keep as drafts.
4. Repeat independent key/language/image review and nonpublished package validation.
5. Return a founder review package listing passing/rejected/replaced IDs and unresolved content risks.

**Do not start publishing tests. Do not change frozen AFCAT release candidate or PR #87 as part of these editorial tasks.**
