import { createHash, randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { prepareApprovedEditorial } from './prepare-approved-editorial.mjs';

const require = createRequire(import.meta.url);
const load = require('./test-support/load-ts.cjs')();
const { validateEditorialEdition, officialSourceUrl } = load('frontend/src/lib/current-affairs/editorial-validation.ts');
const { createClient } = require('../frontend/node_modules/@supabase/supabase-js');
const runCommand = promisify(execFile);
const dayMs = 86400000;

export const rubric = {
  pyqLikelihood: 30, staticCurrentDurability: 20, questionYield: 20,
  crossExam: 10, provenance: 8, novelty: 5, defenceSecurity: 5, significance: 2,
};

export function reportingWindow(date, now = Date.now()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Expected YYYY-MM-DD edition date');
  const end = new Date(date + 'T03:30:00.000Z');
  if (!Number.isFinite(+end) || end.toISOString().slice(0, 10) !== date) throw new Error('Invalid edition date');
  if (+end > now) throw new Error('Reporting window is still open');
  return { start: new Date(+end - dayMs).toISOString(), end: end.toISOString() };
}

const timestamp = value => typeof value === 'string' &&
  /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)$/.test(value) ? Date.parse(value) : NaN;
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const inWindow = (value, start, end) => timestamp(value) >= start && timestamp(value) < end;

function verifyEvidence(verified, window, edition, pendingSourceCheck = false) {
  if (!Array.isArray(verified?.stories) || !verified.stories.length ||
      !Array.isArray(verified?.warnings) || !verified.warnings.every(nonempty) ||
      (edition && verified.stories.length !== edition.stories.length)) {
    throw new Error('Each story needs a verification record');
  }
  const start = Date.parse(window.start);
  const end = Date.parse(window.end);
  for (const [index, proof] of verified.stories.entries()) {
    const story = edition?.stories[index];
    if (!proof || !nonempty(proof.headline) || (story && proof.headline !== story.headline) ||
        !inWindow(proof.eventAt, start, end) || !Array.isArray(proof.sources) || !proof.sources.length ||
        !Array.isArray(proof.context)) {
      throw new Error('Each story needs a verified event in the reporting window');
    }
    const sources = new Set();
    for (const source of proof.sources) {
      if (!officialSourceUrl(source.url) || !nonempty(source.supports) ||
          (!pendingSourceCheck && !(timestamp(source.checkedAt) >= timestamp(proof.eventAt)))) {
        throw new Error('Invalid official-source evidence');
      }
      sources.add(source.url);
    }
    if (story && ![story.sourceUrl, ...story.mcqs.map(q => q.sourceUrl)].every(url => sources.has(url))) {
      throw new Error('Story and MCQ sources must appear in verified evidence');
    }
    for (const context of proof.context) {
      if (!inWindow(context.publishedAt, end - 3 * dayMs, end) || !nonempty(context.label) || !nonempty(context.linkage)) {
        throw new Error('Recent context needs a timestamp, label and connection to the fresh event');
      }
    }
    const { scores, penalties, justification } = proof;
    if (!scores || Object.keys(scores).length !== Object.keys(rubric).length ||
        !Object.entries(rubric).every(([key, max]) => Number.isInteger(scores[key]) && scores[key] >= 0 && scores[key] <= max) ||
        !Array.isArray(penalties) ||
        !penalties.every(p => Number.isInteger(p.points) && p.points > 0 && nonempty(p.reason))) {
      throw new Error('Invalid editorial rubric components');
    }
    const score = Object.values(scores).reduce((a, b) => a + b, 0) - penalties.reduce((sum, p) => sum + p.points, 0);
    if ((story && score !== story.dpScore) || score < 68 || (score < 75 && !nonempty(justification))) {
      throw new Error('Invalid or unjustified editorial rubric score');
    }
  }
}

function validateAssembly(date, window, manuscript, evidence, pendingSourceCheck = false) {
  const edition = prepareApprovedEditorial(manuscript);
  validateEditorialEdition(edition);
  if (edition.date !== date) throw new Error('Edition date differs from reporting window');
  verifyEvidence(evidence, window, edition, pendingSourceCheck);
  return edition;
}

async function packageEdition(date, window, manuscript, evidence, checkPyqs) {
  const edition = validateAssembly(date, window, manuscript, evidence);
  await checkPyqs([...new Set(edition.stories.flatMap(story => story.linkedPyqIds))]);
  const snapshot = JSON.stringify({ edition, window, evidence });
  if (Buffer.byteLength(snapshot) > 512000) throw new Error('Editorial package exceeds 512,000 bytes');
  const sha256 = createHash('sha256').update(snapshot, 'utf8').digest('hex');
  return { draftId: `${date}-${sha256}`, sha256, snapshot };
}

