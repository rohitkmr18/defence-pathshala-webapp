import DefaultRenderer from "./DefaultRenderer";
import { QuestionText } from "./renderer-utils";

export default function AssertionReasonRenderer({ text }: { text: string }) {
  const assertionMatch = /Assertion\s*\(?(?:A)\)?\s*:\s*/i.exec(text);
  const reasonMatch = /Reason\s*\(?(?:R)\)?\s*:\s*/i.exec(text);

  if (!assertionMatch || !reasonMatch || (assertionMatch.index ?? 0) > (reasonMatch.index ?? 0)) {
    return <DefaultRenderer text={text} />;
  }

  const intro = text.slice(0, assertionMatch.index).trim();
  const assertion = text.slice(
    (assertionMatch.index ?? 0) + assertionMatch[0].length,
    reasonMatch.index
  ).trim();
  const reason = text.slice(
    (reasonMatch.index ?? 0) + reasonMatch[0].length
  ).trim();

  return (
    <div className="space-y-5">
      {intro && <QuestionText text={intro} />}
      <div className="space-y-4">
        <p>
          <strong>Assertion (A):</strong> <QuestionText text={assertion} />
        </p>
        <p>
          <strong>Reason (R):</strong> <QuestionText text={reason} />
        </p>
      </div>
    </div>
  );
}