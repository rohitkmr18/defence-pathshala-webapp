import DefaultRenderer from "./DefaultRenderer";
import { QuestionText, splitLabeledItems } from "./renderer-utils";

interface MatchingSection {
  title: string;
  items: ReturnType<typeof splitLabeledItems>;
}

function getSections(text: string): { intro: string; sections: MatchingSection[] } {
  const labels = Array.from(
    text.matchAll(/\bList\s*(?:[-:]?\s*)?(I|II)\b/gi)
  );

  const candidates = labels.map((label, index) => {
    const start = (label.index ?? 0) + label[0].length;
    const end = labels[index + 1]?.index ?? text.length;
    const body = text.slice(start, end);
    return {
      label,
      body,
      items: splitLabeledItems(body),
    };
  });

  const sectionsWithItems = candidates.filter((candidate) => candidate.items.length > 0);

  if (sectionsWithItems.length < 2) {
    return { intro: text, sections: [] };
  }

  const sections = sectionsWithItems.slice(0, 2).map((section) => {
    const firstItem = section.body.search(/(?<![A-Za-z0-9])(?:[A-Da-d]|\d+)[.)]\s+/);
    const descriptor = firstItem > 0
      ? section.body.slice(0, firstItem).replace(/[():]/g, " ").trim()
      : "";
    const title = `${/II/i.test(section.label[1]) ? "List-II" : "List-I"}${descriptor ? ` (${descriptor})` : ""}`;
    return {
      title,
      items: section.items,
    };
  });

  const intro = text.slice(0, sectionsWithItems[0].label.index).trim();

  return { intro, sections };
}

export default function MatchingRenderer({ text }: { text: string }) {
  const parsed = getSections(text);

  if (parsed.sections.some((section) => section.items.length === 0)) {
    return <DefaultRenderer text={text} />;
  }

  return (
    <div className="space-y-5">
      {parsed.intro && <QuestionText text={parsed.intro} />}
      <div className="grid grid-cols-2 gap-x-5 overflow-hidden rounded-2xl border border-slate-200">
        {parsed.sections.map((section) => (
          <h3 key={section.title} className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800">
            {section.title}
          </h3>
        ))}
        {Array.from({ length: Math.max(...parsed.sections.map((section) => section.items.length)) }).map((_, index) => (
          parsed.sections.map((section) => {
            const item = section.items[index];
            return (
              <div key={`${section.title}-${index}`} className="grid min-w-0 grid-cols-[auto_1fr] gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0">
                {item ? (
                  <>
                    <span className="font-semibold text-slate-700">{item.label}.</span>
                    <span className="min-w-0 whitespace-pre-line">{item.text}</span>
                  </>
                ) : null}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
}