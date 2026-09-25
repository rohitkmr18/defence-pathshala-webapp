"use client";

import { AlertOctagon, Repeat, SkipForward, CheckCircle } from "lucide-react";
import type { MistakePatternItem } from "@/lib/analysis/computeAnalysisMetrics";
import AnalysisSection from "./AnalysisSection";

interface MistakePatternsCardProps {
  patterns: MistakePatternItem[];
  isEligible: boolean;
}

export default function MistakePatternsCard({
  patterns,
  isEligible,
}: MistakePatternsCardProps) {
  function getIcon(type: MistakePatternItem["type"]) {
    switch (type) {
      case "easy_miss":
        return <AlertOctagon className="h-4 w-4 text-red-600" />;
      case "recurring_theme":
        return <Repeat className="h-4 w-4 text-amber-600" />;
      case "high_yield_skip":
        return <SkipForward className="h-4 w-4 text-purple-600" />;
    }
  }

  function getBadgeColor(type: MistakePatternItem["type"]) {
    switch (type) {
      case "easy_miss":
        return "bg-red-50 text-red-700 border-red-200";
      case "recurring_theme":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "high_yield_skip":
        return "bg-purple-50 text-purple-700 border-purple-200";
    }
  }

  return (
    <AnalysisSection
      title="Systemic Mistake Patterns"
      subtitle="Data-backed behavioral and conceptual trends identified across your attempt."
      isEligible={isEligible}
      minThresholdNotice="Mistake pattern analysis requires at least 10 questions to identify recurring trends."
    >
      {patterns.length > 0 ? (
        <div className="space-y-3">
          {patterns.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50/50"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                  {getIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getBadgeColor(
                        item.type
                      )}`}
                    >
                      {item.count} occurrences
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{item.description}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-red-600">
                  -{item.impactMarks} Marks Impact
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-5 text-xs text-emerald-900">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
          <p>
            No recurring mistake patterns detected! Errors were isolated rather than systemic.
          </p>
        </div>
      )}
    </AnalysisSection>
  );
}
