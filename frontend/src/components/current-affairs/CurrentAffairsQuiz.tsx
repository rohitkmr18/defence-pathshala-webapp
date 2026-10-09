"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ChevronRight, CircleHelp, FastForward, Lightbulb, RotateCcw, XCircle } from "lucide-react";
import type { CurrentAffairsMcq } from "@/lib/current-affairs";
import { trackLearningEvent } from "@/lib/learning-events";

type RevisionTakeaway = {
  title: string;
  subject: string | null;
  points: string[];
};

type Props = {
  questions: CurrentAffairsMcq[];
  editionDate: string;
  revisionTakeaways: RevisionTakeaway[];
};

type ParsedQuestion = {
  intro: string | null;
  statements: string[];
  prompt: string;
};

function parseQuestion(text: string): ParsedQuestion {
  const statementStart = text.match(/^([\s\S]*?):\s*1\.\s*/);
  if (!statementStart) {
    return { intro: null, statements: [], prompt: text };
  }

  const intro = statementStart[1]?.trim() || null;
  const remainder = text.slice(statementStart[0].length);
  const promptMatch = remainder.match(/\s+(Which|Select|How|What)\b[\s\S]*$/);
  const statementBlock = promptMatch ? remainder.slice(0, promptMatch.index).trim() : remainder;
  const prompt = promptMatch ? promptMatch[0].trim() : "";

  const statements = statementBlock
    .split(/\s+(?=\d+\.\s)/)
    .map((item, idx) => item.replace(new RegExp(`^${idx + 1}\\.\\s*`), "").trim())
    .filter(Boolean);

  return {
    intro,
    statements,
    prompt: prompt || "Which of the statements given above is/are correct?",
  };
}

