"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { PracticeQuestion, PlayerMode, OptionKey } from "@/lib/practice-types";
import PracticePersistenceStatus from "@/components/practice/PracticePersistenceStatus";
import QuestionPlayer from "@/components/practice/player/QuestionPlayer";
import FilteredAttemptDebrief from "@/components/practice/analysis/FilteredAttemptDebrief";
import {
  initializeSession,
  completePracticeSession,
  updateSessionProgress,
  getLocalSession,
  clearLocalSession,
  loadResumeSession,
  restoreQuestionOrder,
  saveLocalSession,
  type ActivePracticeSession,
} from "@/lib/practice-session-client";
import {
  parseFiltersFromSearchParams,
  serializeFiltersToSearchParams,
  buildPracticeUrl,
} from "@/lib/question-filters";
import { safeLearningReturn } from "@/lib/learning-navigation";
import { trackLearningEvent } from "@/lib/learning-events";

// ─── Props ───────────────────────────────────────────────────────────────────

interface SessionPageClientProps {
  mode: PlayerMode;
  exam?: string;
  year?: string;
  cycle?: string;
  subject?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: string;
  intelligenceOnly?: boolean;
  limit?: number;
  returnTo?: string;
  origin?: string;
  resume?: boolean;
  specificIds?: string;
  resumeSessionId?: string;
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SessionSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 animate-pulse">
      <div className="h-16 rounded-2xl bg-slate-200" />
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-5 flex gap-2">
          <div className="h-6 w-24 rounded-full bg-slate-200" />
          <div className="h-6 w-36 rounded-full bg-slate-200" />
        </div>
        <div className="mb-8 space-y-2.5">
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-5/6 rounded bg-slate-200" />
          <div className="h-4 w-4/6 rounded bg-slate-200" />
        </div>
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="h-11 w-28 rounded-xl bg-slate-200" />
        <div className="h-11 w-36 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ returnUrl }: { returnUrl: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border border-dashed border-slate-200 bg-white p-8">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 text-2xl">
        🔍
      </div>
      <h2 className="text-xl font-black text-slate-900">No questions found</h2>
      <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-500">
        The current filters returned no matching questions. Try adjusting your
        syllabus filters or expanding the year range.
      </p>
      <Link
        href={returnUrl}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Return to Filters
      </Link>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SessionPageClient({
  mode,
  exam,
  year,
  cycle,
  subject,
  topic,
  subtopic,
  difficulty,
  intelligenceOnly,
  limit,
  returnTo,
  origin,
  resume,
  specificIds,
  resumeSessionId,
}: SessionPageClientProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<PracticeQuestion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [initialIndex, setInitialIndex] = useState(0);
  const [restoredSession, setRestoredSession] = useState<ActivePracticeSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingCompletion, setSavingCompletion] = useState(false);
  const completionRef = useRef(false);
  const sessionMode: PlayerMode = restoredSession?.mode === "attempt" ? "attempt" : restoredSession ? "instant" : mode;
  const startTimeRef = useRef<number>(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  useEffect(() => {
    if (!sessionId) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("session_id") === sessionId && url.searchParams.get("resume") === "true") return;
    url.searchParams.set("resume", "true"); url.searchParams.set("session_id", sessionId);
    router.replace(`${url.pathname}${url.search}`, { scroll: false });
  }, [sessionId, router]);

  // Keep this stable so state restoration does not restart the loading effect.
  const parsedFilters = useMemo(() => parseFiltersFromSearchParams({
    exam, year, cycle, subject, topic, subtopic, difficulty, mode, returnTo, origin,
    intelligence_only: intelligenceOnly ? "true" : undefined,
  }), [exam, year, cycle, subject, topic, subtopic, difficulty, intelligenceOnly, mode, returnTo, origin]);

  // Build header label and breadcrumb
  const filterLabel =
    restoredSession?.title || [subject, topic, subtopic].filter(Boolean).join(" › ") ||
    exam ||
    "Practice Session";

  // Determine Back Button destination
  const backHref = safeLearningReturn(returnTo || restoredSession?.filters.returnTo,
    buildPracticeUrl(restoredSession?.filters || parsedFilters));
  const backLabel = backHref === "/dashboard" ? "Back to Dashboard" : backHref.includes("question-bank")
    ? "Back to Explore"
    : "Back to Practice";

