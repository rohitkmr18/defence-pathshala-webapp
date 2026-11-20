"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import MockQuestion from "@/components/mock/MockQuestion";
import MockResult, { type MockResultReport } from "@/components/mock/MockResult";
import { trackMockFunnel } from "@/lib/mock/funnel";
import { backupUnsaved, MockSaveError, MockSaveQueue, readUnsaved, type MockSavePayload, type MockSaveState } from "@/lib/mock/save-queue";
import type { MockLearnerQuestion } from "@/lib/mock/serialize";

type Key = "A" | "B" | "C" | "D";
type Answer = { selected: Key | null; markedForReview: boolean };
type Paper = {
  serverNow: string;
  session: {
    id: string; title: string; code: string; status: string; deadline: string; expired: boolean;
    marking: { correctPoints: number; wrongPoints: number; pointsDivisor: number; maxMarks: number };
  };
  questions: MockLearnerQuestion[];
  responses: { question_id: string; selected_option: Key | null; marked_for_review: boolean; time_spent_seconds?: number }[];
};

async function api(url: string, init?: RequestInit, timeoutMs = 20000) {
  let response: Response;
  try {
    response = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(timeoutMs) });
  } catch {
    throw new MockSaveError("Network unavailable");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new MockSaveError(data.error || "Request failed", response.status);
  return data;
}
// Background clock resync at most this often (each sync refetches the paper).
const SYNC_INTERVAL_MS = 60_000;
const button =
  "min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:border-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-40 disabled:cursor-not-allowed";

