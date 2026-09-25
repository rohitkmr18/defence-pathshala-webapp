"use client";

import { useState } from "react";
import { TrendingUp, CheckCircle, ChevronDown, Sparkles } from "lucide-react";
import type { OptionKey } from "@/lib/practice-types";
import type { RecoverableTopicItem } from "@/lib/analysis/computeAnalysisMetrics";
import type { ExamScoringRule } from "@/lib/examScoring";
import QuestionCard from "@/components/practice/player/QuestionCard";
import AnswerReveal from "@/components/practice/player/AnswerReveal";
import AnalysisSection from "./AnalysisSection";

interface RecoverableMarksCardProps {
  totalRecoverableMarks: number;
  topics: RecoverableTopicItem[];
  answers?: Record<string, OptionKey>;
  scoringRule?: ExamScoringRule;
  isEligible: boolean;
}

export default function RecoverableMarksCard({
  totalRecoverableMarks,
  topics,
  answers = {},
  scoringRule,
  isEligible,
}: RecoverableMarksCardProps) {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const toggleTopic = (topicName: string) => {
    setExpandedTopic((prev) => (prev === topicName ? null : topicName));
  };

  const correctBonus = scoringRule?.correctFormatted || "+2.00";
  const penaltySaved = scoringRule?.penaltyFormatted || "-0.67";
  const netSwing = scoringRule?.recoverableSwingPerQuestion
    ? `+${scoringRule.recoverableSwingPerQuestion.toFixed(2)}`
    : "+2.67";

  return (
    <AnalysisSection
      id="recoverable-marks-section"
      title="Recoverable Marks Analysis"
      subtitle={`Easy & Moderate questions you missed. Converting these gives ${correctBonus} marks and eliminates the ${penaltySaved} penalty (${netSwing} net swing per question).`}
      badge={
        totalRecoverableMarks > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            +{totalRecoverableMarks} pts upside
          </span>
        ) : undefined
      }
      isEligible={isEligible}
      minThresholdNotice="Attempt at least 5 questions to calculate recoverable marks."
    >
      {/* Big summary pill */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Total High-Leverage Upside
            </p>
            <p className="text-2xl font-black text-emerald-950 sm:text-3xl">
              +{totalRecoverableMarks} Marks
            </p>
          </div>
        </div>

        <p className="max-w-xs text-xs text-emerald-700">
          These are questions you likely have foundational knowledge for, but lost to traps or misreads.
        </p>
      </div>

      {/* Prioritized topics list */}
      {topics.length > 0 ? (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Top Priority Recovery Areas (Click any card to review questions)
            </p>
            <span className="text-[11px] font-medium text-blue-600">
              Interactive · Click to expand
            </span>
          </div>

          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            {topics.map((item, idx) => {
              const isExpanded = expandedTopic === item.topic;
              const questionsList = item.contributingQuestions || [];

              return (
                <div key={item.topic} className="transition-colors">
                  {/* Topic Row Toggle Button */}
                  <button
                    type="button"
                    onClick={() => toggleTopic(item.topic)}
                    aria-expanded={isExpanded}
                    className={`flex w-full items-center justify-between p-4 text-left transition hover:bg-slate-50/90 focus:outline-none ${
                      isExpanded ? "bg-slate-50/90" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{item.topic}</h4>
                          <span className="text-[11px] rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-500">
                            {questionsList.length} missed
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {item.subject} · {item.count} question{item.count > 1 ? "s" : ""} missed
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-block rounded-lg bg-emerald-100/80 px-2.5 py-1 text-xs font-extrabold text-emerald-800">
                        +{item.marks} pts
                      </span>
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform duration-200 ${
                          isExpanded ? "rotate-180 bg-slate-200 text-slate-900" : ""
                        }`}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </button>

                  {/* Inline Contributing Questions Drawer */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden bg-slate-50/70 border-t border-slate-100">
                      <div className="p-4 sm:p-6 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                          <div className="flex items-center gap-2 text-slate-700">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                              {item.topic} · Contributing Missed Questions ({questionsList.length})
                            </h5>
                          </div>
                          <p className="text-xs text-slate-500">
                            Fixing these foundational questions unlocks +{item.marks} marks
                          </p>
                        </div>

                        {questionsList.length > 0 ? (
                          <div className="space-y-6">
                            {questionsList.map((q) => {
                              const userChoice = answers[q.id] ?? null;
                              return (
                                <div
                                  key={q.id}
                                  className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
                                >
                                  <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                                    <span className="font-bold text-slate-700">
                                      Question {q.q_num} · {q.exam} {q.year}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 font-semibold text-amber-800">
                                        {q.difficulty_category || "Moderate"} Difficulty
                                      </span>
                                      <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 font-bold text-rose-700">
                                        Lost Marks ({penaltySaved})
                                      </span>
                                    </div>
                                  </div>

                                  <QuestionCard
                                    question={q}
                                    questionNumber={q.q_num}
                                    selectedOption={userChoice}
                                    revealed={true}
                                    onSelect={() => {}}
                                  />

                                  <AnswerReveal
                                    question={q}
                                    selectedOption={userChoice}
                                    visible={true}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic py-2">
                            Contributing questions details will display when full question data is available.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Zero Easy/Moderate misses! Exceptional execution on foundational questions.</span>
        </div>
      )}
    </AnalysisSection>
  );
}
