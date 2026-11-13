# Defence Pathshala — AFCAT Package B Product & UX Specification
Status: Design-ready, NOT implementation-authorized until Package A acceptance.
Basis: source inspection of Package A PR #137 SHA 6eb9fa02e6e5aecb5c97ecd0154be210afd2059d on 9 Nov 2026.

## 1. Problem, objective, boundaries
The current /afcat landing markets one static “Full Mock 01” despite a dynamic /api/afcat/tests catalogue. /afcat/lab contains the real published mock picker and saved attempts; /afcat/dashboard includes attempted mocks, in-progress resume, summary metrics, section accuracy and lost-marks topics. A useful redesign must connect acquisition → catalogue → login → attempt/resume → results → targeted revision without changing scoring/security semantics.

Primary objective: make the first *right* learner action discoverable within the first mobile viewport, then return learners to their next relevant study action. Secondary: make the brand feel cohesive, fast, credible and exam-specific.

Explicit non-goals for Package B: no AFCAT scoring/database migrations, session-policy/auth bypass, paid course introduction, rankings/percentiles based on unvalidated data, or fabricated mock availability. Do not promise an existing AFCAT-targeted practice route until integration is inspected and verified.

## 2. Existing code and constraints
- `frontend/src/app/afcat/page.tsx`: static headline/SEO "Full Mock 01"; one CTA to /afcat/lab; static paper specifications; hero tracker.
- `frontend/src/app/api/afcat/tests/route.ts`: dynamic published FULL_MOCK catalog filtered to codes AFCAT-FM%; returns id, code, title, duration, question count, max marks; server-side no-store.
- `frontend/src/app/afcat/lab/page.tsx` (PR #137): real session creator/player, saved history, server timer and submit/retry path; must preserve correctness.
- `frontend/src/app/afcat/dashboard/AfcatDashboardClient.tsx`: dynamic mock/attempt summary; stable test ID matches in PR #137; currently requests catalogue and dashboard independently.
- `frontend/src/lib/afcat/funnel.ts`: GA4 acquisition events and a static default test code. Redesign multi-mock tracking must use code actually selected; no PII.
- Existing brand: DP logo, navy/blue, crisp typography. Don't redraw or substitute official logo.
- Backend catalog published by exact project; do not hardcode availability, year, "free" pricing, counts of live mocks, or cut-off claims unless data or product policy supports them.

## 3. Information architecture
`/afcat` — discover AFCAT preparation and active mock catalogue; primary CTA "Explore free AFCAT mocks", with active resume callout for authenticated learner if API succeeds. Public access must work with no login.
`/afcat/lab` — published-mock selection; start/resume/results as implemented after Package A. Avoid second, divergent history source.
`/afcat/dashboard` — learning home: resume → latest score → next action → attempts → section/topic review. Treat signed-out/empty/error separately.
`/afcat/lab?session=<id>` — canonical user-scoped direct link. Never leak answer key for active session.
Targeted-practice handoff — ONLY after verifying compatible live routes + exam/topic taxonomy. Until then, show specific, honest revision guidance and links to established exploration modules.

## 4. Mobile-first layout design
### Landing, 320/390/desktop
1. Compact header: exact DP logo and exam navigation, accessible.
2. First viewport: "Prepare for AFCAT with mock tests that show what to improve"; one primary CTA to live mock catalogue, secondary "My performance" for returning users. Avoid misleading number of available mocks.
3. Server-fed mock cards: name, 100 Q / 120 min / 300 marks from API (not hardcoded), status available only if PUBLISHED; card CTA "Start" or "Resume" based on authorized session state; use canonical test ID.
4. Score learning promise: score breakdown, time and revision action; illustrative not fictitious testimonials.
5. Four-section pattern and explanatory copy.
6. Trust: independent exam-prep label; transparent scoring and original-questions disclaimer.
7. Lightweight FAQ/SEO and one final CTA. Avoid excessive marketing sections.
Loading/empty/error states: visible skeleton; empty means no published mocks; failure means request unavailable; never invent a mock.

### Mock player
Preserve server deadline, offline state and response persistence. Mobile: sticky compact timer/save-state; 44px+ actions; question options fully readable; reachable palette/mark for review; submit confirmation; no horizontal scrolling at 320px; safe-area aware. No redesign of transactional behavior in B.

### Dashboard and results
A learner's top action depends on state: in-progress → Resume; finished → View analysis + revise weakest topic; first-time → Start first available published mock. Score trend and weak-topic panels must show sample-size context and honest no-data state. Retired mock results still viewable under ownership restrictions.

## 5. Component approach
- Shared `AfcatMockCatalogue` with explicit server schema and stable ID; reuse on landing and lab where viable, without moving session logic out of secure API.
- `AfcatHero`, `AfcatExamPattern`, `AfcatTrustDisclosure`, `AfcatNextAction`, `AfcatAttemptHistory` (source-of-truth choice explicitly documented).
- Preserve canonical URL /afcat; metadata should describe AFCAT mock platform dynamically enough not to depend on Full Mock 01.
- Avoid client waterfalls: public catalogue server-load if feasible, cache scoped to publication state with controlled revalidation, no personalized cache leaks.

## 6. UX event contract and analysis
Existing: afcat_landing_view, afcat_cta_click, afcat_signin_click, afcat_mock_start, afcat_mock_submit, afcat_result_view, afcat_share_click. Extend only if needed with afcat_mock_catalogue_view, afcat_mock_selected, afcat_resume_click, afcat_next_action_click; event context: coarse placement, test code, device class, auth state (boolean). Do NOT emit names, emails, session ids, question text, answer keys.
Measure: landing→catalogue click; catalogue→start; start→submission; submitted→result; result→next-learning-action; 7-day reattempt (cohort denominators and eligibility clearly defined). Capture baseline before redesign; compare like-for-like and guard sample sizes.

## 7. QA and acceptance
- P0: Package A acceptance completed before code implementation/merge.
- Public /afcat + catalogue work signed-out; auth return path preserved; no 404, 500, misleading empty state.
- 320px, 390px, 768px, 1440px: no overflow; key CTA first viewport; contrast/accessibility; keyboard navigation; Lighthouse/performance budget established from baseline before change.
- Mock list is truly backend-driven; published/retired changes respected; no hardcoded old mock names/IDs.
- Player start/resume/answer persistence/expiry/scoring unchanged; test with two isolated staging identities.
- Results and history accessible only to current user; fail-closed if auth/DB unavailable.
- New analytics verified in GA4/PostHog with PII-free payload, no duplicated events.
- Evidence: desktop/mobile captures, request traces with no secrets, exact SHA CI, staged app acceptance matrix.

## 8. Execution in minimum steps (independent PRs)
**B0**: Review and approve this design spec + obtain baseline screenshots and 1-week funnel baseline (no code).
**B1**: Landing+dynamic catalogue only in one PR. Verify published data, mobile first viewport and CTA conversion instrumentation.
**B2**: Dashboard next-action and results-to-revision affordances in a second PR, only using verified existing study routes.
**B3**: Unified journey acceptance + analytics audit and controlled release; no database changes unless separately reviewed.

Do not implement B1/B2, merge Package A, deploy production or mutate production database during specification phase.
