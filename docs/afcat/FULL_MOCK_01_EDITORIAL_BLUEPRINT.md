# AFCAT Full Mock 01 — Editorial Pilot Contract

**Status:** BLUEPRINT ONLY. Nothing in this document is an approved or importable exam question.

## Source of truth
Official scheme: https://afcat.edcil.co.in/assets/images/guidelines/download/afcatsektsyllabus.pdf
Official Indian Air Force syllabus: https://careerairforce.gov.in/afcat-syllabus

- Official: 100 questions, two hours, +3 correct / -1 wrong / 0 unattempted, English language.
- Official: English, General Awareness, Numerical Ability, Reasoning and Military Aptitude.
- **Editorial, not officially prescribed:** DP's initial fixed 30 English / 25 GA / 20 Numerical / 25 Reasoning distribution. Revise before launch if recent official reference material indicates a more representative split.
- Official: Numerical Ability at matriculation level; other subjects at graduation level.

## DP pilot blueprint (100 distinct original questions)

| Section | Count | Editorial topics and slots |
| --- | ---: | --- |
| English | 30 | Reading comprehension 4; Cloze 3; error spotting 4; sentence completion 3; synonyms/antonyms 4; idioms/phrases 3; one-word substitution 2; sentence rearrangement 3; analogy/homonyms/transformation 4 |
| General Awareness | 25 | History 3; Geography 3; Polity 3; Science & Technology 4; Environment 2; Economy 2; Sports/Awards/Art/Culture 3; Defence & Aviation 3; contemporary current events 2 |
| Numerical | 20 | Percentages/ratios 4; time-work-speed 4; profit-loss/interest 3; number systems/series 2; fractions/averages 2; elementary mensuration 2; probability/statistics 2; mixture 1 |
| Reasoning | 25 | Verbal reasoning, analogies and coding 8; patterns/series 5; visual transformations, embedded figures, paper folding, Venn and spatial problems 12 |

**Visual questions:** exactly 12 original SVG-backed reasoning questions in this pilot, each with unique stimulus and four inspected options. The existing 12 diagram benchmarks are testing fixtures and MUST NOT be copied into the scored corpus.

## Question schema/QA gates
Each authored question must have:
- Globally unique external ID and source provenance `ORIGINAL_DP_AUTHORED`.
- One precise unambiguous stem, exactly four options, one verified correct option, and a worked explanation that rules out distractors where appropriate.
- Section, topic, difficulty, content version, and review trail.
- Plain UTF-8 text (no auto-date conversions, clipped initials or unintentionally normalized spelling).
- For math: independently recomputed result, units/rounding reviewed.
- For GA/current affairs: as-of date and at least one retrievable authoritative source; avoid speculative future claims.
- For figures: semantic alt text plus editor-reviewed unambiguous geometry, proportions, line thickness and expected transform.
- Automated duplicate, near-duplicate and image-equivalence checks across *all* 1,000 final questions, not just the pilot.
- Independent editorial PASS and machine validation before `APPROVED` or `PUBLISHED`. No auto-approval.
- Review of copyright/licensing; do not represent model-created content as official AFCAT PYQs.

## Editorial sequence
1. Author first 20 diverse original questions, including two verified visual figures, in a non-published candidate package.
2. Run question-level editorial/answer-key QA and rendering against staging.
3. Expand to the remaining 80; repeat QA and original source audit.
4. Publish the 100-question pilot to staging only; test actual learner attempt.
5. Once pilot accepted, manufacture the remaining 900 questions in audited 100-question releases.

## Staging/production separation
Only the existing synthetic QA set is in staging today. Keep this blueprint and all authored candidates unpublished until verified. No production writes or `main` merge before final product acceptance.
