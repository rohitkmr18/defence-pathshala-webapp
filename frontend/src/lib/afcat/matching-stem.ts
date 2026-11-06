/**
 * Splits a matching-question stem written as
 *   "<intro> List-I: A. ... B. ... List-II: 1. ... 2. ..."
 * into an intro and two item lists, so the learner sees two columns like a printed paper.
 * Returns null for anything that does not clearly match, and the caller falls back to plain text.
 */
export type MatchingColumn = { label: string; items: string[] };
export type MatchingStem = { intro: string; left: MatchingColumn; right: MatchingColumn };

const STEM_PATTERN = /^([\s\S]*?)\bList-I:\s*([\s\S]*?)\s*\bList-II:\s*([\s\S]+)$/;
const LEFT_SPLIT = /\s+(?=[A-H]\.\s)/;
const RIGHT_SPLIT = /\s+(?=\d+\.\s)/;

function items(raw: string, splitter: RegExp): string[] {
  return raw.split(splitter).map((part) => part.trim()).filter(Boolean);
}

export function parseMatchingStem(text: string): MatchingStem | null {
  const match = text.match(STEM_PATTERN);
  if (!match) return null;
  const intro = match[1].trim();
  const left = items(match[2], LEFT_SPLIT);
  const right = items(match[3], RIGHT_SPLIT);
  // Both sides must look like real lists; otherwise keep the original text.
  if (left.length < 2 || right.length < 2) return null;
  return {
    intro,
    left: { label: "List-I", items: left },
    right: { label: "List-II", items: right },
  };
}
