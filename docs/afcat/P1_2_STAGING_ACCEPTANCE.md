# P1.2 AFCAT isolated data foundation — acceptance plan

## Scope
- Proposed migration: `supabase/migrations/20261023131000_afcat_p12_isolated_foundation.sql`.
- Six new `public.afcat_*` tables. Existing CDS/CAPF questions, attempts, sessions and read models are unchanged.
- Shared identity via `auth.users`, distinct AFCAT session and response FKs.
- Two non-overlapping pools: 500 sectional questions + 500 full-mock questions, 20 sectionals and five full mocks.
- Read access: published test catalogue; authenticated learner sees own session/response records only. Question answers, test items and assets are server-only.

## Deployment rules
1. PR review and SQL parse/static analysis first.
2. **Do not execute on production from this PR.**
3. Test against an isolated staging Supabase project. Confirm staging is not wired to production before any write.
4. Validate role grants + RLS using actual anon, learner A, learner B and elevated server roles.
5. Verify that the intended internal server routes can access the tables, but clients cannot read answer keys or question assignments.
6. Application API / storage policy / visual renderer are **not part of P1.2**.
7. Explicit production release approval and migration-ledger check required after staging acceptance.

## Required scenario tests
- Create question in sectional pool; attach only to matching sectional test.
- Reject cross-pool and wrong-section assignments.
- Reject unapproved or mismatched-version question assignments.
- Reject duplicate question ID in any second test (including five full mocks).
- Reject publishing a test with missing positions, gaps, unapproved content, or unexpected count.
- Reject full-mock publication lacking any of the four sections.
- Verify a published test cannot add/change/delete item assignments (note: DELETE needs separate trigger before release).
- Verify a published question cannot change, including corrections and answer key.
- Verify artwork changes cannot invalidate a frozen published question (needs asset-freeze trigger).
- Verify session belongs to a real user, and a second user cannot read learner A sessions/responses.
- Verify session responses reference only test-assigned questions (currently requires API validation; DB trigger recommended).
- Verify limits of 20 sectionals / 5 mocks, exactly 500 + 500 and full-mock 30/25/20/25 quotas at **release level** (not yet enforced by migration).
- Verify no exact/semantic/visual near-duplicates across pools (external content QA).
- Confirm all old PYQ routes/query counts and learner history are unchanged.

## Findings / deliberate holds
- Migration provides foundational database isolation, NOT a fully secure published exam engine.
- Correct answers must never reach client before submission.
- Current catalogue is empty, so no AFCAT attempts possible.
- Need frozen asset updates/deletion and immutable item delete gate before test publication.
- Need server-authoritative scoring, strict session-to-test question validation, idempotent submissions and test-release version handling in later API PR.
- There is no published AFCAT content in this migration.
- Test counts are a business release gate; blindly imposing 1,000 as a DDL check would prevent incremental ingestion.

## Existing dependency
- P1.1: PR #78 remains separate. This migration PR should not depend on merging P1.1.