export async function runEditorial({ date, stage, run, checkPyqs, checkSources, now }) {
  const window = reportingWindow(date, now);
  const checkpoints = {};
  for (const [index, name] of ['discover', 'verify', 'assemble', 'package'].entries()) {
    const step = index + 1;
    const token = randomUUID();
    const request = (action, output) => stage({ day: date, step, token, action, output });
    const claim = await request('claim');
    if (claim.status === 'completed') {
      if (checkSources && name === 'assemble' && !claim.checkpoint?.evidence) {
        throw new Error('Stored assembly predates primary-source verification');
      }
      checkpoints[name] = claim.checkpoint;
      continue;
    }
    if (claim.status !== 'claimed') throw new Error(`Editorial stage ${name}: ${claim.status}`);
    try {
      let output;
      if (name === 'package') {
        output = await packageEdition(date, window, checkpoints.assemble.manuscript ?? checkpoints.assemble, checkpoints.assemble.evidence ?? checkpoints.verify, checkPyqs);
      } else {
        output = await run(name, { date, window, rubric, checkpoints });
        if (name === 'discover' && (output?.window?.start !== window.start || output.window.end !== window.end ||
            !Array.isArray(output.candidates) || !Array.isArray(output.coverage) || output.coverage.length === 0)) {
          throw new Error('Discovery must report coverage for the entire reporting window');
        }
        if (name === 'verify') verifyEvidence(output, window, undefined, !!checkSources);
        if (name === 'assemble') {
          validateAssembly(date, window, output, checkpoints.verify, !!checkSources);
          if (checkSources) {
            const evidence = structuredClone(checkpoints.verify);
            await checkSources(output, evidence, checkpoints.discover);
            output = { manuscript: output, evidence };
          }
        }
      }
      const completion = await request('complete', output);
      if (completion.status !== 'completed') throw new Error('Editorial stage lease expired');
      checkpoints[name] = output;
    } catch (error) {
      await request('fail').catch(() => {});
      throw new Error(`Editorial stage ${name} failed: ${error.message}`, { cause: error });
    }
  }
  return checkpoints.package;
}

async function runJsonCommand(file, args, input, maxBuffer = 512000) {
  const execution = runCommand(file, args, {
    timeout: 240000, killSignal: 'SIGKILL', maxBuffer,
    env: { PATH: process.env.PATH, LANG: 'C.UTF-8' },
  });
  execution.child.stdin.on('error', () => {});
  execution.child.stdin.end(JSON.stringify(input));
  const { stdout } = await execution.catch(() => { throw new Error('Editorial adapter failed or timed out'); });
  return JSON.parse(stdout);
}

const sourceCommand = input => runJsonCommand('python3', ['scripts/current-affairs-sources.py'], input, 5000000);
const normalized = value => value.normalize('NFKC').replace(/\s+/g, ' ').trim();
function containsPhrase(text, phrase) {
  const escaped = normalized(phrase).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('(?<![\\p{L}\\p{N}])' + escaped + '(?![\\p{L}\\p{N}])', 'u').test(normalized(text));
}

export async function verifyPrimarySources(manuscript, evidence, discovered, hosts, fetchPages = sourceCommand) {
  if (!Array.isArray(hosts) || !hosts.length) throw new Error('Configure trusted primary source hosts');
  const urls = [...new Set(evidence.stories.flatMap(proof => proof.sources.map(source => source.url)))];
  if (!urls.every(url => officialSourceUrl(url) && hosts.includes(new URL(url).hostname))) {
    throw new Error('Source outside approved primary hosts');
  }
  const pages = await fetchPages({ operation: 'verify', urls, hosts });
  for (const [index, proof] of evidence.stories.entries()) {
    const story = manuscript.stories[index];
    if (!discovered.candidates.some(candidate => candidate.url === story.sourceUrl &&
        timestamp(candidate.publishedAt) === timestamp(proof.eventAt))) {
      throw new Error('Primary release and event time must match an independently discovered feed item');
    }
    for (const source of proof.sources) {
      const page = pages[source.url];
      if (!page || !/^[a-f0-9]{64}$/.test(page.sha256) || !nonempty(source.excerpt) ||
          normalized(source.excerpt).length < 24 || normalized(source.excerpt).length > 480 ||
          !normalized(page.text).includes(normalized(source.excerpt))) {
        throw new Error('Primary source does not contain the proposed evidence excerpt');
      }
      source.checkedAt = page.checkedAt;
      source.responseSha256 = page.sha256;
    }
    for (const fact of story.keyFacts) {
      if (!proof.sources.some(source => containsPhrase(source.excerpt, fact))) {
        throw new Error('Key fact lacks exact primary-source support');
      }
    }
    for (const question of story.mcqs) {
      const key = question.options[question.correctOption];
      const others = Object.values(question.options).filter(option => option !== key);
      if (!proof.sources.some(source => source.url === question.sourceUrl &&
          containsPhrase(source.excerpt, key) &&
          others.every(option => !containsPhrase(source.excerpt, option)))) {
        throw new Error('MCQ key lacks unambiguous extractive evidence');
      }
    }
  }
  return evidence;
}

