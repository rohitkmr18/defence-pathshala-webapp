"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, CheckCircle, XCircle, MinusCircle, ArrowLeft, Eye, RotateCcw } from "lucide-react";
import type { PracticeQuestion, OptionKey } from "@/lib/practice-types";
import { getCorrectKey } from "@/lib/practice-types";
import QuestionCard from "@/components/practice/player/QuestionCard";
import AnswerReveal from "@/components/practice/player/AnswerReveal";

interface ExamScorecardProps {
  questions: PracticeQuestion[];
  answers: Record<string, OptionKey>;
  examTitle: string;
  totalTimeSpentSeconds: number;
  onRetake: () => void;
}

export default function ExamScorecard({
  questions,
  answers,
  examTitle,
  totalTimeSpentSeconds,
  onRetake,
}: ExamScorecardProps) {
  const [filterMode, setFilterMode] = useState<"all" | "incorrect" | "correct" | "unattempted">("all");
  const [showSolutions, setShowSolutions] = useState(false);

  const total = questions.length;
  let correct = 0;
  let incorrect = 0;
  let unattempted = 0;

  questions.forEach((q) => {
    const selected = answers[q.id];
    const correctKey = getCorrectKey(q);

    if (!selected) {
      unattempted++;
    } else if (selected === correctKey) {
      correct++;
    } else {
      incorrect++;
    }
  });

  const attempted = correct + incorrect;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  // UPSC Standard Marking for 2-mark questions (Paper 1): +2.00 for correct, -0.67 for incorrect
  const marksPerQuestion = 2.0;
  const negativeMark = 0.67;
  const netScore = Math.max(0, Number((correct * marksPerQuestion - incorrect * negativeMark).toFixed(2)));
  const maxPossibleMarks = total * marksPerQuestion;

  const filteredQuestions = questions.filter((q) => {
    const selected = answers[q.id];
    const correctKey = getCorrectKey(q);

    if (filterMode === "correct") return selected && selected === correctKey;
    if (filterMode === "incorrect") return selected && selected !== correctKey;
    if (filterMode === "unattempted") return !selected;
    return true;
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
              Exam Complete
            </span>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{examTitle}</h1>
            <p className="mt-1 text-sm text-slate-400">
              UPSC Defence Performance Audit
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onRetake}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retake Paper
            </button>
            <Link
              href="/dashboard/practice"
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Practice
            </Link>
          </div>
        </div>

        {/* Big Score Hero */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-800 pt-8 sm:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Net Score
            </p>
            <p className="mt-1 text-3xl font-extrabold text-white sm:text-4xl">
              {netScore}{" "}
              <span className="text-sm font-normal text-slate-400">
                / {maxPossibleMarks}
              </span>
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Accuracy
            </p>
            <p className="mt-1 text-3xl font-extrabold text-blue-400 sm:text-4xl">
              {accuracy}%
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Attempted
            </p>
            <p className="mt-1 text-3xl font-extrabold text-white sm:text-4xl">
              {attempted}{" "}
              <span className="text-sm font-normal text-slate-400">
                / {total}
              </span>
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Marking Scheme
            </p>
            <p className="mt-1.5 text-sm font-semibold text-slate-300">
              +2.00 / -0.67
            </p>
            <p className="text-xs text-slate-500">UPSC Standard</p>
          </div>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-center sm:p-6">
          <CheckCircle className="mx-auto h-6 w-6 text-emerald-600" />
          <p className="mt-2 text-2xl font-bold text-emerald-950 sm:text-3xl">
            {correct}
          </p>
          <p className="text-xs font-semibold text-emerald-700">Correct</p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 text-center sm:p-6">
          <XCircle className="mx-auto h-6 w-6 text-red-600" />
          <p className="mt-2 text-2xl font-bold text-red-950 sm:text-3xl">
            {incorrect}
          </p>
          <p className="text-xs font-semibold text-red-700">Incorrect</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center sm:p-6">
          <MinusCircle className="mx-auto h-6 w-6 text-slate-400" />
          <p className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">
            {unattempted}
          </p>
          <p className="text-xs font-semibold text-slate-500">Unattempted</p>
        </div>
      </div>

      {/* Solutions Section Toggle */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Detailed Solutions & Intelligence
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Review answer keys, explanations, themes and difficulty tags.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSolutions(!showSolutions)}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
          >
            <Eye className="h-4 w-4" />
            <span>{showSolutions ? "Hide Solutions" : "Review All Solutions"}</span>
          </button>
        </div>

        {/* Filter Chips when solutions are open */}
        {showSolutions && (
          <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
            {(
              [
                ["all", `All (${total})`],
                ["incorrect", `Incorrect (${incorrect})`],
                ["correct", `Correct (${correct})`],
                ["unattempted", `Unattempted (${unattempted})`],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setFilterMode(mode)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  filterMode === mode
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Question Solutions List */}
        {showSolutions && (
          <div className="mt-6 space-y-6">
            {filteredQuestions.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">
                No questions matching this filter.
              </p>
            ) : (
              filteredQuestions.map((q) => {
                const selected = answers[q.id] ?? null;
                return (
                  <div
                    key={q.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 p-5 shadow-xs"
                  >
                    <QuestionCard
                      question={q}
                      questionNumber={q.q_num}
                      selectedOption={selected}
                      revealed={true}
                      onSelect={() => {}}
                    />
                    <AnswerReveal
                      question={q}
                      selectedOption={selected}
                      visible={true}
                    />
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
