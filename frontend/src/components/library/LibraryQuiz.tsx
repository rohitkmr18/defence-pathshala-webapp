"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck, Grid3x3, RotateCcw, Timer } from "lucide-react";
import { trackLearningEvent } from "@/lib/learning-events";
import { OPTION_KEYS, scoreQuiz, type LibraryQuiz as Quiz, type OptionKey, type Responses } from "@/lib/library/quiz";
import McqBody, { SourceBadge } from "./McqBody";
import QuizResults from "./QuizResults";
import type { LibraryLink } from "@/lib/library/books";

interface Saved {
  responses: Responses;
  index: number;
  startedAt: number | null;
  submittedAt: number | null;
}

const EMPTY: Saved = { responses: {}, index: 0, startedAt: null, submittedAt: null };
const storageKey = (slug: string) => `dp_library_quiz:${slug}`;

function load(slug: string): Saved {
  try {
    const raw = localStorage.getItem(storageKey(slug));
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Saved>;
    return { ...EMPTY, ...parsed, responses: parsed.responses ?? {} };
  } catch {
    return EMPTY;
  }
}

function save(slug: string, state: Saved) {
  try {
    localStorage.setItem(storageKey(slug), JSON.stringify(state));
  } catch {
    /* Storage can be unavailable (private mode); the attempt still works in memory. */
  }
}

