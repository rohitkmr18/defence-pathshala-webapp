"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, History, RefreshCw, ShieldCheck } from "lucide-react";
import AfcatPerformancePanel from "@/components/afcat/AfcatPerformancePanel";
import type { AfcatPerformanceV2 } from "@/lib/afcat/performance-v2";

type Attempt = {
  sessionId: string; title: string; status: string; score: number | null; maxMarks: number;
  correct: number; incorrect: number; unanswered: number; timeSeconds: number;
  questionTimeSeconds?: number | null; completedAt: string | null;
};
type AvailableMock = { id: string; code: string; title: string; duration_seconds: number; expected_questions: number; max_marks: number };
type Dashboard = {
  attempts: Attempt[]; inProgress: { sessionId: string; title: string } | null;
  bestScore: number | null; averageScore: number | null;
  performanceV2?: AfcatPerformanceV2;
};
type LoadState = "loading" | "signin" | "error" | "ready";
const date = (v: string | null) => v ? new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Date unavailable";
const time = (s: number | null | undefined) => s == null ? "Question time unavailable" : s < 60 ? `${s}s recorded` : `${Math.floor(s / 60)}m ${s % 60}s recorded`;

export default function AfcatDashboardClient() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [mocks, setMocks] = useState<AvailableMock[] | null>(null);
  const [state, setState] = useState<LoadState>("loading");

  const reload = useCallback(async () => {
    setState("loading");
    try {
      const response = await fetch("/api/afcat/dashboard", { cache: "no-store" });
      if (response.status === 401) { setData(null); setState("signin"); return; }
      if (!response.ok) { setState("error"); return; }
      const next = await response.json() as Dashboard;
      if (!Array.isArray(next.attempts)) throw new Error("Invalid history payload");
      setData(next);
      setState("ready");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    let active = true;
    void fetch("/api/afcat/tests", { cache: "no-store" })
      .then(async r => r.ok ? (await r.json() as { tests: AvailableMock[] }).tests : [])
      .then(v => { if (active) setMocks(Array.isArray(v) ? v : []); })
      .catch(() => { if (active) setMocks([]); });
    void reload();
    return () => { active = false; };
  }, [reload]);

  const attempts = data?.attempts ?? [];
  const hasHistory = state === "ready" && attempts.length > 0;
  const mostRecent = attempts.find(a => a.score !== null) ?? null;
  // The catalogue is a separate action, not proof that a learner has never attempted a mock.
  const publishedMock = mocks?.[0] ?? null;

  return <div className="min-w-0 space-y-6">
    {state === "loading" && <section role="status" className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
      Loading your saved AFCAT attempts and performance…
    </section>}

    {state === "signin" && <section className="rounded-3xl border border-blue-200 bg-blue-50 p-5 sm:p-6">
      <div className="flex items-center gap-2 text-blue-900"><ShieldCheck aria-hidden="true" className="h-5 w-5"/><h2 className="font-black">Sign in to restore your AFCAT history</h2></div>
      <p className="mt-2 text-sm leading-6 text-blue-900">Previously submitted mocks, including retired papers, remain saved to the account that attempted them. Sign in with the same account to see its scores and analytics.</p>
      <Link className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800" href="/auth/login?next=%2Fafcat%2Fdashboard">Sign in to view saved results <ArrowRight className="h-4 w-4"/></Link>
    </section>}

    {state === "error" && <section role="alert" className="rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
      <h2 className="font-black text-amber-950">Saved AFCAT history could not be loaded</h2>
      <p className="mt-2 text-sm text-amber-900">This does not mean your attempts were deleted or that you need to attempt another mock. Retry loading your saved results.</p>
      <button type="button" onClick={() => void reload()} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-900 px-4 py-2 text-sm font-bold text-white"><RefreshCw className="h-4 w-4"/> Retry history</button>
    </section>}

    {state === "ready" && data?.inProgress && <Link href={`/afcat/lab?session=${encodeURIComponent(data.inProgress.sessionId)}`} className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-900">
      <span>Resume saved attempt: {data.inProgress.title}</span><ArrowRight className="h-4 w-4 shrink-0"/>
    </Link>}

    {hasHistory && <section aria-label="Saved AFCAT mock history" className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <History aria-hidden="true" className="h-5 w-5 text-blue-700"/>
        <div className="min-w-0"><h2 className="text-xl font-black text-slate-950">Your saved AFCAT results</h2>
          <p className="mt-1 text-xs text-slate-500">{attempts.length} finalized {attempts.length === 1 ? "attempt" : "attempts"}, including retired mocks where applicable. These are your previous scores, not a fresh start.</p>
        </div>
      </div>
      <ul className="mt-4 divide-y divide-slate-100">
        {attempts.map(a => <li key={a.sessionId} className="flex min-w-0 flex-wrap items-center justify-between gap-3 py-4">
          <div className="min-w-0">
            <p className="break-words font-bold text-slate-950">{a.title}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{date(a.completedAt)} · {a.status === "EXPIRED" ? "Expired attempt" : "Submitted"} · {time(a.questionTimeSeconds)}</p>
            <p className="mt-1 text-xs text-slate-600">{a.correct} correct · {a.incorrect} wrong · {a.unanswered} skipped</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <p className="font-black tabular-nums text-slate-900">{a.score ?? "—"}/{a.maxMarks}</p>
            {a.score !== null && <Link href={`/afcat/lab?session=${encodeURIComponent(a.sessionId)}`} className="inline-flex min-h-11 items-center rounded-xl border border-blue-200 px-3 text-xs font-bold text-blue-700 hover:border-blue-400">View analysis</Link>}
          </div>
        </li>)}
      </ul>
    </section>}

    {state === "ready" && data?.performanceV2 && data.performanceV2.overview.completedMocks > 0 && <AfcatPerformancePanel data={data.performanceV2} latestSessionId={mostRecent?.sessionId ?? null}/>}

    {state === "ready" && attempts.length === 0 && <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="font-black text-slate-900">No finalized AFCAT results for this signed-in account</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">If you attempted a mock before, check that you are using the same sign-in account. We do not erase results when the dashboard changes. In-progress attempts can be resumed above.</p>
    </section>}

    <section aria-label="Choose AFCAT mock" className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2"><Clock3 aria-hidden="true" className="h-4 w-4 text-blue-700"/><h2 className="font-black text-slate-900">{hasHistory ? "Attempt another mock" : "Explore published AFCAT mocks"}</h2></div>
      <p className="mt-2 text-sm text-slate-600">{publishedMock ? `Available full mocks · ${publishedMock.expected_questions} questions · ${Math.round(publishedMock.duration_seconds / 60)} minutes · +3/−1` : "View currently published mocks and their details."}</p>
      <Link href="/afcat#available-mocks" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-blue-900">
        View mock catalogue <ArrowRight className="h-4 w-4"/>
      </Link>
    </section>
  </div>;
}
