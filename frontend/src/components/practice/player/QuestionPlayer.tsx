"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import type { PracticeQuestion, PlayerMode, OptionKey } from "@/lib/practice-types";
import ProgressHeader from "./ProgressHeader";
import QuestionCard from "./QuestionCard";
import AnswerReveal from "./AnswerReveal";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface QuestionPlayerProps {
  questions: PracticeQuestion[];
  mode: PlayerMode;
  onComplete?: (answers: Record<string, OptionKey>) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function QuestionPlayer({
  questions,
  mode,
  onComplete,
}: QuestionPlayerProps) {
  // ── Session state (all local) ───────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  /** question.id → chosen option key */
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  /** Set of question IDs whose answers have been revealed */
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  // ── Derived state ───────────────────────────────────────────────────────────
  const question = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;
  const selectedOption = question ? (answers[question.id] ?? null) : null;
  const isRevealed = question ? revealed.has(question.id) : false;
  const hasAnswer = selectedOption !== null;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSelect = useCallback(
    (key: OptionKey) => {
      if (!question || isRevealed) return;
      setAnswers((prev) => ({ ...prev, [question.id]: key }));
    },
    [question, isRevealed]
  );

  const handleReveal = useCallback(() => {
    if (!question) return;
    setRevealed((prev) => new Set(prev).add(question.id));
  }, [question]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleNext = useCallback(() => {
    if (isLast) {
      onComplete?.(answers);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [isLast, onComplete, answers]);

  // ── Mode-specific nav logic ─────────────────────────────────────────────────
  //
  // instant:  Check Answer → reveals → Next appears
  // attempt:  No reveal, Next always available (once an option is selected),
  //           last question shows "Finish" (placeholder for Milestone 3 submit)

  const showCheckAnswer = mode === "instant" && hasAnswer && !isRevealed;
  const showNext =
    mode === "instant"
      ? isRevealed
      : hasAnswer; // attempt: next enabled as soon as an option is picked
  const nextLabel = isLast
    ? mode === "attempt"
      ? "Finish"
      : "Complete"
    : "Next";

  // ── Guard ───────────────────────────────────────────────────────────────────

  if (!question) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-400">No questions available.</p>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Progress */}
      <ProgressHeader
        current={currentIndex + 1}
        total={questions.length}
        mode={mode}
      />

      {/* Question card + options */}
      <QuestionCard
        question={question}
        questionNumber={question.q_num}
        selectedOption={selectedOption}
        revealed={isRevealed}
        onSelect={handleSelect}
      />

      {/* Answer reveal (instant mode only) */}
      {mode === "instant" && (
        <AnswerReveal
          question={question}
          selectedOption={selectedOption}
          visible={isRevealed}
        />
      )}

      {/* Navigation row */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {/* Previous */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={isFirst}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex items-center gap-3">
          {/* Check Answer — instant mode only */}
          {showCheckAnswer && (
            <button
              type="button"
              onClick={handleReveal}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
            >
              <CheckCircle className="h-4 w-4" />
              Check Answer
            </button>
          )}

          {/* Next / Finish */}
          {showNext && (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
            >
              {nextLabel}
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
