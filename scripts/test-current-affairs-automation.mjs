import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { buildPublishingRequest } from './publish-approved-current-affairs.mjs';
import { verifyPublishingIdentity, PUBLISH_AUDIENCE, PUBLISH_WORKFLOW } from '../frontend/src/lib/current-affairs/github-identity.ts';
import { validateEditorialEdition, officialSourceUrl } from '../frontend/src/lib/current-affairs/editorial-validation.ts';
import { generateKeyPair, SignJWT, exportJWK, createLocalJWKSet } from '../frontend/node_modules/jose/dist/webapi/index.js';
const require = createRequire(import.meta.url);
const ts = require('../frontend/node_modules/typescript');
const { PGlite } = require('../frontend/node_modules/@electric-sql/pglite');
// Resolve the production helper's extensionless import without altering Next.js source.
const helper = fs.readFileSync('frontend/src/lib/current-affairs/automation-handler.ts', 'utf8')
  .replace('"./editorial-validation"', JSON.stringify(pathToFileURL(`${process.cwd()}/frontend/src/lib/current-affairs/editorial-validation.ts`).href));
const js = ts.transpileModule(helper, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { handlePublishingRequest } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);

const { publicKey, privateKey } = await generateKeyPair('RS256');
const jwk = await exportJWK(publicKey);
jwk.kid = 'local-test-only';
const key = createLocalJWKSet({ keys: [jwk] });
const claims = {
  repository: 'rohitkmr18/defence-pathshala-webapp', repository_id: '1387974858',
  repository_owner_id: '321342611', actor_id: '321342611', actor: 'rohitkmr18',
  ref: 'refs/heads/main', workflow_ref: PUBLISH_WORKFLOW, event_name: 'issues',
  runner_environment: 'github-hosted', run_id: '1234', run_attempt: '1',
};
async function token(changes = {}, signer = privateKey) {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ ...claims, ...changes }).setProtectedHeader({ alg: 'RS256', kid: jwk.kid })
    .setIssuer(changes.iss || 'https://token.actions.githubusercontent.com')
    .setAudience(changes.aud || PUBLISH_AUDIENCE).setSubject('repo:local-test:ref:refs/heads/main')
    .setJti('local-test').setIssuedAt(changes.iat ?? now).setNotBefore(changes.nbf ?? now)
    .setExpirationTime(changes.exp ?? now + 240).sign(signer);
}
test('signed, intended workflow identity succeeds', async () => {
  assert.deepEqual(await verifyPublishingIdentity(await token(), key), { actor: 'rohitkmr18', runId: '1234', runAttempt: '1' });
});
for (const [name, change] of Object.entries({
  audience: { aud: 'other' }, issuer: { iss: 'https://attacker.invalid' },
  expired: { exp: 1 }, stale: { iat: 1 }, future: { nbf: Math.floor(Date.now()/1000)+600 },
  repository: { repository_id: '1' }, owner: { repository_owner_id: '1' }, actor: { actor_id: '1' },
  branch: { ref: 'refs/heads/feature' }, workflow: { workflow_ref: 'other' },
  event: { event_name: 'pull_request' }, runner: { runner_environment: 'self-hosted' },
})) test(`OIDC rejects wrong ${name}`, async () => {
  await assert.rejects(verifyPublishingIdentity(await token(change), key));
});
test('OIDC rejects forged signature and malformed token', async () => {
  const other = await generateKeyPair('RS256');
  await assert.rejects(verifyPublishingIdentity(await token({}, other.privateKey), key));
  await assert.rejects(verifyPublishingIdentity('not.a.jwt', key));
});
function edition(date = '2026-10-09') {
  return { date, title: 'Isolated QA edition', summary: 'Synthetic test only', stories: Array.from({ length: 3 }, (_, i) => ({
    headline: `Isolated story ${date} ${i}`, whatHappened: 'Synthetic verified fixture', whyItMatters: 'Exam application',
    keyFacts: ['Fact'], subject: 'Economy', topic: 'Test topic', examTags: ['CAPF'], dpScore: 85,
    sourceName: 'PIB', sourceUrl: `https://pib.gov.in/test/${date}/${i}`, sourceDate: date,
    mcqs: Array.from({ length: i === 0 ? 2 : 1 }, (_, n) => ({ question: `Fixture ${i}/${n}?`, options: { A: 'One', B: 'Two', C: 'Three', D: 'Four' },
      correctOption: 'B', explanation: 'Fixture explanation', examEdge: 'Fixture exam edge', difficulty: 'Moderate',
      contentStatus: 'VERIFIED', sourceUrl: 'https://pib.gov.in/test/source', concept: 'Fixture concept', examTags: ['CDS', 'CAPF'] })),
  })) };
}
test('source URL checks reject lookalike domains, credentials, insecure and arbitrary URLs', () => {
  for (const url of ['http://pib.gov.in/x', 'https://pib.gov.in.evil.com/x', 'https://user:secret@pib.gov.in/x', 'https://127.0.0.1/x', 'https://example.com/x', 'garbage']) assert.equal(officialSourceUrl(url), false);
  assert.equal(officialSourceUrl('https://pib.gov.in/PressReleasePage.aspx?PRID=1'), true);
});
for (const [name, mutate] of Object.entries({
  date: p => p.date = '2026-02-30', source: p => p.stories[0].sourceUrl = 'https://evil.com',
  unverified: p => p.stories[0].mcqs[0].contentStatus = 'REVIEW_REQUIRED',
  missingOption: p => delete p.stories[0].mcqs[0].options.D,
  duplicateOption: p => p.stories[0].mcqs[0].options.D = ' one ',
  key: p => p.stories[0].mcqs[0].correctOption = 'E',
  explanation: p => p.stories[0].mcqs[0].explanation = '',
  mcqSource: p => p.stories[0].mcqs[0].sourceUrl = 'http://pib.gov.in',
  futureSource: p => p.stories[0].sourceDate = '2026-10-10',
})) test(`editorial validation rejects ${name}`, () => { const p = edition(); mutate(p); assert.throws(() => validateEditorialEdition(p)); });

