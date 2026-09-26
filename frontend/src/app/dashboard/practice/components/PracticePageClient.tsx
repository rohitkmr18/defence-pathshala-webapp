"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, ClipboardList, LogIn } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

import FullPaperHero, { FullPaperDefinition } from "@/components/practice/FullPaperHero";
import QuestionCountCard from "@/components/practice/QuestionCountCard";
import AttemptModeCard from "@/components/practice/AttemptModeCard";
import PracticeFilters from "./PracticeFilters";


// ─── Active filter shape ───────────────────────────────────────────────────────

export interface ActiveFilters {
  exams: string[];
  years: number[];
  cycles: string[];
  subjects: string[];
  topics: string[];
}

// ─── Auth gate modal / banner ─────────────────────────────────────────────────

function AuthGateBanner({ nextUrl }: { nextUrl: string }) {
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 shadow-xs">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
            <LogIn className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              Sign in to attempt Full Paper mocks
            </p>
            <p className="mt-0.5 text-xs text-slate-600">
              Full-length exam simulations require an account to save official rankings and post-mock performance analytics. Targeted filtered practice is completely free without signing in.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href={`/auth/login?next=${encodeURIComponent(nextUrl)}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-500"
          >
            <LogIn className="h-3.5 w-3.5" />
            Log In to Attempt Full Paper
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PracticePageClient() {
  const router = useRouter();

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    exams: [],
    years: [],
    cycles: [],
    subjects: [],
    topics: [],
  });

  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState(false);

  // Auth state — check once on mount
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data.user);
    });
  }, []);

  // ── Fetch question count whenever filters change ───────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchCount() {
      setCountLoading(true);
      setQuestionCount(null);

      try {
        const params = new URLSearchParams();
        if (activeFilters.exams.length) {
          params.set("exam", activeFilters.exams.join(","));
        }
        if (activeFilters.years.length) {
          params.set("year", activeFilters.years.join(","));
        }
        if (activeFilters.cycles.length) {
          params.set("cycle", activeFilters.cycles.join(","));
        }
        if (activeFilters.subjects.length) {
          params.set("subject", activeFilters.subjects.join(","));
        }
        if (activeFilters.topics.length) {
          params.set("topic", activeFilters.topics.join(","));
        }

        const res = await fetch(
          `/api/practice/count${params.toString() ? `?${params}` : ""}`,
          { cache: "no-store" }
        );

        if (!cancelled) {
          if (res.ok) {
            const data = (await res.json()) as { count: number };
            setQuestionCount(data.count);
          } else {
            setQuestionCount(0);
          }
        }
      } catch {
        if (!cancelled) {
          setQuestionCount(0);
        }
      } finally {
        if (!cancelled) {
          setCountLoading(false);
        }
      }
    }

    void fetchCount();

    return () => {
      cancelled = true;
    };
  }, [activeFilters]);

  // ── Callback from PracticeFilters ─────────────────────────────────────────
  const handleFilterChange = useCallback((filters: ActiveFilters) => {
    setActiveFilters(filters);
    // Reset auth gate when filters change
    setShowAuthGate(false);
  }, []);

  // ── Derived hero data ──────────────────────────────────────────────────────
  const primaryExam = activeFilters.exams[0] ?? "";



  // ── Session URL builder ────────────────────────────────────────────────────
  function buildSessionParams(mode: "instant" | "attempt") {
    const params = new URLSearchParams({ mode });
    if (activeFilters.exams.length)    params.set("exam", activeFilters.exams.join(","));
    if (activeFilters.years.length)    params.set("year", activeFilters.years.join(","));
    if (activeFilters.cycles.length)   params.set("cycle", activeFilters.cycles.join(","));
    if (activeFilters.subjects.length) params.set("subject", activeFilters.subjects.join(","));
    if (activeFilters.topics.length)   params.set("topic", activeFilters.topics.join(","));
    return params.toString();
  }

  // ── Auth-gated navigation ──────────────────────────────────────────────────
  function requireAuth(navigateTo: string) {
    if (isAuthenticated === false) {
      setShowAuthGate(true);
      return;
    }
    router.push(navigateTo);
  }

  function handleStartFullPaper(paper: FullPaperDefinition) {
    const params = new URLSearchParams();
    params.set("exam", paper.exam);
    params.set("year", paper.year.toString());
    if (paper.cycle) {
      params.set("cycle", paper.cycle);
    }
    requireAuth(`/dashboard/practice/full-paper?${params.toString()}`);
  }

  function handleStartLearning() {
    router.push(`/dashboard/practice/session?${buildSessionParams("instant")}`);
  }

  function handleStartPractice() {
    router.push(`/dashboard/practice/session?${buildSessionParams("attempt")}`);
  }

  const attemptDisabled = countLoading || questionCount === 0;

  // Current page URL for next= redirect
  const currentUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/dashboard/practice";

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ── Auth Gate Banner ─────────────────────────────────────────────── */}
      {showAuthGate && (
        <AuthGateBanner nextUrl={currentUrl} />
      )}

      {/* ── Section 1: Full Paper Hero ─────────────────────────────────── */}
      <FullPaperHero
        onStart={handleStartFullPaper}
        initialExam={primaryExam}
        initialYear={activeFilters.years[0]}
      />

      {/* ── Section 2: Targeted Practice ────────────────────────────────── */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 pt-6 pb-5 sm:px-8 sm:pt-8">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Targeted Practice
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose filters, then decide how to attempt.
          </p>
        </div>

        <div className="px-5 py-5 sm:px-8 sm:py-6">
          <PracticeFilters onFilterChange={handleFilterChange} />
        </div>
      </div>

      {/* ── Section 3: Live Question Count ──────────────────────────────── */}
      <QuestionCountCard count={questionCount} loading={countLoading} />

      {/* ── Section 4: Attempt Mode Cards ────────────────────────────────── */}
      {questionCount !== null && questionCount > 0 && !countLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          <AttemptModeCard
            icon={Lightbulb}
            title="Instant Feedback"
            description="Learn after every question with explanations. Review themes, subtopics, and difficulty as you go."
            ctaLabel="Start Learning"
            variant="outline"
            onStart={handleStartLearning}
            disabled={attemptDisabled}
          />

          <AttemptModeCard
            icon={ClipboardList}
            title="Attempt at Once"
            description="Finish first. Review everything after submission. A full UPSC-like experience — no mid-session answers."
            ctaLabel="Start Practice"
            variant="filled"
            onStart={handleStartPractice}
            disabled={attemptDisabled}
          />
        </div>
      )}
    </div>
  );
}
