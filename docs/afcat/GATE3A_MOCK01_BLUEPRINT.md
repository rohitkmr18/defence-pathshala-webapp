# AFCAT Full Mock 01 — Gate 3A Editorial Blueprint (v1)

**Status: DRAFT / UNPUBLISHED / NOT APPROVED.** Owner: DP Editorial. This document specifies what to author and audit, not learner-ready material.

## 1. Source hierarchy and representation
1. Indian Air Force AFCAT syllabus: https://careerairforce.gov.in/afcat-syllabus
2. Indian Air Force AFCAT examination instructions: https://careerairforce.gov.in/afcat-examination
3. Applicable 2026 cycle notification: https://www.careerairforce.gov.in/sites/default/files/inline-files/AFCAT-Cycle-02-2026-Notification.pdf
4. DP internal contract: `docs/afcat/FULL_MOCK_01_EDITORIAL_BLUEPRINT.md`

**Official:** English-language objective paper; 100 questions; 120 minutes; maximum 300; +3 correct, −1 incorrect, 0 skipped. Numerical Ability is matriculation-level; the other sections are graduation-level. Four sections: English, General Awareness, Numerical Ability, Reasoning and Military Aptitude.

**DP design choice, NOT prescribed by IAF:** English 30, GA 25, Numerical 20, Reasoning/Military Aptitude 25. These counts are currently enforced by DP's draft AFCAT publication trigger. A future change needs coordinated editorial + schema review; do not alter the split in content alone. Do not claim this mock is an actual or official AFCAT past paper.

## 2. Quantitative composition

| Section | Total | Topic-group allocation (DP slots) |
|---|---:|---|
| ENGLISH | 30 | Reading comprehension 4; cloze 3; error detection 4; sentence completion 3; synonyms/antonyms 4; idioms/phrases 3; one-word substitution 2; sentence rearrangement 3; analogy/homonyms/transformation 4 |
| GENERAL_AWARENESS | 25 | History 3; Geography 3; Polity 3; basic science and technology 4; Environment 2; Economy 2; sports/awards/art/culture 3; Defence/Aviation 3; contemporary current affairs 2 |
| NUMERICAL_ABILITY | 20 | Percentages/ratios 4; time/work/speed 4; profit/loss/interest 3; numbers/series 2; fractions/averages 2; mensuration 2; probability/statistics 2; mixture/alligation 1 |
| REASONING_MILITARY_APTITUDE | 25 | Verbal analogy/coding and logic 8; patterns and sequences 5; original non-verbal visual reasoning 12 |
| **TOTAL** | **100** | **100** |

**Difficulty planning target (DP, revise after pilot):** EASY 25, MODERATE 55, HARD 20. Use cognitive complexity/time-to-solve, not obscure facts, as the determinant. Do not overrule official curricular standards or label items merely by expected correct percentage; there is no pilot item-response calibration yet.

**Visual item quota:** 12 of 25 reasoning items have independently authored and inspected original figure sets. Suggested mix: embedded figures 2, mirror/spatial 2, folding/cutting 2, Venn/spatial sets 2, series/pattern transforms 2, figure matrix/analogies 2. These are **suggested editorial categories**, not official frequencies. Reuse of synthetic QA benchmark SVGs is forbidden.

## 3. Syllabus coverage map
- **English:** Comprehension; error spotting; word/sentence completion; synonym/antonym; cloze; idioms and phrases; analogy; sentence rearrangement; one-word substitution; sentence transformation; homonyms.
- **GA:** Indian history, geography, polity, economy, science and technology, environment, ecology, sports, organisations, personalities, arts and culture, Indian defence, aviation and up-to-date national/international affairs.
- **Numerical:** Fractions, ratios, averages and percentages; profit/loss; interest; time and work; distances/trains/boats; number system and series; HCF/LCM, powers and roots; mensuration and heights/distances; mixtures; elementary probability/statistics. Do not silently substitute a higher-than-matriculation method requirement.
- **Reasoning:** Verbal and non-verbal reasoning; classification, syllogisms, analogy, codes, directions and sequences; spatial transformation and diagrammatic reasoning.

