// ─────────────────────────────────────────────────────────────────────────────
// Current Affairs calendar helpers (pure, no I/O) — used by the list page,
// the month archive pages and the sitemap. Dates are "YYYY-MM-DD" strings in
// India time; month keys are "YYYY-MM".
// ─────────────────────────────────────────────────────────────────────────────

export type CalendarCell = { date: string; day: number } | null;

export interface MonthSummary {
  month: string;
  label: string;
  editionCount: number;
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH_RE = /^(\d{4})-(\d{2})$/;
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad = (n: number) => String(n).padStart(2, "0");

export function isValidDateKey(value: string): boolean {
  const m = DATE_RE.exec(value);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  return mo >= 1 && mo <= 12 && d >= 1 && d <= daysInMonth(y, mo);
}

export function isValidMonthKey(value: string): boolean {
  const m = MONTH_RE.exec(value);
  return Boolean(m) && Number(m![2]) >= 1 && Number(m![2]) <= 12;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Today's date in India (Asia/Kolkata), as YYYY-MM-DD. */
export function indiaToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
}

export function addDays(date: string, delta: number): string {
  const m = DATE_RE.exec(date);
  if (!m) return date;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + delta));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** "Today" / "Yesterday" relative to India time, otherwise null. */
export function relativeDayLabel(date: string, today: string): "Today" | "Yesterday" | null {
  if (date === today) return "Today";
  if (date === addDays(today, -1)) return "Yesterday";
  return null;
}

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Weekday name for a YYYY-MM-DD date (calendar date, no timezone shift). */
export function weekdayName(date: string): string | null {
  const m = DATE_RE.exec(date);
  if (!m) return null;
  return WEEKDAY_NAMES[new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))).getUTCDay()];
}

export function monthKeyOf(date: string): string {
  return date.slice(0, 7);
}

export function shiftMonth(month: string, delta: number): string {
  const m = MONTH_RE.exec(month);
  if (!m) return month;
  const index = Number(m[1]) * 12 + (Number(m[2]) - 1) + delta;
  return `${Math.floor(index / 12)}-${pad((index % 12) + 1)}`;
}

export function formatMonthLabel(month: string): string {
  const m = MONTH_RE.exec(month);
  if (!m) return month;
  return `${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

/** Monday-first grid for a month: leading nulls, then one cell per day, padded to whole weeks. */
export function buildMonthGrid(month: string): CalendarCell[] {
  const m = MONTH_RE.exec(month);
  if (!m) return [];
  const year = Number(m[1]);
  const mo = Number(m[2]);
  const firstWeekday = new Date(Date.UTC(year, mo - 1, 1)).getUTCDay(); // 0 = Sunday
  const leading = (firstWeekday + 6) % 7; // Monday-first
  const cells: CalendarCell[] = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= daysInMonth(year, mo); day++) {
    cells.push({ date: `${month}-${pad(day)}`, day });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/** Months that have at least one edition, newest first. */
export function summariseMonths(dates: readonly string[]): MonthSummary[] {
  const counts = new Map<string, number>();
  for (const date of dates) {
    if (!isValidDateKey(date)) continue;
    const key = monthKeyOf(date);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([month, editionCount]) => ({ month, label: formatMonthLabel(month), editionCount }));
}
