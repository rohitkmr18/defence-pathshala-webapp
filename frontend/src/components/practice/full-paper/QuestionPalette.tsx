"use client";

import type { OptionKey } from "@/lib/practice-types";

interface QuestionPaletteProps {
  total: number;
  questionIds: string[];
  currentIndex: number;
  answers: Record<string, OptionKey>;
  markedForReview: Set<string>;
  visited: Set<string>;
  onSelect: (index: number) => void;
}

export type QuestionStatus =
  | "answered"
  | "marked"
  | "answered_marked"
  | "unanswered"
  | "not_visited";

export function getQuestionStatus(
  id: string,
  answers: Record<string, OptionKey>,
  markedForReview: Set<string>,
  visited: Set<string>
): QuestionStatus {
  const isAnswered = answers[id] !== undefined;
  const isMarked = markedForReview.has(id);
  const isVisited = visited.has(id);

  if (isAnswered && isMarked) return "answered_marked";
  if (isMarked) return "marked";
  if (isAnswered) return "answered";
  if (isVisited) return "unanswered";
  return "not_visited";
}

export default function QuestionPalette({
  total,
  questionIds,
  currentIndex,
  answers,
  markedForReview,
  visited,
  onSelect,
}: QuestionPaletteProps) {
  // Counters for legend
  let answered = 0;
  let marked = 0;
  let unanswered = 0;
  let notVisited = 0;

  for (let i = 0; i < total; i++) {
    const qid = questionIds[i];
    if (!qid) continue;
    const status = getQuestionStatus(qid, answers, markedForReview, visited);
    if (status === "answered" || status === "answered_marked") answered++;
    if (status === "marked" || status === "answered_marked") marked++;
    if (status === "unanswered") unanswered++;
    if (status === "not_visited") notVisited++;
  }

  function getButtonClasses(index: number): string {
    const qid = questionIds[index];
    if (!qid) return "border-slate-200 bg-white text-slate-700";

    const status = getQuestionStatus(qid, answers, markedForReview, visited);
    const isCurrent = index === currentIndex;

    let base =
      "relative flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all shadow-2xs ";

    if (isCurrent) {
      base += "ring-2 ring-blue-600 ring-offset-2 ";
    }

    switch (status) {
      case "answered":
        return base + "bg-emerald-600 text-white hover:bg-emerald-700";
      case "marked":
        return base + "bg-purple-600 text-white hover:bg-purple-700";
      case "answered_marked":
        return (
          base +
          "bg-purple-600 text-white hover:bg-purple-700 ring-2 ring-emerald-500 ring-offset-1"
        );
      case "unanswered":
        return base + "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200";
      case "not_visited":
      default:
        return base + "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100";
    }
  }

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900">Question Palette</h3>
        <p className="text-xs text-slate-500">
          Jump to any question instantly
        </p>
      </div>

      {/* Grid of question chips */}
      <div className="max-h-[360px] flex-1 overflow-y-auto pr-1 sm:max-h-[460px]">
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-5">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              className={getButtonClasses(i)}
              aria-label={`Question ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 border-t border-slate-100 pt-4 text-xs">
        <p className="mb-2 font-semibold text-slate-700">Status Legend</p>
        <div className="grid grid-cols-2 gap-2 text-slate-600">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-xs bg-emerald-600" />
            <span>Answered ({answered})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-xs bg-purple-600" />
            <span>Marked ({marked})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-xs border border-amber-300 bg-amber-100" />
            <span>Unanswered ({unanswered})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-xs border border-slate-200 bg-slate-50" />
            <span>Not Visited ({notVisited})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
