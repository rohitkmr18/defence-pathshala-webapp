"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Grid, Calendar } from "lucide-react";

interface NavigationButtonsProps {
  prevDate: string | null;
  nextDate: string | null;
  currentDate: string;
}

export default function NavigationButtons({
  prevDate,
  nextDate,
  currentDate,
}: NavigationButtonsProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-6">
      {/* Previous Day */}
      {prevDate ? (
        <Link
          href={`/current-affairs/${prevDate}`}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:border-slate-300"
        >
          <ArrowLeft className="h-4 w-4 text-slate-500" />
          <span>Previous Day ({prevDate})</span>
        </Link>
      ) : (
        <div className="text-xs font-medium text-slate-400 italic px-2">
          Oldest recorded brief
        </div>
      )}

      {/* Return to Archive */}
      <Link
        href="/current-affairs"
        className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800"
      >
        <Grid className="h-3.5 w-3.5" />
        <span>All Daily Briefs</span>
      </Link>

      {/* Next Day */}
      {nextDate ? (
        <Link
          href={`/current-affairs/${nextDate}`}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:border-slate-300"
        >
          <span>Next Day ({nextDate})</span>
          <ArrowRight className="h-4 w-4 text-slate-500" />
        </Link>
      ) : (
        <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          Latest Brief
        </div>
      )}
    </div>
  );
}
