# CAPF Paper II B1 foundation — draft, local only

This change ingests Package A v0.2 into a local embedded PostgreSQL database and adds
publication-gated corpus reads. All 56 real records remain DRAFT and private. No
official text verification or academic approval is claimed. No numerical evaluation,
learner submissions, OCR, upload storage, jobs, scoring, charts or learner UI are added.
The existing capf-p2 registry and all AFCAT application code remain unchanged.

## Baseline and isolation

Refreshed on 11 November 2026:

| Ref | SHA | State |
| --- | --- | --- |
| main | 87cb4b4c4a00f4ac86311e4fc62614df5c129637 | B1 parent |
| AFCAT PR #137 | c0c467fde07fc284c14c9a86e172c7486a770f22 | Open draft; untouched |
| AFCAT PR #138 | 710d4296a5a9900dae996922a615b8c582d78265 | Open draft; untouched |

Branch: feature/capf-paper2-b1-foundation. No AFCAT branch was merged or cherry-picked.
Both Vercel configuration locations disable deployment of this branch. The branch
uses a separate CI job with no hosted secrets, installation scripts disabled, and a
direct Next build that never invokes the existing CDS production-data build hook.
Other branches retain their existing CI behavior. This is not a production release.

## Academic inputs and mapping

The supplied ZIP has 13 files; all 13 plus deep-research-report.md are preserved
as original text with individual SHA-256 hashes in the private import batch.
The archive itself stays outside the repository.

Archive SHA-256:
3e1520235ea4411bfea3acdfc9b71f465812b2ea7721eeb81b6ab1541d62aea6

Input-manifest SHA-256:
a21b72c87b747920049cb28908307a0a64e653c574633991247347d7f2aff6f7

The Python preparation step validates exact CSV fields, 56 unique identities and
matching demand cards, seven years with six essays/two arguments each, source links,
publication holds, taxonomy membership and both 20-mark/eight-criterion rubrics.
Original wording is preserved; no question wording is reconstructed by the importer.
Four explicit mechanical demand-label mappings reconcile Package A with its ontology:
analysis → analyse; for_against → dialectical_for_against;
opportunities_challenges → opportunity_challenge; solution → solution_design.
These are mapping rules, not new academic labels.

Q1 keeps a reported approximate 300-word limit. Q2 has a null limit and
NOT_SPECIFIED_IN_RESEARCH status, not an invented number or a verified official claim.
Reported page numbers are retained separately from verified printed pages and
zero-based PDF page indexes. Missing PDF hashes, directions and language rules remain
null. Source records default to unverified. Rubrics remain provisional and unreadable
by browser roles. Hindi, Q3–Q6 and evaluation eligibility are outside B1.

## Storage and publication contract

Public-schema tables hold identities, immutable revision snapshots, versioned
taxonomy and provisional rubrics. Revision snapshots embed the versioned annotation
and demand card, avoiding a separate annotation service in B1. Raw files, raw records,
source-review evidence and academic reviews live in capf_p2_private with no anonymous
or learner grants and RLS enabled.

RLS exposes only PUBLISH_APPROVED revisions; questions require an active approved
revision belonging to that same question. The security-invoker published view returns
only the current approved projection. Browser roles have no write grants. Taxonomy,
rubrics and raw/editorial tables are not browser-readable.

The database enforces DRAFT → SOURCE_MATCHED → ACADEMIC_REVIEWED → PUBLISH_APPROVED.
Each transition needs a signed approval for the exact revision content hash.
Source evidence must include verified PDF checksum, retrieval timestamp, source URL,
matching year, printed/PDF page coordinates, directions and language rule.
Academic review requires an immutable approved taxonomy, valid demand/domain labels
and different source/academic reviewers. Publication dependencies are row-locked
within the transaction. State cannot be skipped, and draft activation is rejected.
Content changes require a new revision; approved content, taxonomy versions, rubrics
and signed reviews are immutable. There is no browser-accessible promotion RPC.
Only trusted local schema-owner SQL can exercise editorial transitions in B1.

