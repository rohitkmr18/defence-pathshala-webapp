import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMonthGrid, shiftMonth, formatMonthLabel, summariseMonths, relativeDayLabel,
  indiaToday, addDays, isValidDateKey, isValidMonthKey,
} from '../lib/current-affairs-calendar.ts';

test('month grid is Monday-first and padded to whole weeks', () => {
  const grid = buildMonthGrid('2026-10'); // 1 Oct 2026 is a Thursday
  assert.equal(grid.length % 7, 0);
  assert.deepEqual(grid.slice(0, 3), [null, null, null]);
  assert.deepEqual(grid[3], { date: '2026-10-01', day: 1 });
  assert.equal(grid.filter(Boolean).length, 31);
});

test('February in a leap year has 29 days', () => {
  assert.equal(buildMonthGrid('2028-02').filter(Boolean).length, 29);
  assert.equal(isValidDateKey('2027-02-29'), false);
  assert.equal(isValidDateKey('2028-02-29'), true);
});

test('shiftMonth crosses year boundaries', () => {
  assert.equal(shiftMonth('2026-01', -1), '2025-12');
  assert.equal(shiftMonth('2026-12', 1), '2027-01');
  assert.equal(formatMonthLabel('2026-11'), 'November 2026');
});

test('summariseMonths counts editions per month, newest first, ignoring bad dates', () => {
  const months = summariseMonths(['2026-10-30', '2026-11-02', '2026-10-01', 'nope', '2026-11-03']);
  assert.deepEqual(months, [
    { month: '2026-11', label: 'November 2026', editionCount: 2 },
    { month: '2026-10', label: 'October 2026', editionCount: 2 },
  ]);
});

test('relative labels use India time', () => {
  // 19:00 UTC on 4 Nov is 00:30 IST on 5 Nov
  const today = indiaToday(new Date('2026-11-04T19:00:00Z'));
  assert.equal(today, '2026-11-05');
  assert.equal(relativeDayLabel('2026-11-05', today), 'Today');
  assert.equal(relativeDayLabel('2026-11-04', today), 'Yesterday');
  assert.equal(relativeDayLabel('2026-11-03', today), null);
  assert.equal(addDays('2026-03-01', -1), '2026-02-28');
});

test('month keys are validated', () => {
  assert.equal(isValidMonthKey('2026-10'), true);
  assert.equal(isValidMonthKey('2026-13'), false);
  assert.equal(isValidMonthKey('2026-1'), false);
});
