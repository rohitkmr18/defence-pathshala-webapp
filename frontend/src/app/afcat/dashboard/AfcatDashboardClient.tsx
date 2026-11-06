"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Clock3, Target, Trophy } from "lucide-react";

type Attempt = {
  sessionId: string; title: string; status: string; score: number | null; maxMarks: number;
  correct: number; incorrect: number; unanswered: number; timeSeconds: number; completedAt: string | null;
};
type Section = { section: string; label: string; total: number; correct: number; incorrect: number; unanswered: number; accuracyPercent: number; marks: number; maximumMarks: number };
type Topic = { section: string; topic: string; total: number; accuracyPercent: number; marksLost: number };
type Dashboard = {
  attempts: Attempt[]; inProgress: { sessionId: string; title: string } | null;
  bestScore: number | null; averageScore: number | null; sections: Section[]; weakTopics: Topic[];
};

const minutes = (s: number) => `${Math.round(s / 60)} min`;
const date = (v: string | null) => (v ? new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");

export default function AfcatDashboardClient() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [state, setState] = useState<"loading" | "signin" | "error" | "ready">("loading");

  useEffect(() => {
    let active = true;
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

  if (state === "loading") return <div className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white" />;
  if (state === "signin") {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <p className="font-bold">Sign in to see your AFCAT dashboard.</p>
        <Link href="/auth/login?next=/afcat/dashboard" className="mt-4 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white">Sign in</Link>
      </div>
    );
  }
  if (state === "error" || !data) return <p className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">Your AFCAT dashboard could not be loaded. Please refresh.</p>;

  const latest = data.attempts.find((a) => a.score !== null) ?? null;
  if (!data.attempts.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-lg font-black">No AFCAT mock submitted yet</p>
        <p className="mt-2 text-sm text-slate-600">Attempt a full mock and your scores, section accuracy and weak topics will appear here.</p>
        <Link href={data.inProgress ? `/afcat/lab?session=${data.inProgress.sessionId}` : "/afcat/lab"} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white">
          {data.inProgress ? "Resume your mock" : "Attempt Full Mock"} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const cards = [
    { icon: Target, label: "Latest score", value: latest ? `${latest.score}/${latest.maxMarks}` : "—" },
    { icon: Trophy, label: "Best score", value: data.bestScore !== null ? `${data.bestScore}` : "—" },
    { icon: BarChart3, label: "Average score", value: data.averageScore !== null ? `${data.averageScore}` : "—" },
    { icon: Clock3, label: "Mocks submitted", value: String(data.attempts.length) },
  ];

  return (
    <div className="space-y-6">
      {data.inProgress && (
        <Link href={`/afcat/lab?session=${data.inProgress.sessionId}`} className="flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-800">
          Resume {data.inProgress.title} <ArrowRight className="h-4 w-4" />
        </Link>
      )}

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

      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-700">Your mocks</h2>
        <ul className="mt-4 divide-y divide-slate-100">
          {data.attempts.map((a) => (
            <li key={a.sessionId} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <div>
                <p className="font-bold">{a.title}</p>
                <p className="text-xs text-slate-500">{date(a.completedAt)} · {minutes(a.timeSeconds)} · {a.correct} correct, {a.incorrect} wrong, {a.unanswered} skipped</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black">{a.score ?? "—"}/{a.maxMarks}</span>
                <Link href={`/afcat/lab?session=${a.sessionId}`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-blue-700 hover:border-blue-400">View analysis</Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
