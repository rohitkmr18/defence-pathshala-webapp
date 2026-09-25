"use client";

import type { SubjectStat } from "@/lib/analysis/computeAnalysisMetrics";
import AnalysisSection from "./AnalysisSection";

interface SubjectPerformanceCardProps {
  subjects: SubjectStat[];
  isEligible: boolean;
}

export default function SubjectPerformanceCard({
  subjects,
  isEligible,
}: SubjectPerformanceCardProps) {
  function getBadgeClasses(badge: SubjectStat["badge"]): string {
    switch (badge) {
      case "Strength":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Stable":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Focus":
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  }

  function getBarColor(badge: SubjectStat["badge"]): string {
    switch (badge) {
      case "Strength":
        return "bg-emerald-500";
      case "Stable":
        return "bg-blue-500";
      case "Focus":
        return "bg-amber-500";
    }
  }

  return (
    <AnalysisSection
      title="Subject Performance Audit"
      subtitle="Cross-subject syllabus breakdown showing accuracy, net contribution, and target focus areas."
      isEligible={isEligible}
      minThresholdNotice="Subject comparisons require a multi-subject full paper mock (20+ questions)."
      hideIfIneligible={false}
    >
      <div className="space-y-4">
        {subjects.map((sub) => (
          <div
            key={sub.subject}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-xs"
          >
            {/* Top row: Subject name, status badge, net score */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <h4 className="text-base font-bold text-slate-900">{sub.subject}</h4>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getBadgeClasses(
                    sub.badge
                  )}`}
                >
                  {sub.badge}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-500">
                  Attempted: <strong className="text-slate-800">{sub.attempted}/{sub.total}</strong> ({sub.attemptRate}%)
                </span>
                <span className="text-slate-300">·</span>
                <span className="font-bold text-slate-900">
                  {sub.netScore} pts
                </span>
              </div>
            </div>

            {/* Horizontal progress bar showing accuracy */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Accuracy</span>
                <span className="font-bold text-slate-900">{sub.accuracy}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                    sub.badge
                  )}`}
                  style={{ width: `${sub.accuracy}%` }}
                />
              </div>
            </div>

            {/* Sub-strip breakdown: Correct, Incorrect, Skipped */}
            <div className="mt-3 flex gap-4 text-xs text-slate-500">
              <span className="text-emerald-700">✓ {sub.correct} Correct</span>
              <span className="text-red-700">✗ {sub.incorrect} Incorrect</span>
              <span className="text-slate-400">○ {sub.skipped} Skipped</span>
            </div>
          </div>
        ))}
      </div>
    </AnalysisSection>
  );
}
