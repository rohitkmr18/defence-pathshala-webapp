"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw, Target, Award, Clock, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import type { AnalysisMetrics } from "@/lib/analysis/computeAnalysisMetrics";

interface MockDebriefHeroProps {
  metrics: AnalysisMetrics;
  examTitle: string;
  onRetake?: () => void;
  isFiltered?: boolean;
}

export default function MockDebriefHero({
  metrics,
  examTitle,
  onRetake,
  isFiltered = false,
}: MockDebriefHeroProps) {
  return (
    <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-2xl sm:p-10">
      {/* Top Bar with Badge and Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
            {isFiltered ? "Targeted Practice Debrief" : "UPSC AI Mock Debrief"}
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-white">
            {examTitle}
          </h1>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            {isFiltered
              ? "Session breakdown & actionable intelligence"
              : "Comprehensive examination audit & tactical recovery roadmap"}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onRetake && (
            <button
              type="button"
              onClick={onRetake}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retake</span>
            </button>
          )}
          <Link
            href="/dashboard/practice"
            className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Practice Home</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-800 pt-8 sm:grid-cols-4">
        {/* Net Score */}
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-slate-400">Net Score</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white sm:text-4xl">
              {metrics.netScore}
            </span>
            <span className="text-xs text-slate-400 sm:text-sm">/ {metrics.maxMarks}</span>
          </div>
          <p className="text-[11px] text-slate-500">+2.00 / -0.67 marking</p>
        </div>

        {/* Accuracy Rate (NEW) */}
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-slate-400">Accuracy Rate</p>
          <p className="text-3xl font-extrabold text-blue-400 sm:text-4xl">
            {metrics.accuracyRate}%
          </p>
          <p className="text-[11px] text-slate-500">Excludes skipped questions</p>
        </div>

        {/* Attempt Rate */}
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-slate-400">Attempt Rate</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white sm:text-4xl">
              {metrics.attemptRate}%
            </span>
            <span className="text-xs text-slate-400">({metrics.attempted}/{metrics.total})</span>
          </div>
          <p className="text-[11px] text-slate-500">Coverage of the paper</p>
        </div>

        {/* Time Used */}
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-slate-400">Time Used</p>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-2xl font-bold text-white sm:text-3xl">
              {metrics.formattedTime}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            ~{metrics.timeManagement.avgTimePerQuestionSeconds}s per question
          </p>
        </div>
      </div>

      {/* Answer Distribution Strip */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/5 px-5 py-3 border border-white/5 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="text-slate-300">
            <strong className="text-white">{metrics.correct}</strong> Correct
          </span>
        </div>

        <div className="flex items-center gap-2">
          <XCircle className="h-4 w-4 text-red-400" />
          <span className="text-slate-300">
            <strong className="text-white">{metrics.incorrect}</strong> Incorrect
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MinusCircle className="h-4 w-4 text-slate-400" />
          <span className="text-slate-300">
            <strong className="text-white">{metrics.skipped}</strong> Skipped
          </span>
        </div>

        {metrics.totalRecoverableMarks > 0 && (
          <div className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-emerald-300 font-semibold">
            +{metrics.totalRecoverableMarks} Recoverable Marks
          </div>
        )}
      </div>
    </div>
  );
}
