"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Pencil } from "lucide-react";
import { computeDashboardSnapshot, MOCK_SAVED_EVENT } from "@/lib/mockHistory";
import EditTargetModal, {
  formatExamsLabel,
  TARGETS_UPDATED_EVENT,
} from "./EditTargetModal";

interface Props {
  name: string;
  exam: string;
  targetExams?: string[];
  targetYear?: number | null;
  accuracy?: number;
  lastTopic?: string;
}

export default function ContinuePreparationHero({
  name,
  exam,
  targetExams = [],
  targetYear,
  accuracy: initialAccuracy = 0,
  lastTopic: initialLastTopic = "Start your first practice",
}: Props) {
  const firstName = name?.trim()?.split(" ")[0] || "Aspirant";
  const [accuracy, setAccuracy] = useState(initialAccuracy);
  const [lastTopic, setLastTopic] = useState(initialLastTopic);

  const [exams, setExams] = useState<string[]>(() =>
    targetExams && targetExams.length > 0 ? targetExams : exam ? [exam] : []
  );
  const [year, setYear] = useState<number | null | undefined>(targetYear);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Sync props if parent updates
  useEffect(() => {
    if (targetExams && targetExams.length > 0) {
      setExams(targetExams);
    }
    setYear(targetYear);
  }, [targetExams, targetYear]);

  // Listen to live target updates & mock history
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

    const handleTargetsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{
        target_exams: string[];
        target_year: number | null;
      }>;
      if (customEvent.detail) {
        if (customEvent.detail.target_exams) {
          setExams(customEvent.detail.target_exams);
        }
        if (customEvent.detail.target_year !== undefined) {
          setYear(customEvent.detail.target_year);
        }
      }
    };

    syncAccuracy();

    window.addEventListener(MOCK_SAVED_EVENT, syncAccuracy);
    window.addEventListener("storage", syncAccuracy);
    window.addEventListener(TARGETS_UPDATED_EVENT, handleTargetsUpdated);

    return () => {
      window.removeEventListener(MOCK_SAVED_EVENT, syncAccuracy);
      window.removeEventListener("storage", syncAccuracy);
      window.removeEventListener(TARGETS_UPDATED_EVENT, handleTargetsUpdated);
    };
  }, []);

  const formattedExamLabel =
    formatExamsLabel(exams) || exam || "Choose your target exam";

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50/60 to-blue-50/40 p-6 sm:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        {/* Top Badges & Action */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Welcome back</span>
          </div>

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-xs transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:scale-95 cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5 text-blue-600 transition-transform group-hover:scale-110" />
            <span>Edit Target</span>
          </button>
        </div>

        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Hi, {firstName} 👋
        </h1>

        <p className="mt-2 text-lg font-semibold text-blue-600 sm:text-xl">
          Continue your preparation
        </p>

        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
          You&apos;re preparing for{" "}
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-0.5 font-bold text-blue-700 transition hover:bg-blue-100 hover:border-blue-300 cursor-pointer text-left"
            title="Click to modify your target exams & year"
          >
            <span>
              {formattedExamLabel}
              {year ? ` ${year}` : ""}
            </span>
            <Pencil className="h-3 w-3 opacity-60 transition group-hover:opacity-100 group-hover:scale-110 text-blue-700" />
          </button>
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

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="col-span-2 sm:col-span-1 flex flex-col justify-between text-left rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:bg-blue-50/40 group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Target Goal
              </p>
              <span className="text-[11px] font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                <Pencil className="h-3 w-3" />
                Edit
              </span>
            </div>
            <div className="mt-1">
              <p className="truncate text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-700 transition">
                {formattedExamLabel}
              </p>
              <p className="text-xs font-semibold text-slate-500">
                {year ? `Target Year: ${year}` : "Tap to set year"}
              </p>
            </div>
          </button>
        </div>

        <Link
          href="/dashboard/practice"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] sm:mt-8"
        >
          <span>Continue Practice</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Target Modal */}
      <EditTargetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialExams={exams}
        initialYear={year}
        onSuccess={(updated) => {
          setExams(updated.target_exams);
          setYear(updated.target_year);
        }}
      />
    </>
  );
}