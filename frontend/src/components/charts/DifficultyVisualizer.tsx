"use client";

import { useMemo } from "react";
import { Gauge, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

interface DifficultyVisualizerProps {
  difficulty: {
    name: string;
    value: number;
  }[];
  totalQuestions: number;
  subjectContext?: string | null;
}

export default function DifficultyVisualizer({
  difficulty,
  totalQuestions,
  subjectContext,
}: DifficultyVisualizerProps) {
  const diffMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of difficulty) {
      map[item.name.toLowerCase()] = item.value;
    }
    return map;
  }, [difficulty]);

  const easy = diffMap["easy"] || 0;
  const moderate = diffMap["moderate"] || 0;
  const hard = diffMap["hard"] || 0;
  const sum = easy + moderate + hard || totalQuestions || 1;

  const easyPct = Number(((easy / sum) * 100).toFixed(1));
  const modPct = Number(((moderate / sum) * 100).toFixed(1));
  const hardPct = Number(((hard / sum) * 100).toFixed(1));

  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
      {/* ── Section Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 shadow-2xs">
            <Gauge className="h-3.5 w-3.5 text-blue-600" />
            <span>
              {subjectContext
                ? `${subjectContext.toUpperCase()} DIFFICULTY PROFILE`
                : "EXAM DIFFICULTY PROFILE"}
            </span>
          </div>
          <h2 className="mt-2.5 text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            {subjectContext
              ? `${subjectContext} — Difficulty Split`
              : "Cognitive Rigor & Difficulty Split"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {subjectContext
              ? `Categorized difficulty distribution for ${subjectContext} (${totalQuestions} Questions)`
              : "Categorized by UPSC historical candidate success rates and conceptual depth"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
            <span>Core Anchor:</span>
            <strong className="text-blue-600 font-black">Moderate ({modPct}%)</strong>
          </span>
        </div>
      </div>

      {/* ── Comparative Segmented Multi-Bar ──────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2.5">
          <span>Overall Distribution</span>
          <span>100% of analyzed questions</span>
        </div>

        <div className="flex h-5 w-full overflow-hidden rounded-xl bg-slate-100 p-0.5 shadow-inner">
          {easyPct > 0 && (
            <div
              style={{ width: `${easyPct}%` }}
              title={`Easy: ${easy} Qs (${easyPct}%)`}
              className="group relative flex items-center justify-center bg-emerald-500 text-[10px] font-black text-white transition-all first:rounded-l-lg hover:brightness-110"
            >
              {easyPct >= 8 && `${easyPct}%`}
            </div>
          )}
          {modPct > 0 && (
            <div
              style={{ width: `${modPct}%` }}
              title={`Moderate: ${moderate} Qs (${modPct}%)`}
              className="group relative flex items-center justify-center bg-blue-600 text-[10px] font-black text-white transition-all hover:brightness-110"
            >
              {modPct >= 8 && `${modPct}%`}
            </div>
          )}
          {hardPct > 0 && (
            <div
              style={{ width: `${hardPct}%` }}
              title={`Hard: ${hard} Qs (${hardPct}%)`}
              className="group relative flex items-center justify-center bg-rose-500 text-[10px] font-black text-white transition-all last:rounded-r-lg hover:brightness-110"
            >
              {hardPct >= 8 && `${hardPct}%`}
            </div>
          )}
        </div>

        {/* Bar Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">Easy ({easy} Qs)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-600" />
            <span className="font-bold text-slate-900">Moderate ({moderate} Qs)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500" />
            <span className="font-semibold text-slate-700">Hard ({hard} Qs)</span>
          </div>
        </div>
      </div>

      {/* ── 3 Strategic Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Easy Card */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 transition-all hover:shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-2xl font-black text-emerald-800">
              {easy}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Easy Questions
          </h3>
          <p className="text-xs font-semibold text-emerald-700 mt-0.5">
            {easyPct}% of examined paper
          </p>
          <div className="mt-3 rounded-xl bg-white/80 p-3 border border-emerald-100/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Scoring Strategy
            </p>
            <p className="mt-1 text-xs text-slate-700 leading-relaxed font-medium">
              Base scoring anchor. Target <strong className="text-emerald-800 font-bold">90%+ accuracy</strong>. Mark loss here directly hurts merit rank.
            </p>
          </div>
        </div>

        {/* Moderate Card */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Gauge className="h-5 w-5" />
            </div>
            <span className="text-2xl font-black text-blue-900">
              {moderate}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Moderate Questions
          </h3>
          <p className="text-xs font-semibold text-blue-700 mt-0.5">
            {modPct}% of examined paper (The Decider)
          </p>
          <div className="mt-3 rounded-xl bg-white p-3 border border-blue-100 shadow-2xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Rank Deciding Zone
            </p>
            <p className="mt-1 text-xs text-slate-700 leading-relaxed font-medium">
              The core UPSC battleground. Target <strong className="text-blue-700 font-bold">70–75% accuracy</strong> through elimination & conceptual depth.
            </p>
          </div>
        </div>

        {/* Hard Card */}
        <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5 transition-all hover:shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <span className="text-2xl font-black text-rose-900">
              {hard}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Hard Questions
          </h3>
          <p className="text-xs font-semibold text-rose-700 mt-0.5">
            {hardPct}% of examined paper
          </p>
          <div className="mt-3 rounded-xl bg-white/80 p-3 border border-rose-100/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Risk Management
            </p>
            <p className="mt-1 text-xs text-slate-700 leading-relaxed font-medium">
              Eliminator traps. Never blind guess. Only attempt if you eliminate at least 2 options to protect negative marks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

