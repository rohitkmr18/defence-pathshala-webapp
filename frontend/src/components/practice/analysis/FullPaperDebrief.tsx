"use client";

import { useState } from "react";
import type { PracticeQuestion, OptionKey } from "@/lib/practice-types";
import { computeAnalysisMetrics } from "@/lib/analysis/computeAnalysisMetrics";
import MockDebriefHero from "./MockDebriefHero";
import NextBestMoveCard from "./NextBestMoveCard";
import RecoverableMarksCard from "./RecoverableMarksCard";
import SubjectPerformanceCard from "./SubjectPerformanceCard";
import TopicHeatmapCard from "./TopicHeatmapCard";
import DifficultyBreakdownCard from "./DifficultyBreakdownCard";
import MistakePatternsCard from "./MistakePatternsCard";
import TimeManagementCard from "./TimeManagementCard";
import RecoveryPlanCard from "./RecoveryPlanCard";
import QuestionCard from "@/components/practice/player/QuestionCard";
import AnswerReveal from "@/components/practice/player/AnswerReveal";
import { getCorrectKey } from "@/lib/practice-types";
import { Eye } from "lucide-react";

interface FullPaperDebriefProps {
  questions: PracticeQuestion[];
  answers: Record<string, OptionKey>;
  examTitle: string;
  totalTimeSpentSeconds: number;
  onRetake: () => void;
}

export default function FullPaperDebrief({
  questions,
  answers,
  examTitle,
  totalTimeSpentSeconds,
  onRetake,
}: FullPaperDebriefProps) {
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
    <div className="mx-auto max-w-4xl space-y-8 pb-16 animate-in fade-in duration-300">
      {/* 1. Hero Scorecard */}
      <MockDebriefHero
        metrics={metrics}
        examTitle={examTitle}
        onRetake={onRetake}
        isFiltered={false}
      />

      {/* 2. AI Coach Next Best Move */}
      <NextBestMoveCard move={metrics.nextBestMove} />

      {/* 3. Recoverable Marks */}
      <RecoverableMarksCard
        totalRecoverableMarks={metrics.totalRecoverableMarks}
        topics={metrics.recoverableTopics}
        isEligible={metrics.eligibility.hasRecoverableMarks}
      />

      {/* 4. Subject Performance */}
      <SubjectPerformanceCard
        subjects={metrics.subjects}
        isEligible={metrics.eligibility.hasSubjectPerformance}
      />

      {/* 5. Topic Heatmap */}
      <TopicHeatmapCard
        topics={metrics.topics}
        isEligible={metrics.eligibility.hasTopicHeatmap}
      />

      {/* 6. Difficulty Breakdown */}
      <DifficultyBreakdownCard
        difficulties={metrics.difficulties}
        isEligible={metrics.eligibility.hasDifficulty}
      />

      {/* 7. Mistake Patterns */}
      <MistakePatternsCard
        patterns={metrics.mistakePatterns}
        isEligible={metrics.eligibility.hasMistakePatterns}
      />

      {/* 8. Time Management */}
      <TimeManagementCard
        timeManagement={metrics.timeManagement}
        totalTimeFormatted={metrics.formattedTime}
        isEligible={metrics.eligibility.hasTimeManagement}
      />

      {/* 9. Recovery Plan */}
      <RecoveryPlanCard
        steps={metrics.recoveryPlan}
        isEligible={metrics.eligibility.hasRecoverableMarks}
      />

      {/* 10. Detailed Review Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Detailed Question Solutions & Explanations
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Examine the official answer key, rationale, syllabus theme, and difficulty for every question.
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
