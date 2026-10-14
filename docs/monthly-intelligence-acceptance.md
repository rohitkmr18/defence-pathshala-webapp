# Monthly Intelligence — acceptance evidence

This records the initial Phase 1 local acceptance. CI #814 later exposed a root-cwd
fixture failure before browser execution. See the [PR #61 remediation report](monthly-intelligence-remediation.md)
for the corrected CI invocation, four-width production verification and current evidence.

## Candidate and boundaries

Repository: rohitkmr18/defence-pathshala-webapp.
Branch: feat/monthly-intelligence-public-sample.
PR: https://github.com/rohitkmr18/defence-pathshala-webapp/pull/61.
Fresh main baseline: e00ac43194ced005e97dc55649dd1a226d7d7762 (fetched 14 October 2026).
The exact delivered head and its Preview are recorded in the PR description.

No production data writes, migrations, publication, payments, orders, production settings
changes, merges or production deployments were performed. Production access was read-only:
published approved editorial, eligibility of two specified canonical PYQs, and anon-role
permission verification. The permission test used a read-only transaction.

Preview isolation was not proven. All authenticated attempts, onboarding and learner persistence
tests use the local HTTP Supabase contract double, synthetic credentials/users and synthetic
historical PYQ prompts. Live Preview verification uses GET only. No acceptance events are sent
to production analytics; GA is disabled outside VERCEL_ENV=production.

## Reused capabilities

- DashboardShell, DashboardSidebar and MobileLearningNavigation for DP branding/navigation.
- getCurrentAffairsByDate for published approved source preservation.
- EditorialMarkdown and storyDisplayMarkdown for faithful safe Markdown rendering.
- CurrentAffairsQuiz and /api/current-affairs/attempt for the interactive sample.
- v_dp_question_intelligence_v2 and isContentEligible for canonical PYQ eligibility.
- /pyq/[questionId], SessionPageClient and QuestionPlayer for exact PYQ practice.
- getServerProfile, auth redirect/continue and onboarding for retained question destinations.
- safeLearningReturn and trackLearningEvent for learning navigation and canonical analytics.

Integration fixes: allowlist the monthly sample return destination, keep the closed mobile
drawer inert, scope document scrolling to monthly reading pages, move focus to checked-answer
feedback, and communicate guest/save-failure status without interrupting learning.

## Editorial fidelity

Approved story: “First BIMSTEC Home Ministers’ Meeting Adopts Delhi Declaration”.
Story ID: bcadb490-b39a-4f11-befd-fa8e15bf480b; source date: 14 October edition.
Preserved edition SHA-256:
9c543435b083a0d0be572eaef2bfe867b6ac16f77a4192cfe476bca0023ce112.

Unit tests hash the complete preserved source and compare exact lesson Markdown, title,
original MCQ, options and explanation against the existing approved read model.
Browser tests check every non-empty editorial line after presentation-only Markdown
formatting, the original official citation, all lesson sections and explanation rendering.
No other story from that source document appears in sample HTML/RSC payload.
Wrong post/story/version/subject and unpublished source are rejected. No replacement lesson,
question or explanation was generated.

Both CDS_I_2026_GK_099 and CAPF_2022_P1_125 were found eligible in the actual canonical
view. Their status is UNCHECKED, distinct from structural eligibility. The sample repeats
canonical eligibility checks at runtime and does not claim stronger editorial verification.

## Validation

| Check | Result |
| --- | --- |
| TypeScript, current main | Passed |
| TypeScript, feature | Passed |
| Production build, current main | Passed |
| Production build, feature | Passed |
| Lint, changed TS/TSX and Playwright configuration | Passed |
| Full repository lint, current main and feature | Same 32 errors and 45 warnings |
| Existing relevant script tests | 83 passed |
| Frontend auth/practice/filter regression tests | 56 passed |
| Monthly public content/navigation tests | 5 passed |
| Production-build Playwright acceptance and regression | 10 passed |

The lint diagnostics match after normalizing worktree paths and formatting whitespace.
They are pre-existing, including explicit-any and effect-state issues in unrelated files.
No new lint failures were introduced.

Browser acceptance uses the production build with 360, 390, 430 and 1440px viewports.
It covers discovery, catalogue/detail, ₹79 and unavailable purchase state, faithful sample,
guest and authenticated MCQs, wrong answers, explanation/save-failure feedback, both linked
PYQs, login/onboarding target preservation, sample return navigation, invalid editions,
unpublished/unapproved source, withheld PYQs, event dimensions/deduplication, keyboard focus,
sticky reading progress, overflow and existing daily/PYQ regression.

Screenshots below come from that production build and the read-only approved editorial
fixture with synthetic auth infrastructure. They are not captures of production learner data.

| Surface | Mobile (390px) | Desktop (1440px) |
| --- | --- | --- |
| Product | [Mobile product](monthly-intelligence-evidence/product-mobile.png) | [Desktop product](monthly-intelligence-evidence/product-desktop.png) |
| Free sample | [Mobile sample](monthly-intelligence-evidence/sample-mobile.png) | [Desktop sample](monthly-intelligence-evidence/sample-desktop.png) |
| Checked answer | [Mobile explanation](monthly-intelligence-evidence/sample-answer-mobile.png) | Covered by the same responsive quiz |

Reproduction (from the repository root, using only synthetic infrastructure):

```sh
node --test scripts/test-approved-editorial.cjs scripts/test-content-integrity.cjs scripts/test-learning-continuity.cjs scripts/test-auth-middleware.cjs scripts/test-onboarding.cjs scripts/test-current-affairs-automation.mjs scripts/test-learner-intelligence.cjs
node --test frontend/src/__tests__/*.test.mjs
node --test scripts/test-monthly-current-affairs.cjs
cd frontend
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:4547 NEXT_PUBLIC_SUPABASE_ANON_KEY=synthetic-anon SUPABASE_SERVICE_ROLE_KEY=synthetic-service NEXT_TELEMETRY_DISABLED=1 npm run build
DP_E2E_PRODUCTION=1 ./node_modules/.bin/playwright test
```

## Scope limitations

No validated sample PDF was available, so the page honestly reports that it is unavailable.
The full edition, bookmarks, monthly progress/assessment and commerce remain planned.
Next's existing streamed parent shell can return HTTP 200 for a not-found page; invalid
editions render the 404 UI and noindex without exposing content.
Real authenticated Preview writes were deliberately not tested against an unproven database.

See [future implementation specification](monthly-intelligence-architecture.md) for the
canonical web/PDF snapshot, correction/release approvals, learning workspace and secure
₹79 order/entitlement/delivery phases.
