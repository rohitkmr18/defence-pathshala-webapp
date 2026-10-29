"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import AfcatVisualQuestion from "@/components/afcat/AfcatVisualQuestion";
import type {
  AfcatDisplayQuestion,
  AfcatChoice,
} from "@/lib/afcat/visual-types";
import {
  AFCAT_SECTIONS,
  type AfcatSection,
  type AfcatSectionSummary,
} from "@/lib/afcat/results-analytics";
type Test = {
  id: string;
  title: string;
  expected_questions: number;
  duration_seconds: number;
};
type Answer = { selected: AfcatChoice["key"] | null; markedForReview: boolean };
type Paper = {
  serverNow: string;
  session: {
    id: string;
    title: string;
    status: string;
    deadline: string;
    expired: boolean;
  };
  questions: (AfcatDisplayQuestion & { section: AfcatSection })[];
  responses: {
    question_id: string;
    selected_option: AfcatChoice["key"] | null;
    marked_for_review: boolean;
  }[];
};
type Result = {
  score: number;
  max_marks: number;
  correct_count: number;
  incorrect_count: number;
  unanswered_count: number;
};
async function api(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}
const button =
  "min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:border-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-40 disabled:cursor-not-allowed";
export default function AfcatLab() {
  const [tests, setTests] = useState<Test[]>([]),
    [paper, setPaper] = useState<Paper | null>(null);
  const [index, setIndex] = useState(0),
    [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [visited, setVisited] = useState<number[]>([]),
    [error, setError] = useState("");
  const [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [submitting, setSubmitting] = useState(false);
  const [online, setOnline] = useState(true),
    [palette, setPalette] = useState(false);
  const [result, setResult] = useState<Result | null>(null),
    [sections, setSections] = useState<AfcatSectionSummary[]>([]);
  const [left, setLeft] = useState(0),
    [saveState, setSaveState] = useState("All responses saved");
  const lock = useRef(false),
    autoSubmitted = useRef(false);
  const clock = useRef({ remaining: 0, at: 0 });
  const confirmation = useRef<HTMLDialogElement>(null),
    title = useRef<HTMLDivElement>(null);
  const load = useCallback(async (id: string) => {
    const data: Paper = await api(`/api/afcat/sessions/${id}`);
    clock.current = {
      remaining: Math.max(
        0,
        Date.parse(data.session.deadline) - Date.parse(data.serverNow),
      ),
      at: performance.now(),
    };
    setLeft(Math.ceil(clock.current.remaining / 1000));
    setPaper(data);
    setAnswers(
      Object.fromEntries(
        data.responses.map((r) => [
          r.question_id,
          { selected: r.selected_option, markedForReview: r.marked_for_review },
        ]),
      ),
    );
    let position = 0,
      seen = [0];
    try {
      const saved = JSON.parse(
        sessionStorage.getItem(`afcat-view:${id}`) || "null",
      );
      if (
        saved &&
        Number.isInteger(saved.index) &&
        saved.index >= 0 &&
        saved.index < data.questions.length
      )
        position = saved.index;
      if (Array.isArray(saved?.visited))
        seen = saved.visited.filter(
          (n: number) =>
            Number.isInteger(n) && n >= 0 && n < data.questions.length,
        );
    } catch {
      /* Navigation memory is optional. */
    }
    setIndex(position);
    setVisited([...new Set([...seen, position])]);
    window.history.replaceState(null, "", `?session=${encodeURIComponent(id)}`);
    if (data.session.status !== "IN_PROGRESS") {
      const completed = await api(`/api/afcat/sessions/${id}/result`);
      setResult(completed.summary);
      setSections(completed.sections ?? []);
    }
  }, []);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    (id ? load(id) : api("/api/afcat/tests").then((x) => setTests(x.tests)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    const timer = window.setInterval(
      () =>
        setLeft(
          Math.max(
            0,
            Math.ceil(
              (clock.current.remaining -
                (performance.now() - clock.current.at)) /
                1000,
            ),
          ),
        ),
      1000,
    );
    return () => {
      clearInterval(timer);
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, [load]);
  useEffect(() => {
    if (!paper) return;
    try {
      sessionStorage.setItem(
        `afcat-view:${paper.session.id}`,
        JSON.stringify({ index, visited }),
      );
    } catch {
      /* Optional. */
    }
  }, [paper, index, visited]);
  const submit = useCallback(async () => {
    if (!paper || lock.current) return;
    lock.current = true;
    setSubmitting(true);
    confirmation.current?.close();
    try {
      await api(`/api/afcat/sessions/${paper.session.id}/submit`, {
        method: "POST",
      });
      const completed = await api(
        `/api/afcat/sessions/${paper.session.id}/result`,
      );
      setResult(completed.summary);
      setSections(completed.sections ?? []);
      setPaper((old) =>
        old
          ? { ...old, session: { ...old.session, status: completed.status } }
          : old,
      );
      setError("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Submission failed. Retry safely.",
      );
    } finally {
      lock.current = false;
      setSubmitting(false);
    }
  }, [paper]);
  useEffect(() => {
    if (
      paper?.session.status === "IN_PROGRESS" &&
      left === 0 &&
      online &&
      !busy &&
      !loading &&
      !autoSubmitted.current
    ) {
      autoSubmitted.current = true;
      void submit();
    }
  }, [paper, left, online, busy, loading, submit]);
  useEffect(() => {
    if (!paper || paper.session.status !== "IN_PROGRESS") return;
    let alive = true;
    const sync = async () => {
      if (document.visibilityState !== "visible" || lock.current) return;
      try {
        const fresh: Paper = await api(
          `/api/afcat/sessions/${paper.session.id}`,
        );
        if (!alive || lock.current) return;
        clock.current = {
          remaining: Math.max(
            0,
            Date.parse(fresh.session.deadline) - Date.parse(fresh.serverNow),
          ),
          at: performance.now(),
        };
        setLeft(Math.ceil(clock.current.remaining / 1000));
        if (fresh.session.status !== "IN_PROGRESS")
          await load(paper.session.id);
      } catch {
        /* The next save still verifies auth and database time. */
      }
    };
    const guard = (event: BeforeUnloadEvent) => {
      if (lock.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("focus", sync);
    window.addEventListener("online", sync);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("beforeunload", guard);
    return () => {
      alive = false;
      window.removeEventListener("focus", sync);
      window.removeEventListener("online", sync);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("beforeunload", guard);
    };
  }, [paper, load]);
  async function start(testId: string) {
    if (lock.current) return;
    lock.current = true;
    setLoading(true);
    setError("");
    try {
      const started = await api("/api/afcat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId }),
      });
      await load(started.sessionId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to start test");
    } finally {
      lock.current = false;
      setLoading(false);
    }
  }
  const question = paper?.questions[index];
  const active = paper?.session.status === "IN_PROGRESS" && left > 0 && online;
  async function save(id: string, answer: Answer) {
    if (!paper || !active || lock.current) return;
    lock.current = true;
    setBusy(true);
    setSaveState("Saving response…");
    setError("");
    try {
      await api(`/api/afcat/sessions/${paper.session.id}/responses`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: id, ...answer }),
      });
      setAnswers((old) => ({ ...old, [id]: answer }));
      setSaveState("All responses saved");
    } catch (e) {
      setSaveState("Save not confirmed — reload to recover");
      setError(
        `${e instanceof Error ? e.message : "Save failed"}. Reload the saved attempt before continuing; a timed-out request may have reached the server.`,
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function navigate(next: number) {
    if (lock.current || !paper || next < 0 || next >= paper.questions.length)
      return;
    setIndex(next);
    setVisited((old) => [...new Set([...old, next])]);
    setPalette(false);
    title.current?.focus();
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  const answered = Object.values(answers).filter(
      (a) => a.selected !== null,
    ).length,
    marked = Object.values(answers).filter((a) => a.markedForReview).length;
  const blocked =
    busy || submitting || saveState.startsWith("Save not confirmed");
  const time = `${String(Math.floor(left / 3600)).padStart(2, "0")}:${String(Math.floor((left % 3600) / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900" style={{ overflowX: "clip", overflowY: "visible" }}>
      <header className="sticky top-0 z-30 bg-[#081b35] text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-300">
              Defence Pathshala · QA staging
            </p>
            <h1 className="truncate text-base font-bold sm:text-xl">
              AFCAT Test Player
            </h1>
          </div>
          {paper && (
            <div
              className={`shrink-0 rounded-xl border px-3 py-2 ${left <= 300 && !result ? "border-amber-400 text-amber-200" : "border-white/15 bg-white/5"}`}
            >
              <p className="text-[10px] uppercase tracking-wider">
                {result ? "Test complete" : "Time remaining"}
              </p>
              <span
                role="timer"
                aria-label={`Time remaining ${time}`}
                className="font-mono text-lg font-bold tabular-nums sm:text-2xl"
              >
                {time}
              </span>
            </div>
          )}
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-5 pb-32 sm:px-6">
        {!online && (
          <div role="alert" className="mb-4 rounded-xl bg-amber-50 p-4">
            You are offline. Responses are paused; the timer continues.
            Reconnect to continue.
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="mb-4 space-y-2 rounded-xl border border-amber-300 bg-amber-50 p-4"
          >
            <p>{error}</p>
            {/sign in required/i.test(error) ? (
              <Link
                className="font-semibold text-blue-700 underline"
                href={`/auth/login?next=${encodeURIComponent(`/afcat/lab${typeof window !== "undefined" ? window.location.search : ""}`)}`}
              >
                Sign in with Defence Pathshala
              </Link>
            ) : (
              <button
                className={button}
                onClick={() => window.location.reload()}
              >
                Reload saved attempt
              </button>
            )}
          </div>
        )}
        {loading && (
          <p role="status" className="py-8 text-slate-600">
            Loading your examination…
          </p>
        )}
        {!paper ? (
          <section className="mx-auto max-w-2xl space-y-4 py-8" style={{ maxWidth: "42rem" }}>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
              Your examination workspace
            </p>
            <h2 className="text-3xl font-bold">Ready to begin?</h2>
            <p className="text-slate-600">
              Synthetic QA questions only. This isolated test does not measure
              real AFCAT preparation.
            </p>
            <div className="flex gap-5 text-sm font-semibold">
              <span>+3 correct</span>
              <span>−1 incorrect</span>
              <span>0 unanswered</span>
            </div>
            {!loading && tests.length === 0 && !error && (
              <p>No staging tests available.</p>
            )}
            {tests.map((t) => (
              <button
                key={t.id}
                disabled={loading}
                onClick={() => void start(t.id)}
                className="block w-full rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm hover:border-blue-500 disabled:opacity-50"
              >
                <strong className="block text-lg">{t.title}</strong>
                <span className="mt-2 block text-sm text-slate-500">
                  {t.expected_questions} questions ·{" "}
                  {Math.round(t.duration_seconds / 60)} minutes
                </span>
                <span className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">
                  Start / resume test →
                </span>
              </button>
            ))}
          </section>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {paper.session.title}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {answered} of {paper.questions.length} answered · {marked}{" "}
                  marked for review
                </p>
              </div>
              <button
                className={`${button} lg:hidden`}
                aria-expanded={palette}
                aria-controls="question-palette"
                onClick={() => setPalette(!palette)}
              >
                {palette ? "Close palette" : "Question palette"}
              </button>
            </div>
            <nav
              aria-label="Exam sections"
              className="mb-5 grid grid-cols-2 gap-2 lg:grid-cols-4"
            >
              {AFCAT_SECTIONS.map((s) => {
                const rows = paper.questions.filter((q) => q.section === s.key);
                return rows.length ? (
                  <button
                    key={s.key}
                    disabled={blocked}
                    aria-current={
                      question?.section === s.key ? "true" : undefined
                    }
                    onClick={() =>
                      navigate(
                        paper.questions.findIndex((q) => q.section === s.key),
                      )
                    }
                    className={`min-h-16 rounded-xl border p-3 text-left text-xs sm:text-sm ${question?.section === s.key ? "border-blue-600 bg-blue-50 text-blue-900" : "border-slate-200 bg-white"}`}
                  >
                    <strong className="block">{s.label}</strong>
                    <span className="mt-1 block text-xs">
                      {rows.filter((q) => answers[q.id]?.selected).length}/
                      {rows.length} answered
                    </span>
                  </button>
                ) : null;
              })}
            </nav>
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_290px]">
              <div className="min-w-0 space-y-4">
                {result && (
                  <section
                    aria-label="Exam results"
                    className="rounded-2xl border border-blue-200 bg-white p-6"
                  >
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                      Test complete · {paper.session.status}
                    </p>
                    <h2 className="my-3 text-3xl font-bold">
                      {result.score}{" "}
                      <span className="text-lg text-slate-500">
                        / {result.max_marks} marks
                      </span>
                    </h2>
                    <p>
                      {result.correct_count} correct · {result.incorrect_count}{" "}
                      incorrect · {result.unanswered_count} unanswered
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {result.correct_count + result.incorrect_count
                        ? Math.round(
                            (result.correct_count /
                              (result.correct_count + result.incorrect_count)) *
                              10000,
                          ) / 100
                        : 0}
                      % accuracy among attempted questions
                    </p>
                    <div
                      aria-label="Section breakdown"
                      className="mt-5 grid gap-3 sm:grid-cols-2"
                    >
                      {sections.map((s) => (
                        <div
                          key={s.section}
                          className="rounded-xl bg-slate-50 p-4"
                        >
                          <strong className="text-sm">{s.label}</strong>
                          <p className="mt-2 font-bold">
                            {s.marks}/{s.maximumMarks} marks
                          </p>
                          <p className="text-xs text-slate-600">
                            {s.correct} correct · {s.incorrect} incorrect ·{" "}
                            {s.unanswered} unanswered
                          </p>
                          <p className="mt-1 text-xs">
                            {s.accuracyPercent}% accuracy
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-xs text-slate-500">
                      Synthetic QA only. Scores are calculated by the server.
                    </p>
                  </section>
                )}
                <div ref={title} tabIndex={-1} className="outline-none">
                  <div className="mb-3 flex justify-between text-xs font-semibold text-slate-500">
                    <span>
                      QUESTION {index + 1} / {paper.questions.length}
                    </span>
                    <span>+3 / −1</span>
                  </div>
                  {question && (
                    <AfcatVisualQuestion
                      key={question.id}
                      question={question}
                      selected={answers[question.id]?.selected ?? null}
                      disabled={!active || blocked}
                      onSelect={(selected) =>
                        void save(question.id, {
                          selected,
                          markedForReview:
                            answers[question.id]?.markedForReview ?? false,
                        })
                      }
                    />
                  )}
                </div>
                {question && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={button}
                      disabled={!active || blocked}
                      aria-pressed={
                        answers[question.id]?.markedForReview ?? false
                      }
                      onClick={() =>
                        void save(question.id, {
                          selected: answers[question.id]?.selected ?? null,
                          markedForReview:
                            !answers[question.id]?.markedForReview,
                        })
                      }
                    >
                      {answers[question.id]?.markedForReview
                        ? "Unmark Review"
                        : "Mark for Review"}
                    </button>
                    <button
                      className={button}
                      disabled={
                        !active || blocked || !answers[question.id]?.selected
                      }
                      onClick={() =>
                        void save(question.id, {
                          selected: null,
                          markedForReview:
                            answers[question.id]?.markedForReview ?? false,
                        })
                      }
                    >
                      Clear Response
                    </button>
                  </div>
                )}
              </div>
              <aside
                id="question-palette"
                className={`${palette ? "order-first block lg:order-none" : "hidden"} rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-24 lg:block`}
              >
                <h2 className="font-bold">Question palette</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Select a number to jump.
                </p>
                <div className="my-4 grid grid-cols-2 gap-2 text-[11px]">
                  <span>✓ Answered</span>
                  <span>○ Visited, unanswered</span>
                  <span>◆ Marked for review</span>
                  <span>· Not visited</span>
                </div>
                <nav
                  aria-label="Question navigation"
                  className="grid max-h-[55vh] grid-cols-5 gap-2 overflow-y-auto p-1"
                >
                  {paper.questions.map((q, i) => {
                    const a = answers[q.id];
                    const state = a?.markedForReview
                      ? a.selected
                        ? "answered, marked for review"
                        : "unanswered, marked for review"
                      : a?.selected
                        ? "answered"
                        : visited.includes(i)
                          ? "visited, unanswered"
                          : "not visited";
                    return (
                      <button
                        key={q.id}
                        disabled={blocked}
                        aria-label={`Question ${i + 1}, ${state}`}
                        aria-current={i === index ? "step" : undefined}
                        onClick={() => navigate(i)}
                        className={`relative min-h-11 rounded-lg border text-sm font-semibold focus-visible:outline-2 focus-visible:outline-blue-600 ${i === index ? "ring-2 ring-blue-600 ring-offset-1" : ""} ${a?.markedForReview ? "border-violet-300 bg-violet-100 text-violet-900" : a?.selected ? "border-emerald-300 bg-emerald-50 text-emerald-900" : visited.includes(i) ? "border-amber-300 bg-amber-50 text-amber-900" : "border-slate-200 bg-slate-50 text-slate-600"}`}
                      >
                        {i + 1}
                        <span
                          aria-hidden="true"
                          className="absolute bottom-0 right-1 text-[9px]"
                        >
                          {a?.markedForReview
                            ? `◆${a.selected ? "✓" : ""}`
                            : a?.selected
                              ? "✓"
                              : visited.includes(i)
                                ? "○"
                                : "·"}
                        </span>
                      </button>
                    );
                  })}
                </nav>
                {!result && (
                  <button
                    className="mt-5 min-h-11 w-full rounded-xl bg-[#081b35] px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
                    disabled={blocked || !online}
                    onClick={() => confirmation.current?.showModal()}
                  >
                    Submit test
                  </button>
                )}
              </aside>
            </div>
            <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-sm sm:px-4 sm:py-3">
              <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
                <p
                  role="status"
                  className="w-full text-center text-xs text-slate-500 sm:w-auto sm:text-left"
                >
                  {submitting
                    ? "Submitting securely…"
                    : !result && left === 0
                      ? "Time expired. Submit to retrieve your result."
                      : saveState}
                </p>
                <button
                  className={button}
                  disabled={index === 0 || blocked}
                  onClick={() => navigate(index - 1)}
                >
                  Previous
                </button>
                <div className="flex min-w-0 flex-1 justify-end gap-2 sm:flex-none">
                  {!result && (
                    <button
                      className={`${button} min-w-0 px-3 lg:hidden`}
                      disabled={blocked || !online}
                      onClick={() => confirmation.current?.showModal()}
                    >
                      Submit
                    </button>
                  )}
                  <button
                    className="min-h-11 min-w-0 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-40 sm:px-5"
                    disabled={index === paper.questions.length - 1 || blocked}
                    onClick={() => navigate(index + 1)}
                  >
                    {result ? "Next" : "Save & Next"}
                  </button>
                </div>
              </div>
            </footer>
            <dialog
              ref={confirmation}
              aria-labelledby="submit-title"
              className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl p-6 text-slate-900 shadow-xl backdrop:bg-slate-950/60"
            >
              <h2 id="submit-title" className="text-xl font-bold">
                Submit your test?
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                {answered} answered · {paper.questions.length - answered}{" "}
                unanswered · {marked} marked for review.
              </p>
              <p className="mt-3 text-sm">
                Marked answers are scored normally. You cannot change responses
                after submission.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  autoFocus
                  className={button}
                  onClick={() => confirmation.current?.close()}
                >
                  Keep reviewing
                </button>
                <button
                  className="min-h-11 rounded-xl bg-blue-600 px-4 font-semibold text-white"
                  onClick={() => void submit()}
                >
                  Confirm submission
                </button>
              </div>
            </dialog>
          </>
        )}
      </div>
    </main>
  );
}
