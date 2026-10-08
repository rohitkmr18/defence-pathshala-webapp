# DP PYQ Ingestion Engine v1

## Objective

Add historical UPSC PYQs with maximum automation while preserving source fidelity, answer-key authority, canonical taxonomy and auditable intelligence provenance.

Raw/model output must never write directly to learner-facing `public.questions`.

## Pipeline

1. Official source manifest
2. Raw extraction into `dp_ingest.rows`
3. Deterministic structural/text validation
4. Canonical text normalization
5. Official answer-key reconciliation + independent LLM solve
6. Existing-node-first taxonomy mapping
7. Question intelligence generation
8. Independent model audit
9. Deterministic release gate
10. Atomic promotion to production (separate implementation phase)
11. Preview/live acceptance

## First pilot

| Batch | Expected |
|---|---:|
| CAPF-AC 2021 I — General Ability and Intelligence | 125 |
| CDS 2021 I — General Knowledge | 120 |
| CDS 2021 II — General Knowledge | 120 |
| Total | 365 |

CAPF 2021 is the first extraction pilot. CDS I/II follow only after the CAPF pipeline reaches a small exception queue.

## Source contract

Every batch stores the official source URL, source hash once downloaded, source version, prompt versions and model identifiers.

Every row preserves immutable-style raw extraction fields separately from learner-facing canonical text.

## Taxonomy rule

Map to an existing subject/topic/subtopic node first.

A model may populate `taxonomy_new_node_candidate` only when no existing node is defensible. Any proposed new node blocks automatic release.

Do not propagate known legacy aliases. In particular, canonical ingestion should prefer `Science & Technology` rather than creating additional `Science` rows.

## Answer rule

`source_key_opt` is the accepted answer from the declared key source. `key_authority` records whether that source is `OFFICIAL` or `TRUSTED_SECONDARY`.

For CDS I/II 2021, the product decision is to treat UnlockIAS as `TRUSTED_SECONDARY` source-of-truth because an official UPSC key is unavailable. This does **not** relabel the key as official; provenance remains explicit.

`official_opt` is populated only when an actual official key exists.

`llm_opt` is an independent diagnostic solve.

A disagreement sets `key_discrepancy=true` and routes the row to review. The model never silently overrides the official key.

## Release thresholds v1

A row is blocked if any deterministic issue exists, including:

- missing raw or canonical question/options
- missing/invalid official answer
- answer-key discrepancy
- missing taxonomy
- invalid canonical pattern
- difficulty/category mismatch
- extraction confidence < 0.98
- source-fidelity confidence < 0.98
- taxonomy confidence < 0.85
- intelligence confidence < 0.80
- extraction flags
- proposed new taxonomy node
- duplicate production question ID/content hash

A batch is release-ready only when the row count and question-number range exactly match the expected paper and every row is individually release-eligible.

## Human review target

Humans review exceptions, not papers.

Expected review reasons:

- unreadable/ambiguous source extraction
- unresolved official key
- material LLM/key disagreement
- genuinely new taxonomy node
- deterministic validation failure

## Production promotion

Not implemented in the initial schema PR.

Promotion must be idempotent and transactional across the canonical question, release contract and intelligence layer. A failed promotion must leave no partial learner-facing state.

## Acceptance after promotion

Validate on Preview:

- 2021 appears in Explore
- CAPF 2021 and CDS I/II 2021 counts are exact
- subject/topic counts match source rows
- targeted practice returns rows for every visible filter
- full-paper mode returns 125 CAPF / 120 CDS questions
- Check Answer uses the correct final key and intelligence
- no hard-coded year/cycle list hides the new papers
