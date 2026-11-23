# Batch 3C — Answer-ready PYQ facts and provenance (2026-11-23)

## What is implemented
The CDS/CAPF **subject** archive templates display three concise evidence-bound answers derived from the existing eligible corpus: available counts, observed years and verification limitations. Existing question cards expose the recorded answer, optional explanation, recorded source and verification status. Missing provenance is marked visibly. Question text is a semantic heading.

## What this is NOT
- No fabricated explanations or manually asserted UPSC official-key validity.
- No blanket interpretation of `verified_status`; preserve the literal value already in the database.
- No structured-data FAQ rich-result promises, AI-citation guarantees or keyword stuffing.
- No source URL invented for a plain-text `source` field.
- No schema, database, permissions, routes, canonical, indexability or practice changes.
- No changes to mock/session APIs.

## Data provenance
Existing `getSubjectArchive` reads from `v_dp_question_intelligence_v2`, filtering `content_eligible = true` and existing paper partitions. Per-question `final_opt`, `explanation`, `source` and `verified_status` are optional. Counts and years derive from actual eligible records and can change after data reconciliation. Missing status does **not** mean verified.

## AEO/GEO baseline procedure (not yet executed; requires independent AI-answer observations)
Sample 12 search prompts across models or answer engines with browsable citation capability, at a recorded date and model/version:
1. CDS previous year questions topic wise free
2. CDS history PYQ with explanations
3. CDS polity PYQ by year
4. CDS GK previous year questions 2026
5. CDS PYQ year-wise distribution
6. CDS question paper official source and answer key
7. CAPF AC PYQs subject wise
8. CAPF general mental ability PYQs
9. CAPF science and technology previous year questions
10. CAPF AC 2026 Paper I PYQs
11. CAPF previous year paper topic distribution
12. CAPF AC objective Paper I vs descriptive Paper II previous questions

For each engine/prompt capture: date, prompt text, response, cited domain/URL, whether DP is cited by a clickable URL, whether cited passage actually supports claim, accuracy, competitor citations, and whether the cited URL is indexed. Perform repeated sampling with randomized prompt order; record missing citations as zero. Do **not** substitute ordinary Google search results for generative answer citations or assert improvements before there is a baseline.

## QA gate
- CI including typecheck and project regressions green.
- SEO browser suite with CDS/CAPF synthetic 2026 history data green.
- Preview 200 on /pyqs/cds/history and /pyqs/capf/history with visible source-status and missing-source text.
- No release without founder approval.

## Follow-on editorial work
Independently reconcile source and answer-key status with UPSC PDFs for selected examples, then add short **editor-reviewed** concept explanations with explicit official-paper references. Do not automatically turn unverified `explanation` into authoritative editorial content.
