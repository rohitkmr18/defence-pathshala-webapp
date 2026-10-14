# PR #61 — independent acceptance remediation

## CI #814 root cause

Failed run: https://github.com/rohitkmr18/defence-pathshala-webapp/actions/runs/38626652051
Job: Build & Verify, 116067392202, browser step 16.
Fetched PR head: 60e592152e794eae3746ce0ffbb5a046ae60bf87.
Fetched main: e00ac43194ced005e97dc55649dd1a226d7d7762.

The exact failing command was:

    npm exec --prefix frontend -- playwright test --config frontend/playwright.config.ts

Its execution working directory was the repository root:
/home/runner/work/defence-pathshala-webapp/defence-pathshala-webapp.
At frontend/e2e/monthly-intelligence.spec.ts:6, readFileSync attempted
../scripts/test-support/monthly-public-fixture.json. That resolves outside the repository:
/home/runner/work/defence-pathshala-webapp/scripts/test-support/monthly-public-fixture.json.
The actual fixture is in the repository's scripts/test-support directory.
The spec failed during collection; no browser tests executed and no artifacts were uploaded.
The previous frontend-cwd success did not verify the Actions invocation.

The fixture now resolves relative to the test module:
path.resolve(__dirname, "../../scripts/test-support/monthly-public-fixture.json").
No global CI working directory changes. Web-server cwd is explicitly the config's frontend
directory, matching Playwright's default. The workflow retains the exact browser command,
adds an isolated production build and runs the monthly/parser unit tests.

## Product and editorial fixes

Before: product benefits appeared as a future feature list; the sample read like a daily
lesson. After: the first viewport explains the planned ₹79 monthly organisation, revision,
practice, progress and included eBook, with a direct working free-lesson CTA.
A daily/monthly comparison and a compact illustrative workspace show how those features
fit together. Only the actual approved BIMSTEC chapter is linked; all full-edition rows
are labelled planned. No invented coverage, counts, progress, testimonials or PDF asset.

Linked PYQs now explicitly state: “Login is required to attempt and save linked PYQs.
Your selected question will be preserved.” Browser tests retain both exact destinations
through login/onboarding and verify the sample return path.

Release information emits monthly_ca_release_availability_viewed, once per edition.
It never emits purchase intent. Product/price viewing, sample opening and future approved
asset downloads remain separate. No asset-download event occurs without an artifact.
Existing event abstraction, privacy and environment separation are preserved.

Explicit statement syntax renders as separate numbered lines using exact source slices.
The parser accepts only an unambiguous introductory phrase, consecutive numbering and a
recognised original terminal question. Concatenating its parts reproduces the source byte
for byte. Ordinary, Markdown, incomplete and ambiguous questions retain the original renderer.
Original options, answer and explanation are unchanged.

The preserved editorial fixture, runtime allowlist/hash, canonical PYQ IDs, eligible canonical
read model, RLS/service-role boundary, auth routing and daily public content reader are unchanged.
The approved source SHA-256 remains:
9c543435b083a0d0be572eaef2bfe867b6ac16f77a4192cfe476bca0023ce112.
CDS_I_2026_GK_099 and CAPF_2022_P1_125 remain the identities used. Eligibility is distinct from
their UNCHECKED content verification status; no stronger verification claim is made.

## Validation and isolation

All persistence uses the HTTP Supabase contract double at 127.0.0.1:4547, synthetic keys,
synthetic users and synthetic historical question prompts. The production build uses the
same local public URL; all Supabase runtime bindings in the browser server are overridden.
No production learner attempts, database writes, migrations, publication, payment activation,
orders, deployment or settings changes. Preview checks are read-only.

The root exact CI invocation and the frontend-directory invocation each execute all 40
production-build browser tests, not merely collection. Each width is a separate project,
so the complete daily and monthly flow runs at every viewport.
The JSON report at test-results/issue-47/results.json records testedGitSha, production
runtime and synthetic-local persistence. The delivered SHA, final-head CI run and Preview
are recorded in the PR description and delivery response.

| Width | Browser cases | Coverage |
| --- | --- | --- |
| 360px | 10 passed | Overflow, first-viewport CTA/value, navigation, sticky progress, MCQ feedback/focus, PYQs, daily regression |
| 390px | 10 passed | Same complete flow |
| 430px | 10 passed | Same complete flow |
| 1440px | 10 passed | Same complete flow |

Additional local validation: production build and TypeScript pass; changed TS/TSX lint
passes; the new ESM test has no lint rule violations. Parser/editorial/security suite:
14 passed. Auth/practice/content regression suite: 112 passed. Backend regression suite:
12 passed (one inherited dependency deprecation warning).
Full repository lint matches freshly fetched main: 32 errors and 45 warnings,
with identical diagnostics after path/whitespace normalisation.

## Fresh screenshots

| Surface | Mobile 390px | Desktop 1440px |
| --- | --- | --- |
| Product first viewport | [Mobile](monthly-intelligence-evidence/product-mobile-first-viewport.png) | [Desktop](monthly-intelligence-evidence/product-desktop-first-viewport.png) |
| Complete product/workspace | [Mobile](monthly-intelligence-evidence/product-mobile.png) | [Desktop](monthly-intelligence-evidence/product-desktop.png) |
| Sample first viewport | [Mobile](monthly-intelligence-evidence/sample-mobile-first-viewport.png) | [Desktop](monthly-intelligence-evidence/sample-desktop-first-viewport.png) |
| Complete lesson/MCQ | [Mobile](monthly-intelligence-evidence/sample-mobile.png) | [Desktop](monthly-intelligence-evidence/sample-desktop.png) |

[Checked MCQ and explanation](monthly-intelligence-evidence/sample-answer-mobile.png).
Captures use the production runtime and approved public editorial fixture; no real learner data.

## Release recommendation

Return for independent re-acceptance after final-head CI passes. Do not merge automatically.
No Phase 2 implementation is included. Remaining limitations: inherited lint debt,
unproven Preview database isolation (no live persistence testing), no approved PDF artifact,
and the previously documented streamed not-found HTTP behaviour.
