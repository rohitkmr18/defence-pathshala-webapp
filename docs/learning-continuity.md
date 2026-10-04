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
  and 46 warnings; this branch has 31 errors and 47 warnings.
- Browser fixture at desktop and 390px: restored Explore selections, preserved
  authentication destination, unchecked-answer refresh, Dashboard resume →
  Check → Next → Dashboard, failed cloud attempt → visible retry → acknowledged
  save → confirmed completion, and mobile Home targeting Dashboard.
  Mobile question controls clear the final option without horizontal overflow.

Acceptance follow-up: unchecked AnswerReveal content is unmounted, so verdict,
correct answer, explanation and intelligence controls are absent from the DOM
and accessibility tree. Explicit checking reveals feedback; moving to an
unchecked question removes it. Resume uses checked question IDs independently
of selected answers. Mobile navigation is exactly Home, Explore, Practice,
with icons, 56px targets, safe-area padding and distinct pathname states.
Desktop navigation is unchanged.

Mobile session follow-up: Home always links to `/dashboard` and remains active
at its Performance Coach anchor. Blue emphasis belongs only to the active item;
Practice no longer looks selected on Dashboard. The central
`showGlobalMobileNav` rule suppresses navigation on targeted session and
full-paper routes, including their inline debrief. Navigation returns when
leaving for Dashboard, Explore or Practice setup.

Targeted controls use one sticky row at `bottom: 0` with safe-area padding and
trailing document space. The former 5rem stacked-bar offset is removed. Scoped
mobile CSS replaces ancestor `overflow-x: hidden` with `clip`, so sticky actions
follow the document rather than nested vertical scroll containers. Full-paper
actions retain their existing normal flow with safe-area space below the page.

`scripts/browser-mobile-session-check.js` asserts bounding boxes, document
scrolling, absence of global navigation, last-option reachability and no
horizontal overflow. Local synthetic question/auth fixtures passed:

| Viewport | Targeted option D bottom / actions top | Full-paper option D bottom / actions top |
| --- | --- | --- |
| 390 × 844 | 583 / 628 px | 552 / 593 px |
| 393 × 852 | 591 / 636 px | 556 / 597 px |
| 768 × 1024 | 735 / 788 px | 620 / 669 px |
| 1440 × 1000 | 839 / 876 px | 855 / 904 px |

A reduced 390 × 700 viewport also passed targeted reachability and clearance.
Mobile action ancestors all had `overflow-y: visible`; desktop classes and
the existing 16px targeted action offset are retained. Chromium fixtures do not
replace physical iPhone Safari testing of browser chrome and nonzero safe areas.

Browser API fixtures do not prove production database or email delivery behavior.
Before release, use a real account to verify email OTP returns to filtered
Practice, authenticated refresh and cross-device resume, interrupted cloud saves
and retry against Supabase, full-paper timer resume, analytics in GA DebugView,
and safe-area spacing on iOS Safari. Production deployment is outside this batch.
