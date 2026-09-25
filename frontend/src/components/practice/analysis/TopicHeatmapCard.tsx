"use client";

import type { TopicStat } from "@/lib/analysis/computeAnalysisMetrics";
import AnalysisSection from "./AnalysisSection";

interface TopicHeatmapCardProps {
  topics: TopicStat[];
  isEligible: boolean;
}

export default function TopicHeatmapCard({
  topics,
  isEligible,
}: TopicHeatmapCardProps) {
  function getPriorityStyle(level: TopicStat["priorityLevel"]) {
    switch (level) {
      case "High Priority":
        return {
          card: "border-red-200 bg-red-50/40 text-red-900 hover:border-red-300",
          badge: "bg-red-100 text-red-800",
          bar: "bg-red-500",
        };
      case "Medium Priority":
        return {
          card: "border-amber-200 bg-amber-50/40 text-amber-900 hover:border-amber-300",
          badge: "bg-amber-100 text-amber-800",
          bar: "bg-amber-500",
        };
      case "Good Performance":
        return {
          card: "border-emerald-200 bg-emerald-50/40 text-emerald-900 hover:border-emerald-300",
          badge: "bg-emerald-100 text-emerald-800",
          bar: "bg-emerald-500",
        };
    }
  }

  return (
    <AnalysisSection
      title="Topic Accuracy Heatmap"
      subtitle="Color-coded priority matrix identifying high-risk topics vs consolidated strengths."
      isEligible={isEligible}
      minThresholdNotice="Topic heatmap requires at least 10 questions to establish statistical validity."
    >
      {/* Legend */}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-xs bg-red-500" />
          <span>High Priority (&lt;50% or 2+ misses)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-xs bg-amber-500" />
          <span>Medium Priority (50-74%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-xs bg-emerald-500" />
          <span>Good Performance (75%+)</span>
        </div>
      </div>

      {/* Grid of topic cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => {
          const style = getPriorityStyle(t.priorityLevel);
          return (
            <div
              key={`${t.subject}-${t.topic}`}
              className={`rounded-2xl border p-4 transition shadow-2xs ${style.card}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {t.subject}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {t.topic}
                  </h4>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${style.badge}`}
                >
                  {t.accuracy}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200/60">
                <div
                  className={`h-full rounded-full ${style.bar}`}
                  style={{ width: `${t.accuracy}%` }}
                />
              </div>

              {/* Footer stats */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  {t.correct}/{t.attempted} correct
                </span>
                {t.recoverableMarks > 0 && (
                  <span className="font-semibold text-emerald-700">
                    +{t.recoverableMarks} pts
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AnalysisSection>
  );
}
