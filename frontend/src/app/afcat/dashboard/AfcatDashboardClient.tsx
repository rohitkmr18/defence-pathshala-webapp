"use client";

import { useEffect, useState } from "react";
import { formatQuestionTime } from "@/lib/afcat/duration";
import Link from "next/link";
import { ArrowRight, BarChart3, Clock3, Target, Trophy } from "lucide-react";

type Attempt = {
  sessionId: string; testId: string; testCode: string | null; title: string; status: string; score: number | null; maxMarks: number;
  correct: number; incorrect: number; unanswered: number; timeSeconds: number; questionTimeSeconds?: number | null; completedAt: string | null;
};
type Section = { section: string; label: string; total: number; correct: number; incorrect: number; unanswered: number; accuracyPercent: number; marks: number; maximumMarks: number };
type Topic = { section: string; topic: string; total: number; accuracyPercent: number; marksLost: number };
type AvailableMock = { id: string; code: string; title: string; duration_seconds: number; expected_questions: number; max_marks: number };
type Dashboard = {
  attempts: Attempt[]; inProgress: { sessionId: string; title: string } | null;
  bestScore: number | null; averageScore: number | null; sections: Section[]; weakTopics: Topic[];
};

const date = (v: string | null) => (v ? new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");

export default function AfcatDashboardClient() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [mocks, setMocks] = useState<AvailableMock[] | null>(null);
  const [state, setState] = useState<"loading" | "signin" | "error" | "ready">("loading");

  useEffect(() => {
    let active = true;
    // The mock list is public and loads independently, so "Attempt a mock" shows immediately.
    fetch("/api/afcat/tests", { cache: "no-store" })
      .then(async (res) => (res.ok ? ((await res.json()) as { tests: AvailableMock[] }).tests : []))
      .then((tests) => active && setMocks(tests))
      .catch(() => active && setMocks([]));
    fetch("/api/afcat/dashboard", { cache: "no-store" })
      .then(async (res) => {
        if (!active) return;
        if (res.status === 401) return setState("signin");
        if (!res.ok) return setState("error");
        setData((await res.json()) as Dashboard);
        setState("ready");
      })
      .catch(() => active && setState("error"));
    return () => { active = false; };
  }, []);

  const attempts = data?.attempts ?? [];
  // Fall back to the published Full Mock 01 details so the primary action never disappears.
  const mock = mocks?.[0] ?? null;
  const firstTime = state !== "loading" && (state !== "ready" || attempts.length === 0);
  // The mock chooser (/afcat/lab) lists every live mock, so this card has one action.
  // "Reattempt" only when the learner has finished one of the mocks currently on offer;
  // a finished retired mock does not count.
  const finishedLiveMock = attempts.some((a) => (mocks ?? []).some((m) => m.id === a.testId));
  const ctaLabel = finishedLiveMock ? "Reattempt mock" : "Start mock for free";
  const latest = attempts.find((a) => a.score !== null) ?? null;
  const cards = [
    { icon: Target, label: "Latest score", value: latest ? `${latest.score}/${latest.maxMarks}` : "—" },
    { icon: Trophy, label: "Best score", value: data?.bestScore != null ? `${data.bestScore}` : "—" },
    { icon: BarChart3, label: "Average score", value: data?.averageScore != null ? `${data.averageScore}` : "—" },
    { icon: Clock3, label: "Mocks submitted", value: String(attempts.length) },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Primary action: always visible, even if history or the mock list cannot load */}
      {data?.inProgress && (
        <Link href={`/afcat/lab?session=${data.inProgress.sessionId}`} className="flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-800">
          Resume {data.inProgress.title} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-700">{firstTime ? "Start here" : "Attempt a mock"}</h2>
        <div className="mt-4 rounded-2xl bg-slate-900 p-5 text-white">
          <p className="text-sm text-slate-300">{mock ? `${mock.expected_questions} questions · ${Math.round(mock.duration_seconds / 60)} min · ${mock.max_marks} marks · +3 / −1 · free` : "Mock catalogue is temporarily unavailable. Check the live mock list before starting."}</p>
          <Link href="/afcat/lab" className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 text-base font-bold text-white hover:bg-blue-400 sm:w-auto">
            {ctaLabel} <ArrowRight className="h-5 w-5" />
          </Link>
          {firstTime && <p className="mt-3 text-xs text-slate-400">Keep 2 uninterrupted hours. Your score, section accuracy and weak topics appear here the moment you submit.</p>}
        </div>

        {state === "loading" && <div className="mt-5 h-24 animate-pulse rounded-2xl bg-slate-100" />}
        {state === "signin" && (
          <p className="mt-5 text-sm text-slate-600">
            <Link href="/auth/login?next=/afcat/dashboard" className="font-bold text-blue-700 hover:underline">Sign in</Link> to see the mocks you have attempted and your performance analytics.
          </p>
        )}
        {state === "error" && <p className="mt-5 text-sm text-slate-500">Your past attempts could not be loaded right now. You can still start a mock above; refresh to try again.</p>}
        {state === "ready" && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Your attempted mocks</h3>
            {attempts.length === 0 ? (
              <p className="mt-3 text-sm text-slate-600">No mock submitted yet.</p>
            ) : (
              <ul className="mt-2 divide-y divide-slate-100">
                {attempts.map((a) => (
                  <li key={a.sessionId} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                    <div>
                      <p className="font-bold">{a.title}</p>
                      <p className="text-xs text-slate-500">{date(a.completedAt)} · {formatQuestionTime(a.questionTimeSeconds)} · {a.correct} correct, {a.incorrect} wrong, {a.unanswered} skipped</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black">{a.score ?? "—"}/{a.maxMarks}</span>
                      <Link href={`/afcat/lab?session=${a.sessionId}`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-blue-700 hover:border-blue-400">View analysis</Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* 2. Performance analytics, same blocks as the CDS dashboard */}
      {state === "ready" && attempts.length > 0 && data && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cards.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
                <Icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <p className="mt-2 text-2xl font-black">{value}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          {data.sections.length > 0 && (
            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-700">Section accuracy (all mocks)</h2>
              <ul className="mt-4 space-y-4">
                {data.sections.map((s) => (
                  <li key={s.section}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-bold">{s.label}</span>
                      <span className="text-slate-600">{s.accuracyPercent}% · {s.correct}/{s.total} correct · {s.unanswered} skipped</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(100, s.accuracyPercent)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {data.weakTopics.length > 0 && (
            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-700">Topics costing you the most marks</h2>
              <ul className="mt-4 divide-y divide-slate-100">
                {data.weakTopics.map((t) => (
                  <li key={`${t.section}-${t.topic}`} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="font-semibold">{t.topic}</span>
                    <span className="text-slate-600">{t.marksLost} marks lost · {t.accuracyPercent}% accuracy</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
