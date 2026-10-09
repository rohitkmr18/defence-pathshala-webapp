# Issue 47: approved source and exact PYQ acceptance

The complete founder-approved manuscript travels through the existing GitHub
issue → GitHub OIDC → Vercel automation endpoint → atomic Supabase RPC. The
new source is never inferred from a historical, compressed record.

## Approval contract

Keep the complete manuscript in each story's `editorialMarkdown`, including all
original headings, paragraphs, lists, emphasis, tables, citations, static-current
linkage and future question angles. Optional edition-level `editorialMarkdown`
holds introductory/closing material outside individual stories. Keep all existing
structured story metadata and verified daily MCQs, with each explanation intact.
Add `linkedPyqIds: ["CDS_II_2026_GK_011", ...]` to the appropriate story; use `[]`
when no PYQ has been verified. No lookup by subject, fuzzy matching or random
fallback is permitted.

The editorial review includes the manuscript AND structured fields. Prepare the
approval package before the founder approves it:

```js
import { prepareApprovedEditorial } from '../scripts/prepare-approved-editorial.mjs';
const edition = prepareApprovedEditorial(completeEditorialFields);
// Only after explicit founder approval, submit the existing issue envelope:
// { schemaVersion: 1, operation: 'publish', approved: true, edition }
```

The helper only packages data; it does not publish. `approvedEditorial.source`
is `JSON.stringify(completeEditorialFields)`; the SHA-256 hashes its exact UTF-8
bytes. Canonical JSON prevents duplicate keys from hiding approved content; JSON
packaging whitespace is separate from manuscript string whitespace. All paragraph
and Markdown strings remain unchanged. `version: 1` is this source format version.
The endpoint rejects source/hash mismatches, drift between source and structured
fields, unsupported fields (rather than silently dropping them), invalid MCQs and
invalid ID syntax. The RPC independently checks the hash/source and resolves every
ID against the active, content-eligible canonical question read model within the
same transaction. Corpus row locks prevent concurrent deactivation/content holds.

Markdown runs without a raw-HTML plugin. Raw HTML is displayed as text; dangerous
link protocols are not navigable. HTTPS citations and document footnotes are
clickable; GFM tables scroll within their own container. The complete rich copy,
structured reference fields, taxonomy and linked-PYQ cards render for new editions.
Daily quizzes and edition navigation remain in place. Quiz explanations and exam
edges use safe Markdown for approved editions and retain the legacy renderer for
historical editions.

The existing 55 KB GitHub payload / 60 KB endpoint limits still reject oversized
requests explicitly; no content is shortened to fit. If a complete approved draft
exceeds the limit, stop publication and explicitly review a transport limit change.

## Exact-question flow

`/pyq/[questionId]?edition=YYYY-MM-DD` retains the external corpus ID through
login, `/auth/continue` and onboarding. The existing practice questions endpoint's
`id`/`ids` parameters continue to mean UUIDs. The new authenticated `question_id`
parameter resolves one exact external ID from the active eligible read model and
allowlists only the prompt/options and routing metadata in its initial response.
It includes no answer, explanation or intelligence hints.

The existing QuestionPlayer, practice sessions, persistence status, attempt API,
completion/debrief and learner events handle the attempt. On Check Answer,
`reveal: true` requests the authoritative answer only AFTER authenticated ownership,
content version, eligibility and session membership checks and a successful attempt
write. The UI locks options while saving and supports retry without revealing on
failure. Persistence uses the existing internal question UUID and retry-safe attempt
ID. Missing/inactive/held references visibly fail; the app never picks another PYQ.

## Migration and release

`20261009052951_approved_editorial_source.sql` adds three nullable columns to
`current_affairs_posts`: exact source, SHA-256 and source format version. It replaces
the existing RPC in place, retaining security-invoker, service-role-only execution,
insert-only/duplicate rejection and final published-state update. It adds a source
integrity constraint and an immutable-source trigger. It adds no table grants,
RLS policies or service credentials. No historical row is rewritten. Legacy NULL
source remains explicitly non-verbatim; the reader also works before this additive
migration because its post selection tolerates absent optional source columns.

No production migration, merge or production deployment is authorized by this PR.
After explicit release approval, review/apply the additive migration first, then
release the reviewed app commit. Do not use Supabase reset/reconstruction against
production. The recorded production ledger remains unchanged; the reconstruction
test explicitly allows and replays the two pending Current Affairs migrations.

Rollback: revert the application commit first; keep the additive columns/source
and immutable trigger so approved manuscripts remain auditable. Restore the prior
RPC definition from `20261008050000_atomic_current_affairs_publish.sql` only through
an explicitly approved follow-up migration if publication must be paused/reverted.
Do not drop source columns or rewrite approved records. Reverting the app alone
does not restore the old publishing contract.

The original complete 9 October manuscript remains unavailable. The eight IDs in
the issue were checked read-only: all exist, are active and content-eligible. This
PR does not fabricate or backfill 7/8/9 October content. Historical backfill remains
a separate approval once the original drafts are available.

## Acceptance checklist

- [x] Complete source UTF-8 bytes and hash survive real PostgreSQL publication.
- [x] Hash drift, structured-field drift, duplicate keys and omitted manuscript/IDs reject.
- [x] Every approved story paragraph, section, table, taxonomy and future angle is retained.
- [x] MCQ questions, explanations and exam edges retain complete text/formatting.
- [x] Official source validation, OIDC caller restrictions and preview write prohibition remain.
- [x] Missing/inactive/held IDs reject the atomic transaction with no partial publication.
- [x] Duplicate edition/late child failure rolls back; legacy edition remains unchanged.
- [x] Authenticated learner can attempt exact external ID using the existing player.
- [x] Login and incomplete onboarding preserve exact ID and originating edition.
- [x] Initial exact-question response contains no answer/explanation hints.
- [x] Server-authoritative attempt is saved with the internal UUID and standard analytics.
- [x] Missing/withheld route displays an error without random fallback.
- [x] Mobile 390px layout has no document overflow; safe citations/tables and PYQ cards work.
- [x] Daily quiz and navigation remain available; historical reader behavior retained.
- [x] TypeScript, production build and changed-file lint pass.
- [x] Main's existing repository-wide lint failures independently reproduced (32 errors).
- [ ] Real newly approved editorial publication after explicit production release approval.

## Reproduce verification

```sh
node --experimental-strip-types --test --test-concurrency=1 \
  scripts/test-approved-editorial.cjs scripts/test-current-affairs-automation.mjs \
  scripts/test-current-affairs-atomic-publisher.cjs scripts/test-current-affairs-db-rollback.cjs \
  scripts/test-content-integrity.cjs scripts/test-migration-ledger.cjs
npm exec --prefix frontend -- playwright test --config frontend/playwright.config.ts
npm run build --prefix frontend
./frontend/node_modules/.bin/tsc --noEmit --project frontend/tsconfig.json
```

Browser tests use an isolated HTTP Supabase contract double and synthetic manuscripts;
database tests use PGlite's real PostgreSQL engine. They never publish to a live project.
CI retains mobile screenshots and failure traces as `issue-47-browser-evidence`.
Use `DP_CHROMIUM_PATH` for another installed Chromium executable; CI uses Chrome.
Preview smoke tests use real read-only legacy editions and auth redirects. A newly
approved edition on the live database is intentionally pending release approval.
