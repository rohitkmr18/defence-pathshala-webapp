"use client";

import Link from "next/link";
import { Target, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import type { WeakAreaSummary } from "@/lib/mockHistory";

interface WeakAreasCardProps {
  weakAreas: WeakAreaSummary[];
}

export default function WeakAreasCard({ weakAreas }: WeakAreasCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-7">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-rose-700">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 border border-rose-200">
              <Target className="h-4 w-4 text-rose-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Recurring Weak Areas</h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Across Mocks
          </span>
        </div>

        {weakAreas.length > 0 ? (
          <div className="mt-4 space-y-2.5">
            {weakAreas.map((area, idx) => (
              <div
                key={area.topic}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-[10px] font-extrabold text-rose-800">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-800">{area.topic}</span>
                </div>
                <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 font-medium text-slate-600">
                  {area.count} {area.count === 1 ? "miss" : "misses"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 p-4 text-xs text-emerald-800">
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>No recurring weak topics flagged! Your coverage across mocks is uniform.</span>
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <Link
          href="/dashboard/practice"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
        >
          <span>Practice These Topics</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
