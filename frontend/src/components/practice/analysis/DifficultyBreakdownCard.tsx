"use client";

import { AlertTriangle, ShieldCheck } from "lucide-react";
import type { DifficultyStat } from "@/lib/analysis/computeAnalysisMetrics";
import AnalysisSection from "./AnalysisSection";

interface DifficultyBreakdownCardProps {
  difficulties: DifficultyStat[];
  isEligible: boolean;
}

export default function DifficultyBreakdownCard({
  difficulties,
  isEligible,
}: DifficultyBreakdownCardProps) {
  const easyStat = difficulties.find((d) => d.category === "Easy");
  const modStat = difficulties.find((d) => d.category === "Moderate");
  const hardStat = difficulties.find((d) => d.category === "Hard");

  const easyLoss = easyStat?.marksLost || 0;

  return (
    <AnalysisSection
      title="Difficulty Matrix (ESAC Audit)"
      subtitle="Accuracy segmented by examiner question difficulty level."
      isEligible={isEligible}
      minThresholdNotice="Difficulty breakdown requires at least 10 questions for meaningful categorization."
    >
      {/* Actionable insight pill */}
      {easyLoss > 0 ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p>
            You lost <strong>{easyLoss} marks</strong> on Easy questions. In UPSC defence exams, Easy questions represent foundational cutoff guarantees. Eliminating direct factual misreads here is your highest return on investment.
          </p>
        </div>
      ) : (
        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-900">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          <p>Perfect score on Easy questions! Core foundation is rock solid.</p>
        </div>
      )}

      {/* 3 Difficulty Columns */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {difficulties.map((diff) => {
          const color =
            diff.category === "Easy"
              ? "text-emerald-700 bg-emerald-50 border-emerald-200"
              : diff.category === "Moderate"
              ? "text-blue-700 bg-blue-50 border-blue-200"
              : "text-purple-700 bg-purple-50 border-purple-200";

          const barColor =
            diff.category === "Easy"
              ? "bg-emerald-500"
              : diff.category === "Moderate"
              ? "bg-blue-500"
              : "bg-purple-500";

          return (
            <div
              key={diff.category}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${color}`}>
                  {diff.category}
                </span>
                <span className="text-xs text-slate-400">
                  {diff.total} questions
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-slate-900">
                    {diff.accuracy}%
                  </span>
                  <span className="text-xs text-slate-500">
                    {diff.correct}/{diff.attempted} attempted
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${diff.accuracy}%` }}
                  />
                </div>
              </div>

              {diff.marksLost > 0 && (
                <p className="mt-3 text-right text-[11px] font-semibold text-red-600">
                  -{diff.marksLost} marks lost
                </p>
              )}
            </div>
          );
        })}
      </div>
    </AnalysisSection>
  );
}
