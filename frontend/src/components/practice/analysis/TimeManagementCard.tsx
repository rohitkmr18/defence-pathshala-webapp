"use client";

import { Clock, Gauge, AlertCircle } from "lucide-react";
import type { AnalysisMetrics } from "@/lib/analysis/computeAnalysisMetrics";
import AnalysisSection from "./AnalysisSection";

interface TimeManagementCardProps {
  timeManagement: AnalysisMetrics["timeManagement"];
  totalTimeFormatted: string;
  isEligible: boolean;
}

export default function TimeManagementCard({
  timeManagement,
  totalTimeFormatted,
  isEligible,
}: TimeManagementCardProps) {
  const pace = timeManagement.paceScore;
  const paceColor =
    pace === "Optimal"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : pace === "Fast / Rushed"
      ? "text-amber-700 bg-amber-50 border-amber-200"
      : "text-blue-700 bg-blue-50 border-blue-200";

  return (
    <AnalysisSection
      title="Time Management & Pacing Audit"
      subtitle="Evaluation of attempt speed, question dwell time, and examination discipline."
      isEligible={isEligible}
      minThresholdNotice="Attempt at least 5 questions to generate time and pacing insights."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Time Used */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 text-slate-500">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Duration
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {totalTimeFormatted}
          </p>
          <p className="mt-1 text-xs text-slate-400">Total session elapsed</p>
        </div>

        {/* Avg Time Per Question */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 text-slate-500">
            <Gauge className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Average Dwell Time
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {timeManagement.avgTimePerQuestionSeconds}s{" "}
            <span className="text-xs font-normal text-slate-400">/ question</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">Target UPSC: ~55–60s/q</p>
        </div>

        {/* Pacing Assessment */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pacing Assessment
          </span>
          <div className="mt-2">
            <span
              className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${paceColor}`}
            >
              {pace}
            </span>
          </div>
          <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
            {timeManagement.paceAdvice}
          </p>
        </div>
      </div>
    </AnalysisSection>
  );
}
