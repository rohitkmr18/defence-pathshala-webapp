# Question content integrity — 6 October 2026

## Live outcome

The production corpus contains 1,821 active questions across 15 papers. Two guarded repair batches changed 116 distinct questions, with 116 before/after revision records and a private baseline of all 1,821 rows. Every row now passes the structural eligibility check. This does not certify spelling, factual correctness, official answer-key provenance or explanations across the entire corpus.

- All 19 critical audit rows were repaired against original UPSC booklet scans hosted by mirrors. This restores ten blank options, six spreadsheet error cells, contaminated/missing stems and the duplicate climate option. Booklet variants were matched by question content, not question number.
- CDS II 2025 Q83 option A was restored to `0101` from the printed option.
- CDS I 2026 Q89 final answer changed from D to C; option A is `None`. The Government of India former Vice-Presidents register establishes that only Radhakrishnan and Zakir Hussain held both offices. The Set A provisional UPSC key agrees. `official_opt` remains null because this batch did not establish final-key provenance.
- CAPF 2024 Q9 option spellings and `June 21` were restored from the scan.
- Literal `[cite: integer]` extraction artifacts were removed from 95 rows. Surrounding text and line breaks were preserved.

All existing question identities and student attempt/score records were retained. No prior recorded attempt existed for the corrected Q89 at verification. There were 287 historical attempts at that point; none was rescored or assigned invented content versions.

The exact changes and source PDF hashes are in `20261006-source-repairs.json` and `20261006-presentation-repairs.json`. The SQL files are execution records, not pending migrations; their old-value preconditions deliberately prevent replay against already repaired rows.

## Database controls already installed

Migration `20261006055218_question_content_integrity` adds private snapshots, revision history and a persistent review queue. All three private tables use RLS and have no learner grants. The v2 view retains security-invoker behavior, existing joins, existing column order and taxonomy/intelligence fields.

`content_eligible` requires a stem, four nonblank/distinct choices, an A–D key, no spreadsheet-error tokens and a status other than WITHHELD. UNCHECKED means structural eligibility only. SOURCE_MATCHED describes the documented repair fields; it does not certify all answer keys or explanations. Existing AI/taxonomy verification flags were not promoted by these repairs.

`content_version` increases for changed question, option, key or explanation content. Historical attempt versions are null. Revisions preserve original text and correction evidence. The full original baseline is private; it contains question content, not student data.

## Application changes prepared for release

The PR adds import checks before coercion and before any batch writes. CSV reads preserve `None`, fractions and leading zeros. XLSX content cells reject formulas, errors, typed dates/times and formatted numeric values. Date-looking *text* produces a review warning; it is not rewritten automatically. Bulk imports preflight all incoming rows and refuse to overwrite SOURCE_MATCHED, WITHHELD or already revised content with changed stems, choices, keys or explanations.

Practice fetches/counts/filters/distributions enforce content eligibility. Selected saved IDs return a review message if any row is unavailable. Session creation and completion also check eligibility. Full papers require one coherent paper, every expected question number and a complete set; they cannot silently become shortened full mocks. Attempt writes require the displayed content version and use the canonical answer.

These prevention controls become active when both the Next.js and FastAPI changes are deployed. The additive schema and content repairs are already live. Until deployment, the existing application does not enforce the new gate. A five-minute learner metadata cache and any already loaded questions can continue to contain earlier wording; reload/revalidation is part of release acceptance.

## Remaining work in order

| Priority | Work | Owner role | Acceptance evidence |
|---|---|---|---|
| P0 | Deploy the prevention PR to preview, verify authenticated practice/resume/full-paper flows, then release frontend and backend together | Engineering | No broken or shortened full mock; stale versions prompt reload; progress survives a review hold |
| P1 | Reconcile missing paper numbers against final UPSC keys and dropped-question notices | Content lead + subject reviewer | Explicit paper manifests distinguish omitted content from officially dropped questions |
| P1 | Reconcile all 1,139 missing official-key provenance rows | Subject reviewers | Matched exam, booklet, source question number, final key, page/URL/hash and reviewer recorded; unknown keys remain unknown |
| P1 | Compare every CDS II 2025 item with its printed paper, then CAPF 2026 and CDS I 2026 | Content editors + subject reviewers | Stem/options faithful, symbols intact, key and explanation separately checked; each correction has evidence |
| P2 | Review remaining papers, including spelling, initials, tables, matching lists, units, fractions, signs, subscripts and date-like options | Content editors | All 1,821 items pass source comparison; no guessed initial restoration or blanket spelling substitutions |
| P2 | Add review UI, approved paper manifests and staged imports | Engineering + content lead | Editor proposes → reviewer accepts → guarded publish; baseline and rollback preserved |
| P2 | Add student “Report issue” capture and prioritise by attempted-paper traffic | Product + content lead | Reports link to question/version; scoring defects are contained first; review queue visibly closes |

The private review queue currently contains 1,139 OPEN official-key provenance reviews. A missing stored official key is a provenance gap, not proof that the current final answer is wrong.

## Papers needing completeness reconciliation

| Paper | Present / expected printed questions | Missing numbers |
|---|---:|---|
| CAPF 2025 Paper I | 124 / 125 | 98 |
| CAPF 2026 Paper I | 123 / 125 | 41, 103 |
| CDS II 2026 GK | 119 / 120 | 55 |

The current PR holds these three papers as full mocks. Targeted practice remains available for eligible items. Do not fabricate missing rows. If UPSC officially dropped an item, use an approved paper manifest with explicit scoring rules before reopening the mock. Completed historical sessions remain stored; their affected review screen may show a review hold until the paper is reconciled.

## Premium experience release checklist

1. Readability: test direct MCQs, statements, matching lists, chronology and formula-heavy questions on phone and desktop. Bare initials, `None`, `0101`, `+7`, `2/3`, dates and units must survive unchanged.
2. Trust: content, answer-key and intelligence review are separate states. Do not label UNCHECKED or model-derived metadata as independently verified.
3. Fairness: server grades the displayed content version. Any future key correction identifies affected attempts and follows an explicit score-repair decision; never silently rewrite historical scores.
4. Reliability: review holds preserve question IDs, attempts and progress. A retry must not duplicate saved attempts or shorten the expected paper.
5. Prevention: block malformed imports before writing any batch. Keep raw source bytes and matched booklet evidence outside student-facing data.

## Validation

Production verification: baseline 1,821; structural eligible 1,821; revisions/changed questions 116; citation-artifact rows remaining 0; corrected Q89 final C and content version 2; no affected historical Q89 attempts. Private snapshot/revision/queue RLS is enabled.

Offline verification covers reconstructed production schema, private access denial, revision/version behavior, import date/error rejection, leading-zero/None preservation, stale import protection, withheld/stale attempt rejection, session creation/completion and full-paper completeness. TypeScript and production frontend build also pass. Exact commands/results are recorded in the PR. The final check passed 70 practice/learner regression tests, 3 content-integrity tests, 2 migration-ledger tests, and all 33 backend tests. Practice-route lint has no errors and two existing unused-variable warnings.

## Recovery

Use the before/after manifests and `dp_content_private.revisions`. Restore only explicitly changed fields, in a guarded transaction that first compares the current row/version to the recorded after-state. Set a rollback evidence reason so the trigger records the reversal and increments content version. If a newer edit exists, stop and reconcile instead of overwriting it. Never restore all 1,821 rows wholesale or change student attempts as part of content rollback.
