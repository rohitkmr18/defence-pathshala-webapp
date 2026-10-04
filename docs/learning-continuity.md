# Phase 1, Batch 1: learning continuity

Baseline: main `c181bae73972dece7797a615356f9fa15fee34d0`.

Explore and Practice use the same URL filter contract: exam, year, cycle,
subject, topic, subtopic, mode, origin and a contextual return URL. The existing
email authentication resolver remains authoritative. Return navigation accepts
only supported learning destinations; nested query strings remain encoded.

Practice retains a stable device session identity and an independent, confirmed
cloud identity. Session creation retries reuse a UUID. Attempt retries use a
deterministic user/session/question primary key and server-side answer scoring.
Pending attempts, checked questions, question order, position, answers and timing
remain on the device after failures or refresh. Checked state and question timing
travel in the existing session filters JSON; no database migration is required.
Completion waits for required attempt writes and the final session save.
Guest practice remains local. Earlier local sessions are archived for resume.

PR #9 supplied the relevant persistence foundation and regression cases. This
branch adapts those changes to current main; it does not merge that PR's unrelated
work, authentication changes, corpus changes or schema changes.

## Validation

- `npm run verify`: production frontend build and backend import.
- Frontend/auth/continuity regression suites: 84 passing tests.
- Onboarding database and migration ledger suites: 12 passing tests.
- Backend `python -m pytest -q tests`: 25 passing tests.
- TypeScript and `git diff --check`: pass.
- Full ESLint remains blocked by existing repository errors: main has 41 errors
  and 46 warnings; this branch has 31 errors and 46 warnings.
- Browser fixture at desktop and 390px: restored Explore selections, preserved
  authentication destination, unchecked-answer refresh, Dashboard resume →
  Check → Next → Dashboard, failed cloud attempt → visible retry → acknowledged
  save → confirmed completion, and mobile Progress targeting Performance Coach.
  Mobile question controls clear the bottom bar without horizontal overflow.

Acceptance follow-up: unchecked AnswerReveal content is unmounted, so verdict,
correct answer, explanation and intelligence controls are absent from the DOM
and accessibility tree. Explicit checking reveals feedback; moving to an
unchecked question removes it. Resume uses checked question IDs independently
of selected answers. Mobile navigation is exactly Explore, Practice, Progress,
with icons, 56px targets, safe-area padding and distinct route/anchor states.
Desktop navigation is unchanged.

Browser API fixtures do not prove production database or email delivery behavior.
Before release, use a real account to verify email OTP returns to filtered
Practice, authenticated refresh and cross-device resume, interrupted cloud saves
and retry against Supabase, full-paper timer resume, analytics in GA DebugView,
and safe-area spacing on iOS Safari. Production deployment is outside this batch.
