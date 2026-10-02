"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Layers } from "lucide-react";
import type { PracticeQuestion, PlayerMode, OptionKey } from "@/lib/practice-types";
import QuestionPlayer from "@/components/practice/player/QuestionPlayer";
import FilteredAttemptDebrief from "@/components/practice/analysis/FilteredAttemptDebrief";
import {
  initializeSession,
  getLocalSession,
  updateSessionProgress,
  clearLocalSession,
} from "@/lib/practice-session-client";
import {
  parseFiltersFromSearchParams,
  serializeFiltersToSearchParams,
  buildPracticeUrl,
} from "@/lib/question-filters";

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
  resume?: boolean;
  specificIds?: string;
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
  resume,
  specificIds,
}: SessionPageClientProps) {
  const [questions, setQuestions] = useState<PracticeQuestion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [initialIndex, setInitialIndex] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  // Build filter object for deterministic backward navigation
  const currentFilters = {
    exam,
    year,
    cycle,
    subject,
    topic,
    subtopic,
    difficulty,
    intelligence_only: intelligenceOnly ? "true" : undefined,
  };

  const parsedFilters = parseFiltersFromSearchParams(currentFilters as any);

  // Build header label and breadcrumb
  const filterLabel =
    [subject, topic, subtopic].filter(Boolean).join(" › ") ||
    exam ||
    "Practice Session";

  // Determine Back Button destination
  const backHref = returnTo
    ? decodeURIComponent(returnTo)
    : buildPracticeUrl(parsedFilters);
  const backLabel = returnTo && returnTo.includes("question-bank")
    ? "Back to Explore"
    : "Back to Practice";

  useEffect(() => {
    let cancelled = false;

    async function loadSessionAndQuestions() {
      setLoading(true);
      try {
        const params = serializeFiltersToSearchParams({
          ...parsedFilters,
          limit: limit || 100,
        });

        if (specificIds) {
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
          const fetchedQuestions = data.questions || [];
          setQuestions(fetchedQuestions);

          if (fetchedQuestions.length > 0) {
            // Check if resuming active session
            const local = getLocalSession();
            if (resume && local && !local.is_completed) {
              setSessionId(local.id);
              setAnswers(local.answers || {});
              setInitialIndex(local.current_index || 0);
            } else {
              // Initialize a fresh session
              const newSess = await initializeSession({
                title: filterLabel,
                mode,
                filters: parsedFilters,
                questions: fetchedQuestions,
              });
              setSessionId(newSess.id);
            }
          }
        } else if (!cancelled) {
          setQuestions([]);
        }
      } catch {
        if (!cancelled) setQuestions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadSessionAndQuestions();
    return () => {
      cancelled = true;
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
    mode,
    filterLabel,
  ]);

  return (
    <div>
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
              {mode === "instant" ? "Targeted Practice" : "Full Mock Paper"}
            </span>
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
              {filterLabel}
            </h1>
          </div>
        </div>
      )}

      {/* Content Player */}
      {loading && <SessionSkeleton />}
      {!loading && questions?.length === 0 && <EmptyState returnUrl={backHref} />}
      {!loading && questions && questions.length > 0 && !completed && (
        <QuestionPlayer
          questions={questions}
          mode={mode}
          sessionId={sessionId}
          initialIndex={initialIndex}
          initialAnswers={answers}
          onComplete={(completedAnswers) => {
            setAnswers(completedAnswers);
            const duration = Math.max(
              1,
              Math.round(
                (Date.now() - (startTimeRef.current || Date.now())) / 1000
              )
            );
            setTimeSpentSeconds(duration);

            if (sessionId) {
              const correctCount = questions.filter(
                (q) => completedAnswers[q.id] === q.final_opt
              ).length;
              const incorrectCount = questions.filter(
                (q) =>
                  completedAnswers[q.id] &&
                  completedAnswers[q.id] !== q.final_opt
              ).length;

              updateSessionProgress(sessionId, {
                answers: completedAnswers,
                is_completed: true,
                correct_count: correctCount,
                incorrect_count: incorrectCount,
                time_spent_seconds: duration,
              });
            }

            setCompleted(true);
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
            setCompleted(false);
            setAnswers({});
            setInitialIndex(0);
            startTimeRef.current = Date.now();
          }}
        />
      )}
    </div>
  );
}
