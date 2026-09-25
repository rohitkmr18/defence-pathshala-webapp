"use client";

import { Award, CheckCircle2, TrendingUp, Layers } from "lucide-react";
import type { DashboardPreparationSnapshot } from "@/lib/mockHistory";

interface PreparationSnapshotCardProps {
  snapshot: DashboardPreparationSnapshot;
}

export default function PreparationSnapshotCard({
  snapshot,
}: PreparationSnapshotCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-7">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Mock Test History
          </span>
          <h3 className="text-lg font-bold text-slate-900">Preparation Snapshot</h3>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          {snapshot.mocksCompleted} {snapshot.mocksCompleted === 1 ? "Mock" : "Mocks"} Completed
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Mocks */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Layers className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold">Total Mocks</span>
          </div>
          <p className="text-2xl font-black text-slate-900 sm:text-3xl">
            {snapshot.mocksCompleted}
          </p>
          <p className="text-[11px] text-slate-500">Attempted so far</p>
        </div>

        {/* Questions Attempted */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-semibold">Questions Solved</span>
          </div>
          <p className="text-2xl font-black text-slate-900 sm:text-3xl">
            {snapshot.totalQuestionsAttempted}
          </p>
          <p className="text-[11px] text-slate-500">In real test conditions</p>
        </div>

        {/* Average Score */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Award className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold">Average Net Score</span>
          </div>
          <p className="text-2xl font-black text-slate-900 sm:text-3xl">
            {snapshot.averageScore}
          </p>
          <p className="text-[11px] text-slate-500">UPSC negative marking</p>
        </div>

        {/* Recoverable Upside */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-semibold">Recoverable Upside</span>
          </div>
          <p className="text-2xl font-black text-emerald-700 sm:text-3xl">
            +{snapshot.totalRecoverableMarks}
          </p>
          <p className="text-[11px] text-emerald-600">Immediate score target</p>
        </div>
      </div>
    </div>
  );
}
