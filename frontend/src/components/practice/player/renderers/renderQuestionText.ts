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
    .replace(new RegExp(`^\\(?${optionKey}\\)?[.)]?\\s*`, "i"), "")
    .trim();
}