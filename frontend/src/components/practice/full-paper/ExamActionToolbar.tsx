"use client";

import { ChevronLeft, ChevronRight, Bookmark, RotateCcw, Check } from "lucide-react";

interface ExamActionToolbarProps {
  isFirst: boolean;
  isLast: boolean;
  hasAnswer: boolean;
  isMarked: boolean;
  onPrevious: () => void;
  onClearResponse: () => void;
  onToggleMarkForReview: () => void;
  onSaveAndNext: () => void;
}

export default function ExamActionToolbar({
  isFirst,
  isLast,
  hasAnswer,
  isMarked,
  onPrevious,
  onClearResponse,
  onToggleMarkForReview,
  onSaveAndNext,
}: ExamActionToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Left side actions: Clear Response & Mark for Review */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onClearResponse}
          disabled={!hasAnswer}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Clear Response</span>
        </button>

        <button
          type="button"
          onClick={onToggleMarkForReview}
          className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
            isMarked
              ? "border-purple-300 bg-purple-50 text-purple-700"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Bookmark className="h-3.5 w-3.5" />
          <span>{isMarked ? "Marked for Review" : "Mark for Review"}</span>
        </button>
      </div>

      {/* Right side navigation: Previous, Save & Next */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirst}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={onSaveAndNext}
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800 active:scale-[0.98]"
        >
          <span>{isLast ? "Review / Submit" : "Save & Next"}</span>
          {isLast ? <Check className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
