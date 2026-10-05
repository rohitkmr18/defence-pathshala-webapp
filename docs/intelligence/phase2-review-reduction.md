# Phase 2 deterministic review reduction
Verified against production 2026-10-03 UTC.

## Outcome
- Active questions and canonical v2 rows: 1,821 / 1,821.
- Model Ready: 569 -> 626.
- Review Required: 1,252 -> 1,195 (57 cleared, 4.6%).
- Human Verified: 0. All auto-cleared intelligence remains MODEL_DERIVED and intelligence_verified=false.
- Difficulty-category repair: 267 Easy labels changed to Moderate. Scores and other question/intelligence fields unchanged.
- Database constraint now implements Easy <=20, Moderate >20 and <=50, Hard >50 on continuous scores.

## Clearance rule
All structural checks pass, existing content verified_status is exactly Verified, stored official answer is A-D and matches final_opt, key_discrepancy=false. Content provenance is inherited from existing database status; this is NOT a new independent official-source or semantic verification. Missing keys, X keys, discrepancies, incomplete options and category drift never auto-clear.
The migration changes only review/readiness flags, keeps intelligence_verified and confidence unchanged, and synchronizes release review flags. Audit snapshots precede every promotion.

## Remaining queue (mutually exclusive primary actions)
- 1,141 BULK_OFFICIAL_KEY_RECONCILIATION.
- 45 ANSWER_DISCREPANCY_REVIEW.
- 9 STRUCTURAL_REPAIR.
Full corpus contains 10 incomplete option sets, including one outside the flagged queue.
Actions prioritize structural repair, then discrepancy, then key reconciliation. Other concerns can coexist; re-query after resolving the primary action. There is no promise that 1,141 records are correct or will auto-clear.

## Next bulk process
Group by exam/year/cycle/paper; obtain authoritative UPSC keys and original papers. Verify booklet series and question-order mapping before joining by question number. X must be reconciled against source evidence: unknown placeholder versus officially deleted question. Never infer its meaning.
Store document URL/hash, booklet series, mapping version and row-level evidence. Import to staging and dry-run; do not overwrite production answers on mismatch. Compare final answer and explanation with the reconciled key; disagreement becomes an exception queue. Model agreement alone cannot verify correctness.
Difficulty and taxonomy remain model-derived; structural validation does not establish educational correctness. Adaptive features need their own trust threshold.

## Reproduction and access
Production migration versions: 20261003191321 and 20261003191601. First migration is repeat-safe for previously cleared rows; second is a one-time repair migration.
public.v_dp_intelligence_review_triage recomputes checks on current data. View uses security_invoker, client grants revoked; service_role has read access.
Snapshots reside in dp_quality, client access revoked, RLS enabled, service_role-only SELECT policy.
Security advisor returns the prior six public-table policy information items and prior password warning, with no additional finding.

## Verification
SQL checks confirmed row parity, review flag parity, zero human promotion, unchanged question content in clearance, and category-only changes in repair.
Run scripts/check-intelligence-review-contract.sql against the target database after migration.
PR #14 also had literal newline escapes in two TypeScript files; corrected.
Production database migration is applied. Repository/frontend changes remain on PR #14 pending checks and merge.

## Recovery
Use dp_quality.review_auto_clear_log for pre-change intelligence/release flags. Restore only affected review/readiness fields after checking the current row has not received later review changes.
Use dp_quality.difficulty_category_repair_log for category history. Reverting categories requires restoring the matching prior category constraint atomically; do not restore incompatible labels alone.
