"use client";

import { CalendarCheck, ArrowRight, BookOpen } from "lucide-react";
import type { RecoveryPlanStep } from "@/lib/analysis/computeAnalysisMetrics";
import AnalysisSection from "./AnalysisSection";

interface RecoveryPlanCardProps {
  steps: RecoveryPlanStep[];
  isEligible: boolean;
}

export default function RecoveryPlanCard({
  steps,
  isEligible,
}: RecoveryPlanCardProps) {
  return (
    <AnalysisSection
      title="Tactical Recovery Plan"
      subtitle="Prioritized, time-blocked revision agenda to capture maximum recoverable marks."
      isEligible={isEligible}
      minThresholdNotice="Attempt at least 5 questions to generate a customized recovery agenda."
    >
      {steps.length > 0 ? (
        <div className="space-y-3">
          {steps.map((step, idx) => (
            <div
              key={step.topic}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
            >
              <div className="flex items-center gap-3.5">
                {/* Time block badge */}
                <div className="flex h-12 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-900 text-white font-mono shadow-xs">
                  <span className="text-xs font-semibold">{step.timeMinutes}</span>
                  <span className="text-[10px] uppercase text-slate-400">mins</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      Phase {idx + 1} · {step.subject}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{step.topic}</h4>
                  <p className="text-xs text-slate-500">{step.reason}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                  +{step.recoverableMarks} Marks Recovery
                </span>
              </div>
            </div>
          ))}

          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
            <strong>Study Tip:</strong> Focus strictly on PYQ pattern variations and official explanations for these 3 areas before attempting another full mock.
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-emerald-50 p-5 text-xs text-emerald-900">
          No urgent recovery areas identified. Your foundational coverage is complete for this attempt.
        </div>
      )}
    </AnalysisSection>
  );
}
