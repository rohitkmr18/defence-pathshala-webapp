"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3, CheckCircle2, ClipboardCheck, Clock, FileCheck2, Gauge, Layers, LineChart, PlayCircle, RotateCcw, ShieldCheck, Timer, Trophy,
} from "lucide-react";
import { trackMockFunnel } from "@/lib/mock/funnel";
import { useMockAttempts, type MockAttempt } from "@/lib/mock/attempts";

type Test = {
  id: string; code: string; title: string; duration_seconds: number; expected_questions: number;
  correct_points: number; wrong_points: number; points_divisor: number; max_marks: number | string;
  blueprint: Record<string, number>;
};

async function api(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(20000) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}
/** "+0.83 / -0.28" derived from the test row, never hard-coded. */
export function markingLabel(t: Pick<Test, "correct_points" | "wrong_points" | "points_divisor">) {
  const f = (n: number) => (n / t.points_divisor).toFixed(2);
  return `+${f(t.correct_points)} / -${f(t.wrong_points)}`;
}

export default function MockCatalogue({ embedded = false }: { embedded?: boolean } = {}) {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [briefing, setBriefing] = useState<Test | null>(null);
  const [agreed, setAgreed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const { attempts } = useMockAttempts(true);

  useEffect(() => {
    api("/api/mock/tests").then((x) => { setTests(x.tests); trackMockFunnel("mock_catalogue_view", { count: x.tests.length }, "catalogue"); })
      .catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { if (briefing) dialog.current?.showModal(); }, [briefing]);

  const byTest = useMemo(() => {
    const map = new Map<string, MockAttempt[]>();
    for (const a of attempts ?? []) map.set(a.testId, [...(map.get(a.testId) ?? []), a]);
    return map;
  }, [attempts]);
  const done = (attempts ?? []).filter((a) => a.result);
  const best = done.reduce<number | null>((b, a) => (b === null || a.result!.score > b ? a.result!.score : b), null);

  async function start(t: Test) {
    if (starting) return;
    setStarting(t.id); setError(""); dialog.current?.close();
    try {
      const s = await api("/api/mock/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ testId: t.id }) });
      trackMockFunnel(s.resumed ? "mock_resume" : "mock_start", { test_code: t.code }, `${s.resumed ? "resume" : "start"}:${s.sessionId}`);
      router.push(`/mock/cds-gk/${s.sessionId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to start test");
      setStarting(null);
    }
  }
  const primaryTest = tests[0];
  const primaryAttempts = primaryTest ? (byTest.get(primaryTest.id) ?? []) : [];
  const primaryLive = primaryAttempts.find((a) => a.status === "IN_PROGRESS" && !a.expired);
  const primaryFinished = primaryAttempts.some((a) => a.result);
  function handleHeroStart() {
    if (!primaryTest || starting) return;
    if (primaryLive) void start(primaryTest);
    else { setAgreed(false); setBriefing(primaryTest); }
  }
  const signInNext = embedded ? "/dashboard/practice?mode=full_paper&fp=dp" : "/mock/cds-gk";
  const Shell = embedded ? "div" : "main";

  return (
    <Shell className={embedded ? "text-slate-900" : "min-h-screen bg-slate-50 text-slate-900"} style={embedded ? undefined : { overflowX: "clip" }}>
      <div className={embedded ? "space-y-6" : "mx-auto max-w-5xl space-y-6 px-4 py-4 sm:px-6 sm:py-6"}>
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#081b35] via-[#0b2547] to-[#123a6b] p-5 text-white shadow-xl sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200">
              <ClipboardCheck className="h-3.5 w-3.5" />CDS GK · Full-length mock
            </span>
            {embedded ? (
              <h2 className="mt-4 max-w-2xl text-2xl font-black leading-tight tracking-tight sm:text-4xl">Test your CDS GK readiness.</h2>
            ) : (
              <h1 className="mt-4 max-w-2xl text-2xl font-black leading-tight tracking-tight sm:text-4xl">Test your CDS GK readiness.</h1>
            )}
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
              Original Defence Pathshala questions, not repeated PYQs. Attempt under UPSC CDS exam conditions and see exactly where you lose marks.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2" aria-label="Mock specifications">
              {[[primaryTest ? String(primaryTest.expected_questions) : "120", "Questions"], [primaryTest ? String(Math.round(primaryTest.duration_seconds / 60)) : "120", "Minutes"], [primaryTest ? Number(primaryTest.max_marks).toFixed(0) : "100", "Marks"]].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/10 px-2 py-3 text-center">
                  <strong className="block text-xl font-black tabular-nums sm:text-2xl">{value}</strong>
                  <span className="text-[11px] font-semibold text-blue-100">{label}</span>
                </div>
              ))}
            </div>
            <button type="button" disabled={loading || !primaryTest || starting !== null} onClick={handleHeroStart}
              className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 text-sm font-extrabold text-white shadow-lg transition hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-64">
              {primaryLive ? <Clock className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
              {loading ? "Loading free mocks…" : !primaryTest ? "No mock available" : starting === primaryTest.id ? "Opening mock…" : primaryLive ? "Resume your mock" : primaryFinished ? "Attempt mock again" : "Start free mock 01"}
            </button>
            <p className="mt-3 text-xs font-medium text-blue-100">UPSC negative marking · Server-side timer · Instant analysis</p>
            {done.length > 0 && (
              <p className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm">
                <Trophy className="h-4 w-4 text-amber-300" />Your record: <strong>{done.length}</strong> attempt{done.length === 1 ? "" : "s"} · best <strong>{best!.toFixed(2)}</strong>
              </p>
            )}
          </div>
        </section>

        {error && (
          <div role="alert" className="space-y-2 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm">
            <p>{error}</p>
            {/sign in required/i.test(error) && (
              <Link className="font-semibold text-blue-700 underline" href={`/auth/login?next=${encodeURIComponent(signInNext)}`}>Sign in with Defence Pathshala</Link>
            )}
          </div>
        )}
        {loading && <div role="status" className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white" aria-label="Loading mocks" />}
        {!loading && !tests.length && !error && (
          <p role="status" className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">No CDS GK mock is published yet.</p>
        )}

        {!embedded && (
          <section aria-label="Founder credentials" className="rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-700">Built by Defence Pathshala</p>
            <p className="mt-1 text-sm font-bold text-slate-900">Rohit Kumar · IIT Kanpur · CAPF AC AIR 163 · CDS written qualified 4 times</p>
            <p className="mt-1 text-xs text-slate-600">Exam experience informing the learning platform. Original mock questions are not official UPSC papers.</p>
          </section>
        )}

        {/* Mock cards */}
        {tests.map((t, i) => {
          const mine = byTest.get(t.id) ?? [];
          const live = mine.find((a) => a.status === "IN_PROGRESS" && !a.expired);
          const finished = mine.filter((a) => a.result).sort((a, b) => Date.parse(b.result!.completedAt) - Date.parse(a.result!.completedAt));
          const last = finished[0];
          const minutesLeft = live ? Math.max(0, Math.round((Date.parse(live.deadline) - Date.now()) / 60000)) : 0;
          return (
            <article key={t.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.3fr_1fr]">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">Mock {String(i + 1).padStart(2, "0")}</span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">Free</span>
                    {finished.length > 0 && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">Attempted {finished.length}×</span>}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold leading-snug tracking-tight sm:text-2xl">{t.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">UPSC CDS pattern · mixed subject order, as in the real paper</p>
                  </div>
                  <dl className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[[String(t.expected_questions), "Questions"], [String(Math.round(t.duration_seconds / 60)) + " min", "Duration"],
                      [Number(t.max_marks).toFixed(0), "Marks"]].map(([value, label]) => (
                      <div key={label} className="min-w-0 rounded-2xl bg-slate-50 px-2 py-3.5 text-center sm:px-4">
                        <dd className="text-xl font-extrabold tabular-nums text-slate-900 sm:text-2xl">{value}</dd>
                        <dt className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                  <ul className="space-y-2.5 text-sm text-slate-700">
                    <li className="flex gap-2"><Gauge className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />Negative marking {markingLabel(t)}</li>
                    <li className="flex gap-2"><Timer className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />Timer runs on our server and auto-submits at zero</li>
                    <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />Answers save as you go and survive a refresh</li>
                  </ul>
                  {last?.result && (
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Your last score</p>
                      <p className="mt-0.5 text-2xl font-black tabular-nums">{last.result.score.toFixed(2)}<span className="text-sm font-bold text-slate-400"> / {last.result.maxMarks.toFixed(0)}</span></p>
                      <Link href={`/mock/cds-gk/${last.sessionId}`} className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"><BarChart3 className="h-3.5 w-3.5" />View full analysis</Link>
                    </div>
                  )}
                  {live ? (
                    <button disabled={starting !== null} onClick={() => void start(t)}
                      className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 text-base font-bold text-white shadow-sm transition-colors hover:bg-amber-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:opacity-50">
                      <Clock className="h-5 w-5" />{starting === t.id ? "Opening mock…" : `Resume mock · ${minutesLeft} min left`}
                    </button>
                  ) : (
                    <button disabled={starting !== null} onClick={() => { setAgreed(false); setBriefing(t); }}
                      className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-base font-bold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50">
                      {finished.length ? <RotateCcw className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
                      {starting === t.id ? "Opening mock…" : finished.length ? "Attempt again" : "Start mock"}
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {!embedded && !loading && tests.length > 0 && (
          <nav aria-label="Related CDS preparation" className="flex flex-wrap gap-3 text-sm font-semibold">
            <Link href="/pyqs/cds" className="rounded-xl border border-blue-200 bg-white px-4 py-3 text-blue-700 hover:bg-blue-50">Explore CDS PYQs</Link>
            <Link href="/dashboard/practice" className="rounded-xl border border-blue-200 bg-white px-4 py-3 text-blue-700 hover:bg-blue-50">Practice by subject</Link>
          </nav>
        )}

        {/* How it works + what you get */}
        {!loading && tests.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            <section aria-label="How it works" className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
              <h3 className="text-base font-bold text-slate-900">How it works</h3>
              <ol className="mt-4 space-y-4">
                {[
                  { icon: FileCheck2, t: "Read the instructions", d: "Same rules as the UPSC paper: 120 questions, 2 hours, one-third negative marking." },
                  { icon: Timer, t: "Attempt in exam conditions", d: "Navigate freely, mark for review, and change answers. Everything saves in the background." },
                  { icon: LineChart, t: "Submit and get your analysis", d: "Score, subject and topic gaps, time per question, and every solution explained." },
                ].map(({ icon: Icon, t: title, d }, n) => (
                  <li key={title} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon className="h-4.5 w-4.5" /></span>
                    <div><p className="text-sm font-bold text-slate-900">{n + 1}. {title}</p><p className="text-sm text-slate-600">{d}</p></div>
                  </li>
                ))}
              </ol>
            </section>
            <section aria-label="Your analysis" className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/50 p-5 sm:p-6">
              <h3 className="text-base font-bold text-slate-900">What your analysis shows</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Gauge, t: "Net score & negatives", d: "Marks earned, lost to wrong answers, and left on skips" },
                  { icon: Layers, t: "Subject & topic gaps", d: "Accuracy heatmap across all nine GK areas" },
                  { icon: Timer, t: "Time intelligence", d: "Where your two hours went, question by question" },
                  { icon: CheckCircle2, t: "Recoverable marks", d: "Easy and moderate questions you should have converted" },
                ].map(({ icon: Icon, t: title, d }) => (
                  <li key={title} className="rounded-2xl border border-slate-200 bg-white p-3.5">
                    <Icon className="h-4.5 w-4.5 text-blue-600" />
                    <p className="mt-2 text-sm font-bold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-600">{d}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>

      {/* Exam instructions before a new attempt */}
      <dialog ref={dialog} aria-labelledby="mock-brief-title" onClose={() => setBriefing(null)}
        className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60">
        {briefing && (
          <div>
            <div className="bg-[#081b35] px-6 py-5 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-300">Instructions</p>
              <h2 id="mock-brief-title" className="mt-1 text-xl font-black">{briefing.title}</h2>
            </div>
            <div className="space-y-4 px-6 py-5 text-sm leading-6 text-slate-700">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>{briefing.expected_questions} questions, {Math.round(briefing.duration_seconds / 60)} minutes, {Number(briefing.max_marks).toFixed(0)} marks. Each question has one correct answer.</li>
                <li>Marking: {markingLabel(briefing)} per question. Skipped questions score zero.</li>
                <li>The timer starts as soon as you begin and keeps running if you close the page. The test auto-submits at zero.</li>
                <li>Use the question palette to jump between questions and <strong>Mark for Review</strong> to come back later.</li>
                <li>Answers save automatically. If your connection drops, keep going — they sync when you are back online.</li>
              </ul>
              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <input type="checkbox" className="mt-1 h-4 w-4" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span>I have read the instructions and I am ready to begin.</span>
              </label>
            </div>
            <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
              <button type="button" className="min-h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm font-semibold" onClick={() => dialog.current?.close()}>Not now</button>
              <button type="button" disabled={!agreed || starting !== null} onClick={() => void start(briefing)}
                className="min-h-11 flex-1 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white disabled:opacity-40">
                {starting ? "Starting…" : "Begin test"}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </Shell>
  );
}
