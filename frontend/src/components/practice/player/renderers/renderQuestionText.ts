export default function renderQuestionText(value: string): string {
  return value
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function renderOptionText(value: string, optionKey: string): string {
  return renderQuestionText(value)
    .replace(/^\(\s*\n\s*/i, "")
    // Strip only an explicit option label such as "A.", "A)" or "(A)".
    // Never strip a bare leading letter: "Argentina" must not become "rgentina".
    .replace(new RegExp(`^(?:\\(${optionKey}\\)|${optionKey}[.)])\\s+`, "i"), "")
    .trim();
}