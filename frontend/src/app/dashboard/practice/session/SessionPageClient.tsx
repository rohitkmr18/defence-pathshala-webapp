"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PracticeQuestion, PlayerMode, OptionKey } from "@/lib/practice-types";
import QuestionPlayer from "@/components/practice/player/QuestionPlayer";
import FilteredAttemptDebrief from "@/components/practice/analysis/FilteredAttemptDebrief";

// ─── Props ───────────────────────────────────────────────────────────────────

interface SessionPageClientProps {
  mode: PlayerMode;
  exam?: string;
  year?: string;
  cycle?: string;
  subject?: string;
  topic?: string;
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SessionSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 animate-pulse">
      {/* Progress bar skeleton */}
      <div className="h-[72px] rounded-2xl bg-slate-200" />
      {/* Card skeleton */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-5 flex gap-2">
          <div className="h-6 w-20 rounded-full bg-slate-200" />
          <div className="h-6 w-32 rounded-full bg-slate-200" />
        </div>
        <div className="mb-8 space-y-2">
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
      {/* Nav skeleton */}
      <div className="flex justify-between">
        <div className="h-11 w-28 rounded-xl bg-slate-200" />
        <div className="h-11 w-32 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 text-5xl">🔍</div>
      <h2 className="text-xl font-bold text-slate-900">No questions found</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        The current filters returned no matching questions. Try adjusting the
        filters or expanding the year range.
      </p>
      <Link
        href="/dashboard/practice"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Practice
      </Link>
    </div>
  );
}

// ─── Completed state ──────────────────────────────────────────────────────────

function CompletedState({ total }: { total: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 text-5xl">🎯</div>
      <h2 className="text-2xl font-bold text-slate-900">Session Complete!</h2>
      <p className="mt-2 text-slate-500">
        You answered all {total} questions.
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Post-session analytics coming in the next milestone.
      </p>
      <Link
        href="/dashboard/practice"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Practice
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
}: SessionPageClientProps) {
  const [questions, setQuestions] = useState<PracticeQuestion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  // Build header label from filters
  const filterLabel = [subject, topic].filter(Boolean).join(" › ") || exam || "Practice Session";

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (exam)    params.set("exam", exam);
        if (year)    params.set("year", year);
        if (cycle)   params.set("cycle", cycle);
        if (subject) params.set("subject", subject);
        if (topic)   params.set("topic", topic);
        // Request up to 100 questions per session
        params.set("limit", "100");

        const res = await fetch(
          `/api/practice/questions${params.toString() ? `?${params}` : ""}`,
          { cache: "no-store" }
        );

        if (!cancelled) {
          if (res.ok) {
            const data = (await res.json()) as {
              questions: PracticeQuestion[];
              total: number;
            };
            setQuestions(data.questions);
          } else {
            setQuestions([]);
          }
        }
      } catch {
        if (!cancelled) setQuestions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadQuestions();
    return () => { cancelled = true; };
  }, [exam, year, cycle, subject, topic]);

  return (
    <div>
      {/* Back nav + session title */}
      {!completed && (
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/dashboard/practice"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
            aria-label="Back to practice"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              {mode === "instant" ? "Instant Feedback" : "Attempt at Once"}
            </p>
            <h1 className="text-lg font-bold text-slate-900">{filterLabel}</h1>
          </div>
        </div>
      )}

      {/* Content */}
      {loading && <SessionSkeleton />}
      {!loading && questions?.length === 0 && <EmptyState />}
      {!loading && questions && questions.length > 0 && !completed && (
        <QuestionPlayer
          questions={questions}
          mode={mode}
          onComplete={(completedAnswers) => {
            setAnswers(completedAnswers);
            setTimeSpentSeconds(Math.max(1, Math.round((Date.now() - startTime) / 1000)));
            setCompleted(true);
          }}
        />
      )}
      {completed && questions && (
        <FilteredAttemptDebrief
          questions={questions}
          answers={answers}
          sessionTitle={filterLabel}
          totalTimeSpentSeconds={timeSpentSeconds}
          onRetake={() => {
            setCompleted(false);
            setAnswers({});
            setStartTime(Date.now());
          }}
        />
      )}
    </div>
  );
}
