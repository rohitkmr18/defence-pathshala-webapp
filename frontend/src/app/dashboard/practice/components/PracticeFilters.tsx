
"use client";

import { useEffect, useMemo, useState } from "react";
import type { ActiveFilters } from "./PracticePageClient";

type PracticeFiltersResponse = {
  exams: string[];
  years: Record<string, number[]>;
  cycles: Record<string, string[]>;
  subjects: Record<string, Record<string, string[]>>;
};

interface PracticeFiltersProps {
  onFilterChange?: (filters: ActiveFilters) => void;
}

export default function PracticeFilters({ onFilterChange }: PracticeFiltersProps) {
  const [filters, setFilters] = useState<PracticeFiltersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedCycles, setSelectedCycles] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const applyInitialSelection = (data: PracticeFiltersResponse) => {
    const firstExam = data.exams[0] ?? "";
    const firstYear = data.years[firstExam]?.[0] ?? null;

    setSelectedExams(firstExam ? [firstExam] : []);
    setSelectedYears(firstYear !== null ? [firstYear] : []);
    setSelectedCycles(data.cycles[firstExam]?.slice(0, 1) ?? []);
    setSelectedSubjects([]);
    setSelectedTopics([]);
  };

  const reloadFilters = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/practice/filters", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load practice filters");
      }

      const data = (await response.json()) as PracticeFiltersResponse;
      setFilters(data);
      applyInitialSelection(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load practice filters."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadFilters = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/practice/filters", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load practice filters");
        }

        const data = (await response.json()) as PracticeFiltersResponse;

        if (!isMounted) {
          return;
        }

        setFilters(data);
        applyInitialSelection(data);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load practice filters."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadFilters();

    return () => {
      isMounted = false;
    };
  }, []);

  const availableYears = useMemo(() => {
    if (!filters) {
      return [] as number[];
    }

    const years = new Set<number>();

    for (const exam of selectedExams) {
      for (const year of filters.years[exam] ?? []) {
        years.add(year);
      }
    }

    return Array.from(years).sort((a, b) => b - a);
  }, [filters, selectedExams]);

  const availableSubjects = useMemo(() => {
    if (!filters || selectedExams.length === 0) {
      return [] as string[];
    }

    const subjectWeights = new Map<string, number>();

    for (const exam of selectedExams) {
      for (const [subject, topics] of Object.entries(filters.subjects[exam] ?? {})) {
        subjectWeights.set(subject, (subjectWeights.get(subject) ?? 0) + topics.length);
      }
    }

    return Array.from(subjectWeights.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([subject]) => subject);
  }, [filters, selectedExams]);

  const availableTopics = useMemo(() => {
    if (!filters || selectedExams.length === 0) {
      return [] as string[];
    }

    const topics = new Set<string>();

    for (const exam of selectedExams) {
      for (const subject of selectedSubjects) {
        for (const topic of filters.subjects[exam]?.[subject] ?? []) {
          topics.add(topic);
        }
      }
    }

    return Array.from(topics).sort((a, b) => a.localeCompare(b));
  }, [filters, selectedExams, selectedSubjects]);

  // Broadcast filter state to parent whenever selections change
  useEffect(() => {
    onFilterChange?.({
      exams: selectedExams,
      years: selectedYears,
      cycles: selectedCycles,
      subjects: selectedSubjects,
      topics: selectedTopics,
    });
  }, [onFilterChange, selectedExams, selectedYears, selectedCycles, selectedSubjects, selectedTopics]);

  // ── Topics Select All — pure derived state, no extra useState ─────────────
  const allTopicsSelected =
    availableTopics.length > 0 &&
    availableTopics.every((t) => selectedTopics.includes(t));

  function toggleSelectAllTopics() {
    setSelectedTopics(allTopicsSelected ? [] : availableTopics);
  }

  const cycleOptions = filters?.cycles.CDS ?? [];

  function toggleExam(examName: string) {
    setSelectedExams((previous) => {
      const next = previous.includes(examName)
        ? previous.filter((item) => item !== examName)
        : [...previous, examName];

      if (next.length === 0) {
        setSelectedYears([]);
        setSelectedSubjects([]);
        setSelectedTopics([]);
        setSelectedCycles([]);
        return [];
      }

      const nextYears = Array.from(
        new Set(
          next.flatMap((name) => filters?.years[name] ?? [])
        )
      ).sort((a, b) => b - a);

      setSelectedYears((current) => {
        const filtered = current.filter((year) => nextYears.includes(year));
        return filtered.length > 0 ? filtered : (nextYears[0] !== undefined ? [nextYears[0]] : []);
      });

      setSelectedSubjects([]);
      setSelectedTopics([]);

      if (next.includes("CDS")) {
        setSelectedCycles((current) =>
          current.length > 0 ? current : (filters?.cycles.CDS?.slice(0, 1) ?? [])
        );
      } else {
        setSelectedCycles([]);
      }

      return next;
    });
  }

  function toggleYear(yearValue: number) {
    setSelectedYears((previous) =>
      previous.includes(yearValue)
        ? previous.filter((item) => item !== yearValue)
        : [...previous, yearValue]
    );
  }

  function toggleCycle(cycleValue: string) {
    setSelectedCycles((previous) =>
      previous.includes(cycleValue)
        ? previous.filter((item) => item !== cycleValue)
        : [...previous, cycleValue]
    );
  }

  function toggleSubject(subject: string) {
    setSelectedSubjects((previous) => {
      const nextSubjects = previous.includes(subject)
        ? previous.filter((item) => item !== subject)
        : [...previous, subject];

      setSelectedTopics((currentTopics) =>
        currentTopics.filter((topic) =>
          nextSubjects.some((selectedSubject) =>
            selectedExams.some(
              (examName) => (filters?.subjects[examName]?.[selectedSubject] ?? []).includes(topic)
            )
          )
        )
      );

      return nextSubjects;
    });
  }

  function toggleTopic(topic: string) {
    setSelectedTopics((previous) =>
      previous.includes(topic)
        ? previous.filter((item) => item !== topic)
        : [...previous, topic]
    );
  }


  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 animate-pulse">
          <div className="mb-4 h-5 w-36 rounded bg-slate-200" />
          <div className="h-4 w-64 rounded bg-slate-200" />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-14 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-14 animate-pulse rounded-xl bg-slate-200" />
        </div>
        <div className="mt-8 h-12 animate-pulse rounded-xl bg-slate-200" />
      </div>
    );
  }

  if (error || !filters) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm">
        <p className="text-lg font-semibold text-red-700">Unable to load filters</p>
        <p className="mt-2 text-sm text-red-600">{error ?? "Unknown error"}</p>
        <button
          type="button"
          onClick={() => void reloadFilters()}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        <div>
          <label className="mb-3 block text-sm text-slate-500">Exam</label>
          <div className="flex flex-wrap gap-3">
            {filters.exams.map((examName) => (
              <button
                key={examName}
                type="button"
                onClick={() => toggleExam(examName)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selectedExams.includes(examName)
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {examName}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm text-slate-500">Year</label>
          <div className="flex flex-wrap gap-3">
            {availableYears.map((yearValue) => (
              <button
                key={yearValue}
                type="button"
                onClick={() => toggleYear(yearValue)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selectedYears.includes(yearValue)
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {yearValue}
              </button>
            ))}
          </div>
        </div>

        {selectedExams.includes("CDS") && cycleOptions.length > 0 && (
          <div>
            <label className="mb-3 block text-sm text-slate-500">Cycle</label>
            <div className="flex flex-wrap gap-3">
              {cycleOptions.map((cycleOption) => (
                <button
                  key={cycleOption}
                  type="button"
                  onClick={() => toggleCycle(cycleOption)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    selectedCycles.includes(cycleOption)
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {cycleOption}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="mb-3 block text-sm text-slate-500">Subjects</label>

          <div className="flex flex-wrap gap-3">
            {availableSubjects.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => toggleSubject(subject)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selectedSubjects.includes(subject)
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {availableTopics.length > 0 && (
          <div>
            <label className="mb-3 block text-sm text-slate-500">Topics</label>

            <div className="flex flex-wrap gap-3">
              {/* Select All chip — derived state, no extra useState */}
              <button
                type="button"
                onClick={toggleSelectAllTopics}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  allTopicsSelected
                    ? "bg-slate-900 text-white"
                    : "border border-dashed border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:bg-slate-50"
                }`}
              >
                {allTopicsSelected ? "✓ All Selected" : "Select All"}
              </button>

              {availableTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    selectedTopics.includes(topic)
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
