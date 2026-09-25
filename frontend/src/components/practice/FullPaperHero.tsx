"use client";

import { useState } from "react";
import { Clock, BookOpen, Target, Award, ChevronDown } from "lucide-react";

export interface FullPaperDefinition {
  id: string;
  exam: string;
  year: number;
  cycle?: string;
  label: string;
  questions: number;
  duration: string;
  durationSeconds: number;
  marks: number;
}

export const AVAILABLE_FULL_PAPERS: FullPaperDefinition[] = [
  {
    id: "capf-2025",
    exam: "CAPF-AC",
    year: 2025,
    label: "CAPF AC 2025",
    questions: 125,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 250,
  },
  {
    id: "capf-2026",
    exam: "CAPF-AC",
    year: 2026,
    label: "CAPF AC 2026",
    questions: 125,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 250,
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
    id: "cds-2026-2",
    exam: "CDS",
    year: 2026,
    cycle: "II",
    label: "CDS II 2026",
    questions: 120,
    duration: "2 Hours",
    durationSeconds: 7200,
    marks: 100,
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
        (initialExam && (p.exam === initialExam || p.label.includes(initialExam))) &&
        (!initialYear || p.year === initialYear)
    ) || AVAILABLE_FULL_PAPERS[0]!;

  const [selectedPaperId, setSelectedPaperId] = useState<string>(initialPaper.id);

  const selectedPaper =
    AVAILABLE_FULL_PAPERS.find((p) => p.id === selectedPaperId) || AVAILABLE_FULL_PAPERS[0]!;

  return (
    <div className="rounded-3xl bg-black p-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Attempt Full Paper
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Exam-like experience
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Choose an exam paper to simulate the real UPSC test environment.
          </p>
        </div>

        <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
          UPSC Style
        </span>
      </div>

      {/* 2x2 Stats grid matching design mockup */}
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Exam Single Select Option */}
        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20">
          <label
            htmlFor="exam-paper-select"
            className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] text-gray-400"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-400" />
            Exam
          </label>
          <div className="relative mt-2">
            <select
              id="exam-paper-select"
              value={selectedPaperId}
              onChange={(e) => setSelectedPaperId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-base font-bold text-white focus:border-blue-400 focus:outline-none cursor-pointer pr-10"
            >
              {AVAILABLE_FULL_PAPERS.map((paper) => (
                <option
                  key={paper.id}
                  value={paper.id}
                  className="bg-slate-900 text-white py-1"
                >
                  {paper.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Time */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs font-medium uppercase tracking-[0.15em]">
              Time
            </span>
          </div>
          <p className="mt-2.5 text-xl font-bold text-white">
            {selectedPaper.duration}
          </p>
        </div>

        {/* Questions */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Target className="h-3.5 w-3.5" />
            <span className="text-xs font-medium uppercase tracking-[0.15em]">
              Questions
            </span>
          </div>
          <p className="mt-2.5 text-xl font-bold text-white">
            {selectedPaper.questions}
          </p>
        </div>

        {/* Marks */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Award className="h-3.5 w-3.5" />
            <span className="text-xs font-medium uppercase tracking-[0.15em]">
              Marks
            </span>
          </div>
          <p className="mt-2.5 text-xl font-bold text-white">
            {selectedPaper.marks}
          </p>
        </div>
      </div>

      {/* Primary CTA */}
      <button
        type="button"
        onClick={() => onStart(selectedPaper)}
        className="mt-6 w-full rounded-xl bg-white py-4 text-center text-sm font-bold text-black transition-all hover:bg-gray-100 active:scale-[0.98]"
      >
        Start Full Paper
      </button>
    </div>
  );
}
