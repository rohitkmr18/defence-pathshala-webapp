"use client";

import { useState } from "react";
import Link from "next/link";
import type { QuizQuestion } from "@/lib/cyclone-quiz";

export default function ResourceQuiz({ title, questions }: { title: string; questions: readonly QuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const current = questions[index];
  const selected = answers[current.id];
  const complete = Object.keys(answers).length === questions.length;
  const score = questions.reduce((sum,q) => sum + Number(answers[q.id] === q.answer), 0);
  const reset = () => {setAnswers({}); setIndex(0); setFinished(false);};

  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Defence Pathshala · Original practice quiz</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">Five exam-style questions · No login required · No negative marking</p>
      {finished ? (
        <div aria-live="polite" className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Your score</p>
          <p className="mt-2 text-5xl font-black text-blue-700">{score}/{questions.length}</p>
          <p className="mt-2 text-sm text-slate-600">{score === questions.length ? "Excellent work!" : "Review the explanations, then try again."}</p>
          <div className="mt-6 space-y-4">
            {questions.map((q, i) => (
              <div key={q.id} className="rounded-xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{i + 1}. {q.prompt}</p>
                <p className="mt-2 text-sm text-slate-700">Your answer: {q.options[answers[q.id]] ?? "Not answered"}</p>
                <p className="mt-1 text-sm font-medium text-blue-700">Correct: {q.options[q.answer]}</p>
                <p className="mt-2 text-sm text-slate-600">{q.explanation}</p>
              </div>
            ))}
          </div>
          <button onClick={reset} className="mt-6 w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">Try again</button>
          <Link className="mt-4 block text-center text-sm font-semibold text-blue-700" href="/dashboard">Explore more PYQs on Defence Pathshala →</Link>
        </div>
      ) : (
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
            <span>Question {index + 1} of {questions.length}</span>
            <span>{Math.round(Object.keys(answers).length / questions.length * 100)}% answered</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-blue-600 transition-all" style={{ width: `${Object.keys(answers).length / questions.length * 100}%` }} />
          </div>
          <h2 className="mt-7 text-lg font-bold leading-relaxed text-slate-900">{current.prompt}</h2>
          <fieldset className="mt-5 space-y-3">
            <legend className="sr-only">Choose one answer</legend>
            {current.options.map((option, optionIndex) => (
              <label key={optionIndex} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition ${selected === optionIndex ? "border-blue-600 bg-blue-50 text-blue-900" : "border-slate-200 text-slate-800 hover:border-blue-300"}`}>
                <input className="h-4 w-4 shrink-0 accent-blue-700" type="radio" name={current.id} value={optionIndex} checked={selected === optionIndex} onChange={() => setAnswers(previous => ({...previous, [current.id]: optionIndex}))}/>
                <span>{String.fromCharCode(65 + optionIndex)}. {option}</span>
              </label>
            ))}
          </fieldset>
          <div className="mt-7 flex gap-3">
            <button type="button" onClick={() => setIndex(i => Math.max(0, i-1))} disabled={index === 0} className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 disabled:opacity-40">Back</button>
            {index < questions.length - 1 ? (
              <button type="button" onClick={() => setIndex(i => i+1)} disabled={selected === undefined} className="flex-1 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Next question</button>
            ) : (
              <button type="button" onClick={() => setFinished(true)} disabled={!complete} className="flex-1 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">See results</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
