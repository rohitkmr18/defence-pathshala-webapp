"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Pencil,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Play,
} from "lucide-react";
import { computeDashboardSnapshot, MOCK_SAVED_EVENT } from "@/lib/mockHistory";
import {
  getLocalSession,
  PRACTICE_SESSION_UPDATED_EVENT,
  type ActivePracticeSession,
} from "@/lib/practice-session-client";
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
  const [totalAttempts, setTotalAttempts] = useState(0);
  const serverAttemptsRef = useRef(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [mistakeIds, setMistakeIds] = useState<string[]>([]);
  const [activeSession, setActiveSession] = useState<ActivePracticeSession | null>(null);

  const [exams, setExams] = useState<string[]>(() =>
    targetExams && targetExams.length > 0 ? targetExams : exam ? [exam] : []
  );
  const [year, setYear] = useState<number | null | undefined>(targetYear);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const targetsKey = targetExams.join(",");
  const [previousTargets, setPreviousTargets] = useState({ key: targetsKey, year: targetYear });
  if (previousTargets.key !== targetsKey || previousTargets.year !== targetYear) {
    setPreviousTargets({ key: targetsKey, year: targetYear });
    setExams(targetExams.length > 0 ? targetExams : exam ? [exam] : []);
    setYear(targetYear);
  }

  // Sync live session, attempts & target updates
  useEffect(() => {
    const syncStats = () => {
      // 1. Check local session
      const local = getLocalSession();
      if (local && !local.is_completed) {
        setActiveSession(local);
        setLastTopic(local.title || "Targeted Practice");
      } else {
        setActiveSession(null);
      }

      // 2. Fetch server session / attempt stats
      fetch("/api/practice/session", { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            if (data.totalAttempts > 0) {
              serverAttemptsRef.current = data.totalAttempts;
              setTotalAttempts(data.totalAttempts);
              setAccuracy(data.accuracy);
              setMistakeCount(data.mistakeCount);
              if (Array.isArray(data.mistakeQuestionIds)) {
                setMistakeIds(data.mistakeQuestionIds);
              }
            }
            if (data.activeSession && !data.activeSession.is_completed) {
              setActiveSession((prev) => prev || data.activeSession);
              setLastTopic(data.activeSession.title);
            }
          }
        })
        .catch(() => {});

      // 3. Fallback to client mock history
      const snap = computeDashboardSnapshot();
      if (snap.mocksCompleted > 0 && serverAttemptsRef.current === 0) {
        setAccuracy(snap.averageAccuracy);
        setTotalAttempts(snap.totalQuestionsAttempted);
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

    syncStats();

    window.addEventListener(MOCK_SAVED_EVENT, syncStats);
    window.addEventListener(PRACTICE_SESSION_UPDATED_EVENT, syncStats);
    window.addEventListener("dp_question_attempted", syncStats);
    window.addEventListener("storage", syncStats);
    window.addEventListener(TARGETS_UPDATED_EVENT, handleTargetsUpdated);

    return () => {
      window.removeEventListener(MOCK_SAVED_EVENT, syncStats);
      window.removeEventListener(PRACTICE_SESSION_UPDATED_EVENT, syncStats);
      window.removeEventListener("dp_question_attempted", syncStats);
      window.removeEventListener("storage", syncStats);
      window.removeEventListener(TARGETS_UPDATED_EVENT, handleTargetsUpdated);
    };
  }, []);

  const formattedExamLabel =
    formatExamsLabel(exams) || exam || "Choose your target exam";

  const answeredInSession = activeSession
    ? Object.keys(activeSession.answers || {}).length
    : 0;

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

        {/* ── Unfinished Active Session Banner (Priority 1) ───────────────── */}
        {activeSession && !activeSession.is_completed && (
          <div className="mt-6 rounded-2xl border border-blue-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                  Unfinished Practice Session
                </span>
                <h3 className="mt-0.5 text-base sm:text-lg font-black text-slate-900">
                  {activeSession.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Progress: {answeredInSession} of {activeSession.total_questions || activeSession.question_ids?.length || 0} questions completed
                </p>
              </div>

              <Link
                href={`/dashboard/practice/session?resume=true&session_id=${encodeURIComponent(activeSession.id)}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition active:scale-95 shrink-0"
              >
                <span>Resume Session</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* ── Practice Summary KPI Cards ──────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Questions Done
            </p>
            <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
              {totalAttempts}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Accuracy Rate
            </p>
            <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
              {accuracy}%
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Review Mistakes
            </p>
            <div className="mt-1 flex items-baseline justify-between">
              <p className="text-2xl font-black text-slate-900 sm:text-3xl">
                {mistakeCount}
              </p>
              {mistakeCount > 0 && mistakeIds.length > 0 && (
                <Link
                  href={`/dashboard/practice/session?ids=${mistakeIds.join(",")}`}
                  className="text-[11px] font-bold text-rose-600 hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Practice</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="flex flex-col justify-between text-left rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:bg-blue-50/40 group cursor-pointer"
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

        {/* Primary CTA */}
        <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
          <Link
            href="/dashboard/practice"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{totalAttempts > 0 ? "Continue Practice" : "Start Your First Practice"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {mistakeCount > 0 && mistakeIds.length > 0 && (
            <Link
              href={`/dashboard/practice/session?ids=${mistakeIds.join(",")}`}
              className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/80 px-5 py-3.5 text-sm font-bold text-rose-700 shadow-xs hover:bg-rose-100 transition active:scale-95"
            >
              <RotateCcw className="h-4 w-4 text-rose-600" />
              <span>Review {mistakeCount} Mistakes</span>
            </Link>
          )}
        </div>
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
