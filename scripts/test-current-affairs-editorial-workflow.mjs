import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createRequire } from 'node:module';
import { buildPublishingRequest } from './publish-approved-current-affairs.mjs';
import { reportingWindow, rubric, runEditorial } from './run-current-affairs-editorial.mjs';

const require = createRequire(import.meta.url);
const execute = promisify(execFile);
const { edition } = require('./test-support/editorial-fixture.cjs');
const load = require('./test-support/load-ts.cjs')({}, { Request, Response, Buffer });
const { handlePublishingRequest } = load('frontend/src/lib/current-affairs/automation-handler.ts');
const date = '2026-11-28';
const now = Date.parse('2026-11-28T04:30Z');
const hash = source => createHash('sha256').update(source).digest('hex');
const sql = path => readFileSync(path, 'utf8');
const fakeEvent = {
  action: 'opened', repository: { full_name: 'rohitkmr18/defence-pathshala-webapp', id: 1387974858 },
  sender: { id: 321342611 },
  issue: { title: 'DP Current Affairs: publish ' + date, number: 123, user: { id: 321342611 } },
};

async function database(t) {
  const container = process.env.DP_EDITORIAL_TEST_DB;
  if (!container || !/^dp-ca-[a-z0-9-]+$/.test(container)) throw new Error('Set DP_EDITORIAL_TEST_DB to the isolated PostgreSQL container name');
  const name = 'editorial_' + randomUUID().replaceAll('-', '');
  async function psql(database, statement) {
    const { stdout } = await execute('docker', [
      'exec', container, 'psql', '-X', '-qAt', '-v', 'ON_ERROR_STOP=1',
      '-v', 'VERBOSITY=verbose', '-U', 'postgres', '-d', database, '-c', statement,
    ]);
    return stdout.trim();
  }
  await psql('postgres', 'create database ' + name);
  t.after(() => psql('postgres', 'drop database ' + name));
  let role = '';
  const db = {
    async exec(statement) {
      // Each psql invocation is a separate connection. Apply role changes to
      // subsequent calls while allowing fixture setup and bounded fault injection.
      const roles = [...statement.matchAll(/(?:^|;\s*)(reset role|set role (\w+))(?=;|$)/g)];
      const result = await psql(name, role + statement);
      if (roles.length) role = roles.at(-1)[2] ? 'set role ' + roles.at(-1)[2] + ';' : '';
      return result;
    },
    async query(statement, parameters = []) {
      const sql = statement.replace(/\$(\d+)/g, (_, index) => {
        const value = parameters[index - 1];
        return value === null ? 'null' : "'" + String(value).replaceAll("'", "''") + "'";
      });
      const stdout = await psql(name, role + "select coalesce(json_agg(row_to_json(q)), '[]') from (" + sql + ") q");
      return { rows: JSON.parse(stdout) };
    },
  };
  const schema = sql('scripts/test-current-affairs-db-rollback.cjs').match(/const schema = `([\s\S]*?)`;/)[1]
    .replace(/^create role .*;$/gm, '');
  await db.exec(schema);
  await db.exec(`
    create table public.questions(id uuid primary key, question_id text unique, is_active boolean, content_eligible boolean, paper text);
    create view public.v_dp_question_intelligence_v2 as select * from public.questions where is_active;
    grant select, update on public.questions to service_role;
    grant select on public.v_dp_question_intelligence_v2 to service_role;
    insert into public.questions values (gen_random_uuid(), 'CDS_II_2026_GK_011', true, true, 'General Knowledge');
  `);
  for (const migration of ['20261008060157_atomic_current_affairs_publish', '20261009170716_approved_editorial_source', '20261128050329_current_affairs_editorial_workflow']) {
    const directory = migration.startsWith('20261128') ? 'pending' : 'migrations';
    await db.exec(sql('supabase/' + directory + '/' + migration + '.sql'));
  }
  await db.exec('set role service_role');
  return db;
}

const save = (db, snapshot, digest = hash(snapshot)) => db.query('select ca_save_editorial_draft($1,$2,$3)', [date, digest, snapshot]);
const transition = db => async ({ day, step, token, action, output }) => (await db.query(
  'select ca_editorial_stage($1,$2::smallint,$3,$4,$5) result', [day, step, token, action, output === undefined ? null : JSON.stringify(output)],
)).rows[0].result;

test('isolated PostgreSQL protects exact draft bytes, immutable revisions and editorial access', async t => {
  const db = await database(t);
  const snapshot = JSON.stringify({ edition: edition(date), evidence: 'source proof — भारत' });
  await Promise.all([save(db, snapshot), save(db, snapshot)]);
  const { rows } = await db.query('select package, sha256 from ca_editorial_drafts');
  assert.deepEqual(rows, [{ package: snapshot, sha256: hash(snapshot) }]);
  await assert.rejects(save(db, snapshot.replace('भारत', 'tampered'), hash(snapshot)), /check constraint/);
  await assert.rejects(db.exec("update ca_editorial_drafts set package='{}'"), /permission denied/);
  await assert.rejects(db.exec('delete from ca_editorial_drafts'), /permission denied/);
  for (const role of ['anon', 'authenticated']) {
    await db.exec('reset role; set role ' + role);
    for (const table of ['ca_editorial_drafts', 'ca_editorial_stages', 'ca_editorial_events']) {
      await assert.rejects(db.query('select * from ' + table), /permission denied/);
    }
    await assert.rejects(save(db, snapshot), /permission denied/);
    await assert.rejects(db.query('select ca_publish_editorial($1,$2)', [date, hash(snapshot)]), /permission denied/);
    await assert.rejects(transition(db)({ day: date, step: 1, token: randomUUID(), action: 'claim' }), /permission denied/);
  }
});

