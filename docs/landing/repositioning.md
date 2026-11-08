# Landing repositioning acceptance

Base: main 6e3177b53eff289652eab8a949375d7efcd21da5. Checked remote branches and open PRs before editing; existing practice, analytics, ingestion and Current Affairs PRs remain independent. No backend, auth, database, metadata or dashboard code changes.

## Product evidence

- `frontend/src/lib/exam-registry.ts`: CDS GK/English/Mathematics, CAPF Paper I and AFCAT written are live; NDA, CAPF Paper II and AFCAT EKT are coming soon. NDA omitted.
- PracticePageClient explicitly permits guest targeted practice and requires login for full-paper mocks. English/Maths full-paper mocks remain unavailable.
- Existing AFCAT landing and mock engine are separate; links remain `/afcat` rather than pretending AFCAT is in the CDS/CAPF question pool.
- Monthly capsule uses the existing `latestMonthlyCapsule()` and reader route, now in Current Affairs context.
- Removed illustrative dashboard scores and sample question statistics. Optional homepage insight omitted: no independently verified canonical public insight snapshot was established. Existing public discovery links stay intact.
- Product availability is based on current main's registry and routes, not an independent production database inventory.

## Contracts and measurement

Hero selection is addressable as `/?exam=cds|capf|afcat`, retains unrelated URL parameters and supports back/reload. Destination practice/explore uses existing `paper=gs&exam=CDS|CAPF-AC`; paper-specific CDS links use `paper=english|maths`. Intent sets existing learner mode/paper storage only on navigation. Existing auth/returnTo/session handling is untouched.

Canonical `trackLearningEvent` emits landing_view, landing_exam_selection and landing_practice_intent. `origin=home` reaches existing practice_launch attribution. No artificial activation event or alternate SDK added. Root layout continues loading GA only in production; browser checks confirm no GA script locally. Hosted ingestion is unverified.

## Test matrix

| Check | Result |
| --- | --- |
| Changed-file ESLint | Pass |
| TypeScript noEmit | Pass |
| Next.js production Webpack build | Pass |
| Default Turbopack build | Environment worker port binding/font networking failure; Webpack fallback passed |
| Existing practice resume, filter/learning loop, auth component/middleware and dashboard mode regression files | 5 files pass |
| Chromium 320×900 / 390×900 / 1440×900 | 3 tests pass |
| Exam selection, keyboard Enter, pressed state, reload and back | Pass at all widths |
| Practice/AFCAT/English link contracts, analytics queue, no preview GA script, reduced-motion rendering, horizontal overflow | Pass at all widths |
| Real authenticated practice/mock submission, auth-return, downstream persisted activation | Unverified; no production test writes or auth bypass |
| Hosted preview | Check PR deployment status; do not infer READY from a URL |

Run browser checks: `cd frontend && npx playwright test -c playwright.landing.config.ts`. Uses isolated upstream fixture, not production. Screenshots: workspace `test-results/landing-{320,390,1440}.png`. Fixture corpus values in the unchanged PublicExploreLinks section are synthetic and are not production claims.

Release recommendation: draft review only. Require green CI, READY preview and authenticated acceptance on an approved test environment before release. Do not merge automatically.

## Final refinement acceptance

- Exact two-sentence headline and supporting copy; white/blue emphasis; one exam-dependent hero CTA; compact non-clickable founder strip. Removed hero helper text, coverage descriptions and secondary/subject links.
- Current Affairs immediately follows the hero with exactly three cards. Daily reads the existing hub; quiz resolves from the canonical published edition list to the latest edition with MCQs plus `#quiz`; monthly uses the existing capsule edition. Missing quiz/capsule data produces an unavailable card rather than an invented route. Suspense keeps the hero independent of the edition lookup.
- Only related edition change: add `id="quiz"` and scroll margin to its existing quiz section. No quiz logic, auth or API changes.
- Latest acceptance: changed-file ESLint and TypeScript pass; Next.js Webpack production build passes (existing public coverage/sitemap build lookups warn about the environment's placeholder Supabase URL); six regression files pass (practice resume, question learning loop, CA calendar, dashboard states, auth components and auth middleware).
- Four Chromium tests pass: 320×900, 390×900, 1440×900 and actual daily quiz navigation/anchor. Exact copy, one hero link, three CA destinations, exam/back/reload/keyboard, analytics queue, reduced-motion rendering and no overflow verified.
- Screenshots: `test-results/landing-refined-{320,390,1440}.png`, generated locally with the isolated upstream fixture. Authenticated end-to-end submissions and production records were not exercised; dashboard/auth unit regressions cover both states. Keep draft pending authenticated acceptance.

## CTA and credential follow-up

CDS and CAPF now expose Practice plus Decode PYQs, both preserving exam/paper/origin URL context. AFCAT retains only Explore AFCAT Mocks. Decode intent uses the existing learner-mode storage and analytics abstraction. Credentials now begin “Built by Rohit” in a bordered blue-tinted panel with emphasized achievements. Latest changed-file lint and TypeScript pass; all four responsive/quiz Chromium checks pass, including explicit CDS/CAPF dual CTA and AFCAT single CTA assertions.