async function main([date, adapterPath, evidencePath, manuscriptPath, configPath]) {
  if (date === '--today') date = new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10);
  if (!date || !adapterPath) throw new Error('Usage: node scripts/run-current-affairs-editorial.mjs YYYY-MM-DD trusted-adapters.json');
  const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key } = process.env;
  const target = new URL(url);
  if (!key || target.username || target.password || (target.protocol !== 'https:' &&
      !['localhost', '127.0.0.1'].includes(target.hostname))) throw new Error('Invalid trusted Supabase target or service role');
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const rpc = async (name, args) => {
    const { data, error } = await client.rpc(name, args).abortSignal(AbortSignal.timeout(15000));
    if (error) throw new Error(`${name} failed (${error.code || 'transport'})`);
    return data;
  };
  async function checkPyqs(ids) {
    if (!ids.length) return;
    const eligible = await rpc('ca_check_editorial_pyqs', { ids });
    if (eligible !== true) {
      throw new Error('Exact linked PYQ eligibility could not be verified');
    }
  }
  if (adapterPath === '--revise') {
    const evidence = await readArtifact(evidencePath);
    const manuscript = await readArtifact(manuscriptPath);
    const config = await readArtifact(configPath);
    const window = reportingWindow(date);
    validateAssembly(date, window, manuscript, evidence, true);
    const { data, error } = await client.from('ca_editorial_stages').select('checkpoint')
      .eq('edition_date', date).eq('stage', 1).abortSignal(AbortSignal.timeout(15000)).single();
    if (error || !data?.checkpoint) throw new Error('Discovery checkpoint required for revision');
    await verifyPrimarySources(manuscript, evidence, data.checkpoint, config.primaryHosts);
    const review = await packageEdition(date, window, manuscript, evidence, checkPyqs);
    await rpc('ca_save_editorial_draft', { day: date, digest: review.sha256, snapshot: review.snapshot });
  } else {
    const adapters = await readArtifact(adapterPath);
    await runEditorial({
      date,
      stage: args => rpc('ca_editorial_stage', args),
      checkPyqs,
      checkSources: (manuscript, evidence, discovered) => verifyPrimarySources(manuscript, evidence, discovered, adapters.primaryHosts),
      async run(name, input) {
        if (name === 'discover') {
          const discovered = await sourceCommand({ operation: 'discover', feeds: adapters.feeds, window: input.window });
          for (const group of ['india', 'international', 'independent']) {
            if (!discovered.coverage.some(source => source.group === group && source.status === 'checked')) {
              throw new Error('Required discovery coverage unavailable for ' + group);
            }
          }
          return discovered;
        }
        const command = adapters[name];
        if (typeof command === 'string') return readArtifact(command);
        if (!Array.isArray(command) || !command.length || !command.every(nonempty)) throw new Error('Trusted stage command required');
        const [file, ...args] = command;
        return runJsonCommand(file, args, input);
      },
    });
  }
  const { data, error } = await client.from('ca_editorial_drafts').select('sha256,package')
    .eq('edition_date', date).order('revision', { ascending: false }).limit(1)
    .abortSignal(AbortSignal.timeout(15000)).single();
  if (error || createHash('sha256').update(data.package, 'utf8').digest('hex') !== data.sha256) {
    throw new Error('Could not verify stored review package');
  }
  process.stdout.write(JSON.stringify({ draftId: `${date}-${data.sha256}`, sha256: data.sha256, snapshot: data.package }) + '\n');
}

async function readArtifact(path) {
  const artifact = await readFile(path);
  if (artifact.byteLength > 512000) throw new Error('Editorial artifact exceeds 512,000 bytes');
  return JSON.parse(artifact);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main(process.argv.slice(2)).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
