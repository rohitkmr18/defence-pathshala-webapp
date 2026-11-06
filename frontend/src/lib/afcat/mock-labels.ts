/**
 * Learner-facing names for AFCAT full mocks, keyed by immutable test code.
 *
 * Published/retired rows in `afcat_tests` cannot be edited (DB trigger
 * `afcat_validate_publication`), so renumbering is done here instead of in the DB.
 * History: AFCAT-FM01-V2 (original, easier) was retired on founder decision
 * (2026-11-05); AFCAT-FM02-V1 is presented as "Full Mock 01" and
 * AFCAT-FM03-V1 (second paper, same difficulty) as "Full Mock 02".
 * Test codes in analytics stay unchanged, so GA4/Supabase history remains comparable.
 */
const MOCK_LABELS: Record<string, string> = {
  "AFCAT-FM02-V1": "AFCAT Full Mock 01",
  "AFCAT-FM03-V1": "AFCAT Full Mock 02",
  "AFCAT-FM01-V2": "AFCAT Practice Mock (retired)",
};

export function afcatMockLabel(code: string | null | undefined, fallback: string): string {
  return (code && MOCK_LABELS[code]) || fallback;
}
