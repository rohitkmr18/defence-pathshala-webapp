"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Compass,
} from "lucide-react";
import { getExamLabel } from "@/lib/exams";
import type { ActiveFilters } from "./PracticePageClient";

export type PracticeFiltersResponse = {
  exams: string[];
  years: Record<string, number[]>;
  cycles: Record<string, string[]>;
  subjects: Record<string, Record<string, string[]>>;
  subtopics?: Record<string, Record<string, string[]>>;
  difficulties?: string[];
};

export interface FilterOverride {
  type: "cycle" | "year" | "exam" | "all_years";
  value?: string | number;
  timestamp: number;
}

interface PracticeFiltersProps {
  onFilterChange?: (filters: ActiveFilters) => void;
  filterOverride?: FilterOverride | null;
}

export default function PracticeFilters({
  onFilterChange,
  filterOverride,
}: PracticeFiltersProps) {
  const [filters, setFilters] = useState<PracticeFiltersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedCycles, setSelectedCycles] = useState<string[]>([]);

  // Accordion for advanced secondary filters (Years / Cycles)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const applyInitialSelection = (data: PracticeFiltersResponse) => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const urlExam = sp.get("exam")?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
      const urlYear = sp.get("year")?.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n)) ?? [];
      const urlCycle = sp.get("cycle")?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
      const urlSubject = sp.get("subject")?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
      const urlTopic = sp.get("topic")?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
      const urlSubtopic = sp.get("subtopic")?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

      if (
        urlExam.length > 0 ||
        urlYear.length > 0 ||
        urlSubject.length > 0 ||
        urlTopic.length > 0 ||
        urlSubtopic.length > 0
      ) {
        setSelectedExams(urlExam.filter((e) => data.exams.includes(e)));
        setSelectedYears(urlYear);
        setSelectedCycles(urlCycle);
        setSelectedSubjects(urlSubject);
        setSelectedTopics(urlTopic);
        setSelectedSubtopics(urlSubtopic);
        if (urlYear.length > 0 || urlCycle.length > 0) {
          setShowAdvancedFilters(true);
        }
        return;
      }
    }

    // Default to first exam (e.g. CDS) so user has an immediate focus
    if (data.exams && data.exams.length > 0) {
      setSelectedExams([data.exams[0]!]);
    }
    setSelectedSubjects([]);
    setSelectedTopics([]);
    setSelectedSubtopics([]);
    setSelectedYears([]);
    setSelectedCycles([]);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadFilters() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/practice/filters", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load practice filters");
        }
        const data = (await response.json()) as PracticeFiltersResponse;
        if (isMounted) {
          setFilters(data);
          applyInitialSelection(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Unable to load practice filters";
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadFilters();
    return () => { isMounted = false; };
  }, []);

  // Available subjects for selected exams (or all exams if none selected)
  const availableSubjects = useMemo(() => {
    if (!filters) return [];
    const activeExams = selectedExams.length > 0 ? selectedExams : filters.exams;
    const subjectsMap = new Map<string, number>();

    for (const exam of activeExams) {
      for (const [sub, topics] of Object.entries(filters.subjects[exam] ?? {})) {
        subjectsMap.set(sub, (subjectsMap.get(sub) ?? 0) + topics.length);
      }
    }

    return Array.from(subjectsMap.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([sub]) => sub);
  }, [filters, selectedExams]);

  // Available topics for selected subject(s)
  const availableTopics = useMemo(() => {
    if (!filters || selectedSubjects.length === 0) return [];
    const activeExams = selectedExams.length > 0 ? selectedExams : filters.exams;
    const topicsSet = new Set<string>();

    for (const exam of activeExams) {
      for (const subject of selectedSubjects) {
        for (const topic of filters.subjects[exam]?.[subject] ?? []) {
          topicsSet.add(topic);
        }
      }
    }

    return Array.from(topicsSet).sort((a, b) => a.localeCompare(b));
  }, [filters, selectedExams, selectedSubjects]);

  // Available subtopics for selected topic(s)
  const availableSubtopics = useMemo(() => {
    if (!filters?.subtopics || selectedSubjects.length === 0 || selectedTopics.length === 0) {
      return [];
    }

    const subtopicsSet = new Set<string>();
    for (const subject of selectedSubjects) {
      const topicMap = filters.subtopics[subject] ?? {};
      for (const topic of selectedTopics) {
        for (const subtopic of topicMap[topic] ?? []) {
          subtopicsSet.add(subtopic);
        }
      }
    }

    return Array.from(subtopicsSet).sort((a, b) => a.localeCompare(b));
  }, [filters, selectedSubjects, selectedTopics]);

  // Available years for selected exams
  const availableYears = useMemo(() => {
    if (!filters) return [];
    const activeExams = selectedExams.length > 0 ? selectedExams : filters.exams;
    const yearsSet = new Set<number>();

    for (const exam of activeExams) {
      for (const yr of filters.years[exam] ?? []) {
        yearsSet.add(yr);
      }
    }

    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [filters, selectedExams]);

  // Available cycles for selected exams
  const cycleOptions = useMemo(() => {
    if (!filters) return [];
    const activeExams = selectedExams.length > 0 ? selectedExams : filters.exams;
    const cyclesSet = new Set<string>();

    for (const exam of activeExams) {
      for (const cyc of filters.cycles[exam] ?? []) {
        cyclesSet.add(cyc);
      }
    }

    return Array.from(cyclesSet).sort();
  }, [filters, selectedExams]);

  const allExamsSelected =
    Boolean(filters?.exams?.length) &&
    selectedExams.length === (filters?.exams?.length ?? 0) &&
    Boolean(filters?.exams?.every((exam) => selectedExams.includes(exam)));

  // Broadcast changes up
  useEffect(() => {
    onFilterChange?.({
      exams: selectedExams,
      years: selectedYears,
      cycles: selectedCycles,
      subjects: selectedSubjects,
      topics: selectedTopics,
      subtopics: selectedSubtopics,
      allExamsSelected,
    });
  }, [
    onFilterChange,
    selectedExams,
    selectedYears,
    selectedCycles,
    selectedSubjects,
    selectedTopics,
    selectedSubtopics,
    allExamsSelected,
  ]);

  // Handle external filter overrides (e.g. from chart)
  const lastAppliedOverrideTimestamp = useRef<number>(0);
  useEffect(() => {
    if (!filterOverride || !filters) return;
    if (filterOverride.timestamp <= lastAppliedOverrideTimestamp.current) return;
    lastAppliedOverrideTimestamp.current = filterOverride.timestamp;

    queueMicrotask(() => {
      if (filterOverride.type === "year") {
        const yVal = Number(filterOverride.value);
        setSelectedYears([yVal]);
        const examsForYear = (filters.exams ?? []).filter((e) =>
          (filters.years[e] ?? []).includes(yVal)
        );
        if (examsForYear.length > 0) setSelectedExams(examsForYear);
        setSelectedCycles([]);
        setShowAdvancedFilters(true);
      } else if (filterOverride.type === "all_years") {
        setSelectedYears([]);
      } else if (filterOverride.type === "cycle") {
        setSelectedCycles([String(filterOverride.value)]);
        setShowAdvancedFilters(true);
      } else if (filterOverride.type === "exam") {
        const rawVal = String(filterOverride.value);
        const [examVal, cycleVal] = rawVal.includes(":") ? rawVal.split(":") : [rawVal, null];
        setSelectedExams([examVal]);
        if (cycleVal) {
          setSelectedCycles([cycleVal]);
          setShowAdvancedFilters(true);
        }
      }
    });
  }, [filterOverride, filters]);

  // ── Dependency-Safe Mutators ──────────────────────────────────────────────

  function toggleExam(examName: string) {
    setSelectedExams((prev) => {
      const next = prev.includes(examName) ? prev.filter((e) => e !== examName) : [...prev, examName];
      return next.length === 0 && filters?.exams ? [filters.exams[0]!] : next;
    });
  }

  function toggleSelectAllExams() {
    if (allExamsSelected) {
      setSelectedExams(filters?.exams ? [filters.exams[0]!] : []);
    } else {
      setSelectedExams(filters?.exams ?? []);
    }
  }

  function handleSelectSubject(subject: string) {
    setSelectedSubjects((prev) => {
      const isSelected = prev.includes(subject);
      const next = isSelected ? prev.filter((s) => s !== subject) : [...prev, subject];

      // Dependency graph rule: changing subjects cleans child selections that don't belong
      setSelectedTopics([]);
      setSelectedSubtopics([]);
      return next;
    });
  }

  function handleSelectAllSubjects() {
    if (selectedSubjects.length === availableSubjects.length) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects([...availableSubjects]);
    }
    setSelectedTopics([]);
    setSelectedSubtopics([]);
  }

  function handleSelectTopic(topic: string) {
    setSelectedTopics((prev) => {
      const isSelected = prev.includes(topic);
      const next = isSelected ? prev.filter((t) => t !== topic) : [...prev, topic];

      // Dependency graph rule: changing topics cleans child subtopics that don't belong
      setSelectedSubtopics([]);
      return next;
    });
  }

  function handleSelectAllTopics() {
    if (selectedTopics.length === availableTopics.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics([...availableTopics]);
    }
    setSelectedSubtopics([]);
  }

  function handleSelectSubtopic(subtopic: string) {
    setSelectedSubtopics((prev) =>
      prev.includes(subtopic) ? prev.filter((s) => s !== subtopic) : [...prev, subtopic]
    );
  }

  function handleSelectAllSubtopics() {
    if (selectedSubtopics.length === availableSubtopics.length) {
      setSelectedSubtopics([]);
    } else {
      setSelectedSubtopics([...availableSubtopics]);
    }
  }

  function handleResetFilters() {
    if (filters?.exams && filters.exams.length > 0) {
      setSelectedExams([filters.exams[0]!]);
    } else {
      setSelectedExams([]);
    }
    setSelectedSubjects([]);
    setSelectedTopics([]);
    setSelectedSubtopics([]);
    setSelectedYears([]);
    setSelectedCycles([]);
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 rounded-xl bg-slate-200" />
        <div className="h-28 rounded-2xl bg-slate-100" />
        <div className="h-28 rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (error || !filters) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
        <p className="text-sm font-semibold text-rose-800">{error ?? "Failed to load practice filters."}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reset & Header summary */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Progressive Practice Configuration
          </span>
        </div>

        <button
          type="button"
          onClick={handleResetFilters}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900"
        >
          <RotateCcw className="h-3 w-3" />
          Reset All
        </button>
      </div>

      {/* ── 1. EXAM SELECTOR ─────────────────────────────────────────────── */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            1. Target Exam
          </label>
          <button
            type="button"
            onClick={toggleSelectAllExams}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
          >
            {allExamsSelected ? "Deselect All" : "Select Both Exams"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.exams.map((examName) => {
            const isSelected = selectedExams.includes(examName);
            return (
              <button
                key={examName}
                type="button"
                onClick={() => toggleExam(examName)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-2xs ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span>{getExamLabel(examName)}</span>
                {isSelected && <span className="text-[10px] opacity-80">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. CANONICAL SUBJECT SELECTOR ─────────────────────────────────── */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            2. Subject
            {selectedSubjects.length > 0 && (
              <span className="ml-1.5 font-normal text-slate-500">
                ({selectedSubjects.length} selected)
              </span>
            )}
          </label>
          <button
            type="button"
            onClick={handleSelectAllSubjects}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
          >
            {selectedSubjects.length === availableSubjects.length ? "Clear Subjects" : "All Subjects"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {availableSubjects.map((sub) => {
            const isSelected = selectedSubjects.includes(sub);
            return (
              <button
                key={sub}
                type="button"
                onClick={() => handleSelectSubject(sub)}
                className={`flex items-center justify-between rounded-xl p-2.5 text-left text-xs transition border ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/80 font-bold text-blue-900 shadow-2xs"
                    : "border-slate-200 bg-white font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className="truncate">{sub}</span>
                {isSelected && <span className="ml-1 shrink-0 text-blue-600 font-bold">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. TOPIC SELECTOR (Dependent on Subject) ──────────────────────── */}
      {selectedSubjects.length > 0 && availableTopics.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-blue-600" />
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Topic in {selectedSubjects.join(", ")}
              </label>
            </div>
            <button
              type="button"
              onClick={handleSelectAllTopics}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
            >
              {selectedTopics.length === availableTopics.length ? "Deselect All" : "Select All Topics"}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
            {availableTopics.map((top) => {
              const isSelected = selectedTopics.includes(top);
              return (
                <button
                  key={top}
                  type="button"
                  onClick={() => handleSelectTopic(top)}
                  className={`rounded-lg px-3 py-1.5 text-xs transition ${
                    isSelected
                      ? "bg-blue-600 font-semibold text-white shadow-2xs"
                      : "border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {top}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 4. SUBTOPIC SELECTOR (Dependent on Topic) ─────────────────────── */}
      {selectedTopics.length > 0 && availableSubtopics.length > 0 && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 transition">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-blue-600" />
              <label className="text-xs font-bold uppercase tracking-wider text-blue-900">
                4. Subtopic (Optional Granular Focus)
              </label>
            </div>
            <button
              type="button"
              onClick={handleSelectAllSubtopics}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
            >
              {selectedSubtopics.length === availableSubtopics.length ? "Deselect All" : "All Subtopics"}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
            {availableSubtopics.map((subtop) => {
              const isSelected = selectedSubtopics.includes(subtop);
              return (
                <button
                  key={subtop}
                  type="button"
                  onClick={() => handleSelectSubtopic(subtop)}
                  className={`rounded-lg px-2.5 py-1 text-xs transition ${
                    isSelected
                      ? "bg-blue-700 font-semibold text-white shadow-2xs"
                      : "border border-blue-200/60 bg-white font-medium text-slate-700 hover:bg-blue-100/50"
                  }`}
                >
                  {subtop}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 5. ADVANCED / TEMPORAL FILTERS (Year & Cycle Accordion) ───────── */}
      <div className="rounded-2xl border border-slate-200/80 bg-white">
        <button
          type="button"
          onClick={() => setShowAdvancedFilters((prev) => !prev)}
          className="flex w-full items-center justify-between p-3.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition"
        >
          <span className="flex items-center gap-2">
            <span>📅 Refine by Year & Cycle</span>
            {(selectedYears.length > 0 || selectedCycles.length > 0) && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                Active: {[
                  selectedYears.length ? `${selectedYears.length} Years` : null,
                  selectedCycles.length ? `Cycle ${selectedCycles.join(",")}` : null,
                ].filter(Boolean).join(" · ")}
              </span>
            )}
          </span>
          <span className="text-slate-400">
            {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </button>

        {showAdvancedFilters && (
          <div className="space-y-4 border-t border-slate-100 p-4">
            {/* Year Selector */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Exam Years</span>
                <button
                  type="button"
                  onClick={() => setSelectedYears(selectedYears.length === availableYears.length ? [] : [...availableYears])}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                >
                  {selectedYears.length === availableYears.length ? "Clear Years" : "All Years"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableYears.map((yr) => {
                  const isSelected = selectedYears.includes(yr);
                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setSelectedYears((prev) => prev.includes(yr) ? prev.filter((y) => y !== yr) : [...prev, yr])}
                      className={`rounded-lg px-3 py-1 text-xs transition ${
                        isSelected
                          ? "bg-blue-600 text-white font-semibold shadow-2xs"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {yr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cycle Selector */}
            {cycleOptions.length > 0 && (
              <div>
                <span className="mb-2 block text-xs font-semibold text-slate-500">Exam Cycle</span>
                <div className="flex flex-wrap gap-2">
                  {cycleOptions.map((cyc) => {
                    const isSelected = selectedCycles.includes(cyc);
                    return (
                      <button
                        key={cyc}
                        type="button"
                        onClick={() => setSelectedCycles((prev) => prev.includes(cyc) ? prev.filter((c) => c !== cyc) : [...prev, cyc])}
                        className={`rounded-lg px-3 py-1 text-xs transition ${
                          isSelected
                            ? "bg-blue-600 text-white font-semibold shadow-2xs"
                            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        Cycle {cyc}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
