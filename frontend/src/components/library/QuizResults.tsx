"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2, MinusCircle, RotateCcw, Target, XCircle } from "lucide-react";
import { trackLearningEvent } from "@/lib/learning-events";
import { NEGATIVE_MARK, OPTION_KEYS, type LibraryQuiz, type QuizResult, type Responses } from "@/lib/library/quiz";
import type { LibraryLink } from "@/lib/library/books";
import McqBody, { SourceBadge, keySourceNote } from "./McqBody";

type Filter = "all" | "wrong" | "skipped" | "correct";

interface Props {
  quiz: LibraryQuiz;
  result: QuizResult;
  responses: Responses;
  durationMs: number | null;
  practice: LibraryLink;
  onRetry: () => void;
  titleId: string;
}

function formatMinutes(ms: number): string {
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  return m ? `${m} min ${s % 60} s` : `${s} s`;
}

const bandStyle = {
  strong: "bg-emerald-50 text-emerald-900 ring-emerald-200",
  good: "bg-blue-50 text-blue-900 ring-blue-200",
  building: "bg-amber-50 text-amber-900 ring-amber-200",
  start: "bg-slate-50 text-slate-800 ring-slate-200",
} as const;

export default function QuizResults({ quiz, result, responses, durationMs, practice, onRetry, titleId }: Props) {
  const [filter, setFilter] = useState<Filter>(result.wrong > 0 ? "wrong" : "all");
  const status = (n: number, answer: string) => (!responses[n] ? "skipped" : responses[n] === answer ? "correct" : "wrong");
  const shown = quiz.questions.filter((q) => filter === "all" || status(q.n, q.answer) === filter);
  const perQuestion = durationMs && result.attempted ? Math.round(durationMs / 1000 / result.attempted) : null;
  const filters: Array<[Filter, string, number]> = [
    ["all", "All", result.total],
    ["wrong", "Wrong", result.wrong],
    ["skipped", "Skipped", result.skipped],
    ["correct", "Correct", result.correct],
  ];

  return (
    <div className="space-y-6">
      {/* ── Score card ─────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-300">Score card</p>
          <h2 id={titleId} className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-1">
            <span className="font-mono text-5xl font-black tracking-tight">
              {result.correct}<span className="text-2xl text-slate-400">/{result.total}</span>
            </span>
            <span className="pb-1 text-lg font-bold text-slate-300">{result.scorePercent}%</span>
          </h2>
          <div className={`mt-4 rounded-2xl p-4 ring-1 ${bandStyle[result.verdict.band]}`}>
            <p className="font-bold">{result.verdict.headline}</p>
            <p className="mt-1 text-sm leading-6">{result.verdict.advice}</p>
          </div>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0">
          <div className="p-4">
            <dt className="flex items-center gap-1 text-xs font-semibold text-slate-500"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />Correct</dt>
            <dd className="mt-1 font-mono text-2xl font-black text-emerald-700">{result.correct}</dd>
          </div>
          <div className="p-4">
            <dt className="flex items-center gap-1 text-xs font-semibold text-slate-500"><XCircle className="h-3.5 w-3.5 text-red-600" aria-hidden="true" />Wrong</dt>
            <dd className="mt-1 font-mono text-2xl font-black text-red-700">{result.wrong}</dd>
          </div>
          <div className="p-4">
            <dt className="flex items-center gap-1 text-xs font-semibold text-slate-500"><MinusCircle className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />Skipped</dt>
            <dd className="mt-1 font-mono text-2xl font-black text-slate-700">{result.skipped}</dd>
          </div>
          <div className="p-4">
            <dt className="flex items-center gap-1 text-xs font-semibold text-slate-500"><Target className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />Accuracy</dt>
            <dd className="mt-1 font-mono text-2xl font-black text-slate-900">{result.attempted ? `${result.accuracy}%` : "—"}</dd>
          </div>
        </dl>
      </div>

      {/* ── Brief analysis ─────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-base font-bold text-slate-950">Brief analysis</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
          <li>
            <span className="font-semibold text-slate-900">With UPSC negative marking</span> (+1, −⅓ per wrong answer):{" "}
            <span className="font-mono font-bold text-slate-900">{result.netMarks} / {result.total}</span>
            {result.wrong > 0 && (() => {
              const lost = Math.round(result.wrong * NEGATIVE_MARK * 10) / 10;
              return <> — wrong answers cost you <span className="font-mono font-bold text-red-700">{lost}</span> {lost === 1 ? "mark" : "marks"}.</>;
            })()}
          </li>
          {result.bySource.pyq.total > 0 ? (
            <li>
              <span className="font-semibold text-slate-900">Real UPSC PYQs:</span>{" "}
              <span className="font-mono font-bold">{result.bySource.pyq.correct}/{result.bySource.pyq.total}</span>
              {" · "}
              <span className="font-semibold text-slate-900">DP Originals:</span>{" "}
              <span className="font-mono font-bold">{result.bySource.original.correct}/{result.bySource.original.total}</span>
            </li>
          ) : (
            <li>
              <span className="font-semibold text-slate-900">DP Originals:</span>{" "}
              <span className="font-mono font-bold">{result.bySource.original.correct}/{result.bySource.original.total}</span>
            </li>
          )}
          {result.trapsHit > 0 && (
            <li className="flex gap-2 text-amber-900">
              <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
              <span>You fell for {result.trapsHit} trap{result.trapsHit === 1 ? "" : "s"}. Read the orange “Trap” line under each wrong answer below.</span>
            </li>
          )}
          {durationMs !== null && (
            <li>
              <span className="font-semibold text-slate-900">Time:</span> {formatMinutes(durationMs)}
              {perQuestion !== null && perQuestion > 0 && <> · about {perQuestion} s per attempted question</>}
            </li>
          )}
        </ul>

        <h4 className="mt-6 text-sm font-bold text-slate-950">Topic-wise</h4>
        <ul className="mt-3 space-y-3">
          {result.topics.map((t) => {
            const tone = t.score >= 80 ? "bg-emerald-500" : t.score >= 50 ? "bg-blue-500" : "bg-red-500";
            return (
              <li key={t.id}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-semibold text-slate-800">{t.title}</span>
                  <span className="shrink-0 font-mono text-xs font-bold text-slate-600">{t.correct}/{t.total}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                    <div className={`h-2 rounded-full ${tone}`} style={{ width: `${Math.max(t.score, 4)}%` }} />
                  </div>
                  {t.correct < t.total && (
                    <a href={`#page-${t.page}`} className="shrink-0 text-xs font-semibold text-blue-700 hover:underline">
                      Revise p. {t.page}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {result.revise.length > 0 && (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="flex items-center gap-1.5 text-sm font-bold text-slate-900"><BookOpen className="h-4 w-4 text-blue-600" aria-hidden="true" />Revise these first</p>
            <ol className="mt-2 space-y-1 text-sm text-slate-700">
              {result.revise.slice(0, 3).map((t, i) => (
                <li key={t.id}>
                  {i + 1}. <a href={`#page-${t.page}`} className="font-semibold text-blue-700 hover:underline">{t.title}</a>{" "}
                  <span className="text-slate-500">({t.correct}/{t.total} right, from p. {t.page})</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={practice.href}
            onClick={() => trackLearningEvent("library_practice_cta_click", { book: quiz.slug, placement: "score_card" })}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-500"
          >
            {practice.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button type="button" onClick={onRetry}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Retry practice
          </button>
        </div>
      </div>

      {/* ── Answer key & review ────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-base font-bold text-slate-950">Answer key &amp; traps</h3>
        <div role="tablist" aria-label="Filter questions" className="mt-3 flex flex-wrap gap-2">
          {filters.map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              onClick={() => setFilter(key)}
              disabled={count === 0}
              className={`min-h-10 rounded-full px-3.5 text-xs font-bold transition disabled:opacity-40 ${
                filter === key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {label} · {count}
            </button>
          ))}
        </div>

        <ol className="mt-5 space-y-5">
          {shown.map((q) => {
            const s = status(q.n, q.answer);
            const yours = responses[q.n];
            return (
              <li key={q.n} className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-black text-slate-900">Q{q.n}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                    s === "correct" ? "bg-emerald-100 text-emerald-800" : s === "wrong" ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-600"
                  }`}>
                    {s}
                  </span>
                </div>
                <div className="mt-3"><SourceBadge q={q} /></div>
                <div className="mt-3"><McqBody q={q} /></div>
                <ul className="mt-4 grid gap-2">
                  {OPTION_KEYS.map((k) => {
                    const isAnswer = k === q.answer;
                    const isYours = k === yours;
                    const tone = isAnswer
                      ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                      : isYours
                        ? "border-red-300 bg-red-50 text-red-900"
                        : "border-slate-200 text-slate-600";
                    return (
                      <li key={k} className={`flex items-start gap-3 rounded-xl border px-3 py-2 text-sm leading-6 ${tone}`}>
                        <span className="font-mono font-bold">{k}</span>
                        <span className="flex-1">{q.options[k]}</span>
                        {isAnswer && <span className="shrink-0 text-xs font-bold">Correct</span>}
                        {isYours && !isAnswer && <span className="shrink-0 text-xs font-bold">Your answer</span>}
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 space-y-2 text-sm leading-6">
                  <p className="text-slate-800"><span className="font-bold">Why {q.answer}:</span> {q.explanation}</p>
                  {q.trap && (
                    <p className="text-amber-800"><span className="font-bold">Trap:</span> {q.trap}</p>
                  )}
                  <p className="text-xs text-slate-500">
                    {keySourceNote(q.keySource)}{" "}
                    <a href={`#page-${q.page}`} className="font-semibold text-blue-700 hover:underline">Revise on p. {q.page}</a>
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
