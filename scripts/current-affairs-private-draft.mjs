import { prepareApprovedEditorial } from './prepare-approved-editorial.mjs';
import { mkdir, readFile, writeFile, link, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

// Private filesystem adapter. Caller must provide a durable, access-controlled directory.
// No production credentials, database access, or publishing side effects.
export function verifyDraft(edition) {
  const { approvedEditorial, ...fields } = edition;
  const expected = prepareApprovedEditorial(fields).approvedEditorial;
  if (!approvedEditorial || approvedEditorial.version !== 1 ||
      approvedEditorial.source !== expected.source ||
      approvedEditorial.sha256 !== expected.sha256) throw new Error('Draft integrity mismatch');
  return expected.sha256;
}

export async function persistDraft(directory, fields, validate) {
  if (typeof validate !== 'function') throw new Error('Explicit validator required');
  const edition = prepareApprovedEditorial(fields);
  await validate(edition);
  const hash = verifyDraft(edition);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.date)) throw new Error('Invalid edition date');
  const id = fields.date + '-' + hash;
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const target = join(directory, id + '.json');
  const temporary = join(directory, '.' + randomUUID());
  try {
    await writeFile(temporary, JSON.stringify(edition), { flag: 'wx', mode: 0o600 });
    try { await link(temporary, target); }
    catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const existing = await loadDraft(directory, id);
      if (verifyDraft(existing) !== hash) throw new Error('Draft collision');
    }
  } finally { await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; }); }
  return { id, sha256: hash, edition };
}

export async function loadDraft(directory, id) {
  if (!/^\d{4}-\d{2}-\d{2}-[a-f0-9]{64}$/.test(id)) throw new Error('Invalid draft ID');
  const edition = JSON.parse(await readFile(join(directory, id + '.json'), 'utf8'));
  if (edition.date + '-' + verifyDraft(edition) !== id) throw new Error('Draft identity mismatch');
  return edition;
}

// Only a trusted approval handler may supply the explicit founder assertion.
// This helper does not authenticate the founder or invoke the publishing bridge.
export function approvedEnvelope(edition, approval) {
  const hash = verifyDraft(edition);
  if (approval?.approved !== true || approval.draftId !== edition.date + '-' + hash ||
      approval.sha256 !== hash) throw new Error('Exact founder approval required');
  return { schemaVersion: 1, operation: 'publish', approved: true, edition };
}
