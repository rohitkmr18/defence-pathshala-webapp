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

export default function QuestionRenderer({ text, pattern }: QuestionRendererProps): ReactNode {
  const normalizedText = renderQuestionText(text);
  const kind = normalized(pattern);
  const lowerText = normalizedText.toLowerCase();

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
    kind.includes("pair") ||
    /following pairs?|pairs?\s+(?:is|are)\s+correctly matched/i.test(lowerText)
  ) {
    return <PairRenderer text={normalizedText} />;
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