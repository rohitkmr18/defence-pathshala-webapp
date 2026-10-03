"use client";

import { useMemo, useState, useEffect } from "react";
import type { FullPaperDefinition } from "./FullPaperHero";

export interface PaperSelectorProps {
  papers: FullPaperDefinition[];
  selectedPaper: FullPaperDefinition;
  onSelectPaper: (paper: FullPaperDefinition) => void;
  initialExam?: string;
  initialYear?: number;
}

export default function PaperSelector({
  papers,
  selectedPaper,
  onSelectPaper,
  initialExam,
  initialYear,
}: PaperSelectorProps) {
  // Helper to map DB/canonical exam to friendly UI label (e.g., 'CAPF-AC' -> 'CAPF')
  const getExamLabel = (exam: string) => {
    const cleaned = exam.trim().toUpperCase();
    if (cleaned.startsWith("CAPF")) return "CAPF";
    return exam;
  };

  // ── Derive unique exams from papers ───────────────────────────────────────
  const availableExams = useMemo(() => {
    const list: Array<{ label: string; canonical: string }> = [];
    const seen = new Set<string>();

    for (const paper of papers) {
      const label = getExamLabel(paper.exam);
      if (!seen.has(label)) {
        seen.add(label);
        list.push({ label, canonical: paper.exam });
      }
    }
    return list;
  }, [papers]);

  // Initial exam selection
  const initialExamLabel = useMemo(() => {
    if (initialExam) {
      const matched = availableExams.find(
        (e) =>
          e.label.toLowerCase() === initialExam.toLowerCase() ||
          e.canonical.toLowerCase() === initialExam.toLowerCase()
      );
      if (matched) return matched.label;
    }
    return getExamLabel(selectedPaper.exam) || availableExams[0]?.label || "CDS";
  }, [initialExam, availableExams, selectedPaper.exam]);

  const [selectedExamLabel, setSelectedExamLabel] =
    useState<string>(initialExamLabel);

  // ── Derive unique years for selected exam ─────────────────────────────────
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    for (const paper of papers) {
      if (getExamLabel(paper.exam) === selectedExamLabel) {
        years.add(paper.year);
      }
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [papers, selectedExamLabel]);

  // Initial year selection
  const initialYearValue = useMemo(() => {
    if (initialYear && availableYears.includes(initialYear)) {
      return initialYear;
    }
    if (availableYears.includes(selectedPaper.year)) {
      return selectedPaper.year;
    }
    return availableYears[0] ?? 2026;
  }, [initialYear, availableYears, selectedPaper.year]);

  const [requestedYear, setSelectedYear] = useState<number>(initialYearValue);
  const selectedYear = availableYears.includes(requestedYear)
    ? requestedYear : availableYears[0] ?? requestedYear;

  // ── Derive unique cycles for selected exam & year (CDS only) ──────────────
  const availableCycles = useMemo(() => {
    if (selectedExamLabel !== "CDS") {
      return [] as string[];
    }

    const cycles = new Set<string>();
    for (const paper of papers) {
      if (
        getExamLabel(paper.exam) === selectedExamLabel &&
        paper.year === selectedYear &&
        paper.cycle
      ) {
        cycles.add(paper.cycle);
      }
    }
    // Return ordered: "I", "II"
    return Array.from(cycles).sort();
  }, [papers, selectedExamLabel, selectedYear]);

  const [selectedCycle, setSelectedCycle] = useState<string>(
    selectedPaper.cycle || "II"
  );

  // ── Derive final selected paper automatically ─────────────────────────────
  const activePaper = useMemo(() => {
    // 1. Try exact match (exam + year + cycle)
    const exact = papers.find((p) => {
      const examMatch = getExamLabel(p.exam) === selectedExamLabel;
      const yearMatch = p.year === selectedYear;
      const cycleMatch =
        availableCycles.length > 0 ? p.cycle === selectedCycle : true;
      return examMatch && yearMatch && cycleMatch;
    });

    if (exact) return exact;

    // 2. Fallback to exam + year
    const fallbackYear = papers.find((p) => {
      return (
        getExamLabel(p.exam) === selectedExamLabel && p.year === selectedYear
      );
    });
    if (fallbackYear) return fallbackYear;

    return papers[0]!;
  }, [
    papers,
    selectedExamLabel,
    selectedYear,
    selectedCycle,
    availableCycles.length,
  ]);

  // Notify parent component instantly
  useEffect(() => {
    if (activePaper && activePaper.id !== selectedPaper.id) {
      onSelectPaper(activePaper);
    }
  }, [activePaper, onSelectPaper, selectedPaper.id]);

  // ── Interaction Handlers ──────────────────────────────────────────────────
  const handleSelectExam = (examLabel: string) => {
    setSelectedExamLabel(examLabel);

    // Reset year to latest available for this exam
    const yearsForExam = Array.from(
      new Set(
        papers
          .filter((p) => getExamLabel(p.exam) === examLabel)
          .map((p) => p.year)
      )
    ).sort((a, b) => b - a);

    const latestYear = yearsForExam[0] ?? selectedYear;
    setSelectedYear(latestYear);

    if (examLabel === "CDS") {
      // Default to "II" as most recent if available
      const cyclesForYear = papers
        .filter(
          (p) =>
            getExamLabel(p.exam) === "CDS" && p.year === latestYear && p.cycle
        )
        .map((p) => p.cycle!);
      setSelectedCycle(
        cyclesForYear.includes("II") ? "II" : cyclesForYear[0] ?? "I"
      );
    } else {
      setSelectedCycle("I");
    }
  };

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);

    if (selectedExamLabel === "CDS") {
      const cyclesForYear = papers
        .filter(
          (p) => getExamLabel(p.exam) === "CDS" && p.year === year && p.cycle
        )
        .map((p) => p.cycle!);

      if (!cyclesForYear.includes(selectedCycle)) {
        setSelectedCycle(
          cyclesForYear.includes("II") ? "II" : cyclesForYear[0] ?? "I"
        );
      }
    }
  };

  const handleSelectCycle = (cycle: string) => {
    setSelectedCycle(cycle);
  };

  return (
    <div className="space-y-6">
      {/* ── STEP 1: Exam Tabs ────────────────────────────────────────── */}
      <div>
        <span className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
          Exam
        </span>
        <div
          role="tablist"
          aria-label="Select Examination"
          className="flex flex-wrap gap-3"
        >
          {availableExams.map((entry) => {
            const isSelected = selectedExamLabel === entry.label;
            return (
              <button
                key={entry.label}
                role="tab"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                type="button"
                onClick={() => handleSelectExam(entry.label)}
                className={`inline-flex h-11 min-w-[96px] items-center justify-center rounded-full px-6 text-sm font-bold transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-slate-700 bg-white/5 text-slate-300 hover:border-slate-600 hover:bg-white/10 hover:text-white"
                }`}
              >
                {entry.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── STEP 2: Year Tabs ────────────────────────────────────────── */}
      <div>
        <span className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
          Year
        </span>
        <div
          role="tablist"
          aria-label="Select Exam Year"
          className="flex flex-wrap gap-3"
        >
          {availableYears.map((yearValue) => {
            const isSelected = selectedYear === yearValue;
            return (
              <button
                key={yearValue}
                role="tab"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                type="button"
                onClick={() => handleSelectYear(yearValue)}
                className={`inline-flex h-11 min-w-[76px] items-center justify-center rounded-full px-5 text-sm font-bold transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-slate-700 bg-white/5 text-slate-300 hover:border-slate-600 hover:bg-white/10 hover:text-white"
                }`}
              >
                {yearValue}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── STEP 3: Cycle Tabs (CDS only) ────────────────────────────── */}
      {availableCycles.length > 0 && (
        <div>
          <span className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
            Cycle
          </span>
          <div
            role="tablist"
            aria-label="Select Exam Cycle"
            className="flex flex-wrap gap-3"
          >
            {availableCycles.map((cycleValue) => {
              const isSelected = selectedCycle === cycleValue;
              return (
                <button
                  key={cycleValue}
                  role="tab"
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  type="button"
                  onClick={() => handleSelectCycle(cycleValue)}
                  className={`inline-flex h-11 min-w-[64px] items-center justify-center rounded-full px-5 text-sm font-bold transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-slate-700 bg-white/5 text-slate-300 hover:border-slate-600 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cycleValue}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LIVE SUMMARY ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
          Selected Paper
        </p>
        <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {activePaper.label}
          </p>
          <p className="text-xs font-medium text-slate-400 sm:text-sm">
            Ready to simulate the real UPSC exam.
          </p>
        </div>
      </div>
    </div>
  );
}

