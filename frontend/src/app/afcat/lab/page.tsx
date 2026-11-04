"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import AfcatShareButton from "@/components/afcat/AfcatShareButton";
import { trackAfcatFunnel } from "@/lib/afcat/funnel";
import AfcatVisualQuestion from "@/components/afcat/AfcatVisualQuestion";
import AfcatResultAnalysis, {
  type AfcatResultReport,
} from "@/components/afcat/AfcatResultAnalysis";
import type {
  AfcatDisplayQuestion,
  AfcatChoice,
} from "@/lib/afcat/visual-types";
import {
  AFCAT_SECTIONS,
  type AfcatSection,
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
    time_spent_seconds?: number;
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
  const [report, setReport] = useState<AfcatResultReport | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [left, setLeft] = useState(0),
    [saveState, setSaveState] = useState("All responses saved");
  const lock = useRef(false),
    autoSubmitted = useRef(false);
  const clock = useRef({ remaining: 0, at: 0 });
  // Per-question time is for post-test analysis only; scoring never uses it.
  const spent = useRef<Record<string, number>>({}),
    sent = useRef<Record<string, number>>({}),
    viewing = useRef<{ id: string; at: number } | null>(null),
    answersRef = useRef<Record<string, Answer>>({}),
    indexRef = useRef(0);
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
    spent.current = Object.fromEntries(
      data.responses.map((r) => [r.question_id, r.time_spent_seconds ?? 0]),
    );
    sent.current = { ...spent.current };
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
      setReport(completed);
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
      // Record time on the question being viewed; best effort and never blocks submission.
      const view = viewing.current;
      if (view) {
        const now = performance.now();
        spent.current[view.id] = (spent.current[view.id] ?? 0) + (now - view.at) / 1000;
        view.at = now;
      }
      const last = paper.questions[indexRef.current];
      if (last) {
        const total = Math.round(spent.current[last.id] ?? 0);
        if (total - (sent.current[last.id] ?? 0) >= 1) {
          sent.current[last.id] = total;
          const a = answersRef.current[last.id] ?? { selected: null, markedForReview: false };
          try {
            await api(`/api/afcat/sessions/${paper.session.id}/responses`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ questionId: last.id, ...a, timeSpentSeconds: total }),
            });
          } catch {
            /* Timing is optional analysis data. */
          }
        }
      }
      await api(`/api/afcat/sessions/${paper.session.id}/submit`, {
        method: "POST",
      });
      const completed = await api(
        `/api/afcat/sessions/${paper.session.id}/result`,
      );
      setResult(completed.summary);
      setReport(completed);
      trackAfcatFunnel("afcat_mock_submit", { status: String(completed.status) }, `submit:${paper.session.id}`);
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
      trackAfcatFunnel("afcat_mock_start", { resumed: Boolean(started.resumed) }, `start:${started.sessionId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to start test");
    } finally {
      lock.current = false;
      setLoading(false);
    }
  }
  const resultSessionId = result ? paper?.session.id : undefined;
  useEffect(() => {
    if (resultSessionId) trackAfcatFunnel("afcat_result_view", {}, `result:${resultSessionId}`);
  }, [resultSessionId]);
  const question = paper?.questions[index];
  const active = paper?.session.status === "IN_PROGRESS" && left > 0 && online;
  // Refs mirror render state for effect cleanups; written after commit, never during render.
  useEffect(() => {
    answersRef.current = answers;
    indexRef.current = index;
  }, [answers, index]);
  /** Close the open viewing interval and add it to that question's total. */
  const checkpoint = useCallback(() => {
    const view = viewing.current;
    if (!view) return;
    const now = performance.now();
    spent.current[view.id] =
      (spent.current[view.id] ?? 0) + (now - view.at) / 1000;
    view.at = now;
  }, []);
  const sessionId = paper?.session.id;
  const questionId = question?.id;
  useEffect(() => {
    if (!sessionId || !questionId || !active) return;
    const open = () => {
      if (document.visibilityState === "visible")
        viewing.current = { id: questionId, at: performance.now() };
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") open();
      else {
        checkpoint();
        viewing.current = null;
      }
    };
    open();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      checkpoint();
      viewing.current = null;
      // Leaving a question: record its time in the background. Uses the latest
      // confirmed answer so this can never overwrite a newer saved choice.
      const total = Math.round(spent.current[questionId] ?? 0);
      if (total - (sent.current[questionId] ?? 0) < 2) return;
      sent.current[questionId] = total;
      const answer = answersRef.current[questionId] ?? {
        selected: null,
        markedForReview: false,
      };
      void fetch(`/api/afcat/sessions/${sessionId}/responses`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId,
          ...answer,
          timeSpentSeconds: total,
        }),
        keepalive: true,
      }).catch(() => {
        /* Timing is best-effort analysis data. */
      });
    };
  }, [sessionId, questionId, active, checkpoint]);
  async function save(id: string, answer: Answer) {
    if (!paper || !active || lock.current) return;
    lock.current = true;
    setBusy(true);
    setSaveState("Saving response…");
    setError("");
    checkpoint();
    const timeSpentSeconds = Math.round(spent.current[id] ?? 0);
    try {
      await api(`/api/afcat/sessions/${paper.session.id}/responses`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: id, ...answer, timeSpentSeconds }),
      });
      setAnswers((old) => ({ ...old, [id]: answer }));
      sent.current[id] = timeSpentSeconds;
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
              Defence Pathshala · AFCAT
            </p>
            <h1 className="truncate text-base font-bold sm:text-xl">
              AFCAT Full Mock
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
                onClick={() => trackAfcatFunnel("afcat_signin_click", { placement: "lab" })}
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
          <section aria-label="Before you begin" className="mx-auto max-w-3xl space-y-6 py-2 sm:py-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                Before you begin
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                AFCAT Full Mock 01
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                Read this once. The timer starts the moment you press Start.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["100", "Questions"],
                ["120", "Minutes"],
                ["300", "Marks"],
                ["+3 / −1", "Marking"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <dd className="text-2xl font-black">{value}</dd>
                  <dt className="mt-1 text-xs uppercase tracking-wider text-slate-500">{label}</dt>
                </div>
              ))}
            </dl>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Sections, in paper order</h3>
              <ul className="mt-3 divide-y divide-slate-100 text-sm">
                {AFCAT_SECTIONS.map((s) => (
                  <li key={s.key} className="flex justify-between gap-3 py-2.5">
                    <span className="font-semibold">{s.label}</span>
                    <span className="text-slate-600">{s.expected} questions</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">How it works</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <li>Correct answer +3, wrong answer −1, skipped 0.</li>
                <li>Your answers save automatically. If you refresh or lose signal, reopen this page and your attempt resumes.</li>
                <li>The 120-minute timer is kept on the server and keeps running if you leave.</li>
                <li>Use Mark for Review to flag a question and come back. Marked answers are still scored.</li>
                <li>You cannot change answers after you submit. Your analysis appears straight away.</li>
              </ul>
            </div>
            {!loading && tests.length === 0 && !error && (
              <p role="status" className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                The mock is not available right now. Please try again shortly.
              </p>
            )}
            {tests.map((t) => (
              <button
                key={t.id}
                disabled={loading}
                onClick={() => void start(t.id)}
                className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-blue-600 px-6 text-base font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
              >
                Start Full Mock
              </button>
            ))}
          </section>
        ) : result ? (
          <>
            <AfcatShareButton score={result.score} maxMarks={result.max_marks} />
            <AfcatResultAnalysis
              status={paper.session.status}
              summary={result}
              report={report}
            />
          </>
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
                <div
                  className="mt-2 h-1.5 w-56 max-w-full overflow-hidden rounded-full bg-slate-200"
                  role="progressbar"
                  aria-label="Questions answered"
                  aria-valuemin={0}
                  aria-valuemax={paper.questions.length}
                  aria-valuenow={answered}
                >
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${(answered / paper.questions.length) * 100}%` }}
                  />
                </div>
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
                <div className="my-4 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded border border-emerald-300 bg-emerald-50" />Answered</span>
                  <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded border border-amber-300 bg-amber-50" />Visited, unanswered</span>
                  <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded border border-violet-300 bg-violet-100" />Marked for review</span>
                  <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded border border-slate-200 bg-slate-50" />Not visited</span>
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
              <ul className="mt-3 space-y-1 text-sm">
                {AFCAT_SECTIONS.map((s) => {
                  const rows = paper.questions.filter((q) => q.section === s.key);
                  if (!rows.length) return null;
                  const open = rows.filter((q) => !answers[q.id]?.selected).length;
                  return (
                    <li key={s.key} className="flex justify-between gap-3">
                      <span>{s.label}</span>
                      <span className={open ? "font-semibold text-amber-700" : "text-emerald-700"}>
                        {open ? `${open} unanswered` : "All answered"}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 text-sm">
                Time left: <strong className="tabular-nums">{time}</strong>. Marked answers are scored normally.
                You cannot change responses after submission.
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
