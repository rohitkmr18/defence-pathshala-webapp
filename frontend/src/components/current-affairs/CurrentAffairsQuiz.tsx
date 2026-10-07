"use client";

import { useEffect, useMemo, useState } from "react";
import type { CurrentAffairsMcq } from "@/lib/current-affairs";
import { trackLearningEvent } from "@/lib/learning-events";

type Props = { questions: CurrentAffairsMcq[]; editionDate: string };

export default function CurrentAffairsQuiz({ questions, editionDate }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [startedAt, setStartedAt] = useState(() => Date.now());

  const question = questions[index];
  const complete = index >= questions.length;

  const score = useMemo(
    () => questions.reduce((sum, item) => sum + (selected[item.id] === item.correctOption ? 1 : 0), 0),
    [questions, selected],
  );

  useEffect(() => {
    if (!complete) return;
    trackLearningEvent(
      "current_affairs_quiz_complete",
      {
        source_surface: "current_affairs",
        edition_date: editionDate,
        score,
        total_questions: questions.length,
        accuracy: questions.length ? Math.round((score / questions.length) * 100) : 0,
      },
      editionDate,
    );
  }, [complete, editionDate, questions.length, score]);

  if (complete) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-bold text-blue-600">Daily quiz complete</p>
        <h3 className="mt-2 text-3xl font-black text-slate-950">{score} / {questions.length}</h3>
        <p className="mt-2 text-sm text-slate-600">
          {questions.length ? Math.round((score / questions.length) * 100) : 0}% accuracy. Review the explanations above before moving on.
        </p>
      </div>
    );
  }

  const chosen = selected[question.id];
  const hasChecked = checked[question.id];

  async function checkAnswer() {
    if (!chosen || hasChecked) return;
    setChecked((current) => ({ ...current, [question.id]: true }));
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

  function nextQuestion() {
    setIndex((current) => current + 1);
    setStartedAt(Date.now());
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>Question {index + 1} of {questions.length}</span>
        {question.difficulty && <span>{question.difficulty}</span>}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>

      <h3 className="mt-5 text-lg font-black leading-7 text-slate-950">{question.question}</h3>

      <div className="mt-5 space-y-3">
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
                "flex w-full items-start gap-3 rounded-2xl border p-4 text-left text-sm transition",
                isCorrect ? "border-emerald-300 bg-emerald-50" : "",
                isWrongSelected ? "border-rose-300 bg-rose-50" : "",
                !hasChecked && isSelected ? "border-blue-500 bg-blue-50" : "",
                !hasChecked && !isSelected ? "border-slate-200 hover:border-slate-300 hover:bg-slate-50" : "",
              ].join(" ")}
            >
              <span className="font-black text-slate-700">{option.key}.</span>
              <span className="text-slate-800">{option.text}</span>
            </button>
          );
        })}
      </div>

      {!hasChecked ? (
        <button
          type="button"
          onClick={checkAnswer}
          disabled={!chosen}
          className="mt-5 w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Check Answer
        </button>
      ) : (
        <div className="mt-5 space-y-4">
          <div className={`rounded-2xl p-4 ${chosen === question.correctOption ? "bg-emerald-50 text-emerald-950" : "bg-rose-50 text-rose-950"}`}>
            <p className="font-black">{chosen === question.correctOption ? "Correct" : `Correct answer: ${question.correctOption}`}</p>
            {question.explanation && <p className="mt-2 text-sm leading-6">{question.explanation}</p>}
          </div>
          {question.examEdge && (
            <div className="rounded-2xl bg-blue-50 p-4 text-blue-950">
              <p className="font-black">Exam Edge</p>
              <p className="mt-1 text-sm leading-6">{question.examEdge}</p>
            </div>
          )}
          <button type="button" onClick={nextQuestion} className="w-full rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-black text-white hover:bg-blue-700">
            {index + 1 === questions.length ? "See Result" : "Next Question"}
          </button>
        </div>
      )}
    </div>
  );
}
