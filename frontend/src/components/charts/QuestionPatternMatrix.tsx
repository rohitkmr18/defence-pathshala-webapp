"use client";

import { useMemo } from "react";
import {
  FileText,
  Brain,
  CheckCircle,
  HelpCircle,
  ListOrdered,
  Layers,
} from "lucide-react";

interface QuestionPatternMatrixProps {
  patterns: {
    name: string;
    value: number;
  }[];
  types: {
    name: string;
    value: number;
  }[];
  totalQuestions: number;
}

export default function QuestionPatternMatrix({
  patterns,
  types,
  totalQuestions,
}: QuestionPatternMatrixProps) {
  const sortedPatterns = useMemo(() => {
    return [...patterns].sort((a, b) => b.value - a.value);
  }, [patterns]);

  const sortedTypes = useMemo(() => {
    return [...types].sort((a, b) => b.value - a.value);
  }, [types]);

  const getPatternHint = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("single")) {
      return "Direct elimination possible; high speed required";
    }
    if (lower.includes("2-statement") || lower.includes("combination")) {
      return "Check Statement 1 first to discard 2 options immediately";
    }
    if (lower.includes("count")) {
      return "Recent UPSC trend; requires absolute certainty on each statement";
    }
    if (lower.includes("match")) {
      return "Cross-link pairs; find 1 known anchor to solve";
    }
    return "Standard conceptual testing format";
  };

  const getTypeStyle = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("factual")) {
      return {
        barColor: "bg-blue-600",
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        tag: "Memory & Retention",
      };
    }
    if (lower.includes("conceptual")) {
      return {
        barColor: "bg-indigo-600",
        badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
        tag: "Principle & Application",
      };
    }
    return {
      barColor: "bg-purple-600",
      badge: "bg-purple-50 text-purple-700 border-purple-200",
      tag: "Multi-Step Deduction",
    };
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ── Card 1: Question Pattern Distribution ─────────────────────── */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 shadow-2xs">
            <FileText className="h-3.5 w-3.5 text-blue-600" />
            <span>FORMAT INTELLIGENCE</span>
          </div>
          <h3 className="mt-2.5 text-xl font-black tracking-tight text-slate-900">
            Question Pattern Breakdown
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Structural types of questions tested in official papers
          </p>
        </div>

        <div className="space-y-4">
          {sortedPatterns.map((item, idx) => {
            const pct = ((item.value / (totalQuestions || 1)) * 100).toFixed(1);
            const hint = getPatternHint(item.name);

            return (
              <div
                key={item.name}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-slate-50 hover:border-slate-200"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {item.name}
                  </span>
                  <div className="flex items-baseline gap-1.5 shrink-0">
                    <span className="text-sm font-black text-slate-900">
                      {item.value}
                    </span>
                    <span className="text-xs font-semibold text-blue-600">
                      ({pct}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-500 font-medium">
                  {hint}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Card 2: Cognitive Question Types ──────────────────────────── */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 shadow-2xs">
            <Brain className="h-3.5 w-3.5 text-indigo-600" />
            <span>COGNITIVE DEPTH</span>
          </div>
          <h3 className="mt-2.5 text-xl font-black tracking-tight text-slate-900">
            Cognitive Depth Distribution
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Factual recall vs conceptual depth demanded by questions
          </p>
        </div>

        <div className="space-y-4">
          {sortedTypes.map((item) => {
            const pct = ((item.value / (totalQuestions || 1)) * 100).toFixed(1);
            const style = getTypeStyle(item.name);

            return (
              <div
                key={item.name}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-slate-50 hover:border-slate-200"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {item.name}
                    </span>
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${style.badge}`}
                    >
                      {style.tag}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 shrink-0">
                    <span className="text-sm font-black text-slate-900">
                      {item.value}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      ({pct}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${style.barColor} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Relative Exam Share</span>
                  <span className="font-bold text-slate-800">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Strategic Takeaway Banner */}
        <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-800">
            Preparation Strategy
          </p>
          <p className="mt-1 text-xs text-slate-700 leading-relaxed font-medium">
            While factual questions form the numerical base, qualifying the cutoff hinges on converting conceptual and statement-combination questions through pattern-guided revision.
          </p>
        </div>
      </div>
    </section>
  );
}

