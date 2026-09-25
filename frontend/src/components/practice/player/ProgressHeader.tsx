"use client";

import type { PlayerMode } from "@/lib/practice-types";

interface ProgressHeaderProps {
  current: number;
  total: number;
  mode: PlayerMode;
}

const MODE_LABELS: Record<PlayerMode, string> = {
  instant: "Instant Feedback",
  attempt: "Attempt at Once",
};

const MODE_BADGE: Record<PlayerMode, string> = {
  instant: "bg-blue-50 text-blue-700 border border-blue-200",
  attempt: "bg-slate-100 text-slate-700 border border-slate-200",
};

export default function ProgressHeader({
  current,
  total,
  mode,
}: ProgressHeaderProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-4">
        {/* Counter */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900">{current}</span>
          <span className="text-sm text-slate-400">/ {total}</span>
          <span className="ml-1 hidden text-sm text-slate-500 sm:inline">
            questions
          </span>
        </div>

        {/* Mode badge */}
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${MODE_BADGE[mode]}`}
        >
          {MODE_LABELS[mode]}
        </span>
      </div>

      {/* Animated progress bar */}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Question ${current} of ${total}`}
        />
      </div>
    </div>
  );
}
