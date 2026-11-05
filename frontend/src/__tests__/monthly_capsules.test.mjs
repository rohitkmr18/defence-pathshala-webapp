import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  MONTHLY_CAPSULES, capsuleHotspots, capsulePageSrc, getMonthlyCapsule, sectionForPage, latestMonthlyCapsule,
} from '../lib/monthly-capsules.ts';

const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public');

test('every capsule page image exists and nothing extra is shipped', () => {
  for (const c of MONTHLY_CAPSULES) {
    for (let p = 1; p <= c.pageCount; p++) {
      assert.ok(existsSync(path.join(publicDir, capsulePageSrc(c.edition, p))), `missing page ${p} of ${c.edition}`);
    }
    const files = readdirSync(path.join(publicDir, 'monthly-capsule', c.edition));
    assert.equal(files.length, c.pageCount, 'unexpected files in capsule folder');
    assert.ok(files.every((f) => f.endsWith('.webp')), 'only page images may be published (no PDF)');
  }
});

test('sections are ordered and within the page range', () => {
  for (const c of MONTHLY_CAPSULES) {
    let prev = 0;
    for (const s of c.sections) {
      assert.ok(s.page > prev && s.page <= c.pageCount, `${s.title} out of order/range`);
      prev = s.page;
    }
  }
});

test('hotspots stay inside the page and point at real pages', () => {
  for (const c of MONTHLY_CAPSULES) {
    for (const h of capsuleHotspots(c)) {
      assert.ok(h.left >= 0 && h.top >= 0 && h.left + h.width <= 100 && h.top + h.height <= 100);
      assert.ok(h.target >= 1 && h.target <= c.pageCount && h.page >= 1 && h.page <= c.pageCount);
    }
  }
});

test('lookups', () => {
  const oct = getMonthlyCapsule('2026-10');
  assert.ok(oct);
  assert.equal(getMonthlyCapsule('1999-01'), null);
  assert.equal(sectionForPage(oct, 13).title, 'International Relations');
  assert.equal(sectionForPage(oct, 1), null);
  assert.equal(latestMonthlyCapsule().edition, MONTHLY_CAPSULES.map((c) => c.edition).sort().at(-1));
});