test('daily orchestration resumes validated checkpoints and publishes only the approved revision in isolation', async t => {
  const db = await database(t);
  const window = reportingWindow(date, now);
  assert.deepEqual(window, { start: '2026-11-27T03:30:00.000Z', end: '2026-11-28T03:30:00.000Z' });
  assert.throws(() => reportingWindow(date, Date.parse('2026-11-28T03:29Z')), /still open/);
  const { approvedEditorial, ...fields } = edition(date);
  const verify = { warnings: [], stories: fields.stories.map(story => ({
    headline: story.headline, eventAt: '2026-11-28T08:59:59+05:30',
    sources: [story.sourceUrl, story.mcqs[0].sourceUrl].map(url => ({ url, checkedAt: '2026-11-28T03:35:00Z', supports: 'Synthetic evidence' })),
    context: [], scores: { ...rubric, pyqLikelihood: 15 }, penalties: [],
  })) };
  const attempts = [];
  const deps = {
    date, now, stage: transition(db),
    checkPyqs: async ids => assert.deepEqual(ids, ['CDS_II_2026_GK_011']),
    async run(name) {
      attempts.push(name);
      if (name === 'discover') return { window, candidates: ['synthetic'], coverage: ['primary sources'] };
      if (name === 'verify') return verify;
      if (attempts.filter(stage => stage === 'assemble').length === 1) return { ...fields, summary: '' };
      return fields;
    },
  };
  await assert.rejects(runEditorial(deps), /assemble failed: Invalid editorial edition/);
  assert.equal((await db.query('select * from ca_editorial_drafts')).rows.length, 0);
  const result = await runEditorial(deps);
  assert.deepEqual(attempts, ['discover', 'verify', 'assemble', 'assemble']);
  assert.deepEqual(await runEditorial(deps), result);
  const events = (await db.query('select event from ca_editorial_events where stage=3 order by occurred_at')).rows;
  assert.deepEqual(events.map(row => row.event), ['started', 'failed', 'started', 'completed']);
  assert.equal(JSON.parse(result.snapshot).edition.approvedEditorial.source, approvedEditorial.source);
  const snapshot = JSON.stringify({ ...JSON.parse(result.snapshot), evidence: { ...verify, warnings: ['Reviewed again'] } });
  const digest = hash(snapshot);
  await save(db, snapshot);
  const body = { schemaVersion: 2, operation: 'publish', approved: true, draftId: date + '-' + digest, sha256: digest };
  function build(payload, event = fakeEvent) {
    return buildPublishingRequest({ ...event, issue: { ...event.issue, body: JSON.stringify(payload) } }, '1234');
  }
  assert.throws(() => build({ ...body, approved: false }), /approval/);
  assert.throws(() => build({ ...body, sha256: result.sha256 }), /approval/);
  assert.throws(() => build(body, { ...fakeEvent, sender: { id: 99 } }), /Unauthorised/);
  const call = async (digest, legacy = null) => {
    try {
      const { rows } = await db.query('select ca_publish_editorial($1,$2,$3) id', [date, digest, legacy && JSON.stringify(legacy)]);
      return { id: rows[0].id };
    } catch (error) {
      return { errorCode: /draft approval/i.test(error.message) ? 'draft_approval' : error.stderr?.match(/ERROR:\s+(\w{5}):/)?.[1] };
    }
  };
  const handler = (request, production = true) => handlePublishingRequest(new Request('https://local.example', {
    method: 'POST', headers: { Authorization: 'Bearer synthetic' }, body: JSON.stringify(request),
  }), {
    verify: async () => ({ actor: 'founder', runId: '1234', runAttempt: '1' }),
    production, ready: () => true, publishDraft: async (_, sha) => call(sha),
    publish: legacy => call(null, legacy), audit: () => {},
  });
  assert.equal((await handler({ ...build(body), sha256: result.sha256 })).status, 422);
  assert.equal((await handler(build(body), false)).status, 403);
  assert.equal((await handler(build({ ...body, draftId: result.draftId, sha256: result.sha256 }))).status, 409);
  const missing = 'f'.repeat(64);
  assert.equal((await handler(build({ ...body, draftId: date + '-' + missing, sha256: missing }))).status, 409);
  assert.equal((await handler(build({ schemaVersion: 1, operation: 'publish', approved: true, edition: edition(date) }))).status, 409);
  assert.equal((await db.query('select * from current_affairs_posts')).rows.length, 0);
  const response = await handler(build(body));
  assert.equal(response.status, 200);
  const stored = (await db.query('select published, approved_editorial_source, approved_editorial_sha256 from current_affairs_posts')).rows;
  assert.deepEqual(stored, [{ published: true, approved_editorial_source: approvedEditorial.source, approved_editorial_sha256: approvedEditorial.sha256 }]);
  assert.equal((await handler(build(body))).status, 409);
});

test('persistent leases fence lost attempts and cap retries', async t => {
  const db = await database(t);
  const stage = transition(db);
  const op = (action, token, output) => stage({ day: date, step: 1, action, token, output });
  const first = randomUUID();
  assert.equal((await op('claim', first)).status, 'claimed');
  assert.equal((await op('claim', randomUUID())).status, 'busy');
  await db.exec("update ca_editorial_stages set lease_until=now()-interval '1 second'");
  for (let i = 0; i < 2; i++) {
    const token = randomUUID();
    assert.equal((await op('claim', token)).status, 'claimed');
    assert.equal((await op('complete', first, {})).status, 'lost_lease');
    assert.equal((await op('fail', token)).status, 'failed');
  }
  assert.equal((await op('claim', randomUUID())).status, 'exhausted');
  assert.equal((await db.query("select * from ca_editorial_events where event='expired'")).rows.length, 1);
});
