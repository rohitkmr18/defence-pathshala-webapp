"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LogIn,
  Target,
  FileText,
  ArrowRight,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { fullPaperDestination } from "@/lib/full-paper-intent";
import { safeLearningReturn } from "@/lib/learning-navigation";
import { trackLearningEvent } from "@/lib/learning-events";

import FullPaperHero, { FullPaperDefinition } from "@/components/practice/FullPaperHero";
import QuestionDistributionChart from "@/components/practice/QuestionDistributionChart";
import PracticeFilters, { type FilterOverride } from "./PracticeFilters";
import {
  buildPracticeSessionUrl,
  buildPracticeUrl,
  parseFiltersFromSearchParams,
  serializeFiltersToSearchParams,
} from "@/lib/question-filters";

// ─── Active filter shape ───────────────────────────────────────────────────────

export interface ActiveFilters {
  exams: string[];
  years: number[];
  cycles: string[];
  subjects: string[];
  topics: string[];
  subtopics?: string[];
  difficulty?: string;
  allExamsSelected?: boolean;
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
              Full-length exam simulations require an account to save official rankings and post-mock performance analytics. Targeted practice is accessible without signing in.
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

// ─── Main Client Component ───────────────────────────────────────────────────

export default function PracticePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const practiceMode = searchParams.get("mode") === "full_paper" ? "full-paper" : "targeted";
  const sessionStyle = searchParams.get("mode") === "attempt" ? "attempt" : "instant";

  function preserveIntent(filters: ActiveFilters, style: "instant" | "attempt" = sessionStyle, workflow: "targeted" | "full-paper" = practiceMode) {
    const parsed = parseFiltersFromSearchParams(searchParams);
    const url = buildPracticeUrl({ ...parsed, ...filters,
      mode: workflow === "full-paper" ? "full_paper" : style,
      returnTo: returnTo ? safeLearningReturn(returnTo) : undefined,
      origin: parsed.origin || (returnTo?.includes("question-bank") ? "explore" : "practice"),
    });
    if (url !== window.location.pathname + window.location.search) window.history.replaceState(null, "", url);
  }
  const preserveIntentRef = useRef(preserveIntent);
  useEffect(() => { preserveIntentRef.current = preserveIntent; });

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(() => {
    const parsed = parseFiltersFromSearchParams(searchParams);
    return {
      exams: parsed.exams,
      years: parsed.years,
      cycles: parsed.cycles,
      subjects: parsed.subjects,
      topics: parsed.topics,
      subtopics: parsed.subtopics,
      difficulty: "",
    };
  });

  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState(false);

  // Accordion for question distribution chart
  const [showDistribution, setShowDistribution] = useState(false);

