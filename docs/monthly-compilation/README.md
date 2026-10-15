# Monthly Intelligence compilation — Phase 2

This branch is stacked on PR #61 (`feat/monthly-intelligence-public-sample`, inspected head `d20cc44a1f84decb8f1caf1410c538d0548b33d6`). Main was inspected at `e00ac43194ced005e97dc55649dd1a226d7d7762`. Neither PR is merged by this work. The full October edition remains DRAFT and unavailable for purchase.

## Source inventory and editorial blockers

[Machine-readable audit](source-audit-2026-10.json), [coverage](coverage.json), [explicit pilot manifest](pilot-manifest.json), [editorial queue](editorial-decisions.json).

Read-only published-source audit as of **15 October 2026**: nine published dates (7–15 October), 37 relational stories and 39 MCQs. Six editions (10–15 October) preserve approved manuscripts: 25 stories / 26 MCQs. The 7–9 October legacy editions have no preserved approved manuscript; none was reconstructed. 1–6 October have no published edition. 16–31 October are future dates, not missing publications. All 42 distinct referenced canonical PYQs were eligible at audit time; eligibility does not confer editorial verification. Each retained status, including UNCHECKED, is in the report.

Two candidate pairs await editorial decisions: a same-development pair and the 13/14 October BIMSTEC announcement/outcome follow-up. No story was silently merged, removed or rewritten. Candidate detection uses exact content identity, shared official URL and headline-token similarity; it is a review aid, not semantic adjudication. Explicit exclusions require reasons. Candidate retention requires reviewer identity, reason and a retain-separate/retain-follow-up decision. Excluding a duplicate also requires an explicit manifest reason.

October approval is blocked by the open coverage window, missing dates, missing legacy manuscripts, unresolved pairs and founder approval. Source absence is an editorial condition, not permission to invent manuscripts. The sample is a VALIDATED single-story artifact from already approved public daily content; it does not approve/release the monthly edition.

## Commands

Node 22, frontend lockfile dependencies, Python 3.11 and Chromium are required. Fonts and their licenses are bundled under `scripts/monthly/fonts`. No new application runtime PDF dependency, database table or migration is introduced.

```sh
npm ci --prefix frontend
python -m venv .monthly-venv
.monthly-venv/bin/python -m pip install -r scripts/monthly/requirements.txt
node --test scripts/monthly/core.test.mjs
node scripts/monthly/cli.mjs sample
node scripts/monthly/build-sample.mjs
# Generic snapshot build (private review or separately approved edition):
node scripts/monthly/build-book.mjs PRIVATE_VALIDATED_SNAPSHOT.json PRIVATE_OUTPUT_DIR
node scripts/monthly/layout-test.mjs
node scripts/monthly/verify-package.mjs
```

