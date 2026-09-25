"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, ClipboardList } from "lucide-react";

import FullPaperHero, { FullPaperDefinition } from "@/components/practice/FullPaperHero";
import QuestionCountCard from "@/components/practice/QuestionCountCard";
import AttemptModeCard from "@/components/practice/AttemptModeCard";
import PracticeFilters from "./PracticeFilters";

// ─── Exam paper configuration ────────────────────────────────────────────────
// Static for Milestone 1. Will be served from backend in a future milestone.

interface ExamPaperConfig {
  questions: number;
  duration: string;
  marks: number;
}

const EXAM_PAPER_CONFIG: Record<string, ExamPaperConfig> = {
  "CAPF AC": { questions: 125, duration: "2 Hours", marks: 250 },
  "CDS":     { questions: 120, duration: "2 Hours", marks: 100 },
  "NDA":     { questions: 120, duration: "2.5 Hours", marks: 300 },
  "AFCAT":   { questions: 100, duration: "2 Hours", marks: 300 },
};

const DEFAULT_EXAM_CONFIG: ExamPaperConfig = {
  questions: 0,
  duration: "—",
  marks: 0,
};

// ─── Active filter shape (passed up from PracticeFilters) ─────────────────────

export interface ActiveFilters {
  exams: string[];
  years: number[];
  cycles: string[];
  subjects: string[];
  topics: string[];
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
  }, []);

  // ── Derived hero data ──────────────────────────────────────────────────────
  const primaryExam = activeFilters.exams[0] ?? "";

  // Normalize exam key — "CAPF AC 2025" → "CAPF AC"
  const examConfigKey =
    Object.keys(EXAM_PAPER_CONFIG).find((key) =>
      primaryExam.startsWith(key)
    ) ?? primaryExam;

  const examConfig = EXAM_PAPER_CONFIG[examConfigKey] ?? DEFAULT_EXAM_CONFIG;

  const heroExamLabel = primaryExam
    ? primaryExam
    : "Select an Exam";

  const heroReady = Boolean(primaryExam) && examConfig.questions > 0;

  // ── Navigation handlers ────────────────────────────────────────────────────
  function buildSessionParams(mode: "instant" | "attempt") {
    const params = new URLSearchParams({ mode });
    if (activeFilters.exams.length)    params.set("exam", activeFilters.exams.join(","));
    if (activeFilters.years.length)    params.set("year", activeFilters.years.join(","));
    if (activeFilters.cycles.length)   params.set("cycle", activeFilters.cycles.join(","));
    if (activeFilters.subjects.length) params.set("subject", activeFilters.subjects.join(","));
    if (activeFilters.topics.length)   params.set("topic", activeFilters.topics.join(","));
    return params.toString();
  }

  function handleStartFullPaper(paper: FullPaperDefinition) {
    const params = new URLSearchParams();
    params.set("exam", paper.exam);
    params.set("year", paper.year.toString());
    if (paper.cycle) {
      params.set("cycle", paper.cycle);
    }
    router.push(`/dashboard/practice/full-paper?${params.toString()}`);
  }

  function handleStartLearning() {
    router.push(`/dashboard/practice/session?${buildSessionParams("instant")}`);
  }

  function handleStartPractice() {
    router.push(`/dashboard/practice/session?${buildSessionParams("attempt")}`);
  }

  // ── Disable attempt cards if no questions found ────────────────────────────
  const attemptDisabled = countLoading || questionCount === 0;

  return (
    <div className="space-y-6">
      {/* ── Section 1: Full Paper Hero ─────────────────────────────────────── */}
      <FullPaperHero
        onStart={handleStartFullPaper}
        initialExam={primaryExam}
        initialYear={activeFilters.years[0]}
      />

      {/* ── Section 2: Targeted Practice (existing filters) ────────────────── */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 px-8 pt-8 pb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Targeted Practice
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose filters, then decide how to attempt.
          </p>
        </div>

        <div className="px-8 py-6">
          <PracticeFilters onFilterChange={handleFilterChange} />
        </div>
      </div>

      {/* ── Section 3: Live Question Count ─────────────────────────────────── */}
      <QuestionCountCard count={questionCount} loading={countLoading} />

      {/* ── Section 4: Attempt Mode Cards ──────────────────────────────────── */}
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
