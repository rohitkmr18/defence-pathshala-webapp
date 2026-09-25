"use client";

import { ReactNode } from "react";
import { Info } from "lucide-react";

interface AnalysisSectionProps {
  title: string;
  subtitle?: string;
  isEligible: boolean;
  minThresholdNotice?: string;
  hideIfIneligible?: boolean;
  children: ReactNode;
}

export default function AnalysisSection({
  title,
  subtitle,
  isEligible,
  minThresholdNotice,
  hideIfIneligible = false,
  children,
}: AnalysisSectionProps) {
  if (!isEligible) {
    if (hideIfIneligible) return null;

    return (
      <section className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-xs backdrop-blur-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Info className="h-4 w-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {minThresholdNotice ||
            "Not enough sample size in this session to infer statistically reliable patterns. Complete a larger session to unlock this debrief."}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-8">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 sm:text-xl">{title}</h3>
        {subtitle && <p className="mt-1 text-xs text-slate-500 sm:text-sm">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
