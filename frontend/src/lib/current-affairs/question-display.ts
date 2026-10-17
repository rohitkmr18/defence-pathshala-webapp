export type StatementQuestion = { intro: string; statements: string[]; prompt: string };

/**
 * Presentation-only splitting of an explicit, consecutive numbered-statement
 * grammar. Every character is retained; ambiguous structures stay unchanged.
 */
export function parseStatementQuestion(source: string): StatementQuestion | null {
  // Markdown, nested lists and code require their original renderer.
  if (/[*_#<>\[\]]/.test(source) || source.includes(String.fromCharCode(96))) return null;
  if ((source.match(/consider the following statements:/gi) ?? []).length !== 1) return null;
  const intro = source.match(/^([\s\S]*?\bconsider the following statements:\s+)(?=1\.\s+)/i)?.[1];
  const ending = source.match(/\s+(?:Which statements are correct\?|Which of the (?:statements given above|above statements) (?:is|are|is\/are) correct\?)\s*$/);
  if (!intro || !ending || ending.index === undefined || ending.index <= intro.length) return null;
  const block = source.slice(intro.length, ending.index);
  if (block.includes("?")) return null;
  // An explicit second-level or multi-digit enumeration is ambiguous.
  if (/(?:^|\s)(?:0|[1-9]\d{1,2})\.\s+|(?:^|\s)\d+\.\d+(?:\.|\s)/.test(block)) return null;
  const markers = [...block.matchAll(/(?:^|\s)([1-9])\.\s+/g)];
  if (markers.length < 2 || markers.length > 9) return null;
  const starts = markers.map(match => match.index! + match[0].indexOf(match[1] + "."));
  if (starts[0] !== 0 || markers.some((match, index) => Number(match[1]) !== index + 1)) return null;
  const statements = starts.map((start, index) => block.slice(start, starts[index + 1] ?? block.length));
  if (statements.some(text => !/^\d\.\s+\S[\s\S]*[.!]\s*$/.test(text))) return null;
  const result = { intro, statements, prompt: source.slice(ending.index) };
  return result.intro + result.statements.join("") + result.prompt === source ? result : null;
}
