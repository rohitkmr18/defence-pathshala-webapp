# Student Engagement Analytics v1 — acceptance and measurement contract

## Scope
- Server-rendered, no-index administrator page: `/admin/analytics/students`.
- Uses Supabase production or staging project selected by the deployment environment.
- Read-only: no schema changes, no writes, no new client-side tracking.
- Only a verified Supabase Auth user with **server-managed** `app_metadata.role = admin` may view learner-level data; unauthorized sessions receive a 404.
- Server-only `SUPABASE_SERVICE_ROLE_KEY` is needed to read across students. Never expose it to the browser or include it in logs.
- Do not reuse `checkIsAdmin()` for this page: its current implementation accepts editable `user_metadata` and potentially editable profile roles.

## Operational definitions
- Primary ranking: persisted answered question interactions across `user_attempts`, `current_affairs_quiz_attempts`, AFCAT and mock responses where `selected_option` is not null.
- Accuracy: successful scored responses / scored responses, from PYQ and Current Affairs only. AFCAT and mock answers are **not** incorrectly treated as wrong or scored.
- Session completion: `practice_sessions.is_completed = true`; AFCAT and mock sessions `status = 'SUBMITTED'`.
- Active day: distinct Asia/Kolkata calendar date of a question interaction or learning session start.
- Repeat-day learners: any student active on 2+ distinct dates; **not** D1/D7 cohort retention.
- Last activity: latest available learning interaction timestamp or session start; not necessarily a website visit.
- Student population: `profiles.role = 'student'`. This excludes admins flagged in profiles but cannot detect all manually-created test users.

## Acceptance tests (required before merge)
1. Verify non-admin and signed-out access returns 404. Do not pass a spoofed role in `user_metadata`.
2. Verify authorized administrator only sees student profiles, with no admin profile included.
3. Compare counts and ranking against an independent read-only Supabase query in staging, including AFCAT answered/unanswered rows.
4. Verify full pagination beyond 1,000 rows; a table exceeding 20,000 rows must visibly warn about truncated results.
5. Verify credentials and internal full UUIDs are absent from HTML and client network payloads.
6. Check empty/error states, mobile horizontal table scrolling, Next.js build and lint.
7. Confirm the Vercel preview points to staging Supabase; never infer this from preview URL alone.
8. Confirm no database migration or production write is required. Keep the PR draft until authorized acceptance.

## Known limitations and subsequent work
- This does **not** instrument Explore clicks, anonymous browsing, acquisition funnels, active-screen time, user-session heartbeat, or genuine cohort retention.
- Existing GA4 `trackLearningEvent` uses dataLayer. PostHog was not present in the inspected main branch, so do not label the current dashboard as PostHog-powered.
- Next phase, separately reviewed: specify consent-aware, no-PII client event taxonomy for `view_explore`, `start_practice`, `answer_question`, `complete_practice`, `view_ca`, `start_mock`, `complete_mock`; verify existing GA4 events to avoid duplicate counting. Add authenticated first-party identity association only after privacy and RLS review.
- Define actual cohort D1/D7 retention from a first-activity cohort and strictly bounded return windows; distinguish eligible/matured cohorts and censor recent users.
- For high volumes replace per-request full-table scans with protected, bounded SQL aggregates and explicit server-side data freshness checks.
