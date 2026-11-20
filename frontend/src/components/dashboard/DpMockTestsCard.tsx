"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, ClipboardCheck, Clock, PlayCircle, Trophy } from "lucide-react";
import { completedAttempts, DP_MOCKS_ENABLED, DP_MOCKS_HREF, useMockAttempts } from "@/lib/mock/attempts";

/** Home-dashboard summary of DP Mock Test attempts (CDS GK). Hidden unless the release flag is on. */
export default function DpMockTestsCard() {
  const { attempts, error } = useMockAttempts();
  if (!DP_MOCKS_ENABLED || error) return null;
  if (attempts === null) return <div className="h-40 animate-pulse rounded-3xl border border-slate-200 bg-slate-50" aria-hidden="true" />;

  const done = completedAttempts(attempts);
  const latest = done.at(-1);
  const best = done.reduce<number | null>((b, a) => (b === null || a.result!.score > b ? a.result!.score : b), null);
  const live = attempts.find((a) => a.status === "IN_PROGRESS");
  const minutesLeft = live ? Math.max(0, Math.round((Date.parse(live.deadline) - Date.now()) / 60000)) : 0;
  const trend = done.slice(-6);
  const delta = done.length >= 2 ? latest!.result!.score - done[done.length - 2].result!.score : null;

  return (
    <section aria-label="DP Mock Tests" className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-emerald-50/40 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#081b35] text-white"><ClipboardCheck className="h-5 w-5" /></span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">DP Mock Tests · CDS GK</p>
            <h2 className="text-lg font-black text-slate-900">{done.length ? "Your full-length mock record" : "Test yourself on a full UPSC-pattern paper"}</h2>
          </div>
        </div>
        <Link href={DP_MOCKS_HREF} className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:underline">All DP mocks <ArrowRight className="h-3.5 w-3.5" /></Link>
      </div>

      <div className="p-5 sm:p-6">
        {live && (
          <Link href={`/mock/cds-gk/${live.sessionId}`}
            className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm hover:bg-amber-100">
            <span className="flex items-center gap-2 font-semibold text-amber-900">
              <Clock className="h-4 w-4" />
              {live.expired ? `${live.title}: time is over — open to see your result` : `${live.title} in progress · ${minutesLeft} min left`}
            </span>
            <span className="font-bold text-amber-900">{live.expired ? "Open" : "Resume"} →</span>
          </Link>
        )}

        {latest ? (
          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Latest score</p>
                <p className="mt-1 text-2xl font-black tabular-nums text-slate-900">{latest.result!.score.toFixed(2)}<span className="text-sm font-bold text-slate-400">/{latest.result!.maxMarks.toFixed(0)}</span></p>
                {delta !== null && <p className={`text-[11px] font-bold ${delta >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(2)} vs previous</p>}
              </div>
              <div>
                <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500"><Trophy className="h-3 w-3" />Best</p>
                <p className="mt-1 text-2xl font-black tabular-nums text-slate-900">{best!.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Attempts</p>
                <p className="mt-1 text-2xl font-black tabular-nums text-slate-900">{done.length}</p>
              </div>
            </div>
            {trend.length > 1 && (
              <div className="flex h-14 items-end gap-1.5" aria-label="Recent scores">
                {trend.map((a) => (
                  <div key={a.sessionId} title={`${a.title}: ${a.result!.score.toFixed(2)}`}
                    className="w-4 rounded-t bg-blue-500/80" style={{ height: `${Math.max(6, (Math.max(0, a.result!.score) / a.result!.maxMarks) * 100)}%` }} />
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <Link href={`/mock/cds-gk/${latest.sessionId}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#081b35] px-4 text-sm font-bold text-white hover:bg-[#0f2f5c]"><BarChart3 className="h-4 w-4" />View latest analysis</Link>
              <Link href={DP_MOCKS_HREF} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"><PlayCircle className="h-4 w-4" />Take another mock</Link>
            </div>
          </div>
        ) : !live ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-xl text-sm text-slate-600">120 original questions · 2 hours · 100 marks with UPSC negative marking. Get a subject-wise, time-wise analysis the moment you submit.</p>
            <Link href={DP_MOCKS_HREF} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"><PlayCircle className="h-4 w-4" />Start a DP Mock</Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
