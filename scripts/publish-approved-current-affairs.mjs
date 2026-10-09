import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export const endpoint = 'https://www.defencepathshala.in/api/current-affairs/automation';
export function buildPublishingRequest(event, runId) {
  if (event.action !== 'opened' || event.repository?.full_name !== 'rohitkmr18/defence-pathshala-webapp'
      || event.repository?.id !== 1387974858 || event.sender?.id !== 321342611
      || event.issue?.user?.id !== 321342611 || !event.issue.title.startsWith('DP Current Affairs: ')
      || event.issue.pull_request || !/^\d+$/.test(runId)) throw new Error('Unauthorised publication request');
  if (typeof event.issue.body !== 'string' || Buffer.byteLength(event.issue.body) > 55000) throw new Error('Invalid issue payload');
  const body = JSON.parse(event.issue.body);
  if (body.schemaVersion !== 1 || !['publish', 'connectivity_check'].includes(body.operation)) throw new Error('Invalid publication operation');
  if (body.operation === 'publish' && body.approved !== true) throw new Error('Explicit editorial approval required');
  return { schemaVersion: 1, operation: body.operation, approved: body.approved === true,
    edition: body.operation === 'publish' ? body.edition : undefined, issueNumber: event.issue.number, runId };
}

export async function runPublisher(env = process.env, fetcher = fetch) {
  const event = JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
  const audit = { issueNumber: event.issue?.number, runId: env.GITHUB_RUN_ID, runAttempt: env.GITHUB_RUN_ATTEMPT, requestedAt: new Date().toISOString() };
  let ok = false;
  try {
    if (env.GITHUB_REF !== 'refs/heads/main') throw new Error('Publisher must run from main');
    const request = buildPublishingRequest(event, env.GITHUB_RUN_ID);
    const raw = JSON.stringify(request);
    audit.request = request;
    audit.payloadHash = createHash('sha256').update(raw).digest('hex');
    const oidcUrl = new URL(env.ACTIONS_ID_TOKEN_REQUEST_URL);
    if (oidcUrl.protocol !== 'https:' || !oidcUrl.hostname.endsWith('.actions.githubusercontent.com')) throw new Error('Invalid OIDC request host');
    oidcUrl.searchParams.set('audience', endpoint);
    const identityResponse = await fetcher(oidcUrl, { headers: { Authorization: `Bearer ${env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}` }, redirect: 'error', signal: AbortSignal.timeout(15000) });
    if (!identityResponse.ok) throw new Error('OIDC identity unavailable');
    const { value: token } = await identityResponse.json();
    if (typeof token !== 'string' || !token) throw new Error('OIDC identity unavailable');
    // Mask the short-lived credential before any subsequent operation.
    process.stdout.write(`::add-mask::${token}\n`);
    const res = await fetcher(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: raw, redirect: 'error', signal: AbortSignal.timeout(45000) });
    audit.httpStatus = res.status;
    const result = await res.json().catch(() => ({ error: 'Unexpected publisher response' }));
    // Persist only recognised response fields; never log raw upstream errors/tokens.
    audit.result = { success: result.success === true, postId: result.postId, operation: result.operation, writes: result.writes, error: result.error, payloadHash: result.audit?.payloadHash };
    ok = res.ok && (request.operation === 'connectivity_check' ? result.writes === 0 && result.operation === request.operation : result.success === true && typeof result.postId === 'string');
  } catch {
    audit.result = { error: 'Publication failed or outcome uncertain; independently verify the edition before resubmission.' };
  }
  audit.completedAt = new Date().toISOString();
  fs.writeFileSync('current-affairs-publication-audit.json', JSON.stringify(audit, null, 2));
  const comment = `Current Affairs ${ok ? 'request succeeded' : 'request failed; verify before retrying'}.\n\nOperation: ${audit.request?.operation || 'rejected'}\nPost ID: ${audit.result?.postId || 'none confirmed'}\nPayload SHA-256: ${audit.payloadHash || 'not submitted'}\nHTTP status: ${audit.httpStatus || 'no confirmed response'}\nAudit: https://github.com/rohitkmr18/defence-pathshala-webapp/actions/runs/${env.GITHUB_RUN_ID}`;
  try {
    const res = await fetcher(`https://api.github.com/repos/rohitkmr18/defence-pathshala-webapp/issues/${event.issue.number}/comments`, {
      method: 'POST', headers: { Authorization: `Bearer ${env.GH_TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: comment }), redirect: 'error', signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error('Audit comment unavailable');
  } catch { process.stderr.write('Audit comment could not be saved; workflow artifact retains the result.\n'); }
  if (!ok) process.exitCode = 1;
  return audit;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await runPublisher();