export default function MockPlayer({ sessionId }: { sessionId: string }) {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [report, setReport] = useState<MockResultReport | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [visited, setVisited] = useState<number[]>([0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [online, setOnline] = useState(true);
  const [palette, setPalette] = useState(false);
  const [left, setLeft] = useState(0);
  const [saveInfo, setSaveInfo] = useState<MockSaveState>({ pending: 0, saving: false, failures: 0, fatal: null });
  const lock = useRef(false), autoSubmitted = useRef(false), lastSync = useRef(0);
  const queue = useRef<MockSaveQueue | null>(null);
  // Cumulative seconds per question (analysis only, never scored) and when the current view started.
  const timeSpent = useRef<Record<string, number>>({});
  const viewStart = useRef<number | null>(null);
  // Server-based clock: remaining time at fetch + local monotonic elapsed, resynced on focus.
  const clock = useRef({ remaining: 0, at: 0 });
  const confirmation = useRef<HTMLDialogElement>(null), title = useRef<HTMLDivElement>(null);
  const firstAnswerSent = useRef(false);

  const applyClock = (data: Pick<Paper, "serverNow" | "session">) => {
    clock.current = { remaining: Math.max(0, Date.parse(data.session.deadline) - Date.parse(data.serverNow)), at: performance.now() };
    setLeft(Math.ceil(clock.current.remaining / 1000));
  };
  const load = useCallback(async () => {
    const data: Paper = await api(`/api/mock/sessions/${sessionId}`);
    applyClock(data);
    setPaper(data);
    const restored: Record<string, Answer> = Object.fromEntries(data.responses.map((r) => [r.question_id, { selected: r.selected_option, markedForReview: r.marked_for_review }]));
    timeSpent.current = Object.fromEntries(data.responses.map((r) => [r.question_id, r.time_spent_seconds ?? 0]));
    // Answers given before a reload that never reached the server are restored and re-sent.
    const unsaved = data.session.status === "IN_PROGRESS" ? readUnsaved(sessionId, new Set(data.questions.map((q) => q.id))) : [];
    for (const p of unsaved) {
      restored[p.questionId] = { selected: p.selected, markedForReview: p.markedForReview };
      if (p.timeSpentSeconds !== undefined) timeSpent.current[p.questionId] = Math.max(timeSpent.current[p.questionId] ?? 0, p.timeSpentSeconds);
      queue.current?.enqueue(p);
    }
    if (data.session.status !== "IN_PROGRESS") backupUnsaved(sessionId, []);
    setAnswers(restored);
    firstAnswerSent.current = Object.values(restored).some((a) => a.selected);
    let position = 0, seen = [0];
    try {
      const saved = JSON.parse(sessionStorage.getItem(`mock-view:${sessionId}`) || "null");
      if (saved && Number.isInteger(saved.index) && saved.index >= 0 && saved.index < data.questions.length) position = saved.index;
      if (Array.isArray(saved?.visited)) seen = saved.visited.filter((n: number) => Number.isInteger(n) && n >= 0 && n < data.questions.length);
    } catch { /* Navigation memory is optional. */ }
    setIndex(position);
    setVisited([...new Set([...seen, position])]);
    viewStart.current = performance.now();
    lastSync.current = Date.now();
    if (data.session.status !== "IN_PROGRESS") setReport(await api(`/api/mock/sessions/${sessionId}/result`));
  }, [sessionId]);

  useEffect(() => {
    queue.current = new MockSaveQueue({
      send: async (payload) => {
        await api(`/api/mock/sessions/${sessionId}/responses`, {
          method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        }, 15000);
      },
      isOnline: () => navigator.onLine,
      onChange: (state) => {
        setSaveInfo(state);
        backupUnsaved(sessionId, queue.current?.snapshot() ?? []);
      },
    });
    Promise.resolve().then(load).catch((e) => setError(e.message)).finally(() => setLoading(false));
    const update = () => { setOnline(navigator.onLine); if (navigator.onLine) queue.current?.kick(); };
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    const timer = window.setInterval(() => setLeft(Math.max(0, Math.ceil((clock.current.remaining - (performance.now() - clock.current.at)) / 1000))), 1000);
    return () => { clearInterval(timer); window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, [load]);
  useEffect(() => {
    if (!paper) return;
    try { sessionStorage.setItem(`mock-view:${sessionId}`, JSON.stringify({ index, visited })); } catch { /* Optional. */ }
  }, [paper, sessionId, index, visited]);

  const submit = useCallback(async () => {
    if (!paper || lock.current) return;
    lock.current = true; setSubmitting(true); confirmation.current?.close();
    try {
      commitTime();
      // Every answer must reach the server before the attempt is scored.
      const saved = await (queue.current?.flush(20000) ?? Promise.resolve(true));
      if (!saved) throw new Error("Some answers are not saved yet. Check your connection and submit again");
      await api(`/api/mock/sessions/${sessionId}/submit`, { method: "POST" });
      const completed: MockResultReport = await api(`/api/mock/sessions/${sessionId}/result`);
      setReport(completed);
      trackMockFunnel("mock_submit", { status: completed.status, test_code: paper.session.code }, `submit:${sessionId}`);
      setPaper((old) => (old ? { ...old, session: { ...old.session, status: completed.status } } : old));
      backupUnsaved(sessionId, []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed. Retry safely.");
    } finally { lock.current = false; setSubmitting(false); }
  }, [paper, sessionId]);
  // Auto-submit once the server deadline passes (needs a connection; the database also rejects late writes).
  useEffect(() => {
    if (paper?.session.status === "IN_PROGRESS" && left === 0 && online && !loading && !autoSubmitted.current) {
      autoSubmitted.current = true; void submit();
    }
  }, [paper, left, online, loading, submit]);
  // Resync the clock whenever the tab regains focus or connectivity (laptop sleep, background throttling).
  useEffect(() => {
    if (!paper || paper.session.status !== "IN_PROGRESS") return;
    let alive = true;
    const sync = async () => {
      if (document.visibilityState !== "visible") { commitTime(); viewStart.current = null; return; }
      if (viewStart.current === null) viewStart.current = performance.now();
      if (lock.current || Date.now() - lastSync.current < SYNC_INTERVAL_MS) return;
      lastSync.current = Date.now();
      try {
        const fresh: Paper = await api(`/api/mock/sessions/${sessionId}`);
        if (!alive || lock.current) return;
        applyClock(fresh);
        if (fresh.session.status !== "IN_PROGRESS") await load();
      } catch { /* The next save still verifies auth and database time. */ }
    };
    const guard = (event: BeforeUnloadEvent) => { if (lock.current || (queue.current?.snapshot().length ?? 0) > 0) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("focus", sync); window.addEventListener("online", sync);
    document.addEventListener("visibilitychange", sync); window.addEventListener("beforeunload", guard);
    return () => {
      alive = false;
      window.removeEventListener("focus", sync); window.removeEventListener("online", sync);
      document.removeEventListener("visibilitychange", sync); window.removeEventListener("beforeunload", guard);
    };
  }, [paper, sessionId, load]);

  // A rejected save (signed out, time over, session closed) cannot succeed on retry.
  useEffect(() => {
    if (!saveInfo.fatal) return;
    if (/sign in/i.test(saveInfo.fatal)) setError("Sign in required to keep saving your answers");
    else if (/expired|closed/i.test(saveInfo.fatal)) void load().catch(() => {});
    else setError(`${saveInfo.fatal}. Reload the saved attempt; answers not yet saved are kept on this device`);
  }, [saveInfo.fatal, load]);

  const question = paper?.questions[index];
  // Answers can be changed while offline; they sync on reconnect. The database still rejects late writes.
  const active = paper?.session.status === "IN_PROGRESS" && left > 0;
  /** Adds time on the current question to its running total. */
  function commitTime() {
    const id = paper?.questions[index]?.id;
    if (!id || viewStart.current === null) return 0;
    const now = performance.now();
    const delta = (now - viewStart.current) / 1000;
    viewStart.current = now;
    timeSpent.current[id] = (timeSpent.current[id] ?? 0) + delta;
    return delta;
  }
  function payloadFor(id: string, answer: Answer): MockSavePayload {
    return { questionId: id, ...answer, timeSpentSeconds: Math.floor(timeSpent.current[id] ?? 0) };
  }
  // Optimistic: the screen updates at once and the queue saves in the background.
  function save(id: string, answer: Answer) {
    if (!paper || !active || saveInfo.fatal) return;
    commitTime();
    setAnswers((old) => ({ ...old, [id]: answer }));
    queue.current?.enqueue(payloadFor(id, answer));
    if (answer.selected && !firstAnswerSent.current) {
      firstAnswerSent.current = true;
      trackMockFunnel("mock_answer_first", { test_code: paper.session.code }, `first:${sessionId}`);
    }
  }
  function navigate(next: number) {
    if (lock.current || !paper || next < 0 || next >= paper.questions.length) return;
    // Record time on the question being left; save it only when it is worth a write.
    const leaving = paper.questions[index];
    if (leaving && commitTime() >= 3 && active) {
      queue.current?.enqueue(payloadFor(leaving.id, answers[leaving.id] ?? { selected: null, markedForReview: false }));
    }
    viewStart.current = performance.now();
    setIndex(next); setVisited((old) => [...new Set([...old, next])]); setPalette(false);
    title.current?.focus(); window.scrollTo({ top: 0, behavior: "instant" });
  }
  const total = paper?.questions.length ?? 0;
  const answered = Object.values(answers).filter((a) => a.selected !== null).length;
  const marked = Object.values(answers).filter((a) => a.markedForReview).length;
  const blocked = submitting || Boolean(saveInfo.fatal);
  const saveLabel = saveInfo.fatal ? "Saving stopped — reload to recover"
    : !online && saveInfo.pending ? `Offline — ${saveInfo.pending} answer${saveInfo.pending > 1 ? "s" : ""} will sync when you reconnect`
    : saveInfo.failures > 0 ? `Connection slow — retrying (${saveInfo.pending} unsaved)`
    : saveInfo.pending ? "Saving…" : "All responses saved";
  const time = `${String(Math.floor(left / 3600)).padStart(2, "0")}:${String(Math.floor((left % 3600) / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
  const current = question ? answers[question.id] : undefined;
  const m = paper?.session.marking;
  const markLabel = m ? `+${(m.correctPoints / m.pointsDivisor).toFixed(2)} / −${(m.wrongPoints / m.pointsDivisor).toFixed(2)}` : "";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900" style={{ overflowX: "clip", overflowY: "visible" }}>
      <header className="sticky top-0 z-30 bg-[#081b35] text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-300">Defence Pathshala · CDS</p>
            <h1 className="truncate text-base font-bold sm:text-xl">{paper?.session.title ?? "CDS GK Mock"}</h1>
          </div>
          {paper && !report && (
            <span aria-hidden="true" title={saveLabel}
              className={`ml-auto hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline-flex ${saveInfo.fatal || saveInfo.failures ? "bg-amber-400/15 text-amber-200" : saveInfo.pending ? "bg-white/10 text-blue-100" : "bg-emerald-400/15 text-emerald-200"}`}>
              <i className={`h-1.5 w-1.5 rounded-full ${saveInfo.fatal || saveInfo.failures ? "bg-amber-300" : saveInfo.pending ? "animate-pulse bg-blue-200" : "bg-emerald-300"}`} />
              {saveInfo.fatal || saveInfo.failures ? "Retrying" : saveInfo.pending ? "Saving" : "Saved"}
            </span>
          )}
          {paper && (
            <div className={`shrink-0 rounded-xl border px-3 py-2 ${left <= 300 && !report ? "border-amber-400 text-amber-200" : "border-white/15 bg-white/5"}`}>
              <p className="text-[10px] uppercase tracking-wider">{report ? "Test complete" : "Time remaining"}</p>
              <span role="timer" aria-label={`Time remaining ${time}`} className="font-mono text-lg font-bold tabular-nums sm:text-2xl">{time}</span>
            </div>
          )}
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-5 pb-32 sm:px-6">
        {!online && <div role="alert" className="mb-4 rounded-xl bg-amber-50 p-4">You are offline. Keep answering — responses are kept on this device and sync when you reconnect. The timer continues.</div>}
        {online && saveInfo.failures >= 3 && !saveInfo.fatal && (
          <div role="status" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
            <span>Your connection is slow. {saveInfo.pending} answer{saveInfo.pending === 1 ? " is" : "s are"} kept on this device and retrying automatically.</span>
            <button className={button} onClick={() => queue.current?.kick()}>Retry now</button>
          </div>
        )}
        {error && (
          <div role="alert" className="mb-4 space-y-2 rounded-xl border border-amber-300 bg-amber-50 p-4">
            <p>{error}</p>
            {/sign in required/i.test(error) ? (
              <Link className="font-semibold text-blue-700 underline" href={`/auth/login?next=${encodeURIComponent(`/mock/cds-gk/${sessionId}`)}`}>Sign in with Defence Pathshala</Link>
            ) : (
              <button className={button} onClick={() => window.location.reload()}>Reload saved attempt</button>
            )}
          </div>
        )}
        {loading && <p role="status" className="py-8 text-slate-600">Loading your examination…</p>}
        {paper && report ? (
          <MockResult report={report} sessionId={sessionId} />
        ) : paper && question ? (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-600">{answered} of {total} answered · {marked} marked for review</p>
                <div className="mt-2 h-1.5 w-56 max-w-full overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answered}>
                  <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${(answered / total) * 100}%` }} />
                </div>
              </div>
              <button className={`${button} lg:hidden`} aria-expanded={palette} aria-controls="question-palette" onClick={() => setPalette(!palette)}>
                {palette ? "Close palette" : "Question palette"}
              </button>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_290px]">
              <div className="min-w-0 space-y-4">
                <div ref={title} tabIndex={-1} className="outline-none">
                  <div className="mb-3 flex justify-between text-xs font-semibold text-slate-500">
                    <span>QUESTION {index + 1} / {total}</span>
                    <span>{markLabel}</span>
                  </div>
                  <p className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">{question.subject}</span>
                    <span>DP practice question</span>
                  </p>
                  <MockQuestion key={question.id} question={question} selected={current?.selected ?? null} disabled={!active || blocked}
                    onSelect={(selected) => void save(question.id, { selected, markedForReview: current?.markedForReview ?? false })} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className={button} disabled={!active || blocked} aria-pressed={current?.markedForReview ?? false}
                    onClick={() => void save(question.id, { selected: current?.selected ?? null, markedForReview: !current?.markedForReview })}>
                    {current?.markedForReview ? "Unmark Review" : "Mark for Review"}
                  </button>
                  <button className={button} disabled={!active || blocked || !current?.selected}
                    onClick={() => void save(question.id, { selected: null, markedForReview: current?.markedForReview ?? false })}>
                    Clear Response
                  </button>
                </div>
              </div>
              <aside id="question-palette" className={`${palette ? "order-first block lg:order-none" : "hidden"} rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-24 lg:block`}>
                <h2 className="font-bold">Question palette</h2>
                <div className="my-4 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded border border-emerald-300 bg-emerald-50" />Answered</span>
                  <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded border border-amber-300 bg-amber-50" />Visited, unanswered</span>
                  <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded border border-violet-300 bg-violet-100" />Marked for review</span>
                  <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded border border-slate-200 bg-slate-50" />Not visited</span>
                </div>
                <nav aria-label="Question navigation" className="grid max-h-[55vh] grid-cols-5 gap-2 overflow-y-auto p-1">
                  {paper.questions.map((q, i) => {
                    const a = answers[q.id];
                    const state = a?.markedForReview ? (a.selected ? "answered, marked for review" : "unanswered, marked for review")
                      : a?.selected ? "answered" : visited.includes(i) ? "visited, unanswered" : "not visited";
                    return (
                      <button key={q.id} disabled={blocked} aria-label={`Question ${i + 1}, ${state}`} aria-current={i === index ? "step" : undefined}
                        onClick={() => navigate(i)}
                        className={`relative min-h-11 rounded-lg border text-sm font-semibold focus-visible:outline-2 focus-visible:outline-blue-600 ${i === index ? "ring-2 ring-blue-600 ring-offset-1" : ""} ${a?.markedForReview ? "border-violet-300 bg-violet-100 text-violet-900" : a?.selected ? "border-emerald-300 bg-emerald-50 text-emerald-900" : visited.includes(i) ? "border-amber-300 bg-amber-50 text-amber-900" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                        {i + 1}
                        <span aria-hidden="true" className="absolute bottom-0 right-1 text-[9px]">
                          {a?.markedForReview ? `◆${a.selected ? "✓" : ""}` : a?.selected ? "✓" : visited.includes(i) ? "○" : "·"}
                        </span>
                      </button>
                    );
                  })}
                </nav>
                <button className="mt-5 min-h-11 w-full rounded-xl bg-[#081b35] px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
                  disabled={blocked || !online} onClick={() => confirmation.current?.showModal()}>Submit test</button>
              </aside>
            </div>
            <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-sm sm:px-4 sm:py-3">
              <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
                <p role="status" className="w-full text-center text-xs text-slate-500 sm:w-auto sm:text-left">
                  {submitting ? "Submitting securely…" : left === 0 ? "Time expired. Submit to retrieve your result." : saveLabel}
                </p>
                <button className={button} disabled={index === 0 || blocked} onClick={() => navigate(index - 1)}>Previous</button>
                <div className="flex min-w-0 flex-1 justify-end gap-2 sm:flex-none">
                  <button className={`${button} min-w-0 px-3 lg:hidden`} disabled={blocked || !online} onClick={() => confirmation.current?.showModal()}>Submit</button>
                  <button className="min-h-11 min-w-0 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-40 sm:px-5"
                    disabled={index === total - 1 || blocked} onClick={() => navigate(index + 1)}>Save &amp; Next</button>
                </div>
              </div>
            </footer>
            <dialog ref={confirmation} aria-labelledby="submit-title" className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl p-6 text-slate-900 shadow-xl backdrop:bg-slate-950/60">
              <h2 id="submit-title" className="text-xl font-bold">Submit your test?</h2>
              <p className="mt-3 text-sm text-slate-600">{answered} answered · {total - answered} unanswered · {marked} marked for review.</p>
              <p className="mt-3 text-sm">Time left: <strong className="tabular-nums">{time}</strong>. Marked answers are scored normally. You cannot change responses after submission.</p>
              <div className="mt-6 flex gap-3">
                <button autoFocus className={button} onClick={() => confirmation.current?.close()}>Keep reviewing</button>
                <button className="min-h-11 rounded-xl bg-blue-600 px-4 font-semibold text-white" onClick={() => void submit()}>Confirm submission</button>
              </div>
            </dialog>
          </>
        ) : null}
      </div>
    </main>
  );
}
