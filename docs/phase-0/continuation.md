# Phase 0 continuation — 3 October 2026 UTC

**HOLD MERGE. Phase 0 incomplete; Phase 1 not cleared.** The current source of truth is [report.md](report.md), with concrete owner setup/release/rollback steps in [runbook.md](runbook.md) and environment boundaries in [testing.md](testing.md).

Main/production remain c0bf5845b43d8e2ab64934ffcf61cd4b8ae62003. PR #9 remains open on phase-0/remaining-baseline-hardening. Read current remote head/checks/deployment rather than assuming any checkpoint SHA is still latest.

This continuation fixed create/first-answer linkage, visible save errors and expired auth, persisted Full Paper submission and timer/auth ordering, safe Google callback return paths, admin bearer proxying and JWT issuer validation. It preserved recent difficulty removal, collapsed/mobile subtopics, Quick Select cleanup and exact session-resume/navigation behavior.

Local authoritative installs and gates pass: 48 frontend tests, 26 backend tests, TypeScript, lint (0 errors/45 warnings), isolated production build and root verification. All 13 recorded production migrations are mirrored; three Phase 0 migrations remain already applied. Fresh local PostgreSQL application-schema/synthetic lineage/RLS checks pass with explicit platform stubs. No production or Lab data was changed. Counts remain 1,821 questions/v2/release/intelligence rows, five attempts and one owned session.

Public production and recorded 28fe18f preview GET checks pass 14/14 each. Preview uses production Supabase. Owner says Google setup stopped at URL configuration. Authenticated OAuth/learning/debrief/recommendation/Full Paper and two-identity tests are pending, with preview browser access also blocked by workspace egress policy.

Main remains unprotected, rulesets empty, administration denied 403; observed Vercel production timing precedes main CI. Backend hosting/env targets and any active formerly exposed credential remain unverified. Free-plan leaked-password protection is unsupported without a paid decision. Automatic approval review rejected copying production question/intelligence payload locally; real frozen restoration remains blocked, and no payload file was created.

Next: complete the concrete owner setup in the runbook, obtain approved artifact/export scope and suitable test write environment, run real authenticated checks, establish/verify the release gate, then merge through PR and prove main/production/post-release checks. Never merge solely because CI is green.
