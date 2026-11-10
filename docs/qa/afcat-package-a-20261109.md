# AFCAT Package A defect regression evidence

Baseline: e04bc308bc24e9430ba28699f85f59170213594a, branch fix/afcat-package-a-history-20261109.
GitHub connector independently verified draft PR #137 and successful CI #1239 (42582689267).

## Root causes and semantics

The foundation schema defaults elapsed_seconds to zero; no repository writer updates it.
Finalization sets status and finished_at only. Response time is optional saved question-view
time, not wall-clock examination duration. History now adds questionTimeSeconds using only
the signed-in owner's responses on assigned questions, and labels it Question time.
Existing timeSeconds remains unchanged for compatibility. No timestamps are used to invent
active time on old or expired sessions. Missing timing is unavailable; saved zero is 0 sec.
Formatting covers 0, 59, 61 and 121 seconds.

The countdown interval was installed unconditionally by the initialization effect.
It now exists only while the session is IN_PROGRESS and no result is present, with cleanup
on completion/unmount. Completed sessions render Test complete without role=timer.
Successful finalization updates terminal status before fetching analysis, so analysis failure
does not restart the countdown. Deadline calculation, offline events and expiry logic remain.

## Executed validation

- node --test scripts/test-afcat-engine.cjs scripts/test-afcat-db.cjs: PASS.
  Includes duration formatting, historical/unavailable and expired timing, production
  dashboard handler with reciprocal owner-scoped fixtures, PostgreSQL ownership,
  repeat finalize, deadline and post-submission rejection.
- npx tsc --noEmit (frontend): PASS.
- npm run lint (frontend): FAIL, 35 errors / 46 warnings across repository.
  Scoped lint: one existing react-hooks/set-state-in-effect error on player initialization.
  Baseline player lint reproduced the same error; unrelated lint was not changed.
- npm run verify: blocked by sandbox font networking; network-enabled retry blocked
  by Turbopack port binding. No full verify pass claimed.
- NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
  NEXT_PUBLIC_SUPABASE_ANON_KEY=synthetic-fixture-key npm run build -- --webpack:
  PASS (frontend production build).
- PYTHONPATH=backend backend/.venv/bin/python -c "import app.main": PASS.
- DP_CHROMIUM_PATH=/usr/bin/chromium npx playwright test
  --config playwright.afcat-player.config.ts (frontend): 5 PASS, 21.3 sec.
  320/390/1280px player navigation, save, clear, review, reload, live countdown,
  successful submission, completed reload, no completed timer, dashboard question time
  and horizontal overflow checks; failed-save behavior; expiry submits once.
  Screenshots: frontend/test-results/afcat-player-{320,390,1280}.png (local artifacts).
- git diff --check: PASS.

Local preinstalled Next.js reports 16.3.6; branch manifest requests 16.4.1.
Exact lockfile-installed CI remains a required release gate.
Browser tests use intercepted synthetic API fixtures, not authenticated staging acceptance.
No database migration, live learner access, live writes, production deployment or merge.
The user-provided A=2/300 and B=3/300 findings remain user-provided evidence.

## Remaining release gates

New exact-SHA GitHub CI; fresh READY preview; independently prove effective staging
isolation before any disposable QA account writes; authenticated reciprocal read/write denial,
offline/retry and repeat-submit HTTP acceptance on the new preview.
Recommendation: NO-GO until these gates and repository lint disposition are resolved.