  // Auth state — check once on mount
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [pendingPaperUrl, setPendingPaperUrl] = useState("/dashboard/practice/full-paper");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data.user);
    });
  }, []);

  // ── Fetch live question count whenever filters change ──────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchCount() {
      if (activeFilters.exams.length === 0) {
        setQuestionCount(null);
        setCountLoading(false);
        return;
      }

      setCountLoading(true);

      try {
        const params = serializeFiltersToSearchParams({
          exams: activeFilters.exams,
          years: activeFilters.years,
          cycles: activeFilters.cycles,
          subjects: activeFilters.subjects,
          topics: activeFilters.topics,
          subtopics: activeFilters.subtopics,
          difficulties: [],
        });

        const res = await fetch(
          `/api/practice/count?${params.toString()}`,
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

  // ── External filter override (from chart bar clicks) ───────────────────────
  const [filterOverride, setFilterOverride] = useState<FilterOverride | null>(null);

  const handleBarClick = useCallback(
    (type: "cycle" | "year" | "exam", value: string | number) => {
      setFilterOverride({
        type,
        value,
        timestamp: Date.now(),
      });
    },
    []
  );

  const handleViewAllYears = useCallback(() => {
    setFilterOverride({
      type: "all_years",
      timestamp: Date.now(),
    });
  }, []);

  const handleFilterChange = useCallback((filters: ActiveFilters) => {
    setActiveFilters((prev) => {
      const examsSame = prev.exams.length === filters.exams.length && prev.exams.every((e, i) => e === filters.exams[i]);
      const yearsSame = prev.years.length === filters.years.length && prev.years.every((y, i) => y === filters.years[i]);
      const cyclesSame = prev.cycles.length === filters.cycles.length && prev.cycles.every((c, i) => c === filters.cycles[i]);
      const subjectsSame = prev.subjects.length === filters.subjects.length && prev.subjects.every((s, i) => s === filters.subjects[i]);
      const topicsSame = prev.topics.length === filters.topics.length && prev.topics.every((t, i) => t === filters.topics[i]);
      const subtopicsSame = (prev.subtopics?.length ?? 0) === (filters.subtopics?.length ?? 0) &&
        (prev.subtopics ?? []).every((st, i) => st === (filters.subtopics ?? [])[i]);
      const diffSame = prev.difficulty === filters.difficulty;
      const allExamsSame = prev.allExamsSelected === filters.allExamsSelected;

      if (examsSame && yearsSame && cyclesSame && subjectsSame && topicsSame && subtopicsSame && diffSame && allExamsSame) {
        return prev;
      }
      return filters;
    });
    setShowAuthGate(false);
    preserveIntentRef.current(filters);
  }, []);

  // ── Auth-gated Full Paper Navigation ───────────────────────────────────────
  function requireAuth(navigateTo: string) {
    if (isAuthenticated !== true) {
      setPendingPaperUrl(navigateTo);
      setShowAuthGate(true);
      return;
    }
    router.push(navigateTo);
  }

  function handleStartFullPaper(paper: FullPaperDefinition) {
    const url = new URL(fullPaperDestination(paper), "https://learning.invalid");
    if (returnTo) url.searchParams.set("returnTo", safeLearningReturn(returnTo));
    const origin = searchParams.get("origin");
    if (origin) url.searchParams.set("origin", origin);
    requireAuth(`${url.pathname}${url.search}`);
  }

  function handleStartPractice() {
    const sessionUrl = buildPracticeSessionUrl(
      {
        ...parseFiltersFromSearchParams(searchParams),
        exams: activeFilters.exams,
        years: activeFilters.years,
        cycles: activeFilters.cycles,
        subjects: activeFilters.subjects,
        topics: activeFilters.topics,
        subtopics: activeFilters.subtopics,
        difficulties: [],
      },
      {
        mode: sessionStyle,
        returnTo: returnTo || undefined,
      }
    );
    trackLearningEvent("practice_launch", { mode: sessionStyle, origin: searchParams.get("origin") || "practice" });
    router.push(sessionUrl);
  }

  const primaryExam = activeFilters.exams[0] ?? "";
  const isCtaDisabled = countLoading || questionCount === 0 || questionCount === null;

  // Filter summary breadcrumbs
  const filterSummary = [
    activeFilters.exams.join("/"),
    activeFilters.subjects.length > 0 ? (activeFilters.subjects.length === 1 ? activeFilters.subjects[0] : `${activeFilters.subjects.length} Subjects`) : "All Subjects",
    activeFilters.topics.length > 0 ? (activeFilters.topics.length === 1 ? activeFilters.topics[0] : `${activeFilters.topics.length} Topics`) : null,
  ].filter(Boolean).join(" › ");

  return (
    <div className="space-y-6">
      {/* Return to Explore Bar if originated from Explore */}
      {returnTo && (
        <div className="flex items-center gap-2 pb-2">
          <Link
            href={safeLearningReturn(returnTo)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-blue-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{safeLearningReturn(returnTo) === "/dashboard/mistakes" ? "Back to Mistakes" : safeLearningReturn(returnTo) === "/dashboard" ? "Back to Dashboard" : "← Back to Explore (Preserve Filters)"}</span>
          </Link>
        </div>
      )}

      {/* ── Mode Selection Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
            Choose Your Practice Workflow
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Select between granular topic mastery and full-length official timed mocks.
          </p>
        </div>

        {/* Clean Segmented Tab Switcher */}
        <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-100/90 p-1 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => { preserveIntent(activeFilters, sessionStyle, "targeted"); }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              practiceMode === "targeted"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Target className="h-4 w-4" />
            <span>Targeted Practice</span>
          </button>

          <button
            type="button"
            onClick={() => { preserveIntent(activeFilters, sessionStyle, "full-paper"); }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              practiceMode === "full-paper"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Full Paper Mock</span>
          </button>
        </div>
      </div>

      {/* ── Auth Gate Banner ─────────────────────────────────────────────── */}
      {showAuthGate && (
        <AuthGateBanner nextUrl={pendingPaperUrl} />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          MODE 1: TARGETED PRACTICE (PRIMARY USER FLOW)
          ═══════════════════════════════════════════════════════════════════════ */}
      {practiceMode === "targeted" && (
        <div className="space-y-6">
          {/* Main Progressive Filter Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <PracticeFilters
              onFilterChange={handleFilterChange}
              filterOverride={filterOverride}
            />
          </div>

          {/* Sticky / Prominent Action & Launch Bar */}
          <div className="sticky bottom-[calc(5rem+env(safe-area-inset-bottom))] lg:bottom-4 z-20 rounded-3xl border border-slate-200/90 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Left: Summary + Live count badge */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Ready to practice
                  </p>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[280px] sm:max-w-md">
                    {filterSummary}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    {countLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    ) : (
                      <span className="text-2xl font-black text-slate-900">
                        {questionCount ?? 0}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-500">
                      Questions Matching Filters
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Practice Mode Toggle + Primary CTA */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Session style segmented toggle */}
                <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => { preserveIntent(activeFilters, "instant"); }}
                    className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
                      sessionStyle === "instant"
                        ? "bg-white font-bold text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    💡 Instant Learning
                  </button>
                  <button
                    type="button"
                    onClick={() => { preserveIntent(activeFilters, "attempt"); }}
                    className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
                      sessionStyle === "attempt"
                        ? "bg-white font-bold text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    ⏱️ Timed Exam
                  </button>
                </div>

                {/* Single Primary CTA */}
                <button
                  type="button"
                  onClick={handleStartPractice}
                  disabled={isCtaDisabled}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white shadow-md transition cursor-pointer ${
                    isCtaDisabled
                      ? "cursor-not-allowed bg-slate-300 shadow-none"
                      : "bg-blue-600 hover:bg-blue-500 active:scale-[0.98] shadow-blue-600/20"
                  }`}
                >
                  <span>Start Practice Session</span>
                  {questionCount !== null && questionCount > 0 && (
                    <span className="rounded-full bg-blue-700/60 px-2 py-0.5 text-xs">
                      {questionCount}
                    </span>
                  )}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible Question Distribution Chart */}
          <div className="rounded-3xl border border-slate-200/90 bg-white">
            <button
              type="button"
              onClick={() => setShowDistribution((prev) => !prev)}
              className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50/60 rounded-3xl cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-bold text-slate-800">
                  Historical PYQ Distribution & Year Breakdown
                </span>
                <span className="text-xs text-slate-400">
                  (Explore year-wise recurrence trends)
                </span>
              </div>
              <span className="text-slate-400">
                {showDistribution ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
            </button>

            {showDistribution && (
              <div className="border-t border-slate-100 p-5 sm:p-7">
                <QuestionDistributionChart
                  activeFilters={activeFilters}
                  allExamsSelected={activeFilters.allExamsSelected}
                  onBarClick={handleBarClick}
                  onViewAllYears={handleViewAllYears}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          MODE 2: FULL PAPER SIMULATION (DECOUPLED FLOW)
          ═══════════════════════════════════════════════════════════════════════ */}
      {practiceMode === "full-paper" && (
        <div className="space-y-6">
          <FullPaperHero
            onStart={handleStartFullPaper}
            initialExam={primaryExam}
            initialYear={activeFilters.years[0]}
          />
        </div>
      )}
    </div>
  );
}
