import DefaultRenderer from "./DefaultRenderer";
import { QuestionText, splitNumberedItems } from "./renderer-utils";

export default function PairRenderer({ text }: { text: string }) {
  const parsed = splitNumberedItems(text);

  if (parsed.items.length < 2) {
    return <DefaultRenderer text={text} />;
  }

  return (
    <div className="space-y-5">
      {parsed.intro && <QuestionText text={parsed.intro} />}
      <ol className="list-none space-y-3 pl-1">
        {parsed.items.map((item) => (
          <li key={`${item.label}-${item.text}`} className="flex gap-4">
            <span className="w-7 shrink-0 font-semibold text-slate-700">
              {item.label}
            </span>
            <span className="min-w-0 whitespace-pre-line">{item.text}</span>
          </li>
        ))}
      </ol>
      {parsed.outro && <QuestionText text={parsed.outro} />}
    </div>
  );
}