  useEffect(() => {
    let cancelled = false;

    async function loadSessionAndQuestions() {
      startTimeRef.current = Date.now();
      setLoading(true);
      setError(null);
      try {
        const url = new URL(window.location.href);
        const saved = resume || url.searchParams.get("resume") === "true"
          ? await loadResumeSession(resumeSessionId || url.searchParams.get("session_id") || undefined) : null;
        if (cancelled) return;
        if (saved?.mode === "full_paper") {
          const params = serializeFiltersToSearchParams({ ...saved.filters,
            returnTo: returnTo || saved.filters.returnTo, origin: origin || saved.filters.origin });
          params.set("resume", "true"); params.set("session_id", saved.id);
          window.location.replace(`/dashboard/practice/full-paper?${params}`);
          return;
        }
        const params = serializeFiltersToSearchParams({
          ...(saved?.filters || parsedFilters),
          limit: saved ? saved.question_ids.length : limit || 100,
        });

        if (saved) {
          params.set("ids", saved.question_ids.join(","));
        } else if (specificIds) {
          params.set("ids", specificIds);
        }

        const res = await fetch(
          `/api/practice/questions?${params.toString()}`,
          { cache: "no-store" }
        );

        if (!cancelled && res.ok) {
          const data = (await res.json()) as {
            questions: PracticeQuestion[];
            total: number;
          };
          const fetchedQuestions = saved
            ? restoreQuestionOrder(saved.question_ids, data.questions || [])
            : data.questions || [];
          setQuestions(fetchedQuestions);

          if (fetchedQuestions.length > 0) {
            // Check if resuming active session
            if (saved) {
              saveLocalSession(saved);
              setRestoredSession(saved);
              setSessionId(saved.id);
              setAnswers(saved.answers || {});
              setInitialIndex(Math.max(0, Math.min(saved.current_index || 0, fetchedQuestions.length - 1)));
              trackLearningEvent("practice_resume", { mode: saved.mode, position: saved.current_index, origin }, `${saved.id}:${saved.updated_at}`);
            } else {
              // Initialize a fresh session
              const newSess = await initializeSession({
                title: [subject, topic, subtopic].filter(Boolean).join(" › ") || exam || "Practice Session",
                mode,
                filters: parsedFilters,
                questions: fetchedQuestions,
              });
              if (!cancelled) {
                setRestoredSession(null);
                setAnswers({});
                setInitialIndex(0);
                setSessionId(newSess.id);
                trackLearningEvent("practice_start", { mode, origin }, newSess.id);
              }
            }
          }
        } else if (!cancelled) {
          throw new Error("Could not load session questions. Please try again.");
        }
      } catch (err) {
        if (!cancelled) {
          setQuestions(null);
          setError(err instanceof Error ? err.message : "Could not restore your session.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const start = window.setTimeout(() => { void loadSessionAndQuestions(); }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(start);
    };
  }, [
    exam,
    year,
    cycle,
    subject,
    topic,
    subtopic,
    difficulty,
    intelligenceOnly,
    limit,
    resume,
    specificIds,
    resumeSessionId,
    mode,
    origin,
    parsedFilters,
  ]);

  useEffect(() => {
    if (!sessionId || completed) return;
    const base = getLocalSession()?.time_spent_seconds || 0;
    const started = Date.now();
    const persist = () => {
      if (getLocalSession()?.id === sessionId) updateSessionProgress(sessionId, {
        time_spent_seconds: base + Math.round((Date.now() - started) / 1000),
      });
    };
    const timer = window.setInterval(persist, 5000);
    window.addEventListener("pagehide", persist);
    return () => { window.clearInterval(timer); window.removeEventListener("pagehide", persist); persist(); };
  }, [sessionId, completed]);

  return (
    <div>
      {sessionId && <PracticePersistenceStatus questions={questions || []} />}
      {/* Back Navigation Bar & Session Breadcrumb */}
      {!completed && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-blue-700 transition active:scale-95"
            aria-label={backLabel}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{backLabel}</span>
          </Link>

          <div className="text-right">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {sessionMode === "instant" ? "Targeted Practice" : "Full Mock Paper"}
            </span>
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
              {filterLabel}
            </h1>
          </div>
        </div>
      )}

      {/* Content Player */}
      {loading && <SessionSkeleton />}
      {!loading && error && (
        <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <p>{error}</p>
          <Link href={backHref} className="mt-3 inline-block font-bold underline">Return to Practice</Link>
        </div>
      )}
      {!loading && questions?.length === 0 && <EmptyState returnUrl={backHref} />}
      {!loading && questions && questions.length > 0 && !completed && (
        <QuestionPlayer
          key={sessionId}
          questions={questions}
          mode={sessionMode}
          sessionId={sessionId}
          initialIndex={initialIndex}
          initialAnswers={answers}
          initialCheckedIds={restoredSession?.checked_ids || []}
          disabled={savingCompletion}
          onComplete={async (completedAnswers) => {
            if (completionRef.current) return;
            completionRef.current = true;
            setSavingCompletion(true);
            setError(null);
            setAnswers(completedAnswers);
            const duration = Math.max(
              1,
              (restoredSession?.time_spent_seconds || 0) + Math.round(
                (Date.now() - (startTimeRef.current || Date.now())) / 1000
              )
            );
            setTimeSpentSeconds(duration);

            if (sessionId) {
              try {
                await completePracticeSession({ sessionId, questions, answers: completedAnswers,
                  mode: sessionMode, timeSpentSeconds: duration });
              } catch (err) {
                setError(err instanceof Error ? err.message : "Could not save completion.");
                completionRef.current = false;
                setSavingCompletion(false);
                return;
              }
            }

            setCompleted(true);
            trackLearningEvent("practice_complete", { mode: sessionMode, duration }, sessionId);
            completionRef.current = false;
            setSavingCompletion(false);
          }}
        />
      )}

      {/* Completion Debrief */}
      {completed && questions && (
        <FilteredAttemptDebrief
          questions={questions}
          answers={answers}
          sessionTitle={filterLabel}
          totalTimeSpentSeconds={timeSpentSeconds}
          onRetake={() => {
            if (sessionId) {
              clearLocalSession();
            }
            void initializeSession({ title: filterLabel, mode: sessionMode,
              filters: restoredSession?.filters || parsedFilters, questions }).then(next => {
                setSessionId(next.id);
              });
            setError(null);
            setCompleted(false);
            setAnswers({});
            setInitialIndex(0);
            setRestoredSession(null);
            startTimeRef.current = Date.now();
          }}
        />
      )}
    </div>
  );
}
