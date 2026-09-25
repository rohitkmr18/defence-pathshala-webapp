import renderQuestionText from "./renderQuestionText";

export interface ParsedItem {
  label: string;
  text: string;
}

const NUMBERED_ITEM_PATTERN = /(?<![A-Za-z0-9])((?:\(\d+\))|(?:\d+|[ivxlcdm]+)[.)])(?=\s)/gi;
const LABELED_ITEM_PATTERN = /((?:[A-Da-d])|(?:\d+))[.)]\s+/g;

export function splitNumberedItems(text: string): {
  intro: string;
  items: ParsedItem[];
  outro: string;
} {
  const normalizedText = renderQuestionText(text);
  const matches = Array.from(normalizedText.matchAll(NUMBERED_ITEM_PATTERN));

  if (matches.length < 2) {
    return { intro: normalizedText, items: [], outro: "" };
  }

  const intro = normalizedText.slice(0, matches[0].index).trim();
  const items: ParsedItem[] = [];

  matches.forEach((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end = matches[index + 1]?.index ?? normalizedText.length;
    items.push({
      label: match[1],
      text: normalizedText.slice(start, end).trim(),
    });
  });

  const lastItem = items.at(-1);
  if (!lastItem) {
    return { intro, items, outro: "" };
  }

  const outroMatch = lastItem.text.search(
    /\s+(?=(?:Which|Select|Choose|How many|The correct answer)\b)/i
  );

  if (outroMatch < 0) {
    return { intro, items, outro: "" };
  }

  const outro = lastItem.text.slice(outroMatch).trim();
  lastItem.text = lastItem.text.slice(0, outroMatch).trim();
  return { intro, items, outro };
}

export function splitLabeledItems(text: string): ParsedItem[] {
  const normalizedText = renderQuestionText(text);
  const matches = Array.from(normalizedText.matchAll(LABELED_ITEM_PATTERN));

  return matches.map((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end = matches[index + 1]?.index ?? normalizedText.length;
    return {
      label: match[1],
      text: normalizedText.slice(start, end).trim(),
    };
  });
}

export function QuestionText({ text }: { text: string }) {
  return <span className="whitespace-pre-line">{renderQuestionText(text)}</span>;
}