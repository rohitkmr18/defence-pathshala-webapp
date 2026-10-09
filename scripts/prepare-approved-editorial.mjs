import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

// Packaging only: no editorial generation, trimming, rewriting or publication.
export function prepareApprovedEditorial(fields) {
  if (!fields || typeof fields !== 'object' || Array.isArray(fields) || fields.approvedEditorial) throw new Error('Expected complete editorial fields without approval wrapper');
  const source = JSON.stringify(fields);
  return { ...fields, approvedEditorial: { version: 1, source, sha256: createHash('sha256').update(source, 'utf8').digest('hex') } };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const fields = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  process.stdout.write(JSON.stringify(prepareApprovedEditorial(fields), null, 2) + '\n');
}
