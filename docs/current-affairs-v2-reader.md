# Current Affairs 2.0 reader — bounded implementation

## Baseline and scope

Issue #56; audited and implementation base: `964c3125d16a77b19b4bfa95e4592f440deb4e37`.
Remote main matched that commit on 12 October 2026. Open PRs #20, #34, #41 and #49 were inspected; none was merged or copied into this branch. Existing CA publishing, source normalization, auth return and exact-PYQ routes remain the architecture.

Implements CA01 (briefing/reader), CA02 (immutable presentation), and UI-related CA06. No database, RLS, publication, scheduling, authentication architecture or analytics-provider changes.

## Presentation contracts

- Compact navy briefing: edition date, supported exam tags, actual story/MCQ counts, reading/quiz actions. The complete edition title, summary and introductory Markdown remain available in collapsed Edition notes.
- Both rich and legacy stories start collapsed in native details/summary elements. Their complete content remains in server-rendered HTML. Only the disclosure's anchor/focus enhancement is a client component; manuscript rendering stays on the server.
- Story-number anchors are stable within each immutable edition. Next links integrate hash navigation with router history. Keyboard disclosure and browser return from the exact PYQ authentication destination are regression tested.
- Approved summaries supply previews; fallback excerpts use existing approved strings, with an ellipsis when cut. No generated summaries. Numerical DP scores are omitted from learner cards.
- Scan and full-reading estimates count available text at approximately 200 words/minute, rounded up to whole minutes; they are estimates, not timing guarantees.
- The existing quiz renders the actual questions in existing order without the old five-question presentation cap. Selection, checking, timing, attempt API and guest/auth behavior are preserved. Changes are selected-state announcements, correctness status, wrapping and reduced-motion handling.

## Immutable content and headings

`EditorialMarkdown` promotes only complete standalone recognized labels or a bold-only paragraph using the Markdown AST. Explicit manuscript headings become section-level H3s; unknown headings and nodes retain their content. Story titles are H2s, and the edition has one H1. Tables have a focusable local scroll container. Footnotes receive per-manuscript prefixes and internal navigation.

`story-display.ts` was inspected and its existing conservative behavior retained. No broader stripping rules were added. It removes only its recognized preamble and complete exact-ID-only PYQ blocks when replacement clickable IDs exist; explanatory PYQ prose stays visible. Source attribution was retained, including any uncertain duplicates.

The parser reads valid text strings exactly, guards malformed optional metadata, and never updates source or SHA. Invalid JSON can use existing legacy rows with an availability notice. Invalid canonical question/options fail honestly rather than substituting another question. Fetch failures reach a retry boundary; zero matching rows reach a separate missing-date screen.

The published 12 October fixture is a read-only database snapshot, copied on 12 October 2026. Its approved source SHA is fixed at `19cc262d86faa6f2b939fd70e0b94fa291a4c7ec20cd95b41ca225e49d4d9c82`. Tests verify the source bytes/hash, all canonical story text, all MCQ options/keys/explanations and every visible manuscript line. The fixture is not published or used as application runtime data.

## Verification and evidence

Run from repository root:

```sh
node --test --experimental-test-isolation=none scripts/test-approved-editorial.cjs scripts/test-current-affairs-reader.cjs
frontend/node_modules/.bin/tsc --noEmit -p frontend
npm run build --prefix frontend
npm exec --prefix frontend -- playwright test --config frontend/playwright.config.ts
```

Run changed-file ESLint from `frontend`, where its configuration lives. Browser tests point both public and server Supabase clients at `127.0.0.1:4547` with synthetic keys. All auth identities and attempts are local HTTP contract doubles. Database regression tests use in-memory PGlite. Never run write journeys using production credentials.

The browser suite covers 375×812, 390×844, 768×1024 and 1440×1000; rich/legacy disclosure; long headlines, URLs and tables; missing summaries/sections/links; malformed JSON/metadata; missing date, fetch failure/retry; keyboard activation, focus and 200% effective zoom; exact PYQ auth return; adjacent editions; quiz checking and request contracts; canonical URLs, SSR content and source integrity.

Published-snapshot briefing and expanded-reader PNGs are emitted as `published-briefing-{width}.png` and `published-reader-{width}.png` in `test-results/issue-47/current-affairs-reader-pub-b4fe0-ing-at-all-target-viewports/`. GitHub CI retains that directory in the existing `issue-47-browser-evidence` artifact. Axe checks WCAG A/AA rules on the changed edition surface at each viewport and expanded story; this is automated evidence, not a complete human accessibility certification. The surrounding app shell is outside this redesign.

## Preview and follow-up boundaries

Vercel Preview environment metadata has shared production/preview Supabase bindings and no branch override for this feature. Database isolation is therefore not established. Preview display checks may only read published content; do not submit quizzes, sign in with test identities, publish, or run other write journeys there. The complete interactive journey is tested locally with isolated doubles.

- CA03/CA04/CA05: security and publication-hardening tasks remain separate. No publishing bridge changes or removal of legacy routes.
- CA08: quiz session persistence, elapsed-time lifecycle and durable-save UX remain existing behavior and require separate work.
- CA12: broad nested archive fetching, pagination and data-access optimization remain separate.
- Verified PYQ eligibility does not establish pedagogical relevance; no IDs are replaced or inferred.
- An additional JavaScript-disabled usability experiment failed because the existing global DashboardShell suspense boundary leaves its streamed content hidden without hydration. The same behavior was reproduced on the unmodified audit baseline. This PR verifies complete editorial HTML in the server response; it does not claim a JavaScript-free global app shell.
- Source duplicate suppression stays deliberately conservative; uncertain repeated citations are retained.

No production merge, deployment, edition, learner record, migration or database write is authorized by this implementation.