The real importer never creates approvals, verified sources or active pointers.
Whole imports are transactional and identical manifests are idempotent. A new
content hash creates a new draft revision; it cannot replace an approved revision.
Withdrawing an active pointer removes the item from the current published view;
previously approved revisions remain approved in revision history. Full editorial
revocation/rejection/adjudication workflows are deferred to a separate reviewed phase.

## Local commands

Run from the repository root with Python 3 and the locked frontend dependencies:

```sh
npm ci --prefix frontend --ignore-scripts --no-audit --no-fund
python scripts/capf-p2/prepare.py --package /absolute/private/Package_A_directory --research /absolute/private/deep-research-report.md
node scripts/capf-p2/import.mjs
node scripts/capf-p2/import.mjs
python scripts/capf-p2/test_prepare.py
node scripts/capf-p2/check.mjs test
node scripts/capf-p2/check.mjs types
node scripts/capf-p2/check.mjs build
node scripts/capf-p2/smoke.mjs
```

The importer accepts no database URL or remote apply option. It uses PGlite under
ignored .capf-private/database. Preparation writes ignored .capf-private/canonical.json.
Do not upload either directory, the ZIP or research files to this public repository.
CI uses invented fixtures only. No raw draft texts are in tests or documentation.

The migration was named by the installed Supabase CLI, but applied only in embedded
local PostgreSQL. Never run database push/reset, replay legacy migrations, repair
remote migration history or apply test-role stubs to hosted Supabase for this PR.
The existing reconstruction guidance remains authoritative for any future environment.

## Read APIs

- GET /api/capf-paper2/questions: optional year (2020–2026), section (Q1_ESSAY or
  Q2_ARGUMENT), limit (1–50; default 20), offset (0–99999).
- GET /api/capf-paper2/questions/[recordId]: approved detail, otherwise 404.

Both default to 404 CAPF_NOT_AVAILABLE. Enabling requires CAPF_P2_LOCAL_READS=1,
a plain HTTP loopback Supabase URL and no VERCEL environment. No hosted enablement
path exists. The server uses the existing cookie/anonymous Supabase client, never
service credentials, and reads only the publication view. Public approved corpus is
readable anonymously; there are no learner-owned resources in B1.

Unknown/duplicate filters return 400, hidden/absent detail returns the same 404,
database failure returns bounded 503 CORPUS_UNAVAILABLE, and all responses are
no-store. Only GET is implemented; mutations return 405. Every successful response
reports scoring_enabled=false.

PGlite verifies PostgreSQL behavior; it does not provide a PostgREST endpoint.
The API adapter therefore needs a separately reviewed local Supabase setup for
full enabled HTTP integration. Do not point it at AFCAT staging or production.

## Verification and remaining gates

Local checks: 11 Node SQL/API/environment tests, six Python ingestion tests, 20 existing
AFCAT engine/performance tests, TypeScript, scoped ESLint, production-format webpack
build and built HTTP disabled-route smoke. All passed. Real import: 56 drafts,
zero anonymous published records; identical second import: zero additions.
The build used offline database configuration; expected existing static-page data
fetch warnings occurred. Google font download required network access, but no hosted
database credentials or build data hook were used.

The RLS tests exercise anonymous/authenticated reads, denied writes/raw access,
invalid stage skips, missing source evidence, stale review hashes, independent
reviewers, immutable published content, cross-question pointers and synthetic
successful publication. The read tests cover filters, pagination, safe errors and
draft-vs-missing behavior. HTTP smoke checks both built routes return disabled 404
and reject POST with 405.

Not claimed: hosted migration/acceptance, live PostgREST role behavior, full-stack
CAPF staging isolation, production deployment, official-PDF reconciliation, human
academic sign-off, scoring calibration, or broader AFCAT release acceptance.
Those remain separate gates. Keep this PR draft and unmerged.

Database authorization follows the distinction between grants and row policies in
the [Supabase RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security).
