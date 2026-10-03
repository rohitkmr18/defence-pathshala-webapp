"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  LayoutGrid,
} from "lucide-react";
import type { PracticeQuestion, PlayerMode, OptionKey } from "@/lib/practice-types";
import { getCorrectKey } from "@/lib/practice-types";
import ProgressHeader from "./ProgressHeader";
import QuestionCard from "./QuestionCard";
import AnswerReveal from "./AnswerReveal";
import { recordQuestionAttempt, updateSessionProgress } from "@/lib/practice-session-client";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface QuestionPlayerProps {
  questions: PracticeQuestion[];
  mode: PlayerMode;
  sessionId?: string;
  initialIndex?: number;
  initialAnswers?: Record<string, OptionKey>;
  onComplete?: (answers: Record<string, OptionKey>) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function QuestionPlayer({
  questions,
  mode,
  sessionId,
  initialIndex = 0,
  initialAnswers = {},
  onComplete,
}: QuestionPlayerProps) {
  // ── Session state ──────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(
    Math.min(initialIndex, Math.max(0, questions.length - 1))
  );
  /** question.id → chosen option key */
  const [answers, setAnswers] = useState<Record<string, OptionKey>>(initialAnswers);
  /** Set of question IDs whose answers have been revealed */
  const [revealed, setRevealed] = useState<Set<string>>(() => {
    // If questions had initial answers in instant mode, treat them as revealed
    const set = new Set<string>();
    if (mode === "instant") {
      Object.keys(initialAnswers).forEach((qId) => set.add(qId));
    }
    return set;
  });
  const [showNavigator, setShowNavigator] = useState(false);

  // Track per-question time
  const questionStartTimeRef = useRef<number>(0);

  useEffect(() => {
    questionStartTimeRef.current = Date.now();
  }, [currentIndex]);

  // ── Derived state ───────────────────────────────────────────────────────────
  const question = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;
  const selectedOption = question ? answers[question.id] ?? null : null;
  const isRevealed = question ? revealed.has(question.id) : false;
  const hasAnswer = selectedOption !== null;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSelect = useCallback(
    (key: OptionKey) => {
      if (!question || (mode === "instant" && isRevealed)) return;
      const nextAnswers = { ...answers, [question.id]: key };
      setAnswers(nextAnswers);

      if (sessionId) {
        updateSessionProgress(sessionId, {
          answers: nextAnswers,
          current_index: currentIndex,
        });
      }
    },
    [question, mode, isRevealed, answers, sessionId, currentIndex]
  );

  const handleCheckAnswer = useCallback(() => {
    if (!question || !selectedOption) return;

    const correctKey = getCorrectKey(question);
    const isCorrect = selectedOption === correctKey;
    const timeSpent = Math.max(
      1,
      Math.round((Date.now() - (questionStartTimeRef.current || Date.now())) / 1000)
    );

    setRevealed((prev) => new Set(prev).add(question.id));

    // Record question-level attempt immediately into user_attempts
    void recordQuestionAttempt({
      question,
      selectedOption,
      isCorrect,
      timeTakenSeconds: timeSpent,
      sessionId,
      mode,
    });

    if (sessionId) {
      updateSessionProgress(sessionId, {
        current_index: currentIndex,
        answers: { ...answers, [question.id]: selectedOption },
      });
    }
  }, [question, selectedOption, sessionId, mode, currentIndex, answers]);

  const handlePrev = useCallback(() => {
    const index = Math.max(0, currentIndex - 1);
    setCurrentIndex(index);
    if (sessionId) updateSessionProgress(sessionId, { current_index: index });
  }, [currentIndex, sessionId]);

  const handleNext = useCallback(() => {
    if (isLast) {
      onComplete?.(answers);
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (sessionId) {
        updateSessionProgress(sessionId, { current_index: nextIdx });
      }
    }
  }, [isLast, onComplete, answers, currentIndex, sessionId]);

  const handleSkip = useCallback(() => {
    if (!question) return;

    const nextAnswers = { ...answers };
    delete nextAnswers[question.id];
    setAnswers(nextAnswers);
    if (sessionId) updateSessionProgress(sessionId, { answers: nextAnswers });

    if (isLast) {
      onComplete?.(nextAnswers);
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (sessionId) {
        updateSessionProgress(sessionId, { current_index: nextIdx });
      }
    }
  }, [answers, isLast, onComplete, question, currentIndex, sessionId]);

  const handleJumpToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
      setShowNavigator(false);
      if (sessionId) updateSessionProgress(sessionId, { current_index: index });
    }
  }, [questions.length, sessionId]);

  // ── Mode-specific nav logic ─────────────────────────────────────────────────
  const showCheckAnswerCTA = mode === "instant" && hasAnswer && !isRevealed;
  const showNextCTA = mode === "instant" ? isRevealed : hasAnswer;
  const nextLabel = isLast
    ? mode === "attempt"
      ? "Finish Mock Paper"
      : "Finish Practice Session"
    : "Next Question";
  const showSkip = mode === "attempt" || (mode === "instant" && !isRevealed && !hasAnswer);
  const skipLabel = isLast ? "Skip & Finish" : "Skip Question";

  // ── Guard ───────────────────────────────────────────────────────────────────
  if (!question) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500 font-semibold">No questions available in this session.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Top Header: Progress & Navigator Trigger */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <ProgressHeader
            current={currentIndex + 1}
            total={questions.length}
            mode={mode}
          />
        </div>

        <button
          type="button"
          onClick={() => setShowNavigator((prev) => !prev)}
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
            showNavigator
              ? "border-blue-600 bg-blue-50 text-blue-700 shadow-2xs"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
          aria-label="Toggle Question Navigator"
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="hidden sm:inline">Question Grid</span>
        </button>
      </div>

      {/* Question Navigator Grid Drawer */}
      {showNavigator && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Jump to Question ({questions.length} Total)
            </span>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Correct
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Incorrect
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Current
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" /> Unanswered
              </span>
            </div>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 max-h-48 overflow-y-auto p-1">
            {questions.map((q, idx) => {
              const qAns = answers[q.id];
              const qRev = revealed.has(q.id);
              const qCorrectKey = getCorrectKey(q);
              const isQCorrect = qRev && qAns && qAns === qCorrectKey;
              const isQIncorrect = qRev && qAns && qAns !== qCorrectKey;
              const isCurrent = idx === currentIndex;

              let btnStyle = "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100";
              if (isCurrent) {
                btnStyle = "border-blue-600 bg-blue-600 text-white font-black shadow-2xs ring-2 ring-blue-300";
              } else if (isQCorrect) {
                btnStyle = "border-emerald-300 bg-emerald-100 text-emerald-900 font-bold";
              } else if (isQIncorrect) {
                btnStyle = "border-rose-300 bg-rose-100 text-rose-900 font-bold";
              } else if (qAns) {
                btnStyle = "border-blue-200 bg-blue-50 text-blue-800 font-bold";
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleJumpToQuestion(idx)}
                  className={`flex h-9 items-center justify-center rounded-xl border text-xs transition active:scale-95 cursor-pointer ${btnStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Question Card + Options */}
      <QuestionCard
        question={question}
        questionNumber={currentIndex + 1}
        selectedOption={selectedOption}
        revealed={isRevealed}
        onSelect={handleSelect}
      />

      {/* Answer Reveal (Instant / Learning Mode) */}
      {mode === "instant" && (
        <AnswerReveal
          question={question}
          selectedOption={selectedOption}
          visible={isRevealed}
        />
      )}

      {/* Sticky Bottom Navigation Row */}
      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white/95 p-3 sm:p-4 shadow-lg backdrop-blur-md">
        {/* Previous Button (Always enabled for earlier questions) */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={isFirst}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        {/* Action CTAs */}
        <div className="flex items-center gap-2">
          {/* Check Answer CTA (Prominent and clear) */}
          {showCheckAnswerCTA && (
            <button
              type="button"
              onClick={handleCheckAnswer}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-500 active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Check Answer</span>
            </button>
          )}

          {/* Skip CTA */}
          {showSkip && (
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 shadow-2xs transition hover:bg-slate-100 active:scale-95 cursor-pointer"
            >
              {skipLabel}
            </button>
          )}

          {/* Next / Finish CTA */}
          {showNextCTA && (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-md transition hover:bg-slate-800 active:scale-95 cursor-pointer"
            >
              <span>{nextLabel}</span>
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