export default function CurrentAffairsQuiz({ questions, editionDate, revisionTakeaways }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [skipped, setSkipped] = useState<Record<string, boolean>>({});
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const quizTopRef = useRef<HTMLDivElement>(null);

  const question = questions[index];
  const complete = index >= questions.length;

  const score = useMemo(
    () => questions.reduce((sum, item) => sum + (selected[item.id] === item.correctOption ? 1 : 0), 0),
    [questions, selected],
  );

  const skippedCount = useMemo(
    () => questions.filter((item) => skipped[item.id]).length,
    [questions, skipped],
  );

  useEffect(() => {
    if (!complete) return;
    trackLearningEvent(
      "current_affairs_quiz_complete",
      {
        source_surface: "current_affairs",
        edition_date: editionDate,
        score,
        skipped_count: skippedCount,
        total_questions: questions.length,
        accuracy: questions.length ? Math.round((score / questions.length) * 100) : 0,
      },
      editionDate,
    );
  }, [complete, editionDate, questions.length, score, skippedCount]);

  function scrollQuizTop() {
    requestAnimationFrame(() => {
      quizTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function goNext() {
    setIndex((current) => current + 1);
    setStartedAt(Date.now());
    scrollQuizTop();
  }

  function restartQuiz() {
    setIndex(0);
    setSelected({});
    setChecked({});
    setSkipped({});
    setStartedAt(Date.now());
    scrollQuizTop();
  }

  if (complete) {
    const revisionItems =
      revisionTakeaways.length > 0
        ? revisionTakeaways
        : questions.slice(0, 5).map((item) => ({
            title: item.topic || item.subject || "Current Affairs",
            subject: item.subject,
            points: [item.examEdge || item.explanation || "Review the key fact tested in this question."],
          }));

    return (
      <div ref={quizTopRef} className="space-y-4 scroll-mt-24">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">Daily quiz complete</p>
              <h3 className="mt-2 text-3xl font-black text-slate-950">{score} / {questions.length}</h3>
            </div>
            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-right text-white">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Accuracy</p>
              <p className="text-xl font-black">{questions.length ? Math.round((score / questions.length) * 100) : 0}%</p>
            </div>
          </div>
          {skippedCount > 0 && (
            <p className="mt-3 text-xs font-semibold text-amber-700">
              {skippedCount} question{skippedCount > 1 ? "s" : ""} skipped — revise the lock card below before leaving.
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-blue-600 p-2.5 text-white">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">Lock today’s Current Affairs</p>
              <h3 className="mt-1 text-xl font-black text-slate-950">60-second revision</h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">Read these once before you move on. These are the durable exam takeaways from today.</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {revisionItems.map((item, idx) => (
              <div key={`${idx}-${item.title}`} className="rounded-2xl border border-blue-100 bg-white p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-black text-blue-700">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    {item.subject && (
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-600">
                        {item.subject}
                      </p>
                    )}
                    <p className="mt-0.5 text-sm font-black leading-5 text-slate-950">{item.title}</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-2 pl-10">
                  {item.points.slice(0, 4).map((point) => (
                    <li key={point} className="relative text-sm font-semibold leading-5 text-slate-700 before:absolute before:-left-4 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-blue-500">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={restartQuiz}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700"
          >
            <RotateCcw className="h-4 w-4" /> Revise quiz again
          </button>
        </div>
      </div>
    );
  }

  const chosen = selected[question.id];
  const hasChecked = checked[question.id];
  const parsed = parseQuestion(question.question);

  async function checkAnswer() {
    if (!chosen || hasChecked) return;
    setChecked((current) => ({ ...current, [question.id]: true }));
    setSkipped((current) => ({ ...current, [question.id]: false }));
    const elapsed = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
    const isCorrect = chosen === question.correctOption;

    trackLearningEvent(
      "current_affairs_quiz_check",
      {
        source_surface: "current_affairs",
        edition_date: editionDate,
        question_id: question.id,
        question_number: index + 1,
        is_correct: isCorrect,
        time_taken_seconds: elapsed,
      },
      `${editionDate}:${question.id}`,
    );

    try {
      await fetch("/api/current-affairs/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mcqId: question.id, selectedOption: chosen, timeTaken: elapsed }),
      });
    } catch {
      // The quiz remains usable for guests or during transient persistence failures.
    }
  }

  function skipQuestion() {
    setSkipped((current) => ({ ...current, [question.id]: true }));
    trackLearningEvent(
      "current_affairs_quiz_skip",
      {
        source_surface: "current_affairs",
        edition_date: editionDate,
        question_id: question.id,
        question_number: index + 1,
      },
      `${editionDate}:${question.id}:skip`,
    );
    goNext();
  }

  return (
    <div ref={quizTopRef} className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-500">
        <span>Question {index + 1} of {questions.length}</span>
        {question.difficulty && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">
            {question.difficulty}
          </span>
        )}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="mt-5">
        {parsed.intro && (
          <p className="text-[15px] font-black leading-6 text-slate-950 sm:text-base">{parsed.intro}</p>
        )}

        {parsed.statements.length > 0 ? (
          <div className="mt-3 space-y-2.5">
            {parsed.statements.map((statement, idx) => (
              <div key={statement} className="flex gap-3 rounded-2xl bg-slate-50 px-3.5 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-blue-700 shadow-sm">
                  {idx + 1}
                </span>
                <p className="text-sm font-semibold leading-5 text-slate-700">{statement}</p>
              </div>
            ))}
            <p className="pt-1 text-[15px] font-black leading-6 text-slate-950">{parsed.prompt}</p>
          </div>
        ) : (
          <h3 className="text-[17px] font-black leading-7 text-slate-950 sm:text-lg">{parsed.prompt}</h3>
        )}
      </div>

      <div className="mt-5 space-y-2.5">
        {question.options.map((option) => {
          const isSelected = chosen === option.key;
          const isCorrect = hasChecked && option.key === question.correctOption;
          const isWrongSelected = hasChecked && isSelected && option.key !== question.correctOption;

          return (
            <button
              key={option.key}
              type="button"
              disabled={hasChecked}
              onClick={() => {
                trackLearningEvent(
                  "current_affairs_quiz_start",
                  {
                    source_surface: "current_affairs",
                    edition_date: editionDate,
                    total_questions: questions.length,
                  },
                  editionDate,
                );
                setSelected((current) => ({ ...current, [question.id]: option.key }));
              }}
              className={[
                "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm transition",
                isCorrect ? "border-emerald-300 bg-emerald-50" : "",
                isWrongSelected ? "border-rose-300 bg-rose-50" : "",
                !hasChecked && isSelected ? "border-blue-500 bg-blue-50 ring-1 ring-blue-100" : "",
                !hasChecked && !isSelected ? "border-slate-200 hover:border-slate-300 hover:bg-slate-50" : "",
              ].join(" ")}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-700">
                {option.key}
              </span>
              <span className="font-semibold leading-5 text-slate-800">{option.text}</span>
            </button>
          );
        })}
      </div>

      {!hasChecked ? (
        <div className="mt-5 grid grid-cols-[auto_1fr] gap-2.5">
          <button
            type="button"
            onClick={skipQuestion}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-black text-slate-600"
          >
            <FastForward className="h-4 w-4" /> Skip
          </button>
          <button
            type="button"
            onClick={checkAnswer}
            disabled={!chosen}
            className="rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Check Answer
          </button>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <div className={[
            "overflow-hidden rounded-2xl border",
            chosen === question.correctOption
              ? "border-emerald-200 bg-emerald-50/70"
              : "border-rose-200 bg-rose-50/70",
          ].join(" ")}>
            <div className="flex items-center gap-3 border-b border-black/5 px-4 py-3">
              {chosen === question.correctOption ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <XCircle className="h-5 w-5 text-rose-600" />
              )}
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Answer check</p>
                <p className="text-sm font-black text-slate-950">
                  {chosen === question.correctOption ? "Correct — keep it." : `Correct answer: ${question.correctOption}`}
                </p>
              </div>
            </div>
            {question.explanation && (
              <div className="px-4 py-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Why?</p>
                <p className="mt-1.5 text-sm font-semibold leading-6 text-slate-700">{question.explanation}</p>
              </div>
            )}
          </div>

          {question.examEdge && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start gap-2.5">
                <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">Exam Edge</p>
                  <p className="mt-1 text-sm font-semibold leading-5 text-blue-950">{question.examEdge}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={goNext}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-black text-white hover:bg-blue-700"
          >
            {index + 1 === questions.length ? "Finish & Lock Revision" : "Next Question"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
