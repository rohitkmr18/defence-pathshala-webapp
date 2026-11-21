# CDS GK Mock 01: production rollout record (2026-11-21)

Applied to the production Supabase project (`afhwegrxnvgsqbqadvwr`) on 2026-11-21 at the founder's request.

## What was applied
| Item | Result |
|---|---|
| Migration `mock_engine_foundation` | applied as production version `20261121101042`; SQL identical to `supabase/migrations/20261119185324_mock_engine_foundation.sql` |
| Migration `mock_finalize_fix_column_conflict` | applied as production version `20261121101054`; SQL identical to `supabase/migrations/20261119185348_mock_finalize_fix_column_conflict.sql` |
| Schema parity with staging | function bodies, policies, columns, learner grants, RLS flags and `mock_finalize_session` execute rights hash-identical |
| Content | 120 `CDS-GK-M01-V1-Q001..Q120` questions (all `APPROVED`, content version 1) copied from staging; per-chunk md5 aggregates of every column matched staging |
| Test | `CDS-GK-M01-V1` "CDS GK Full Mock 01", 7200 s, 120 Q, +15/-5 over 18 = 100.00 marks, status `PUBLISHED`; item order hash matches staging |
| Dummy content | none (`CDS-GK-M00-DEMO` and all `DUMMY-*` rows were never loaded) |
| Scoring probe | in a rolled-back transaction: 50 correct, 10 wrong, 60 skipped scored 38.89; no probe rows remain |
| Learner access | anon: SELECT published `mock_tests` only; authenticated: SELECT own sessions/responses/results only; no access to `mock_questions` or `mock_test_items` |

## What is still off (learner-invisible)
- `NEXT_PUBLIC_MOCK_CDS_ENABLED` unset: nav entries, home menu item and practice card are hidden.
- `MOCK_PRODUCTION_ENABLED` unset: `/api/mock/*` fails closed against production.

## To go live
1. Set `MOCK_PRODUCTION_ENABLED=true` (Vercel production environment; never preview).
2. Set `NEXT_PUBLIC_MOCK_CDS_ENABLED=true` and redeploy (build-time variable).
3. Sign in as a test learner, take the mock end to end once, and confirm the result page.

## Rollback
Unset both variables and redeploy to hide the feature. To retire the test: `update public.mock_tests set status='RETIRED' where code='CDS-GK-M01-V1'` (allowed by the engine). Dropping the tables is not needed and is blocked by foreign keys once any learner attempt exists.

## Known content notes (from the Mock 01 publisher approval)
Q37, Q42 and Q116 carry the accepted exceptions listed in `scripts/cds_gk_m01_publisher_approval.json`.
