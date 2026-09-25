"use client";

import { Sparkles, ArrowRight, Clock, Target } from "lucide-react";
import type { AnalysisMetrics } from "@/lib/analysis/computeAnalysisMetrics";

interface NextBestMoveCardProps {
  move: AnalysisMetrics["nextBestMove"];
}

export default function NextBestMoveCard({ move }: NextBestMoveCardProps) {
  if (!move) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 p-6 shadow-[0_10px_30px_rgba(37,99,235,0.06)] sm:p-8">
      {/* Decorative accent */}
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl" />

      <div className="relative">
        {/* Header with AI Coach tag */}
        <div className="flex items-center gap-2 text-blue-700">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">
            AI Coach · Next Best Move
          </span>
        </div>

        {/* Primary recommendation headline */}
        <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {move.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {move.reason}
        </p>

        {/* Actionable stats pill row */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3.5 py-2 font-semibold text-blue-900 shadow-2xs">
            <Target className="h-3.5 w-3.5 text-blue-600" />
            <span>Target: {move.subject} › {move.topic}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 font-semibold text-emerald-800 shadow-2xs">
            <span>Potential Gain:</span>
            <span className="font-extrabold text-emerald-700">+{move.recoverableMarks} Marks</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-medium text-slate-600 shadow-2xs">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Est. Revision Time: ~{move.estimatedMinutes} mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
