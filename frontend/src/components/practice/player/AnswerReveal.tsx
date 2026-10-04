"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookCheck,
  Compass,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
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

function ProvenanceBadge({ question }: { question: PracticeQuestion }) {
  const isVerified = Boolean(
    question.intelligence_verified || question.verified_status === "Verified"
  );

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
        isVerified
          ? "bg-blue-50 text-blue-700 border border-blue-200"
          : "bg-slate-100 text-slate-600 border border-slate-200"
      }`}
    >
      {isVerified ? (
        <>
          <ShieldCheck className="h-3 w-3 text-blue-600" />
          <span>Verified</span>
        </>
      ) : (
        <>
          <Sparkles className="h-3 w-3 text-slate-400" />
          <span>Model Derived</span>
        </>
      )}
    </span>
  );
}

export default function AnswerReveal({
  question,
  selectedOption,
  visible,
}: AnswerRevealProps) {
  const [showIntelligence, setShowIntelligence] = useState(false);
  if (!visible) return null;

  const correctKey = getCorrectKey(question);
  const isCorrect = selectedOption !== null && selectedOption === correctKey;

  return (
    <div
      className="overflow-hidden"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mt-5 space-y-4">
        {/* 1. Result Banner (User Answer vs Correct Answer) */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 sm:p-5 ${
            isCorrect
              ? "border-emerald-200 bg-emerald-50/90 text-emerald-950"
              : "border-rose-200 bg-rose-50/90 text-rose-950"
          }`}
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="shrink-0 mt-0.5 sm:mt-0">
              {isCorrect ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              ) : (
                <XCircle className="h-6 w-6 text-rose-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-black tracking-tight">
                  {isCorrect ? "Correct Answer!" : "Incorrect"}
                </p>
                <ProvenanceBadge question={question} />
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-medium">
                <span>
                  Your Answer:{" "}
                  <strong className="font-bold">
                    Option {selectedOption ?? "None"}
                  </strong>
                </span>
                {!isCorrect && correctKey && (
                  <span className="text-rose-800">
                    Correct:{" "}
                    <strong className="font-bold underline underline-offset-2">
                      Option {correctKey}
                    </strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 self-end sm:self-center">
            <DifficultyPill category={question.difficulty_category} />
          </div>
        </div>

        {/* 2. Detailed Explanation */}
        {question.explanation && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="mb-2.5 flex items-center justify-between gap-2 text-slate-500">
              <div className="flex items-center gap-1.5">
                <BookCheck className="h-4 w-4 text-blue-600" />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Explanation & Concept
                </p>
              </div>
              <ProvenanceBadge question={question} />
            </div>
            <MathText
              text={question.explanation}
              className="text-sm leading-relaxed text-slate-800 whitespace-pre-line"
              as="div"
            />
          </div>
        )}

        {/* 3. Core Conceptual Taxonomy Mapping */}
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-900">
                {question.exam} {question.year}
              </span>
              {question.cycle && (
                <span className="rounded-md bg-slate-200/80 px-1.5 py-0.5 font-semibold text-slate-700 text-[11px]">
                  Cycle {question.cycle}
                </span>
              )}
              {question.paper && (
                <span className="text-slate-400">· {question.paper}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Difficulty Score:</span>
              <span className="text-xs font-bold text-slate-800">
                {question.difficulty_score != null
                  ? question.difficulty_score.toFixed(1)
                  : "—"}
                /100
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
            <span className="rounded-lg bg-white px-2.5 py-1 font-bold text-slate-800 shadow-2xs border border-slate-200/70">
              {question.subject}
            </span>
            <span className="text-slate-300 font-bold">›</span>
            <span className="rounded-lg bg-white px-2.5 py-1 font-semibold text-slate-700 shadow-2xs border border-slate-200/70">
              {question.topic}
            </span>
            {question.subtopic && (
              <>
                <span className="text-slate-300 font-bold">›</span>
                <span className="rounded-lg bg-white px-2.5 py-1 font-medium text-slate-600 shadow-2xs border border-slate-200/70">
                  {question.subtopic}
                </span>
              </>
            )}
            {question.concept && (
              <>
                <span className="text-slate-300 font-bold">›</span>
                <span className="rounded-lg bg-blue-50 px-2.5 py-1 font-bold text-blue-700 shadow-2xs border border-blue-200/70">
                  {question.concept}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 4. Progressively Disclosed Intelligence Layer */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 transition">
          <button
            type="button"
            onClick={() => setShowIntelligence((prev) => !prev)}
            className="flex w-full items-center justify-between text-left text-xs font-bold text-blue-900 hover:text-blue-700 focus:outline-hidden cursor-pointer"
            aria-expanded={showIntelligence}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>⚡ PYQ Intelligence Insights & Pattern</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600">
              {showIntelligence ? "Hide Intelligence" : "Expand Intelligence"}
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
                  <div className="rounded-xl border border-blue-200/60 bg-white p-3 shadow-2xs">
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
                  <div className="rounded-xl border border-blue-200/60 bg-white p-3 shadow-2xs">
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
                  <div className="rounded-xl border border-blue-200/60 bg-white p-3 shadow-2xs">
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
                  <div className="rounded-xl border border-blue-200/60 bg-white p-3 shadow-2xs">
                    <div className="flex items-center justify-between gap-1.5 font-semibold text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <BookCheck className="h-3.5 w-3.5 text-blue-600" />
                        <span>Source Attribution</span>
                      </div>
                      <ProvenanceBadge question={question} />
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
      </div>
    </div>
  );
}
