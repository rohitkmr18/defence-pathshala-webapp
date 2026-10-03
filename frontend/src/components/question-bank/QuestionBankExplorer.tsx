"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Database,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Filter,
  CheckCircle2,
  Flame,
  Gauge,
  FileText,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import type { QuestionBankMeta } from "@/lib/question-bank";
import {
  getQuestionBank,
  type QuestionBankPayload,
} from "@/lib/question-bank-client";
import TopicHeatmap from "@/components/charts/TopicHeatmap";
import DifficultyVisualizer from "@/components/charts/DifficultyVisualizer";
import QuestionPatternMatrix from "@/components/charts/QuestionPatternMatrix";
import { buildPracticeUrl } from "@/lib/question-filters";

interface Props {
  meta: QuestionBankMeta;
}

type TabView = "all" | "heatmaps" | "difficulty" | "patterns";

export default function QuestionBankExplorer({ meta }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const readList = (key: string) =>
    searchParams.get(key)?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];

  // Initially no exam is selected unless explicitly provided via URL param (?exam=...)
  const [selectedExams, setSelectedExams] = useState<string[]>(() => {
    return readList("exam");
  });

  const allExamValues = useMemo(() => meta.exams.map((e) => e.value), [meta.exams]);
  const allAvailableYears = useMemo(() => {
    return Array.from(new Set(meta.exams.flatMap((e) => e.years))).sort((a, b) => b - a);
  }, [meta.exams]);
  const allAvailableCycles = useMemo(() => {
    return Array.from(new Set(meta.exams.flatMap((e) => e.cycles))).sort();
  }, [meta.exams]);

  const isAllSelected = useMemo(() => {
    if (selectedExams.length !== allExamValues.length || allExamValues.length === 0) return false;
    return allExamValues.every((val) => selectedExams.includes(val));
  }, [allExamValues, selectedExams]);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    const targetExams = selectedExams.length > 0 ? selectedExams : allExamValues;
    for (const exam of targetExams) {
      for (const item of meta.exams.find((entry) => entry.value === exam)?.years ?? []) {
        years.add(item);
      }
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [allExamValues, meta.exams, selectedExams]);

  const availableCycles = useMemo(() => {
    const cycles = new Set<string>();
    const targetExams = selectedExams.length > 0 ? selectedExams : allExamValues;
    for (const exam of targetExams) {
      for (const item of meta.exams.find((entry) => entry.value === exam)?.cycles ?? []) {
        cycles.add(item);
      }
    }
    return Array.from(cycles).sort();
  }, [allExamValues, meta.exams, selectedExams]);

  const [selectedYears, setSelectedYears] = useState<number[]>(() => {
    return readList("year").map(Number).filter(Number.isFinite);
  });

  const [selectedCycles, setSelectedCycles] = useState<string[]>(() => {
    return readList("cycle");
  });

  const [data, setData] = useState<QuestionBankPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabView>("all");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  if (selectedExams.length === 0 && (data !== null || loading)) {
    setData(null);
    setLoading(false);
  }

  const activeYears = selectedYears.filter((item) => availableYears.includes(item));
  const activeCycles = selectedCycles.filter((item) => availableCycles.includes(item));

  // A subject absent from the current result cannot remain selected.
  if (selectedSubject && data?.subjects && !data.subjects.some((s) => s.name === selectedSubject)) {
    setSelectedSubject(null);
  }

  const activeSubjectData = useMemo(() => {
    if (!selectedSubject || !data?.subjectAnalytics) return null;
    return data.subjectAnalytics[selectedSubject] ?? null;
  }, [data, selectedSubject]);

  const activeDifficulty = useMemo(() => {
    if (activeSubjectData) return activeSubjectData.difficulty;
    return data?.difficulty ?? [];
  }, [activeSubjectData, data?.difficulty]);

  const activePatterns = useMemo(() => {
    if (activeSubjectData) return activeSubjectData.questionPatterns;
    return data?.questionPatterns ?? [];
  }, [activeSubjectData, data?.questionPatterns]);

  const activeTypes = useMemo(() => {
    if (activeSubjectData) return activeSubjectData.questionTypes;
    return data?.questionTypes ?? [];
  }, [activeSubjectData, data?.questionTypes]);

  const activeTotalQuestions = useMemo(() => {
    if (activeSubjectData) return activeSubjectData.totalQuestions;
    return data?.summary.questions ?? 0;
  }, [activeSubjectData, data?.summary.questions]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedExams.length) params.set("exam", selectedExams.join(","));
    if (activeYears.length) params.set("year", activeYears.join(","));
    if (activeCycles.length) params.set("cycle", activeCycles.join(","));

    const query = params.toString();
    router.replace(
      query ? `/dashboard/question-bank?${query}` : "/dashboard/question-bank",
      {
        scroll: false,
      }
    );
  }, [activeCycles, activeYears, router, selectedExams]);

  useEffect(() => {
    let cancelled = false;

    // If no exams selected, do not make an API request
    if (selectedExams.length === 0) {
      return;
    }

    async function load() {
      setLoading(true);

      try {
        const result = await getQuestionBank({
          exams: selectedExams,
          years: activeYears,
          cycles: activeCycles,
        });

        if (!cancelled) {
          setData(result);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [activeCycles, activeYears, selectedExams]);

  const selectedExamLabels = selectedExams.map(
    (value) => meta.exams.find((item) => item.value === value)?.label ?? value
  );

  function toggleValue<T>(values: T[], value: T) {
    return values.includes(value)
      ? values.filter((item) => item !== value)
      : [...values, value];
  }

  function handleSelectAll() {
    setSelectedSubject(null);
    setSelectedExams(allExamValues);
    setSelectedYears(allAvailableYears);
    setSelectedCycles(allAvailableCycles);
  }

  function handleResetFilters() {
    setSelectedSubject(null);
    setSelectedExams([]);
    setSelectedYears([]);
    setSelectedCycles([]);
  }

  return (
    <div className="space-y-8">
      {/* ── 1. Interactive Filter Controls Card ─────────────────────────── */}
      <section
        aria-busy={loading}
        className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 shadow-2xs">
              <Filter className="h-3.5 w-3.5 text-blue-600" />
              <span>INTELLIGENCE FILTERS</span>
            </div>
            <h2 className="mt-2.5 text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Filter Official Papers & Patterns
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Select multiple exams, years, and cycles to generate comprehensive pattern analysis
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                isAllSelected
                  ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                  : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Select All Question Papers</span>
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* ── Quick Select Presets Tab Bar ───────────────────────────────── */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Quick Select:
          </span>
          {meta.exams.map((item) => {
            const isOnlyThis = selectedExams.length === 1 && selectedExams[0] === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setSelectedSubject(null);
                  setSelectedExams([item.value]);
                  setSelectedYears(item.years);
                  setSelectedCycles(item.cycles);
                }}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shrink-0 cursor-pointer ${
                  isOnlyThis
                    ? "bg-slate-900 text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>All {item.label} Papers</span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Exam Filter */}
          <div>
            <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
              <span>Target Exam</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer lowercase first-letter:uppercase"
                >
                  {isAllSelected ? "All Selected" : "Select all"}
                </button>
                <span className="text-[11px] font-normal text-slate-400">
                  {selectedExams.length} selected
                </span>
              </div>
            </div>

            <div className="max-h-48 space-y-1.5 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/50 p-2.5">
              {meta.exams.map((item) => {
                const isChecked = selectedExams.includes(item.value);
                return (
                  <label
                    key={item.value}
                    className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                      isChecked
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white text-slate-800 hover:bg-slate-100/80 border border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setSelectedExams((current) =>
                            toggleValue(current, item.value)
                          )
                        }
                        className="sr-only"
                      />
                      <span>{item.label}</span>
                    </div>
                    {isChecked && <CheckCircle2 className="h-4 w-4 text-white" />}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <label className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
              <span>Exam Year</span>
              <span className="text-[11px] font-normal text-slate-400">
                {activeYears.length} selected
              </span>
            </label>

            <div className="max-h-48 space-y-1.5 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/50 p-2.5">
              {availableYears.map((item) => {
                const isChecked = activeYears.includes(item);
                return (
                  <label
                    key={item}
                    className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                      isChecked
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white text-slate-800 hover:bg-slate-100/80 border border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setSelectedYears((current) =>
                            toggleValue(current, item)
                          )
                        }
                        className="sr-only"
                      />
                      <span>Year {item}</span>
                    </div>
                    {isChecked && <CheckCircle2 className="h-4 w-4 text-white" />}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Cycle Filter */}
          <div>
            <label className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
              <span>Exam Cycle / Paper</span>
              <span className="text-[11px] font-normal text-slate-400">
                {activeCycles.length} selected
              </span>
            </label>

            {availableCycles.length ? (
              <div className="max-h-48 space-y-1.5 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/50 p-2.5">
                {availableCycles.map((item) => {
                  const isChecked = activeCycles.includes(item);
                  return (
                    <label
                      key={item}
                      className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                        isChecked
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-white text-slate-800 hover:bg-slate-100/80 border border-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setSelectedCycles((current) =>
                              toggleValue(current, item)
                            )
                          }
                          className="sr-only"
                        />
                        <span>Cycle {item}</span>
                      </div>
                      {isChecked && <CheckCircle2 className="h-4 w-4 text-white" />}
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-400">
                Single cycle exam (Not applicable)
              </div>
            )}
          </div>
        </div>

        {/* Live Filter Selection Badges */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-5 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Filter:
          </span>
          <span className="rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-bold text-blue-700 shadow-2xs">
            {selectedExamLabels.length ? selectedExamLabels.join(" • ") : "No exams"}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
            {activeYears.length ? `Years: ${activeYears.join(", ")}` : "All Years"}
          </span>
          {activeCycles.length > 0 && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
              Cycles: {activeCycles.join(", ")}
            </span>
          )}
        </div>
      </section>

      {/* ── 2. Top Summary KPI Cards ────────────────────────────────────── */}
      {data && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Questions
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {data.summary.questions}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">
              Official PYQs Analyzed
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Subjects
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BookOpen className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-blue-600">
              {data.summary.subjects}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">
              Syllabus Domains Tested
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Exam Scope
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                <Database className="h-4 w-4" />
              </div>
            </div>
            <p className="text-base sm:text-lg font-black text-slate-900 truncate">
              {selectedExamLabels.join(", ") || "All Exams"}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">
              Current Benchmark
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Timeline
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <p className="text-base sm:text-lg font-black text-slate-900 truncate">
              {activeYears.length ? activeYears.join(", ") : "All"}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">
              Cycles: {activeCycles.length ? activeCycles.join(", ") : "All"}
            </p>
          </div>
        </section>
      )}

      {/* ── 3. Quick View Switcher Tabs ─────────────────────────────────── */}
      {data && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`shrink-0 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Insights
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("heatmaps")}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "heatmaps"
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Syllabus Heatmaps</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("difficulty")}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "difficulty"
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Gauge className="h-3.5 w-3.5" />
            <span>Difficulty Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("patterns")}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "patterns"
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Question Patterns</span>
          </button>
        </div>
      )}

      {/* ── 4. Main Intelligence Visualizations ─────────────────────────── */}
      {loading && !data ? (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm animate-pulse space-y-4">
            <div className="h-6 w-52 bg-slate-200 rounded-lg" />
            <div className="h-64 bg-slate-100 rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-64 bg-slate-100 rounded-3xl" />
            <div className="h-64 bg-slate-100 rounded-3xl" />
          </div>
        </div>
      ) : data ? (
        <div className="space-y-8">
          {/* SECTION: Subject & Topic Frequency Heatmaps (with Dynamic Topic Drill-Down) */}
          {(activeTab === "all" || activeTab === "heatmaps") && (
            <TopicHeatmap
              subjects={data.subjects}
              subjectTopics={data.subjectTopics}
              topics={data.topics}
              totalQuestions={data.summary.questions}
              selectedSubject={selectedSubject}
              selectedExams={selectedExams}
              selectedYears={activeYears}
              selectedCycles={activeCycles}
              returnTo={`/dashboard/question-bank?${searchParams.toString()}`}
              onSelectSubject={setSelectedSubject}
            />
          )}

          {/* Contextual Notice Banner when Subject is Selected */}
          {selectedSubject && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-xs sm:text-sm text-blue-950 shadow-2xs">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-bold text-blue-700 uppercase tracking-wider text-[11px]">
                  Subject Filter Applied:
                </span>
                <span className="rounded-lg bg-blue-600 px-2.5 py-0.5 text-xs font-black text-white shadow-2xs">
                  {selectedSubject}
                </span>
                <span className="text-slate-600 font-medium text-xs">
                  Showing analytics for {activeTotalQuestions} questions in {selectedSubject}. Graphs below update automatically.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubject(null)}
                className="self-start sm:self-auto inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 underline text-xs transition cursor-pointer"
              >
                Reset to Full Paper
              </button>
            </div>
          )}

          {/* SECTION C: Difficulty Profile */}
          {(activeTab === "all" || activeTab === "difficulty") && (
            <DifficultyVisualizer
              difficulty={activeDifficulty}
              totalQuestions={activeTotalQuestions}
              subjectContext={selectedSubject}
            />
          )}

          {/* SECTION D: Question Pattern Matrix */}
          {(activeTab === "all" || activeTab === "patterns") && (
            <QuestionPatternMatrix
              patterns={activePatterns}
              types={activeTypes}
              totalQuestions={activeTotalQuestions}
              subjectContext={selectedSubject}
            />
          )}

          {/* Bottom Practice Banner */}
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-600 to-blue-700 p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Ready to act on this intelligence?
              </p>
              <h3 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-white">
                {selectedSubject
                  ? `Practice real ${selectedSubject} questions now`
                  : "Turn these pattern insights into targeted practice"}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-blue-100">
                {selectedSubject
                  ? `Practice real official PYQs filtered specifically for ${selectedSubject}.`
                  : "Practice real questions filtered specifically by the high-yield topics above."}
              </p>
            </div>
            <Link
              href={buildPracticeUrl(
                {
                  exams: selectedExams,
                  years: activeYears,
                  cycles: activeCycles,
                  subjects: selectedSubject ? [selectedSubject] : [],
                },
                { returnTo: `/dashboard/question-bank?${searchParams.toString()}` }
              )}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-blue-700 shadow-md transition hover:bg-blue-50 active:scale-95"
            >
              <span>{selectedSubject ? `Practice ${selectedSubject}` : "Practice Selected PYQs"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : selectedExams.length === 0 ? (
        <section className="rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4 border border-blue-100 shadow-2xs">
            <BookOpen className="h-7 w-7" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Select an Exam to Begin Exploring
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            Choose your target defence examination above, or select all question papers to analyze comprehensive syllabus trends across exams.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSelectAll}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition active:scale-95 cursor-pointer"
            >
              <Layers className="h-4 w-4" />
              <span>Select All Question Papers</span>
            </button>
            {meta.exams.map((exam) => (
              <button
                key={exam.value}
                type="button"
                onClick={() => {
                  setSelectedSubject(null);
                  setSelectedExams([exam.value]);
                  setSelectedYears(exam.years);
                  setSelectedCycles(exam.cycles);
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 transition active:scale-95 cursor-pointer"
              >
                <span>{exam.label}</span>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Database className="mx-auto h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-900">
            No questions found for the selected combination
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Please adjust your exam, year, or cycle selection to view intelligence.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-500"
          >
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
