# Current Affairs private editorial workflow

The reporting interval is half-open, from the previous day’s 09:00 IST through the current day’s 09:00 IST. An event at exactly 09:00 belongs to the following edition. A delayed run takes the original intended edition date. Pass that date explicitly to the runner. A later reporting window can include related explanatory material up to 72 hours old when it is separately labeled and tied to a fresh event.

## Trusted runner

Run from the repository root with the locked frontend dependencies installed. Provide the existing server-side Supabase URL and service-role key through the trusted runner’s environment. Keep the input, review output and stage evidence in an access-controlled directory. Use isolated database credentials for rehearsal.

```sh
umask 077
node scripts/run-current-affairs-editorial.mjs YYYY-MM-DD adapters.json > review.json
```

The manifest provides `feeds`, `primaryHosts`, `verify`, and `assemble`.
Set `feeds` to a list of trusted HTTPS RSS or Atom endpoints with `url` and
`group` keys. The required groups are `india`, `international`, and
`independent`. Confirm candidate endpoints serve RSS/Atom rather than an HTML
feed directory, and configure the precise primary HTML hostnames in
`primaryHosts`. A trusted scheduler on a runner with the existing server-side
configuration can invoke the CLI at **03:30 UTC (09:00 IST)** with
`--today adapters.json`. It rejects early invocations. Use the dated form
to retry a prior edition, including after midnight.

- **Discover** fetches configured feeds directly, independently of the proposed manuscript. It filters by source timestamps within the edition interval. Feed history must reach the opening boundary and include at least one item at or after it for each required group. An unavailable or thin feed is reported separately. Supplement feeds during editorial research where needed. This check measures configured feed coverage rather than exhaustive news coverage.
- **Verify** and **assemble** accept a private JSON path or a trusted command expressed as an argument array. Commands receive the interval, rubric and successful checkpoints on stdin and return JSON on stdout. They run with a minimal environment, a four-minute timeout and capped output. The proposed evidence includes `headline`, `eventAt`, official `sources` with `url`, `supports` and an exact short `excerpt`, and `context` entries with `publishedAt`, `label` and `linkage`. Record the eight rubric components under `scores`, deductions as `penalties: [{ points, reason }]`, and a written `justification` for scores of 68–74. Assembly returns the full fields described in [Issue 47 acceptance](current-affairs-issue-47.md).
- **Primary-source checks** match the selected release URL and timestamp to discovery, independently fetch the cited HTML through bounded HTTPS with redirects disabled, and verify each proposed excerpt against the visible text. Each key fact must occur in an excerpt. Each MCQ answer must occur without its distractors in the cited excerpt. The review records the fetch time and response SHA-256. The current adapter treats the dated announcement as the fresh event. Context, interpretation, question phrasing and entailment still need editorial scrutiny. PDF-only releases, sources without timestamps and JavaScript-only bodies need a supported primary HTML equivalent.
- **Package** applies the publishing validator and the canonical active, production-eligible, content-eligible PYQ checks. It stores the manuscript, evidence and both the package and publication-source SHA-256 values. Use empty PYQ arrays with an explicit warning when no IDs can be confirmed.

On a stage failure, fix the input or transient dependency and rerun the same command. PostgreSQL retains successful checkpoints and records attempts, starts, failures, completions and expired leases. A concurrent runner gets `busy` while the stage owner holds its lease. The lease expires after five minutes and fences late completions. Three attempts are available for each stage. After exhaustion, inspect the recorded history and use a reviewed correction only once verification and assembly have been completed.

To store a corrected revision after editorial review, use the same validation and PYQ eligibility checks:

```sh
node scripts/run-current-affairs-editorial.mjs YYYY-MM-DD --revise verified.json editorial.json adapters.json > review.json
```

Identical snapshots reuse the original revision. A corrected revision requires fresh founder review. Review the full parsed `snapshot` alongside its `draftId` and package `sha256` through a private channel.

## Founder approval and publication

After explicit approval of the displayed review, the trusted founder GitHub account opens the existing issue titled `DP Current Affairs: publish YYYY-MM-DD` with a reference-only JSON body:

```json
{"schemaVersion":2,"operation":"publish","approved":true,"draftId":"<edition-date>-<package-sha256>","sha256":"<package-sha256>"}
```

The signed GitHub workflow and production Vercel handler authenticate the existing founder account and workflow, revalidate the immutable stored edition, and invoke the existing atomic PostgreSQL publisher through a wrapper. The wrapper serializes publication with revision insertion and rejects stale or missing references. A legacy v1 publish is denied by default. During retirement the database owner may record a reasoned, one-edition exception keyed by the exact approved source SHA-256. It can last at most 48 hours and cannot override a private draft. Expire or remove exceptions through the normal controlled release process. No exception is seeded by the migration. Keep new full payloads off GitHub, including when handling legacy recovery; the repository is public. The separate schema v1 connectivity check is read-only and remains available. Approval binds the reference in a founder-authored GitHub request. GitHub OIDC authenticates the workflow and actor identity. The existing connector’s assertion that a specific ChatGPT message represented founder approval remains a trust dependency.

Check the GitHub run, stored publication hash and public dated story page after a real approved release. An uncertain response requires independent verification before retry.

## Automation and release

A founder signed in to the existing application can retrieve the exact package at
`/api/current-affairs/editorial-review?date=YYYY-MM-DD`. It requires a verified
Supabase account matching server-side `ADMIN_EMAIL`, checks the stored digest,
and returns private, no-store JSON. A preview pointed at production storage
fails closed. Share only the dated link through notifications.

The existing ChatGPT automation remains enabled. The connected automation
lookup succeeds, which is distinct from the reported HTTP 404 in the management
interface or the scheduled runtime's ability to call a private service.
The existing GitHub connector can carry a publish reference after the founder's
single approval. The repository is public, so issues and Actions artifacts
cannot carry manuscripts. The founder browser endpoint provides authenticated
retrieval. It does not delegate the founder's Supabase session to ChatGPT.
Direct scheduled ChatGPT-to-runner trigger and in-chat private package delivery
need a supported authenticated connector and live acceptance. The trusted runner
can be scheduled separately at the same cutoff once source egress and editorial
commands are available.

Release requires explicit migration approval, then app deployment and a reference-only replay in isolation. The additive migration in `supabase/pending/20261128050329_current_affairs_editorial_workflow.sql` creates four RLS-enabled tables and service-role-only operations. Its pending location follows the repository’s applied-migration ledger convention. Anonymous and learner access is revoked. Existing approved editorial source and learner data require no backfill. The updated handler depends on the new database wrapper, so apply the reviewed migration before deploying the handler. Preserve the private tables on app rollback.

The runner uses the existing database and deployment stack. At one maximum-sized 512 KB review daily, the draft plus a copy in the final checkpoint use approximately 31 MB per 30 days before intermediate checkpoints, indexes, storage compression and retention. Provider charges and runner time depend on the selected adapters. This change adds no paid research provider.


The private-draft CI starts a disposable PostgreSQL 17 container with no published network port. It tests concurrent requests on separate connections, role denials, exact byte preservation, retries and the reference-based publication path. The regular Current Affairs regressions cover signed OIDC identities, the historical bridge, publisher rollback and reader behavior.
