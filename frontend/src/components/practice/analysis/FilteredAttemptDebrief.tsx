"use client";

import { useState } from "react";
import type { PracticeQuestion, OptionKey } from "@/lib/practice-types";
import { computeAnalysisMetrics } from "@/lib/analysis/computeAnalysisMetrics";
import MockDebriefHero from "./MockDebriefHero";
import NextBestMoveCard from "./NextBestMoveCard";
import RecoverableMarksCard from "./RecoverableMarksCard";
import TopicBreakdownCard from "./TopicBreakdownCard";
import DifficultyBreakdownCard from "./DifficultyBreakdownCard";
import TimeManagementCard from "./TimeManagementCard";
import QuestionCard from "@/components/practice/player/QuestionCard";
import AnswerReveal from "@/components/practice/player/AnswerReveal";
import { getCorrectKey } from "@/lib/practice-types";
import { Eye } from "lucide-react";

interface FilteredAttemptDebriefProps {
  questions: PracticeQuestion[];
  answers: Record<string, OptionKey>;
  sessionTitle: string;
  totalTimeSpentSeconds: number;
  onRetake?: () => void;
}

export default function FilteredAttemptDebrief({
  questions,
  answers,
  sessionTitle,
  totalTimeSpentSeconds,
  onRetake,
}: FilteredAttemptDebriefProps) {
  const metrics = computeAnalysisMetrics(questions, answers, totalTimeSpentSeconds);
  const [showSolutions, setShowSolutions] = useState(false);
  const [solutionFilter, setSolutionFilter] = useState<"all" | "incorrect" | "correct" | "unattempted">("all");

  const filteredQuestions = questions.filter((q) => {
    const selected = answers[q.id];
    const correctKey = getCorrectKey(q);

    if (solutionFilter === "correct") return selected && selected === correctKey;
    if (solutionFilter === "incorrect") return selected && selected !== correctKey;
    if (solutionFilter === "unattempted") return !selected;
    return true;
  });

  return (
    <div className="mx-auto max-w-3xl space-y-7 pb-16 animate-in fade-in duration-300">
      {/* 1. Compact Hero */}
      <MockDebriefHero
        metrics={metrics}
        examTitle={sessionTitle}
        onRetake={onRetake}
        isFiltered={true}
      />

      {/* 2. Next Best Move */}
      <NextBestMoveCard move={metrics.nextBestMove} />

      {/* 3. Recoverable Marks (if sample threshold met) */}
      <RecoverableMarksCard
        totalRecoverableMarks={metrics.totalRecoverableMarks}
        topics={metrics.recoverableTopics}
        isEligible={metrics.eligibility.hasRecoverableMarks}
      />

      {/* 4. Topic Breakdown (Filtered Sessions: topics >= 2 questions) */}
      <TopicBreakdownCard topics={metrics.topics} />

      {/* 5. Difficulty Breakdown */}
      <DifficultyBreakdownCard
        difficulties={metrics.difficulties}
        isEligible={metrics.eligibility.hasDifficulty}
      />

      {/* 6. Time Management */}
      <TimeManagementCard
        timeManagement={metrics.timeManagement}
        totalTimeFormatted={metrics.formattedTime}
        isEligible={metrics.eligibility.hasTimeManagement}
      />

      {/* 7. Detailed Review */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Session Solutions & Explanations
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Review answers, explanations, and themes for this practice run.
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

        {showSolutions && (
          <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
            {(
              [
                ["all", `All (${metrics.total})`],
                ["incorrect", `Incorrect (${metrics.incorrect})`],
                ["correct", `Correct (${metrics.correct})`],
                ["unattempted", `Unattempted (${metrics.skipped})`],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSolutionFilter(mode)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  solutionFilter === mode
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

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
