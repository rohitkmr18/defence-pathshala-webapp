"use client";

import { useState } from "react";
import {
  BookCheck,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Compass,
  Gauge,
  ShieldCheck,
  Target,
  XCircle,
} from "lucide-react";
import type { PracticeQuestion, OptionKey } from "@/lib/practice-types";
import { getCorrectKey } from "@/lib/practice-types";
import { classifyAttempt } from "@/lib/attempt-intelligence";
import MathText from "@/components/common/MathText";

interface AnswerRevealProps {
  question: PracticeQuestion;
  selectedOption: OptionKey | null;
  visible: boolean;
  timeSpentSeconds?: number | null;
}

function DifficultyPill({ category }: { category?: string | null }) {
  if (!category) return null;

  const map: Record<string, string> = {
    Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Hard: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        map[category] ?? "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {category}
    </span>
  );
}

function ExamEdge({ question }: { question: PracticeQuestion }) {
  const recallUnit =
    question.concept || question.subtopic || question.topic || question.subject;
  const pattern = question.q_pattern;

  if (!recallUnit && !pattern) return null;

  return (
    <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-blue-700" />
        <h3 className="text-xs font-black uppercase tracking-wider text-blue-900">
          Exam Edge
        </h3>
      </div>
      <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-900">
        Revise <span className="text-blue-700">{recallUnit}</span> as the smallest recall unit
        {pattern ? (
          <>
            {" "}and practise it in <span className="text-blue-700">{pattern}</span> format.
          </>
        ) : (
          "."
        )}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">
        This is a deterministic study cue derived from the canonical taxonomy and question pattern,
        not a prediction about the next exam.
      </p>
    </section>
  );
}

