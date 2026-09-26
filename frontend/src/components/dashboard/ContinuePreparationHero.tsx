"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { computeDashboardSnapshot, MOCK_SAVED_EVENT } from "@/lib/mockHistory";

interface Props {
  name: string;
  exam: string;
  targetYear?: number | null;
  accuracy?: number;
  lastTopic?: string;
}

export default function ContinuePreparationHero({
  name,
  exam,
  targetYear,
  accuracy: initialAccuracy = 0,
  lastTopic: initialLastTopic = "Start your first practice",
}: Props) {
  const firstName = name?.trim()?.split(" ")[0] || "Aspirant";
  const [accuracy, setAccuracy] = useState(initialAccuracy);
  const [lastTopic, setLastTopic] = useState(initialLastTopic);

  useEffect(() => {
    const syncAccuracy = () => {
      const snap = computeDashboardSnapshot();
      if (snap.mocksCompleted > 0) {
        setAccuracy(snap.averageAccuracy);
        if (snap.weakAreas.length > 0) {
          setLastTopic(`Revise ${snap.weakAreas[0].topic}`);
        } else if (snap.lastMockTitle && snap.lastMockTitle !== "None") {
          setLastTopic(snap.lastMockTitle);
        }
      }
    };

    syncAccuracy();

    window.addEventListener(MOCK_SAVED_EVENT, syncAccuracy);
    window.addEventListener("storage", syncAccuracy);

    return () => {
      window.removeEventListener(MOCK_SAVED_EVENT, syncAccuracy);
      window.removeEventListener("storage", syncAccuracy);
    };
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50/60 to-blue-50/40 p-6 sm:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-2xs">
        <Sparkles className="h-3.5 w-3.5 text-blue-600" />
        <span>Welcome back</span>
      </div>

      <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        Hi, {firstName} 👋
      </h1>

      <p className="mt-2 text-lg font-semibold text-blue-600 sm:text-xl">
        Continue your preparation
      </p>

      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
        You&apos;re preparing for{" "}
        <span className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-2 py-0.5 font-bold text-blue-700">
          {exam}
          {targetYear ? ` ${targetYear}` : ""}
        </span>
        . Pick up exactly where you left off.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Accuracy
          </p>
          <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
            {accuracy}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Focus
          </p>
          <p className="mt-1 truncate text-base font-bold text-slate-900 sm:text-lg">
            {lastTopic}
          </p>
        </div>

        {targetYear && (
          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Target Year
            </p>
            <p className="mt-1 text-2xl font-black text-blue-600 sm:text-3xl">
              {targetYear}
            </p>
          </div>
        )}
      </div>

      <Link
        href="/dashboard/practice"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] sm:mt-8"
      >
        <span>Continue Practice</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}