"use client";

import { useState } from "react";
import { Clock, Target, Award } from "lucide-react";
import PaperSelector from "./PaperSelector";

export interface FullPaperDefinition {
  id: string;
  exam: string;
  year: number;
  cycle?: string;
  label: string;
  questions: number;
  attemptableQuestions?: number;
  availabilityNote?: string;
  duration: string;
  durationSeconds: number;
  marks: number;
}

export const AVAILABLE_FULL_PAPERS: FullPaperDefinition[] = [
  {
    id: "cds-2026-2",
    exam: "CDS",
    year: 2026,
    cycle: "II",
    label: "CDS II 2026",
    questions: 120,
    attemptableQuestions: 119,
    availabilityNote: "1 question is withheld pending source verification.",
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 100,
  },
  {
    id: "cds-2026-1",
    exam: "CDS",
    year: 2026,
    cycle: "I",
    label: "CDS I 2026",
    questions: 120,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 100,
  },
  {
    id: "capf-2026",
    exam: "CAPF-AC",
    year: 2026,
    cycle: "I",
    label: "CAPF 2026",
    questions: 125,
    attemptableQuestions: 123,
    availabilityNote: "2 questions are withheld pending source verification.",
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 250,
  },
  {
    id: "cds-2025-2",
    exam: "CDS",
    year: 2025,
    cycle: "II",
    label: "CDS II 2025",
    questions: 120,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 100,
  },
  {
    id: "cds-2025-1",
    exam: "CDS",
    year: 2025,
    cycle: "I",
    label: "CDS I 2025",
    questions: 120,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 100,
  },
  {
    id: "cds-2024-2",
    exam: "CDS",
    year: 2024,
    cycle: "II",
    label: "CDS II 2024",
    questions: 120,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 100,
  },
  {
    id: "cds-2024-1",
    exam: "CDS",
    year: 2024,
    cycle: "I",
    label: "CDS I 2024",
    questions: 120,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 100,
  },
  {
    id: "cds-2023-2",
    exam: "CDS",
    year: 2023,
    cycle: "II",
    label: "CDS II 2023",
    questions: 120,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 100,
  },
  {
    id: "cds-2023-1",
    exam: "CDS",
    year: 2023,
    cycle: "I",
    label: "CDS I 2023",
    questions: 120,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 100,
  },
  {
    id: "cds-2022-2",
    exam: "CDS",
    year: 2022,
    cycle: "II",
    label: "CDS II 2022",
    questions: 120,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 100,
  },
  {
    id: "cds-2022-1",
    exam: "CDS",
    year: 2022,
    cycle: "I",
    label: "CDS I 2022",
    questions: 120,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 100,
  },
  {
    id: "capf-2025",
    exam: "CAPF-AC",
    year: 2025,
    cycle: "I",
    label: "CAPF 2025",
    questions: 125,
    attemptableQuestions: 121,
    availabilityNote: "4 questions are excluded while dropped/source-disputed items remain under review.",
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 250,
  },
  {
    id: "capf-2024",
    exam: "CAPF-AC",
    year: 2024,
    cycle: "I",
    label: "CAPF 2024",
    questions: 125,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 250,
  },
  {
    id: "capf-2023",
    exam: "CAPF-AC",
    year: 2023,
    cycle: "I",
    label: "CAPF 2023",
    questions: 125,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 250,
  },
  {
    id: "capf-2022",
    exam: "CAPF-AC",
    year: 2022,
    cycle: "I",
    label: "CAPF 2022",
    questions: 125,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 250,
  },
  {
    id: "cds-2021-2",
    exam: "CDS",
    year: 2021,
    cycle: "II",
    label: "CDS II 2021",
    questions: 120,
    attemptableQuestions: 119,
    availabilityNote: "1 source-cancelled question is excluded from this release.",
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 100,
  },
  {
    id: "cds-2021-1",
    exam: "CDS",
    year: 2021,
    cycle: "I",
    label: "CDS I 2021",
    questions: 120,
    attemptableQuestions: 119,
    availabilityNote: "1 source-cancelled question is excluded from this release.",
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 100,
  },
  {
    id: "capf-2021",
    exam: "CAPF-AC",
    year: 2021,
    cycle: "I",
    label: "CAPF 2021",
    questions: 125,
    attemptableQuestions: 123,
    availabilityNote: "2 source-disputed questions are excluded from this release.",
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 250,
  },
  {
    id: "cds-2020-2",
    exam: "CDS",
    year: 2020,
    cycle: "II",
    label: "CDS II 2020",
    questions: 120,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 100,
  },
  {
    id: "cds-2020-1",
    exam: "CDS",
    year: 2020,
    cycle: "I",
    label: "CDS I 2020",
    questions: 120,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 100,
  },
  {
    id: "capf-2020",
    exam: "CAPF-AC",
    year: 2020,
    cycle: "I",
    label: "CAPF 2020",
    questions: 125,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 250,
  },
];

