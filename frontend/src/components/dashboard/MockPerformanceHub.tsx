"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import type { DashboardPreparationSnapshot } from "@/lib/mockHistory";
import type { LearnerIntelligence } from "@/lib/learner-intelligence";
import PreparationSnapshotCard from "./PreparationSnapshotCard";
import WeakAreasCard from "./WeakAreasCard";
import AccuracyCard from "./AccuracyCard";

const EMPTY_SNAPSHOT: DashboardPreparationSnapshot = {
  mocksCompleted: 0,
  totalQuestionsAttempted: 0,
  averageScore: 0,
  averageAccuracy: 0,
  totalRecoverableMarks: 0,
  lastMockTitle: "None",
  weakAreas: [],
  recentScores: [],
  trendDirection: "flat",
};

export default function MockPerformanceHub() {
  const [snapshot, setSnapshot] =
    useState<DashboardPreparationSnapshot | null>(null);

  useEffect(() => {
    let active = true;

    const refreshSnapshot = async () => {
      try {
        const response = await fetch("/api/learner-intelligence", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Performance intelligence unavailable");
        const data = (await response.json()) as LearnerIntelligence;
        if (active) setSnapshot(data.performanceCoach);
      } catch {
        if (active) setSnapshot(EMPTY_SNAPSHOT);
      }
    };

    void refreshSnapshot();

    const refresh = () => void refreshSnapshot();
    window.addEventListener("dp_question_attempted", refresh);
    window.addEventListener("dp_practice_session_updated", refresh);

    return () => {
      active = false;
      window.removeEventListener("dp_question_attempted", refresh);
      window.removeEventListener("dp_practice_session_updated", refresh);
    };
  }, []);

  if (!snapshot) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-8 text-center animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mx-auto mb-3" />
        <div className="h-4 w-72 bg-slate-100 rounded mx-auto" />
      </div>
    );
  }

  if (snapshot.mocksCompleted === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-8 sm:p-10 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
          <Sparkles className="h-7 w-7" />
        </div>

        <h3 className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">
          Mock Performance Analytics
        </h3>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
          Complete your first full paper to unlock durable score trajectory,
          recurring weak areas and recoverable marks across devices.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard/practice/full-paper"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Play className="h-4 w-4" />
            <span>Attempt Full Mock Paper</span>
          </Link>

          <Link
            href="/dashboard/practice"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50"
          >
            <span>Targeted Practice</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
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
