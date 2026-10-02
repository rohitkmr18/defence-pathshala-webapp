"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, BookCheck, Compass, Clock, ShieldCheck } from "lucide-react";
import type { PracticeQuestion, OptionKey } from "@/lib/practice-types";
import { getCorrectKey } from "@/lib/practice-types";
import MathText from "@/components/common/MathText";

interface AnswerRevealProps {
  question: PracticeQuestion;
  selectedOption: OptionKey | null;
  visible: boolean;
}

function DifficultyPill({ category }: { category?: string | null }) {
  if (!category) return null;

  const map: Record<string, string> = {
    Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Hard: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const style =
    map[category] ?? "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style}`}>
      {category}
    </span>
  );
}

export default function AnswerReveal({
  question,
  selectedOption,
  visible,
}: AnswerRevealProps) {
  const [showIntelligence, setShowIntelligence] = useState(false);
  const correctKey = getCorrectKey(question);
  const isCorrect = selectedOption !== null && selectedOption === correctKey;

  const hasIntelligence = Boolean(
    question.intelligence_eligible ||
    (question.verified_status === "Verified" && (question.q_pattern || question.source || question.static_current_link))
  );

  return (
    <div
      className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${visible ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}
      `}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mt-5 space-y-4">
        {/* 1. Result banner */}
        <div
          className={`flex items-center gap-3.5 rounded-2xl border p-4 sm:p-5 ${
            isCorrect
              ? "border-emerald-200 bg-emerald-50/80"
              : "border-rose-200 bg-rose-50/80"
          }`}
        >
          <span className="text-2xl" aria-hidden="true">
            {isCorrect ? "✅" : "❌"}
          </span>
          <div className="flex-1">
            <p
              className={`text-base font-bold ${
                isCorrect ? "text-emerald-900" : "text-rose-900"
              }`}
            >
              {isCorrect ? "Correct Answer!" : "Incorrect"}
            </p>
            {!isCorrect && correctKey && (
              <p className="mt-0.5 text-sm font-medium text-rose-700">
                The correct option is <strong className="underline underline-offset-2">Option {correctKey}</strong>.
              </p>
            )}
          </div>
          <div className="shrink-0">
            <DifficultyPill category={question.difficulty_category} />
          </div>
        </div>

        {/* 2. Detailed Explanation */}
        {question.explanation && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="mb-2.5 flex items-center gap-1.5 text-slate-500">
              <BookCheck className="h-4 w-4 text-blue-600" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Official Key & Explanation
              </p>
            </div>
            <MathText
              text={question.explanation}
              className="text-sm leading-relaxed text-slate-800 whitespace-pre-line"
              as="div"
            />
          </div>
        )}

        {/* 3. Core Conceptual Mapping */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-900">{question.exam} {question.year}</span>
              {question.cycle && (
                <span className="rounded-md bg-slate-200/70 px-1.5 py-0.5 font-medium text-slate-700">
                  Cycle {question.cycle}
                </span>
              )}
              {question.paper && (
                <span className="text-slate-400">· {question.paper}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                Difficulty Score:
              </span>
              <span className="text-xs font-bold text-slate-700">
                {question.difficulty_score != null ? question.difficulty_score.toFixed(1) : "—"}/100
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
            <span className="rounded-lg bg-white px-2.5 py-1 font-semibold text-slate-800 shadow-2xs border border-slate-200/60">
              {question.subject}
            </span>
            <span className="text-slate-300">›</span>
            <span className="rounded-lg bg-white px-2.5 py-1 font-medium text-slate-700 shadow-2xs border border-slate-200/60">
              {question.topic}
            </span>
            {question.subtopic && (
              <>
                <span className="text-slate-300">›</span>
                <span className="rounded-lg bg-white px-2.5 py-1 font-medium text-slate-600 shadow-2xs border border-slate-200/60">
                  {question.subtopic}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 4. Progressively Disclosed Intelligence Layer */}
        {hasIntelligence ? (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 transition">
            <button
              type="button"
              onClick={() => setShowIntelligence((prev) => !prev)}
              className="flex w-full items-center justify-between text-left text-xs font-bold text-blue-900 hover:text-blue-700 focus:outline-hidden"
              aria-expanded={showIntelligence}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>⚡ PYQ Intelligence Insights & Patterns</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                {showIntelligence ? "Hide Analysis" : "View Pattern & Source"}
                {showIntelligence ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </span>
            </button>

            {showIntelligence && (
              <div className="mt-3.5 space-y-3 border-t border-blue-100 pt-3 text-xs">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {question.q_pattern && (
                    <div className="rounded-xl border border-blue-200/60 bg-white p-3">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Compass className="h-3.5 w-3.5 text-blue-600" />
                        <span>Question Pattern</span>
                      </div>
                      <p className="mt-1 font-bold text-slate-900">
                        {question.q_pattern}
                      </p>
                    </div>
                  )}

                  {question.q_type && (
                    <div className="rounded-xl border border-blue-200/60 bg-white p-3">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                        <span>Cognitive Competency</span>
                      </div>
                      <p className="mt-1 font-bold text-slate-900">
                        {question.q_type}
                      </p>
                    </div>
                  )}

                  {question.static_current_link && (
                    <div className="rounded-xl border border-blue-200/60 bg-white p-3">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Clock className="h-3.5 w-3.5 text-blue-600" />
                        <span>Temporal Context</span>
                      </div>
                      <p className="mt-1 font-bold text-slate-900">
                        {question.static_current_link}
                      </p>
                    </div>
                  )}

                  {question.source && (
                    <div className="rounded-xl border border-blue-200/60 bg-white p-3">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <BookCheck className="h-3.5 w-3.5 text-blue-600" />
                        <span>Verified Source Attribution</span>
                      </div>
                      <p className="mt-1 font-medium text-slate-800">
                        {question.source}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
              <span>Standard PYQ Archive</span>
            </span>
            <span className="font-medium text-slate-400">
              {question.verified_status ?? "Draft"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
