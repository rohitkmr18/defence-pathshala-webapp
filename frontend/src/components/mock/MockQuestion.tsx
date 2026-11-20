"use client";

import MathText from "@/components/common/MathText";
import type { MockLearnerQuestion } from "@/lib/mock/serialize";

/** Renders a learner question. Statement-type items get a numbered, spaced list; stem text keeps
 *  its line breaks. Optional review props colour the correct / chosen option after submission. */
export default function MockQuestion({
  question, selected, onSelect, disabled, correct,
}: {
  question: MockLearnerQuestion;
  selected: string | null;
  onSelect?: (key: "A" | "B" | "C" | "D") => void;
  disabled?: boolean;
  correct?: string | null;
}) {
  const review = correct !== undefined;
  return (
    <fieldset className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <legend className="sr-only">Question {question.number}</legend>
      <div className="mb-4 space-y-3 text-base leading-7 text-slate-900 sm:text-lg sm:leading-8">
        <MathText text={question.stem.text} className="block whitespace-pre-line break-words" />
        {question.stem.statements && (
          <ol className="space-y-2 rounded-xl bg-slate-50 p-3 sm:p-4" aria-label="Statements">
            {question.stem.statements.map((s, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-7 sm:text-base">
                <span className="w-6 shrink-0 font-bold text-slate-500" aria-hidden="true">{i + 1}.</span>
                <MathText text={s} className="min-w-0 break-words" />
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className="space-y-2.5" role={review ? "list" : "radiogroup"} aria-label="Answer options">
        {question.options.map((o) => {
          const chosen = selected === o.key;
          const isCorrect = review && correct === o.key;
          const isWrongPick = review && chosen && correct !== o.key;
          const tone = isCorrect ? "border-emerald-500 bg-emerald-50"
            : isWrongPick ? "border-rose-400 bg-rose-50"
            : chosen ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300";
          const body = (
            <>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${chosen || isCorrect ? "border-current" : "border-slate-300 text-slate-600"}`}>{o.key}</span>
              <MathText text={o.text} className="min-w-0 break-words text-[15px] leading-6 sm:text-base" />
              {isCorrect && <span className="ml-auto shrink-0 text-xs font-bold text-emerald-700">Correct</span>}
              {isWrongPick && <span className="ml-auto shrink-0 text-xs font-bold text-rose-700">Your answer</span>}
            </>
          );
          return review ? (
            <div key={o.key} role="listitem" className={`flex min-h-12 items-center gap-3 rounded-xl border-2 p-3 ${tone}`}>{body}</div>
          ) : (
            <button key={o.key} type="button" role="radio" aria-checked={chosen} disabled={disabled}
              onClick={() => onSelect?.(o.key)}
              className={`flex min-h-12 w-full items-center gap-3 rounded-xl border-2 p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60 ${tone}`}>
              {body}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
