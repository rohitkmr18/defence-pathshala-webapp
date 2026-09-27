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
import SubjectBarChart from "@/components/charts/SubjectBarChart";
import TopicHeatmap from "@/components/charts/TopicHeatmap";
import DifficultyVisualizer from "@/components/charts/DifficultyVisualizer";
import QuestionPatternMatrix from "@/components/charts/QuestionPatternMatrix";

interface Props {
  meta: QuestionBankMeta;
}

type TabView = "all" | "topics" | "subjects" | "difficulty" | "patterns";

export default function QuestionBankExplorer({ meta }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const readList = (key: string) =>
    searchParams.get(key)?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];

  const [selectedExams, setSelectedExams] = useState<string[]>(() => {
    const initial = readList("exam");
    return initial.length ? initial : meta.exams[0]?.value ? [meta.exams[0].value] : [];
  });

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    for (const exam of selectedExams) {
      for (const item of meta.exams.find((entry) => entry.value === exam)?.years ?? []) {
        years.add(item);
      }
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [meta.exams, selectedExams]);

  const availableCycles = useMemo(() => {
    const cycles = new Set<string>();
    for (const exam of selectedExams) {
      for (const item of meta.exams.find((entry) => entry.value === exam)?.cycles ?? []) {
        cycles.add(item);
      }
    }
    return Array.from(cycles).sort();
  }, [meta.exams, selectedExams]);

  const [selectedYears, setSelectedYears] = useState<number[]>(() => {
    const initial = readList("year").map(Number).filter(Number.isFinite);
    if (initial.length) return initial;
    const firstExam = meta.exams.find((entry) => entry.value === selectedExams[0]);
    return firstExam?.years[0] ? [firstExam.years[0]] : [];
  });

  const [selectedCycles, setSelectedCycles] = useState<string[]>(() => {
    const initial = readList("cycle");
    if (initial.length) return initial;
    const firstExam = meta.exams.find((entry) => entry.value === selectedExams[0]);
    return firstExam?.cycles[0] ? [firstExam.cycles[0]] : [];
  });

  const [data, setData] = useState<QuestionBankPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabView>("all");

  const activeYears = selectedYears.filter((item) => availableYears.includes(item));
  const activeCycles = selectedCycles.filter((item) => availableCycles.includes(item));

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedExams.length) params.set("exam", selectedExams.join(","));
    if (activeYears.length) params.set("year", activeYears.join(","));
    if (activeCycles.length) params.set("cycle", activeCycles.join(","));

    router.replace(`/dashboard/question-bank?${params.toString()}`, {
      scroll: false,
    });
  }, [activeCycles, activeYears, router, selectedExams]);

  useEffect(() => {
    let cancelled = false;

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

  function handleResetFilters() {
    if (meta.exams[0]?.value) {
      setSelectedExams([meta.exams[0].value]);
      const firstExam = meta.exams[0];
      setSelectedYears(firstExam.years[0] ? [firstExam.years[0]] : []);
      setSelectedCycles(firstExam.cycles[0] ? [firstExam.cycles[0]] : []);
    }
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

          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>Reset Filters</span>
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Exam Filter */}
          <div>
            <label className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
              <span>Target Exam</span>
              <span className="text-[11px] font-normal text-slate-400">
                {selectedExams.length} selected
              </span>
            </label>

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
            onClick={() => setActiveTab("topics")}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "topics"
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Topic Heatmap</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("subjects")}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "subjects"
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Subject Weightage</span>
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

      {/* ── 4. Main Intelligence Visualizations (No Donut Charts) ───────── */}
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
          {/* SECTION A: Subject Weightage Breakdown */}
          {(activeTab === "all" || activeTab === "subjects") && (
            <SubjectBarChart
              data={data.subjects}
              totalQuestions={data.summary.questions}
            />
          )}

          {/* SECTION B: Topic Frequency Heatmap */}
          {(activeTab === "all" || activeTab === "topics") && (
            <TopicHeatmap
              topics={data.topics}
              totalQuestions={data.summary.questions}
            />
          )}

          {/* SECTION C: Difficulty Profile */}
          {(activeTab === "all" || activeTab === "difficulty") && (
            <DifficultyVisualizer
              difficulty={data.difficulty}
              totalQuestions={data.summary.questions}
            />
          )}

          {/* SECTION D: Question Pattern Matrix */}
          {(activeTab === "all" || activeTab === "patterns") && (
            <QuestionPatternMatrix
              patterns={data.questionPatterns}
              types={data.questionTypes}
              totalQuestions={data.summary.questions}
            />
          )}

          {/* Bottom Practice Banner */}
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-600 to-blue-700 p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Ready to act on this intelligence?
              </p>
              <h3 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-white">
                Turn these pattern insights into targeted practice
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-blue-100">
                Practice real questions filtered specifically by the high-yield topics above.
              </p>
            </div>
            <Link
              href="/dashboard/practice"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-blue-700 shadow-md transition hover:bg-blue-50 active:scale-95"
            >
              <span>Start Free Practice</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
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