`build-sample.mjs` compiles the explicit allowlist, validates, renders twice, normalizes metadata/IDs without changing visible pixels, checks all text and artifact checksums, and emits `.monthly-build/sample/{snapshot.json,sample.pdf,parity.json,qa.json,pages/}`. It does not publish anything. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` and `DP_PDF_PYTHON` when paths differ. Exact byte reproducibility requires the same Chromium version, pinned Python packages, frontend lockfile, generator and bundled fonts. The parity report records Chromium/toolchain fingerprint; CI builds twice in its own toolchain. A different browser version can legitimately produce a different PDF checksum and requires fresh artifact QA.

For a private monthly source export, provide existing server-side read credentials only in the operator environment. The exporter issues bounded GETs against published editions and canonical eligibility metadata. It never writes database records. Do not put exports in public assets, Git, logs or browser bundles.

```sh
node scripts/monthly/export-published.mjs 2026-10 .monthly-build/source-export.json
node scripts/monthly/cli.mjs audit --input .monthly-build/source-export.json --month 2026-10 --out .monthly-build/audit.json
node scripts/monthly/pilot.mjs .monthly-build/source-export.json
node scripts/monthly/cli.mjs compile --input .monthly-build/source-export.json --manifest docs/monthly-compilation/pilot-manifest.json
node scripts/monthly/cli.mjs validate --input .monthly-build/snapshots/2026-10/v1/DRAFT.json
# Validation intentionally fails while editorial decisions remain unresolved.
```

The generic builder emits `edition.pdf` for MONTHLY and `sample.pdf` for SAMPLE, runs both builds and QA, and never publishes. Unreleased monthly PDFs are labelled private editorial review copies.

The source export must include explicit relational story/MCQ identities; omitted identity rows fail closed. The preserved source string is hashed before parsing, and the existing production editorial validator checks original text, options, answer keys and official sources. Inputs are operator-controlled provenance, not an authorization mechanism. Reproduce historical artifacts with the frozen audit `as_of`, not a fresh timestamp.

## Snapshot contract and lifecycle

[Schema](snapshot.schema.json). The content digest is SHA-256 over recursively key-sorted canonical JSON, preserving string bytes and array ordering. Only `content_hash`, `status`, `approval_metadata`, `release_metadata` and `generated_artifacts` are excluded from that digest. The signed approval binds the digest, edition identity and version. Status/metadata fields alone never authorize public access.

| Field | Contract |
| --- | --- |
| schema_version / generator_version | Versioned contract and generator identity |
| edition_id / edition_version / kind | YYYY-MM, positive integer, SAMPLE or MONTHLY |
| status | DRAFT → VALIDATED → APPROVED → RELEASED; no skipping |
| title / coverage_start / coverage_end / source_as_of | Explicit identity, bounded dates and frozen audit date |
| source_edition_ids / source_hashes | Exact approved daily IDs, preserved SHA-256 and source version |
| stories | Real source IDs/ordinals/date, exact approved object, subject/topic/subtopic, exam tags and DP priority |
| mcqs / mcq_ids | Real source question IDs, original wording/options/key/explanation/Exam Edge |
| linked_pyqs | Canonical identity, current eligibility, separate content status and check date |
| coverage_manifest | Included/excluded identities with reasons, missing dates and legacy source gaps |
| editorial_decision_manifest / decision_queue | Explicit source selection, taxonomy/exam/order rules and unresolved candidates |
| content_hash | Immutable substantive snapshot digest |
| correction_lineage | Prior digest/version and correction reason |
| approval_metadata | Independent trusted founder signature; null on compilation/validation |
| release_metadata / generated_artifacts | Separately authorized release and QA-bound artifact identities/checksums |

Compilation creates DRAFT. Validation refuses unresolved candidates. Approval requires Ed25519 evidence from a trusted **server/operator-configured** approver registry; the input cannot nominate its own key. Signature payload is canonical `{edition_id, edition_version, content_hash, actor, decision:"APPROVE", approved_at}`. No founder key, signing service or approval credential is configured by this PR. Monthly approval additionally requires complete source coverage and a closed month. Release re-verifies approval and requires matching content-digest/checksum/QA artifact references. These offline lifecycle utilities do not publish or grant access.

`writeImmutable` refuses a different digest under an existing edition/version and refuses changing an existing state file. Corrections use `correction(previous,input,manifest)` with version +1 and explicit lineage, returning DRAFT; the old version remains intact. Deployment/storage permissions must prevent external file replacement. Future attempts must retain `(edition_id, edition_version, content_hash, story_source_id, mcq_source_id)`; never retarget historical answers to the latest revision.

## eBook and parity

[Actual free sample PDF](../../frontend/public/monthly/2026-10-free-sample.pdf) · [QA report](sample/qa.json) · [parity report](sample/parity.json).

[Cover](sample/page-01.png) · [Contents](sample/page-02.png) · [Story](sample/page-03.png) · [Chapter continuation](sample/page-04.png) · [PYQs](sample/page-05.png) · [MCQ](sample/page-06.png) · [Explanation](sample/page-07.png) · [Sources](sample/page-08.png).

A4 navy/blue design, 12pt body, 9pt minimum metadata/running furniture, restrained yellow Exam Edge, embedded legally licensed fonts, clickable contents/bookmarks/sources and running page numbers. The source manuscript is never a second manually edited PDF input. Revision sections use exact approved key facts, without invented monthly conclusions or coverage metrics. Reliable numbered statements reuse the production lossless parser; ambiguous prompts retain plain rendering.

The web lesson now reads the same pinned single-story snapshot used by PDF generation. Its live published read-model gate still checks the approved daily identity/hash and exact lesson text, and canonical PYQ links retain live eligibility checks. Existing quiz/attempt IDs remain unchanged. PDF answer keys and explanations are part of the deliberately free sample; no paid payload is added to public routes.

Parity checks compare exact editorial/question/option/key/explanation/PYQ/source/version projections, actual rendered DOM blocks, whole-document extracted PDF text (detecting missing/duplicated/unexpected passages), PDF identities and reproducible bytes. QA also checks blank pages, page numbers, bookmarks/destinations, HTTPS link syntax, font sizes, body/page bounds, missing glyphs, independent parser page count, and raw-versus-normalized raster equality. Private stress QA repeats approved text across a 16-page chapter/explanation and adds clearly synthetic typography/table/Unicode cases; it is never packaged for users.

**Known document limitation:** complex Devanagari conjuncts can render visually but extract incorrectly in Chromium/PDF text mappings (observed `श्रीलंका` extraction). Simple Devanagari, Indian names in Latin script, ₹, Greek/scientific notation and tables pass. The exact text gate rejects affected complex-script content; no bypass or rewritten source is permitted. Broader Indic publishing requires resolving extraction and renewed visual QA. The English BIMSTEC sample is unaffected. External link checks validate syntax/destinations in the PDF, not future remote uptime.

The reviewed sample is packaged with `node scripts/monthly/build-sample.mjs --package-reviewed-sample` only after page-image review. CI never uses this packaging flag. Replacing a public artifact requires fresh QA/checksum/parity and visual review. `verify-package.mjs` checks the pinned snapshot, actual server allowlist, packaged PDF checksum and parity evidence before build. CI uploads fresh generated evidence separately; browser-engine differences do not silently replace the reviewed public artifact.

## Security and data access

No database mutations, migrations, RLS changes, production attempts, commerce endpoints, orders, payment code or live configuration changes. All persistence acceptance uses the existing synthetic loopback upstream/PGlite. Preview database isolation is not assumed and no persistence tests run against it. Only metadata and hashes from already published records are committed in the source audit. Unpublished manuscripts and full monthly payloads remain outside public content paths and Git.

`monthly-snapshot.ts` is server-only, imports one reviewed free snapshot, verifies its pinned digest, month/version/kind/story identity and refuses other payloads. Request parameters cannot select snapshots or artifact paths. The client receives the existing explicit free lesson/MCQ allowlist and safe PYQ identities, never service credentials, canonical answer payloads for PYQs, private learner records or a full monthly manuscript. Existing analytics abstraction records a sample PDF click with edition/content/artifact identity and environment/auth context; no purchase-intent event is emitted.

Future full-edition snapshots/artifacts belong in private storage with server-side entitlement-aware reads and short-lived delivery URLs. Answer validation must be server-authoritative. Offline digests and client-provided status/entitlement/QA values cannot grant access. A public static sample remains downloadable if the daily read model is temporarily unavailable; it is independently approved public content. Editorial retraction requires removing the sample artifact and references together.

## Release, reconciliation and rollback

1. Review this stacked PR against `feat/monthly-intelligence-public-sample`; keep PR #61 open/unmerged during acceptance. No production release is performed here.
2. Require CI compiler, document reproducibility, production-build browser checks and independent sample page review. Only a feature-branch Preview is authorized.
3. Before any separately authorized final release, refresh main and both heads, preserve the approved sample digest, and reconcile the Phase 1 base into this branch. Once Phase 1 is explicitly authorized/merged, retarget this PR to main, resolve the reduced diff and rerun all checks on the resulting exact SHA. Do not duplicate/cherry-pick already merged changes blindly.
4. October remains unapproved until the month closes and the missing-source/coverage/duplicate decisions plus trusted founder approval are resolved. No payment journey is enabled.
5. Rollback is a branch/release revert removing the PDF links, static sample artifact and snapshot integration together; restore the Phase 1 live sample read model. No database rollback or migration is needed. Retain versioned artifacts and evidence privately for audit, invalidate any future paid signed delivery links if applicable.

## Phase 3 recommendations

Add private snapshot storage and server read authorization before progress APIs. Reference historical edition version/digest and canonical story/MCQ IDs in progress, bookmarks, revision queue and assessment attempts. Preserve existing daily-free routes and exact PYQ authentication destinations. Use idempotent server-authoritative attempts and assessment scoring, RLS scoped to authenticated learner IDs, isolated persistence tests and a correction-aware progress migration policy. Payments remain a separate, explicitly authorized phase.