const envelope = p => ({ schemaVersion: 1, operation: 'publish', approved: true, edition: p, issueNumber: 99, runId: '1234' });
function request(body, auth = 'Bearer fixture') { return new Request(PUBLISH_AUDIENCE, { method: 'POST', headers: auth ? { authorization: auth } : {}, body: typeof body === 'string' ? body : JSON.stringify(body) }); }
function deps(overrides = {}) { return { verify: async () => ({ actor: 'rohitkmr18', runId: '1234', runAttempt: '1' }), ready: () => true, production: true,
  publish: async () => { throw new Error('No test writes expected'); }, connectivity: async () => true, audit: () => {}, ...overrides }; }
test('handler rejects absent/invalid identity without database access', async () => {
  assert.equal((await handlePublishingRequest(request(envelope(edition()), null), deps())).status, 401);
  assert.equal((await handlePublishingRequest(request(envelope(edition())), deps({ verify: async () => { throw new Error('invalid'); } }))).status, 401);
});
test('handler rejects invalid JSON, oversized body, unapproved and preview publication', async () => {
  assert.equal((await handlePublishingRequest(request('{'), deps())).status, 400);
  assert.equal((await handlePublishingRequest(request('x'.repeat(60001)), deps())).status, 413);
  assert.equal((await handlePublishingRequest(request({ ...envelope(edition()), approved: false }), deps())).status, 403);
  assert.equal((await handlePublishingRequest(request(envelope(edition())), deps({ production: false }))).status, 403);
  assert.equal((await handlePublishingRequest(request({ ...envelope(edition()), runId: 'wrong' }), deps())).status, 400);
});
test('connectivity check is authenticated and performs zero writes', async () => {
  const res = await handlePublishingRequest(request({ schemaVersion: 1, operation: 'connectivity_check', issueNumber: 99, runId: '1234' }), deps());
  assert.equal(res.status, 200); assert.equal((await res.json()).writes, 0);
});
test('isolated signed identity → HTTP handler → real PostgreSQL RPC preserves 3 stories / 4 MCQs and rolls back', async () => {
  const db = new PGlite();
  const oldTest = fs.readFileSync('scripts/test-current-affairs-db-rollback.cjs', 'utf8');
  const schema = oldTest.match(/const schema = `([\s\S]*?)`;/)[1];
  try {
    await db.exec(schema);
    await db.exec(fs.readFileSync('supabase/migrations/20261008060157_atomic_current_affairs_publish.sql', 'utf8'));
    await db.exec('set role service_role'); // Isolated fixture only; never applied to production.
    const publish = async p => {
      try { return { id: (await db.query('select public.publish_current_affairs_edition_atomic($1::jsonb) id', [JSON.stringify(p)])).rows[0].id }; }
      catch (e) { return { errorCode: e.code }; }
    };
    const records = [];
    const d = deps({ verify: t => verifyPublishingIdentity(t, key), publish, audit: r => records.push(r) });
    const auth = `Bearer ${await token()}`;
    const payload = edition();
    const result = await handlePublishingRequest(request(envelope(payload), auth), d);
    assert.equal(result.status, 200);
    const id = (await result.json()).postId;
    const before = (await db.query('select * from current_affairs_posts order by date')).rows;
    assert.equal(before[0].published, true);
    assert.equal((await db.query('select count(*)::int n from current_affairs_stories where post_id=$1', [id])).rows[0].n, 3);
    const questions = (await db.query('select m.* from current_affairs_mcqs m join current_affairs_stories s on s.id=m.story_id where s.post_id=$1 order by m.question_number', [id])).rows;
    assert.equal(questions.length, 4);
    const expected = payload.stories.flatMap(s => s.mcqs);
    for (let i=0; i<4; i++) {
      assert.equal(questions[i].correct_option, expected[i].correctOption);
      assert.equal(questions[i].explanation, expected[i].explanation);
      assert.equal(questions[i].source_url, expected[i].sourceUrl);
      assert.equal(questions[i].concept, expected[i].concept);
      assert.deepEqual(questions[i].exam_tags, expected[i].examTags);
    }
    assert.equal((await handlePublishingRequest(request(envelope(payload), auth), d)).status, 409);
    const late = edition('2026-10-10');
    late.stories[2].headline = late.stories[0].headline;
    late.stories[2].sourceUrl = late.stories[0].sourceUrl;
    assert.equal((await handlePublishingRequest(request(envelope(late), auth), d)).status, 409);
    assert.deepEqual((await db.query('select * from current_affairs_posts order by date')).rows, before);
    assert.equal((await db.query('select count(*)::int n from current_affairs_stories')).rows[0].n, 3);
    assert.equal((await db.query('select count(*)::int n from current_affairs_mcqs')).rows[0].n, 4);
    assert.ok(records.some(r => r.postId === id && r.payloadHash && r.runId === '1234'));
    assert.ok(records.every(r => !JSON.stringify(r).includes(auth)));
  } finally { await db.close(); }
});
test('worker accepts founder-created issue snapshot and rejects outsider or missing approval', () => {
  const e = { action: 'opened', repository: { full_name: 'rohitkmr18/defence-pathshala-webapp', id: 1387974858 }, sender: { id: 321342611 },
    issue: { number: 99, user: { id: 321342611 }, title: 'DP Current Affairs: publish 2026-10-09', body: JSON.stringify(envelope(edition())) } };
  assert.equal(buildPublishingRequest(e, '1234').issueNumber, 99);
  assert.throws(() => buildPublishingRequest({ ...e, sender: { id: 1 } }, '1234'));
  assert.throws(() => buildPublishingRequest({ ...e, issue: { ...e.issue, body: JSON.stringify({ schemaVersion: 1, operation: 'publish', approved: false }) } }, '1234'));
  const workflow = fs.readFileSync('.github/workflows/current-affairs-publish.yml', 'utf8');
  assert.doesNotMatch(workflow, /schedule:|pull_request_target:|SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(workflow, /id-token: write/);
});
