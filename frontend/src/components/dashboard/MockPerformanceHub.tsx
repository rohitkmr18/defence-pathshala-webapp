"use client";

import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import type { DashboardPreparationSnapshot } from "@/lib/mockHistory";
import PreparationSnapshotCard from "./PreparationSnapshotCard";
import WeakAreasCard from "./WeakAreasCard";
import AccuracyCard from "./AccuracyCard";

export default function MockPerformanceHub({
  snapshot,
}: {
  snapshot: DashboardPreparationSnapshot;
}) {
  if (snapshot.mocksCompleted === 0) {
    return (
      <div className="space-y-6">
        {snapshot.recentAccuracies.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            <AccuracyCard snapshot={snapshot} />
            <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6 sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Unlock full mock diagnostics
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Your practice accuracy is already tracked. Complete a full paper to add net-score trajectory, recoverable marks and recurring mock weak areas.
              </p>
              <Link
                href="/dashboard/practice/full-paper"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                <Play className="h-4 w-4" />
                <span>Attempt Full Mock Paper</span>
              </Link>
            </div>
          </div>
        )}

        {snapshot.recentAccuracies.length === 0 && (
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-8 sm:p-10 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">
              Performance Analytics
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
              Start targeted practice to unlock your accuracy trajectory, then complete a full paper for deeper mock diagnostics.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard/practice"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                <span>Start Targeted Practice</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/practice/full-paper"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50"
              >
                <Play className="h-4 w-4" />
                <span>Attempt Full Mock Paper</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PreparationSnapshotCard snapshot={snapshot} />

      <div className="grid gap-6 md:grid-cols-2">
        <AccuracyCard snapshot={snapshot} />
        <WeakAreasCard weakAreas={snapshot.weakAreas} />
      </div>
    </div>
  );
}
