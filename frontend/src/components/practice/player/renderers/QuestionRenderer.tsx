import type { ReactNode } from "react";
import AssertionReasonRenderer from "./AssertionReasonRenderer";
import DefaultRenderer from "./DefaultRenderer";
import MatchingRenderer from "./MatchingRenderer";
import PairRenderer from "./PairRenderer";
import renderQuestionText from "./renderQuestionText";
import StatementRenderer from "./StatementRenderer";

interface QuestionRendererProps {
  text: string;
  pattern?: string | null;
}

function normalized(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

// A figure line inside a stem: ![Alt text](/pyq-figures/<paper>/<file>.svg). Same-origin files only.
const FIGURE_LINE = /^\s*!\[([^\]]*)\]\((\/pyq-figures\/[A-Za-z0-9_\-/]+\.(?:svg|png|webp))\)\s*$/;

export default function QuestionRenderer({ text, pattern }: QuestionRendererProps): ReactNode {
  const lines = renderQuestionText(text).split("\n");
  if (lines.some((l) => FIGURE_LINE.test(l))) {
    const parts: ReactNode[] = [];
    let buffer: string[] = [];
    const flush = (key: number) => {
      const chunk = buffer.join("\n").trim();
      if (chunk) parts.push(<QuestionRenderer key={`t${key}`} text={chunk} pattern={pattern} />);
      buffer = [];
    };
    lines.forEach((line, i) => {
      const m = FIGURE_LINE.exec(line);
      if (!m) return void buffer.push(line);
      flush(i);
      parts.push(
        <figure key={`f${i}`} className="my-4 flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG diagrams */}
          <img src={m[2]} alt={m[1] || "Figure"} className="h-auto w-full max-w-sm rounded-xl border border-slate-200 bg-white p-2" />
        </figure>,
      );
    });
    flush(lines.length);
    return <>{parts}</>;
  }
  const normalizedText = renderQuestionText(text);
  const kind = normalized(pattern);
  const lowerText = normalizedText.toLowerCase();

  // Some source rows are tagged "Match the Following" even when the
  // question is actually a list of independent pairs. Prefer the pair renderer
  // when the stem itself says "pairs" so the UI follows the paper structure.
  if (
    kind.includes("pair") ||
    /following pairs?|pairs?\s+(?:is|are)\s+correctly matched/i.test(lowerText)
  ) {
    return <PairRenderer text={normalizedText} />;
  }

  if (
    kind.includes("matching") ||
    kind.includes("list") ||
    (/list\s*[-:]?\s*i{1,2}/i.test(normalizedText) && /list\s*[-:]?\s*ii/i.test(normalizedText))
  ) {
    return <MatchingRenderer text={normalizedText} />;
  }

  if (
    kind.includes("assertion") ||
    kind.includes("reason") ||
    (/assertion\s*\(?(?:a)\)?\s*:/i.test(normalizedText) && /reason\s*\(?(?:r)\)?\s*:/i.test(normalizedText))
  ) {
    return <AssertionReasonRenderer text={normalizedText} />;
  }

  if (
    kind.includes("statement") ||
    kind.includes("multi") ||
    /following statements?/i.test(normalizedText)
  ) {
    return <StatementRenderer text={normalizedText} />;
  }

  return <DefaultRenderer text={normalizedText} />;
}