export interface FullPaperHeroProps {
  onStart: (paper: FullPaperDefinition) => void;
  initialExam?: string;
  initialYear?: number;
}

export default function FullPaperHero({
  onStart,
  initialExam,
  initialYear,
}: FullPaperHeroProps) {
  // Find initial matching paper or default to CAPF AC 2025
  const initialPaper =
    AVAILABLE_FULL_PAPERS.find(
      (p) =>
        (!initialExam ||
          p.exam.toLowerCase() === initialExam.toLowerCase() ||
          p.label.toLowerCase().includes(initialExam.toLowerCase())) &&
        (!initialYear || p.year === initialYear)
    ) || AVAILABLE_FULL_PAPERS[0]!;

  const [selectedPaper, setSelectedPaper] =
    useState<FullPaperDefinition>(initialPaper);

  return (
    <div className="rounded-3xl bg-black p-6 sm:p-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Attempt Full Paper
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Exam-like experience
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Choose an exam paper to simulate the real UPSC test environment.
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
          UPSC Style
        </span>
      </div>

      {/* 3-Step Hierarchical Paper Selector (Exam -> Year -> Cycle) with Live Summary */}
      <div className="mt-7">
        <PaperSelector
          papers={AVAILABLE_FULL_PAPERS}
          selectedPaper={selectedPaper}
          onSelectPaper={setSelectedPaper}
          initialExam={initialExam}
          initialYear={initialYear}
        />
      </div>

      {/* 3-Column Stats Grid */}
      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
        {/* Time */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Clock className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">
              Time
            </span>
          </div>
          <p className="mt-2 text-base sm:text-xl font-bold text-white">
            {selectedPaper.duration}
          </p>
        </div>

        {/* Questions */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Target className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">
              Questions
            </span>
          </div>
          <p className="mt-2 text-base sm:text-xl font-bold text-white">
            {selectedPaper.attemptableQuestions
              ? `${selectedPaper.attemptableQuestions} / ${selectedPaper.questions}`
              : selectedPaper.questions}
          </p>
        </div>

        {/* Marks */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Award className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">
              Marks
            </span>
          </div>
          <p className="mt-2 text-base sm:text-xl font-bold text-white">
            {selectedPaper.marks}
          </p>
        </div>
      </div>

      {selectedPaper.availabilityNote && (
        <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs leading-5 text-amber-100">
          <span className="font-bold">Verified mock subset:</span> {selectedPaper.availabilityNote}
          {" "}Held items are not scored or shown.
        </div>
      )}

      {/* Primary CTA */}
      <button
        type="button"
        onClick={() => onStart(selectedPaper)}
        className="mt-6 w-full rounded-xl bg-white py-4 text-center text-sm sm:text-base font-bold text-black transition-all hover:bg-gray-100 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-white/30"
      >
        Start Full Paper
      </button>
    </div>
  );
}
