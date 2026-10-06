"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Grid3X3 } from "lucide-react";
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
  const [open, setOpen] = useState(false);

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

    if (isCurrent) base += "ring-2 ring-blue-600 ring-offset-2 ";

    switch (status) {
      case "answered":
        return base + "bg-emerald-600 text-white hover:bg-emerald-700";
      case "marked":
        return base + "bg-purple-600 text-white hover:bg-purple-700";
      case "answered_marked":
        return base + "bg-purple-600 text-white hover:bg-purple-700 ring-2 ring-emerald-500 ring-offset-1";
      case "unanswered":
        return base + "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200";
      case "not_visited":
      default:
        return base + "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100";
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Grid3X3 className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-slate-900">Question Palette</span>
          <span className="block text-xs text-slate-500">
            Q{currentIndex + 1} of {total} · {answered} answered · {marked} marked
          </span>
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
      </button>

      {open && (
        <div className="border-t border-slate-100 p-4">
          <div className="max-h-[360px] overflow-y-auto pr-1 sm:max-h-[460px]">
            <div className="grid grid-cols-7 gap-2 sm:grid-cols-9 lg:grid-cols-5">
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

          <div className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-600">
            <div className="grid grid-cols-2 gap-2">
              <div>Answered <strong className="text-slate-800">{answered}</strong></div>
              <div>Marked <strong className="text-slate-800">{marked}</strong></div>
              <div>Unanswered <strong className="text-slate-800">{unanswered}</strong></div>
              <div>Not visited <strong className="text-slate-800">{notVisited}</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