function formatDuration(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

interface Props {
  quiz: Quiz;
  bookTitle: string;
  pyqCount: number;
  practice: LibraryLink;
  anchorId: string;
}

export default function LibraryQuiz({ quiz, bookTitle, pyqCount, practice, anchorId }: Props) {
  const total = quiz.questions.length;
  const [state, setState] = useState<Saved>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const topRef = useRef<HTMLDivElement>(null);

  // Restore an in-progress or finished attempt from this browser.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from browser storage
    setState(load(quiz.slug));
    setHydrated(true);
  }, [quiz.slug]);

  useEffect(() => {
    if (hydrated) save(quiz.slug, state);
  }, [hydrated, quiz.slug, state]);

  const inProgress = state.startedAt !== null && state.submittedAt === null;
  useEffect(() => {
    if (!inProgress) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [inProgress]);

  const result = useMemo(() => (state.submittedAt ? scoreQuiz(quiz, state.responses) : null), [quiz, state.responses, state.submittedAt]);
  const answeredCount = Object.values(state.responses).filter(Boolean).length;
  const question = quiz.questions[Math.min(state.index, total - 1)];
  const picked = state.responses[question.n];

  const scrollTop = useCallback(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  function start() {
    setState({ ...EMPTY, startedAt: Date.now() });
    trackLearningEvent("library_quiz_start", { book: quiz.slug, questions: total });
  }

  function choose(key: OptionKey) {
    setState((s) => ({ ...s, responses: { ...s.responses, [question.n]: key } }));
    setConfirmSubmit(false);
  }

  function clear() {
    setState((s) => {
      const responses = { ...s.responses };
      delete responses[question.n];
      return { ...s, responses };
    });
  }

  function go(index: number) {
    setState((s) => ({ ...s, index: Math.min(Math.max(index, 0), total - 1) }));
    setPaletteOpen(false);
    setConfirmSubmit(false);
    scrollTop();
  }

  function submit() {
    if (answeredCount < total && !confirmSubmit) {
      setConfirmSubmit(true);
      return;
    }
    const submittedAt = Date.now();
    const scored = scoreQuiz(quiz, state.responses);
    setState((s) => ({ ...s, submittedAt }));
    setConfirmSubmit(false);
    trackLearningEvent("library_quiz_submit", {
      book: quiz.slug,
      correct: scored.correct,
      wrong: scored.wrong,
      skipped: scored.skipped,
      score_percent: scored.scorePercent,
      seconds: state.startedAt ? Math.round((submittedAt - state.startedAt) / 1000) : undefined,
    });
    scrollTop();
  }

  function retry() {
    trackLearningEvent("library_quiz_retry", { book: quiz.slug });
    setState({ ...EMPTY, startedAt: Date.now() });
    scrollTop();
  }

  return (
    <section id={anchorId} aria-labelledby={`${anchorId}-title`} className="mx-auto mt-10 max-w-3xl scroll-mt-4">
      <div ref={topRef} className="scroll-mt-4" />

      {/* ── Intro ─────────────────────────────────────────────────────── */}
      {!inProgress && !result && (
        <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
            <ClipboardCheck className="h-4 w-4" aria-hidden="true" /> MCQ practice
          </p>
          <h2 id={`${anchorId}-title`} className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Test yourself on {bookTitle}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {total} questions — {pyqCount} real UPSC PYQs and {total - pyqCount} DP Originals. Answer at your pace, then get a score card,
            topic-wise analysis and the answer key with traps.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <li className="rounded-full bg-white/10 px-3 py-1">No sign-in needed</li>
            <li className="rounded-full bg-white/10 px-3 py-1">UPSC marking shown: +1 / −⅓</li>
            <li className="rounded-full bg-white/10 px-3 py-1">Answers stay hidden until you submit</li>
          </ul>
          <button
            type="button"
            onClick={start}
            disabled={!hydrated}
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            Start practice <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* ── Attempt ───────────────────────────────────────────────────── */}
      {inProgress && (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 sm:px-6">
            <h2 id={`${anchorId}-title`} className="text-sm font-bold text-slate-900">
              Question {state.index + 1} <span className="font-medium text-slate-500">of {total}</span>
            </h2>
            <span className="ml-auto inline-flex items-center gap-1 font-mono text-xs font-semibold text-slate-500" aria-label="Time taken">
              <Timer className="h-3.5 w-3.5" aria-hidden="true" /> {formatDuration(now - (state.startedAt ?? now))}
            </span>
            <button
              type="button"
              onClick={() => setPaletteOpen((v) => !v)}
              aria-expanded={paletteOpen}
              aria-controls={`${anchorId}-palette`}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:border-blue-300"
            >
              <Grid3x3 className="h-4 w-4 text-blue-600" aria-hidden="true" /> {answeredCount}/{total}
            </button>
          </div>
          <div className="h-1 bg-slate-100" aria-hidden="true">
            <div className="h-1 bg-blue-600 transition-all" style={{ width: `${(answeredCount / total) * 100}%` }} />
          </div>

          {paletteOpen && (
            <nav id={`${anchorId}-palette`} aria-label="Jump to question" className="border-b border-slate-100 px-4 py-4 sm:px-6">
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
                {quiz.questions.map((q, i) => {
                  const answered = Boolean(state.responses[q.n]);
                  const here = i === state.index;
                  return (
                    <button
                      key={q.n}
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Question ${q.n}${answered ? ", answered" : ", not answered"}`}
                      aria-current={here ? "step" : undefined}
                      className={`h-10 rounded-lg font-mono text-sm font-bold transition ${
                        answered ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      } ${here ? "ring-2 ring-blue-300 ring-offset-1" : ""}`}
                    >
                      {q.n}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-slate-500">Blue = answered · Grey = not answered</p>
            </nav>
          )}

          <div className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
            <SourceBadge q={question} />
            <McqBody q={question} />
            <fieldset>
              <legend className="sr-only">Options for question {question.n}</legend>
              <div className="grid gap-2.5">
                {OPTION_KEYS.map((k) => {
                  const active = picked === k;
                  return (
                    <label
                      key={k}
                      className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm leading-6 transition ${
                        active ? "border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600" : "border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${anchorId}-q${question.n}`}
                        value={k}
                        checked={active}
                        onChange={() => choose(k)}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                          active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                        aria-hidden="true"
                      >
                        {k}
                      </span>
                      <span className="pt-0.5">{question.options[k]}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-4 py-4 sm:px-6">
            <button type="button" onClick={() => go(state.index - 1)} disabled={state.index === 0}
              className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
            </button>
            {picked && (
              <button type="button" onClick={clear}
                className="inline-flex min-h-11 items-center gap-1 rounded-xl px-3 text-sm font-semibold text-slate-500 hover:text-slate-800">
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear
              </button>
            )}
            <div className="ml-auto flex gap-2">
              {state.index < total - 1 ? (
                <button type="button" onClick={() => go(state.index + 1)}
                  className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-500">
                  {picked ? "Next" : "Skip"} <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
              <button type="button" onClick={submit}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-500">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {confirmSubmit ? "Submit anyway" : "Submit"}
              </button>
            </div>
            {confirmSubmit && (
              <p role="alert" className="w-full rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
                {total - answeredCount} question{total - answeredCount === 1 ? " is" : "s are"} unanswered and will count as skipped. Use the{" "}
                <button type="button" className="font-bold underline" onClick={() => { setConfirmSubmit(false); setPaletteOpen(true); }}>
                  question grid
                </button>{" "}
                to go back, or submit anyway.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Results ───────────────────────────────────────────────────── */}
      {result && (
        <QuizResults
          quiz={quiz}
          result={result}
          responses={state.responses}
          durationMs={state.startedAt && state.submittedAt ? state.submittedAt - state.startedAt : null}
          practice={practice}
          onRetry={retry}
          titleId={`${anchorId}-title`}
        />
      )}
    </section>
  );
}
