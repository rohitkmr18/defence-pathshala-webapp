import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const load = require('./test-support/load-ts.cjs')({}, { Request, Response, Buffer });
const { validateEditorialEdition } = load('frontend/src/lib/current-affairs/editorial-validation.ts');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/preflight-current-affairs.mjs <approved-edition.json>');
  process.exit(2);
}
try {
  const edition = JSON.parse(fs.readFileSync(file, 'utf8'));
  validateEditorialEdition(edition);
  const count = edition.stories.reduce((n, story) => n + story.mcqs.length, 0);
  const payload = JSON.stringify({ schemaVersion: 1, operation: 'publish', approved: true, edition });
  if (Buffer.byteLength(payload, 'utf8') > 55000) throw new Error('GitHub issue payload exceeds 55,000 bytes');
  console.log(JSON.stringify({ valid: true, date: edition.date, stories: edition.stories.length, mcqs: count, sha256: edition.approvedEditorial.sha256 }));
} catch (error) {
  console.error('Current Affairs preflight rejected:', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