Use the machine-readable `taxonomy.json` as the canonical DP editorial labels, not as a claim that AFCAT publishes subtopic quotas.

## 4. Slot and content freeze rules
- IDs: `AFCAT-FM01-Q001` through `AFCAT-FM01-Q100` reserved **only after editorial approval**. Draft IDs remain `AFCAT-FM01-CAND-*`. Never reuse an approved ID for a revised question; bump content_version for a correction before publication.
- Order: English 1–30; GA 31–55; Numerical 56–75; Reasoning 76–100. An editorial assembly ordering, not an official mandated order.
- Each item: one precise stem, exactly four non-overlapping options A–D, exactly one answer, sourced/independently verified explanation, topic/subtopic, difficulty, type, estimated solve time, reviewer decisions, original/provenance record, source-rights review.
- Any time-bound fact must have an `as_of_date`, retrieval date, stable source link and a decision on when it will become stale. No question should depend on a future event that has not occurred.
- Figure item: four visually inspected options, semantic alt text, mobile rendering check at 320px and 390px, source/asset hash; check mirrored and rotation transforms independently.
- Suggested 120-minute rehearsal: don't manufacture difficulty by making the stem unnecessarily long. Author should estimate time and QA should flag items that exceed their section's expected solving pace.
- Ensure no duplicates or variants are shared across Mock 01, the other four future mocks and twenty sectionals. Exact text equality is insufficient: screen paraphrases, answer equivalence and diagram transformations.

## 5. Existing corpus reconciliation
`content/afcat/prelaunch/full_mock_01_candidates_v0.json` contains 20 **unverified** drafts, by section 6/5/4/5. The remaining 80 slots are not yet authored.
- Existing candidate fields `source_kind=ORIGINAL_DP_AUTHORED` and `editorial_status=DRAFT_UNVERIFIED` are not valid `afcat_questions` database values. Map to `ORIGINAL` and `DRAFT` **only in a reviewed import adapter**, never silently in the authored source.
- Missing required import fields include `pool_type=FULL_MOCK`, `difficulty`, `fingerprint_sha256`, `source_rights_status`, and `content_version` (DB default is 1; explicitly pin it in generated package). `subtopic` may be null but should be populated for useful analytics. Retain the original source/provenance trail as editorial metadata; do not claim schema compliance today.
- Draft questions remain non-importable; no database writes until independent QA is complete.
- At least one of the twenty drafts uses deliberately simple one-fact recall. Independently rate cognitive demand and distractor strength before retaining it; do not rubber-stamp because the key is correct.
- Source/reference and copyright checks are required even for seemingly straightforward factual GA questions.

## 6. Acceptance criteria before Gate 3B authoring expansion
1. Editorial owner signs off section quota, taxonomy, difficulty target and non-verbal artwork scope.
2. A machine validator rejects missing fields, duplicate IDs/options, invalid section and type enums, empty explanations, stale source metadata, broken asset hashes and section/count mismatches.
3. **Independent** subject reviewer recomputes/validates every answer and disputes alternatives; second reviewer adjudicates disagreements.
4. Editorial sampling: 20 existing drafts are reviewed before they can be counted toward 100 approved. Changes never silently overwrite the source records.
5. Publishing remains DISABLED. No staging publication/learner activation until Gates 1/2 acceptance is reopened and passed. Offline drafting and offline QA can continue.

## 7. Delivery batches
- Batch A: independently review 20 existing drafts; assign final taxonomy and difficulty; mark corrections/withdrawals.
- Batch B: author missing 80 according to slot quotas, prioritized by underrepresented topic; create 12 original visual sets.
- Batch C: subject review, independent solution, copyright/originality audit, accessibility check, duplicate screening.
- Batch D: build a **non-published**, machine-validated 100-item package and acceptance ledger for explicit founder review.

## 8. Boundary
This editorial branch is `editorial/afcat-mock01-gate3a`; the frozen Gate 1/2 candidate SHA `91f382826efa9051de745b1e8d31729e9773089a` and PR #87 remain untouched by this branch. Do not merge, publish or migrate.
