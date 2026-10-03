import test from 'node:test';
import assert from 'node:assert/strict';
import { safeAuthNext } from '../lib/auth-navigation.ts';
test('auth return paths deny external URLs, protocol relative URLs and backslashes', () => {
  for (const path of [null, 'https://evil.example', '//evil.example', '/\\evil.example', '/dashboard\n']) assert.equal(safeAuthNext(path), '/dashboard');
  assert.equal(safeAuthNext('/dashboard/practice/full-paper?exam=CDS'), '/dashboard/practice/full-paper?exam=CDS');
});
