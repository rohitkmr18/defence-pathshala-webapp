# ChatGPT-first Current Affairs publishing

## Findings, 9 October 2026

PR #39 replaced the destructive REST ingestion sequence with one insert-only
transactional RPC. The database function is security-invoker, grants EXECUTE
only to service_role/postgres, and explicitly requires current_user=service_role.
The connected SQL tool has no authorised service-role RPC identity. Changing
roles or changing the gate is not an acceptable recovery.

PR #42 fixes only importer success rendering. The existing importer requires
an authenticated admin browser session and therefore does not itself give the
connected ChatGPT tools publication access. No publication workflow existed in
GitHub Actions. The exact transport used on 7/8 October has NOT been established:
conversation retrieval failed; database rows alone cannot establish the caller.

Production read-only evidence: 7 October post 4405779e-5591-4d50-87b5-27b7cddefb0a
has 5 stories/5 MCQs; 8 October post ed9f0639-c658-4fc9-ad5c-ab2bab0f0663 has
4 stories/4 MCQs. No 9 October edition existed at investigation time.

## Decision

Reuse connected GitHub issue creation, GitHub Actions, existing Vercel-held
service key, and existing atomic Supabase RPC. Issue #43 proved ChatGPT can
create issues as account id 321342611. No new long-lived publishing credential,
Supabase grant, RLS policy, database migration, or polling schedule is required.

GitHub Actions obtains a short-lived OIDC token. The Vercel automation endpoint
checks the GitHub signature, issuer, audience, expiry, issue event, main branch,
exact workflow path, immutable repository/owner/actor ids and hosted runner.
Only this authenticated endpoint accesses the existing server-held service key.
This authenticates the trusted workflow; editorial approval is an explicit
request assertion made by ChatGPT after the founder approves the visible draft.
It does not cryptographically prove the content of a ChatGPT conversation.

## Daily operation

1. Present the complete source-verified edition after 09:00 IST.
2. Wait for explicit editorial approval. Do not submit an issue before approval.
3. ChatGPT creates a GitHub issue titled `DP Current Affairs: publish YYYY-MM-DD`.
   Body is raw JSON (no Markdown fence):
   `{ "schemaVersion":1, "operation":"publish", "approved":true, "edition":<approved payload> }`.
4. Workflow validates the founder identity and approval assertion, requests an
   OIDC token and posts the exact snapshot to `/api/current-affairs/automation`.
5. Endpoint validates official-source URL syntax, metadata, MCQ options/keys and
   VERIFIED status, then invokes `publish_current_affairs_edition_atomic` once.
6. Read the workflow result and issue audit, then independently verify the edition
   and child records with Supabase and the public website. Close the request issue
   after verification. No daily admin, SQL, Codex or GitHub interaction by founder.

URL allowlisting checks official hostnames, not factual truth or link availability.
Source dates, factual assertions and answer keys must still be verified editorially.
Only submit data already approved. Missing approved drafts must be requested,
never regenerated from memory and passed off as approved.

## Release and connectivity

CI includes signed-token rejection tests, request validation, an isolated real
PostgreSQL atomic publication/rollback test, and workflow caller validation.
Merge only after CI and Vercel preview readiness. No production test editions.
After production is ready, ChatGPT creates an issue `DP Current Affairs: connectivity`
with `{ "schemaVersion":1, "operation":"connectivity_check" }`.
It authenticates the real workflow and reads one post id using the configured
service client; response must report `writes:0`. It does not prove a live insert.
Only an approved edition supplies the final live publication acceptance.

## Audit and failure handling

Issue metadata, exact request snapshot, payload hash, run id/attempt, timestamps,
HTTP status and result/post id are retained in workflow artifacts (90 days).
An issue comment links the run and preserves the hash/outcome. Vercel logs capture
request/result metadata without payload or credentials. Audit is operational,
not an immutable compliance ledger. Existing unique constraints reject duplicate
editions/stories without replacement. A lost response is uncertain, not success:
read the database before retrying. Never delete or overwrite an earlier edition.

## Current limitation

The full approved 9 October 3-story/4-MCQ package was not found in available
attachments or file search; conversation search returned an error. Publication
must wait for that exact content and primary-source reverification.