export default function AnswerReveal({
  question,
  selectedOption,
  visible,
  timeSpentSeconds,
}: AnswerRevealProps) {
  const [showIntelligence, setShowIntelligence] = useState(false);
  if (!visible) return null;

  const correctKey = getCorrectKey(question);
  const isCorrect = selectedOption !== null && selectedOption === correctKey;
  const trustTier = question.intelligence_trust_tier;
  const canShowExamEdge =
    question.intelligence_eligible === true &&
    (trustTier === "HUMAN_VERIFIED" ||
      trustTier === "MODEL_READY" ||
      question.intelligence_verified === true ||
      question.intelligence_confidence === "MODEL_DERIVED");
  const canShowIntelligence =
    question.intelligence_eligible === true &&
    question.student_release_status === "RELEASED";

  const attempt =
    typeof timeSpentSeconds === "number" && timeSpentSeconds > 0
      ? classifyAttempt(isCorrect, timeSpentSeconds, question.difficulty_category)
      : null;

  return (
    <div className="overflow-hidden" aria-live="polite" aria-atomic="true">
      <div className="mt-5 space-y-4">
        <section
          className={`rounded-2xl border p-4 sm:p-5 ${
            isCorrect
              ? "border-emerald-200 bg-emerald-50/90 text-emerald-950"
              : "border-rose-200 bg-rose-50/90 text-rose-950"
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 sm:items-center">
              {isCorrect ? (
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600 sm:mt-0" />
              ) : (
                <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-rose-600 sm:mt-0" />
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-black tracking-tight">
                    {isCorrect ? "Correct" : "Incorrect"}
                  </p>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium sm:text-sm">
                  <span>
                    Your answer: <strong>Option {selectedOption ?? "None"}</strong>
                  </span>
                  {correctKey && (
                    <span>
                      Correct answer: <strong>Option {correctKey}</strong>
                    </span>
                  )}
                  {attempt && (
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {timeSpentSeconds}s
                    </span>
                  )}
                </div>
              </div>
            </div>
            <DifficultyPill category={question.difficulty_category} />
          </div>
        </section>

        {question.explanation && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <BookCheck className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Why this answer is correct
                </h3>
              </div>
            </div>
            <MathText
              text={question.explanation}
              className="whitespace-pre-line text-sm leading-relaxed text-slate-800"
              as="div"
            />
          </section>
        )}

        {canShowExamEdge && <ExamEdge question={question} />}

        {attempt && (
          <section className="rounded-2xl border border-violet-200 bg-violet-50/50 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-violet-700" />
              <h3 className="text-xs font-black uppercase tracking-wider text-violet-900">
                Attempt Intelligence
              </h3>
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-black text-slate-950">{attempt.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{attempt.message}</p>
              </div>
              <div className="shrink-0 rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs text-slate-600">
                <div className="font-bold text-slate-900">{timeSpentSeconds}s</div>
                <div>DP benchmark: ≤ {attempt.targetSeconds}s</div>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-900">
                {question.exam} {question.year}
              </span>
              {question.cycle && (
                <span className="rounded-md bg-slate-200/80 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">
                  Cycle {question.cycle}
                </span>
              )}
              {question.paper && <span className="text-slate-400">· {question.paper}</span>}
            </div>
            {question.difficulty_score != null && (
              <div className="text-xs text-slate-500">
                Difficulty score:{" "}
                <span className="font-bold text-slate-800">
                  {question.difficulty_score.toFixed(1)}/100
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
            <span className="rounded-lg border border-slate-200/70 bg-white px-2.5 py-1 font-bold text-slate-800 shadow-2xs">
              {question.subject}
            </span>
            <span className="font-bold text-slate-300">›</span>
            <span className="rounded-lg border border-slate-200/70 bg-white px-2.5 py-1 font-semibold text-slate-700 shadow-2xs">
              {question.topic}
            </span>
            {question.subtopic && (
              <>
                <span className="font-bold text-slate-300">›</span>
                <span className="rounded-lg border border-slate-200/70 bg-white px-2.5 py-1 font-medium text-slate-600 shadow-2xs">
                  {question.subtopic}
                </span>
              </>
            )}
            {canShowIntelligence && question.concept && (
              <>
                <span className="font-bold text-slate-300">›</span>
                <span className="rounded-lg border border-blue-200/70 bg-blue-50 px-2.5 py-1 font-bold text-blue-700 shadow-2xs">
                  {question.concept}
                </span>
              </>
            )}
          </div>
        </section>

        {canShowIntelligence && (
          <section className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
            <button
              type="button"
              onClick={() => setShowIntelligence((prev) => !prev)}
              className="flex w-full cursor-pointer items-center justify-between text-left text-xs font-bold text-blue-900 hover:text-blue-700 focus:outline-hidden"
              aria-expanded={showIntelligence}
            >
              <span className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-blue-600" />
                PYQ Intelligence
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                {showIntelligence ? "Hide" : "Expand"}
                {showIntelligence ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </span>
            </button>

            {showIntelligence && (
              <div className="mt-3.5 grid grid-cols-1 gap-3 border-t border-blue-100 pt-3 text-xs sm:grid-cols-2">
                {question.q_pattern && (
                  <div className="rounded-xl border border-blue-200/60 bg-white p-3 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                      <Compass className="h-3.5 w-3.5 text-blue-600" />
                      Question pattern
                    </div>
                    <p className="mt-1 font-bold text-slate-900">{question.q_pattern}</p>
                  </div>
                )}
                {question.q_type && (
                  <div className="rounded-xl border border-blue-200/60 bg-white p-3 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                      <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                      Question type
                    </div>
                    <p className="mt-1 font-bold text-slate-900">{question.q_type}</p>
                  </div>
                )}
                {question.static_current_link && (
                  <div className="rounded-xl border border-blue-200/60 bg-white p-3 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                      <Clock3 className="h-3.5 w-3.5 text-blue-600" />
                      Static-current link
                    </div>
                    <p className="mt-1 font-bold text-slate-900">{question.static_current_link}</p>
                  </div>
                )}
                {question.source && (
                  <div className="rounded-xl border border-blue-200/60 bg-white p-3 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                      <BookCheck className="h-3.5 w-3.5 text-blue-600" />
                      Source
                    </div>
                    <p className="mt-1 font-medium text-slate-800">{question.source}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}
