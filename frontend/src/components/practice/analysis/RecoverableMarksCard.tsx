"use client";

import { TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import AnalysisSection from "./AnalysisSection";

interface RecoverableMarksCardProps {
  totalRecoverableMarks: number;
  topics: { topic: string; subject: string; count: number; marks: number }[];
  isEligible: boolean;
}

export default function RecoverableMarksCard({
  totalRecoverableMarks,
  topics,
  isEligible,
}: RecoverableMarksCardProps) {
  return (
    <AnalysisSection
      title="Recoverable Marks Analysis"
      subtitle="Easy & Moderate questions you missed. Converting these gives +2.00 marks and eliminates the -0.67 penalty (+2.67 net swing per question)."
      isEligible={isEligible}
      minThresholdNotice="Attempt at least 5 questions to calculate recoverable marks."
    >
      {/* Big summary pill */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Total High-Leverage Upside
            </p>
            <p className="text-2xl font-black text-emerald-950 sm:text-3xl">
              +{totalRecoverableMarks} Marks
            </p>
          </div>
        </div>

        <p className="max-w-xs text-xs text-emerald-700">
          These are questions you likely have the foundational knowledge for, but lost to traps or misreads.
        </p>
      </div>

      {/* Prioritized topics list */}
      {topics.length > 0 ? (
        <div className="mt-6 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Top Priority Recovery Areas (Sorted by impact)
          </p>

          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden">
            {topics.map((item, idx) => (
              <div
                key={item.topic}
                className="flex items-center justify-between p-4 transition hover:bg-slate-50/80"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.topic}</h4>
                    <p className="text-xs text-slate-500">{item.subject} · {item.count} question{item.count > 1 ? "s" : ""} missed</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block rounded-lg bg-emerald-100/80 px-2.5 py-1 text-xs font-extrabold text-emerald-800">
                    +{item.marks} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Zero Easy/Moderate misses! Exceptional execution on foundational questions.</span>
        </div>
      )}
    </AnalysisSection>
  );
}
