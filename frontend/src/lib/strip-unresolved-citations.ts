/**
 * Remove unresolved AI/tool citation markers from learner-facing prose.
 *
 * The markers are not valid published references. This is a display-only
 * safeguard: retain the database record for editorial review and replacement
 * with verifiable source URLs. Do not alter legitimate URLs or LaTeX.
 */
export function stripUnresolvedCitations(value: string): string {
  return value
    .replace(/\uE200cite\uE202[^\uE201]*\uE201/g, "")
    .replace(/\[cite:\s*[^\]]+\]/gi, "");
}
