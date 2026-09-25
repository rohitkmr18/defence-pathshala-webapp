"use client";

import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import PerformanceTrendSparkline from "./PerformanceTrendSparkline";
import type { DashboardPreparationSnapshot } from "@/lib/mockHistory";

interface AccuracyCardProps {
  snapshot: DashboardPreparationSnapshot;
}

export default function AccuracyCard({ snapshot }: AccuracyCardProps) {
  const isUp = snapshot.trendDirection === "up";
  const isDown = snapshot.trendDirection === "down";

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-7">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-blue-700">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 border border-blue-200">
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Accuracy & Score Trend</h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Trajectory
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Average Accuracy
            </p>
            <p className="text-3xl font-black text-slate-900 sm:text-4xl">
              {snapshot.averageAccuracy}%
            </p>
          </div>

          {/* Trend badge */}
          <div>
            {isUp && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Improving</span>
              </span>
            )}
            {isDown && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                <TrendingDown className="h-3.5 w-3.5" />
                <span>Fluctuating</span>
              </span>
            )}
            {!isUp && !isDown && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                <Minus className="h-3.5 w-3.5" />
                <span>Stable</span>
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50/70 border border-slate-100 p-3.5 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Score History
            </p>
            <p className="text-xs font-medium text-slate-700 truncate max-w-[140px]">
              {snapshot.lastMockTitle}
            </p>
          </div>
          <PerformanceTrendSparkline scores={snapshot.recentScores} />
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
        Based on last {snapshot.recentScores.length} attempted mock tests
      </div>
    </div>
  );
}
