"use client";

import type { TopicStat } from "@/lib/analysis/computeAnalysisMetrics";
import AnalysisSection from "./AnalysisSection";

interface TopicBreakdownCardProps {
  topics: TopicStat[];
}

export default function TopicBreakdownCard({ topics }: TopicBreakdownCardProps) {
  // Enforce sample size threshold: only topics with at least 2 questions
  const validTopics = topics.filter((t) => t.total >= 2);
  const isEligible = validTopics.length > 0;

  return (
    <AnalysisSection
      title="Topic Performance Breakdown"
      subtitle="Performance across tested topics with at least 2 questions."
      isEligible={isEligible}
      minThresholdNotice="Topic breakdown requires at least 2 questions per topic to evaluate."
    >
      <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {validTopics.map((t) => (
          <div
            key={t.topic}
            className="flex flex-wrap items-center justify-between gap-4 p-4 transition hover:bg-slate-50/80"
          >
            <div>
              <h4 className="text-sm font-bold text-slate-900">{t.topic}</h4>
              <p className="text-xs text-slate-500">
                {t.correct} of {t.attempted} answered correctly ({t.total} total)
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="w-24">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Accuracy</span>
                  <span className="font-bold text-slate-900">{t.accuracy}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      t.accuracy >= 75
                        ? "bg-emerald-500"
                        : t.accuracy >= 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${t.accuracy}%` }}
                  />
                </div>
              </div>

              {t.recoverableMarks > 0 && (
                <span className="rounded-lg bg-emerald-50 px-2 py-1 font-bold text-emerald-800">
                  +{t.recoverableMarks} pts
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </AnalysisSection>
  );
}
