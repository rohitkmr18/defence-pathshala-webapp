# Phase 0 continuation — 3 October 2026

Current verified main: c0bf5845b43d8e2ab64934ffcf61cd4b8ae62003.
Production: dpl_Cj3izUkgWmtDnTtywbAoZ44Lj2At, READY, same SHA.
Main push CI run 37074700415 is green. That workflow fixes dependency order and Node 22 but does not enforce full lint/types/offline route coverage.

GitHub contents writes now work. Branch phase-0/remaining-baseline-hardening was created successfully. Branch administration is still denied; no required checks exist on main. Do not represent an unprotected branch as CI-gated production.

Prepared changes reconcile all six newer main commits: difficulty removal, collapsed/mobile subtopics, duplicate Quick Select removal, exact session identity/question-order resume and request-scoped profile reads. New resume regression tests are included in the mandatory test glob. Existing session progress snapshot serialization is retained; failed server operations now return errors instead of fake success. Guests remain local-only.

Production migration history still contains the three Phase 0 migrations; do not reapply them. Corpus counts: 1,821 master and canonical rows, five attempts and one existing saved session. No records were written by this continuation. Security advisor retains six informational denied/private tables and the leaked-password warning; no new schema changes needed.

Remaining exit checks: stronger remote CI and preview; signed-in Google OAuth, practice persistence/debrief/recommendations and Full Paper submission; production SHA and smoke/log checks after approved release; main required checks/production gate; Auth password configuration; deployed backend/key configuration; clean staging schema/release reconstruction. Do not merge solely because offline tests pass.
