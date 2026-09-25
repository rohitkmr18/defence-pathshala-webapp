"use client";

import { Clock, AlertTriangle, Send, ChevronDown, BookOpen } from "lucide-react";
import type { FullPaperDefinition } from "@/components/practice/FullPaperHero";

interface ExamHeaderProps {
  examTitle: string;
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds
  answeredCount: number;
  totalQuestions: number;
  onSubmitClick: () => void;
  availablePapers?: FullPaperDefinition[];
  selectedPaperId?: string;
  onSelectPaper?: (paperId: string) => void;
}

export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

export default function ExamHeader({
  examTitle,
  timeRemaining,
  totalTime,
  answeredCount,
  totalQuestions,
  onSubmitClick,
  availablePapers,
  selectedPaperId,
  onSelectPaper,
}: ExamHeaderProps) {
  const isUrgent = timeRemaining <= 300; // < 5 mins
  const isWarning = timeRemaining <= 600 && !isUrgent; // < 10 mins

  const timerColor = isUrgent
    ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
    : isWarning
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-slate-100 text-slate-800 border-slate-200";

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-6 py-3.5 backdrop-blur-md shadow-xs">
      {/* Title & Exam Meta / Single Select Option */}
      <div className="flex items-center gap-3">
        <div>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
            UPSC Exam Mode
          </span>

          {availablePapers && availablePapers.length > 0 && onSelectPaper ? (
            <div className="relative mt-1 flex items-center">
              <select
                value={selectedPaperId}
                onChange={(e) => onSelectPaper(e.target.value)}
                className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-1 pl-2.5 pr-8 text-sm font-bold text-slate-900 shadow-2xs hover:border-slate-300 focus:border-blue-500 focus:outline-none"
                aria-label="Select exam paper"
              >
                {availablePapers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-slate-500" />
            </div>
          ) : (
            <h1 className="mt-0.5 text-base font-bold text-slate-900 sm:text-lg">
              {examTitle}
            </h1>
          )}
        </div>
      </div>

      {/* Progress & Live Timer & Submit CTA */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Answered progress */}
        <div className="hidden text-right text-xs text-slate-500 sm:block">
          <span className="font-bold text-slate-900">{answeredCount}</span> of{" "}
          <span className="font-bold text-slate-900">{totalQuestions}</span> answered
        </div>

        {/* Floating Timer */}
        <div
          className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-sm font-bold shadow-xs sm:text-base ${timerColor}`}
          aria-label="Time remaining"
        >
          {isUrgent ? (
            <AlertTriangle className="h-4 w-4 animate-bounce text-red-600" />
          ) : (
            <Clock className="h-4 w-4 text-slate-500" />
          )}
          <span>{formatTime(timeRemaining)}</span>
        </div>

        {/* Submit Paper CTA */}
        <button
          type="button"
          onClick={onSubmitClick}
          className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800 active:scale-[0.98]"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Submit Paper</span>
        </button>
      </div>
    </header>
  );
}
