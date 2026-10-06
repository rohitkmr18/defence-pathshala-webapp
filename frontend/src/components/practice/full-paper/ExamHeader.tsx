"use client";

import { Clock, AlertTriangle, Send } from "lucide-react";

interface ExamHeaderProps {
  examTitle: string;
  timeRemaining: number;
  answeredCount: number;
  totalQuestions: number;
  onSubmitClick: () => void;
  isSubmitting?: boolean;
  submissionPending?: boolean;
}

export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  if (hrs > 0) return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  return `${pad(mins)}:${pad(secs)}`;
}

export default function ExamHeader({
  examTitle,
  timeRemaining,
  answeredCount,
  totalQuestions,
  onSubmitClick,
  isSubmitting = false,
  submissionPending = false,
}: ExamHeaderProps) {
  const isUrgent = timeRemaining <= 300;
  const isWarning = timeRemaining <= 600 && !isUrgent;

  const timerColor = isUrgent
    ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
    : isWarning
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-slate-100 text-slate-800 border-slate-200";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md shadow-xs sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-700">
            UPSC Exam Mode
          </span>
          <h1 className="truncate text-sm font-bold text-slate-900 sm:text-base">{examTitle}</h1>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden text-right text-[11px] text-slate-500 sm:block">
            <span className="font-bold text-slate-900">{answeredCount}</span>/{totalQuestions} answered
          </div>

          <div
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2 font-mono text-xs font-bold shadow-xs sm:px-3.5 sm:text-sm ${timerColor}`}
            aria-label="Time remaining"
          >
            {isUrgent ? (
              <AlertTriangle className="h-3.5 w-3.5 animate-bounce text-red-600" />
            ) : (
              <Clock className="h-3.5 w-3.5 text-slate-500" />
            )}
            <span>{formatTime(timeRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={onSubmitClick}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:px-4 sm:text-sm"
          >
            {isSubmitting ? <Clock className="h-3.5 w-3.5 animate-pulse" /> : <Send className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isSubmitting ? "Submitting…" : submissionPending ? "Retry Submit" : "Submit Paper"}</span>
            <span className="sm:hidden">{isSubmitting ? "Saving…" : submissionPending ? "Retry" : "Submit"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
