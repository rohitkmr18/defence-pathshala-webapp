"use client";

import React from "react";
import {
  Lightbulb,
  ClipboardList,
  Target,
  BarChart2,
  BookOpen,
  Brain,
  Timer,
  EyeOff,
  BarChart3,
  TrendingUp,
} from "lucide-react";

export interface ModeCardProps {
  onStart: () => void;
  disabled?: boolean;
}

// ── Benefit Item Subcomponent ────────────────────────────────────────────────
interface BenefitItemProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
}

function BenefitItem({ icon, iconBg, label }: BenefitItemProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full ${iconBg} shadow-2xs mb-2 shrink-0 transition-transform`}
      >
        {icon}
      </div>
      <span className="text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
        {label}
      </span>
    </div>
  );
}

// ── Card 1: Instant Feedback ─────────────────────────────────────────────────
export function InstantFeedbackCard({ onStart, disabled = false }: ModeCardProps) {
  return (
    <article
      className={`
        flex flex-col rounded-[32px] border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10
        shadow-sm transition-all duration-200
        dark:border-slate-800 dark:bg-slate-900
        ${
          disabled
            ? "opacity-60 cursor-not-allowed"
            : "hover:-translate-y-0.5 hover:shadow-lg hover:border-blue-200/80 dark:hover:border-blue-900/60"
        }
      `}
      aria-label="Instant Feedback Practice Mode"
    >
      {/* Top Header: 64x64 Icon + Badge */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF5FF] text-blue-600 shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 shrink-0">
          <Lightbulb className="h-8 w-8" aria-hidden="true" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF5FF] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 shadow-2xs">
          🔥 Most Popular
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[30px] sm:text-[34px] lg:text-[40px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
        Instant Feedback
      </h3>

      {/* Value Hook */}
      <p className="mt-2 text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400 leading-snug">
        Turn every question into a learning shortcut.
      </p>

      {/* Supporting Copy */}
      <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-500 dark:text-slate-400 max-w-2xl">
        See the answer instantly, understand why it&apos;s right, and uncover
        the concept, theme, and source before moving ahead.
      </p>

      {/* Benefit Strip */}
      <div className="mt-6 sm:mt-8 rounded-2xl bg-[#F6FAFF] border border-blue-100/70 p-4 sm:p-5 dark:bg-slate-800/50 dark:border-blue-950/60">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          <BenefitItem
            icon={<Target className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />}
            iconBg="bg-blue-100/80 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
            label="Learn Faster"
          />
          <BenefitItem
            icon={<BarChart2 className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />}
            iconBg="bg-amber-100/80 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
            label="Spot Weak Areas"
          />
          <BenefitItem
            icon={<BookOpen className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />}
            iconBg="bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
            label="Concept & Source"
          />
          <BenefitItem
            icon={<Brain className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />}
            iconBg="bg-indigo-100/80 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300"
            label="Reduce Avoidable Mistakes"
          />
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6 sm:mt-8">
        <button
          type="button"
          onClick={onStart}
          disabled={disabled}
          aria-label="Start Learning with Instant Feedback"
          className="h-14 w-full rounded-2xl border-[3px] border-blue-600 bg-white px-6 text-base sm:text-lg font-bold text-blue-600 shadow-2xs transition-all duration-200 hover:scale-[1.01] hover:bg-blue-600 hover:text-white active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-blue-600 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-center gap-2"
        >
          <span>Start Learning &rarr;</span>
        </button>
      </div>
    </article>
  );
}

// ── Card 2: Attempt at Once ──────────────────────────────────────────────────
export function AttemptAtOnceCard({ onStart, disabled = false }: ModeCardProps) {
  return (
    <article
      className={`
        flex flex-col rounded-[32px] border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10
        shadow-sm transition-all duration-200
        dark:border-slate-800 dark:bg-slate-900
        ${
          disabled
            ? "opacity-60 cursor-not-allowed"
            : "hover:-translate-y-0.5 hover:shadow-lg hover:border-emerald-200/80 dark:hover:border-emerald-900/60"
        }
      `}
      aria-label="Attempt at Once Exam Mode"
    >
      {/* Top Header: 64x64 Icon + Badge */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF9EF] text-emerald-600 shadow-2xs dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
          <ClipboardList className="h-8 w-8" aria-hidden="true" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF9EF] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 shadow-2xs">
          🏆 Real Exam Mode
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[30px] sm:text-[34px] lg:text-[40px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
        Attempt at Once
      </h3>

      {/* Value Hook */}
      <p className="mt-2 text-base sm:text-lg font-semibold text-emerald-600 dark:text-emerald-400 leading-snug">
        Train exactly like the actual exam.
      </p>

      {/* Supporting Copy */}
      <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-500 dark:text-slate-400 max-w-2xl">
        Finish the paper without hints or answers. After submission, unlock your
        complete performance analysis with accuracy, topic-wise insights, and
        recoverable marks.
      </p>

      {/* Benefit Strip */}
      <div className="mt-6 sm:mt-8 rounded-2xl bg-[#F2FAF4] border border-emerald-100/80 p-4 sm:p-5 dark:bg-emerald-950/30 dark:border-emerald-900/40">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          <BenefitItem
            icon={<Timer className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />}
            iconBg="bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
            label="Real Timer"
          />
          <BenefitItem
            icon={<EyeOff className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />}
            iconBg="bg-rose-100/80 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300"
            label="No Hints"
          />
          <BenefitItem
            icon={<BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />}
            iconBg="bg-blue-100/80 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
            label="Full Analysis"
          />
          <BenefitItem
            icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />}
            iconBg="bg-teal-100/80 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300"
            label="Recoverable Marks"
          />
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6 sm:mt-8">
        <button
          type="button"
          onClick={onStart}
          disabled={disabled}
          aria-label="Start Mock Test at Once"
          className="h-14 w-full rounded-2xl bg-blue-600 px-6 text-base sm:text-lg font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:scale-[1.01] hover:bg-blue-700 active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 disabled:hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          <span>Start Mock &rarr;</span>
        </button>
      </div>
    </article>
  );
}

// ── Backwards Compatible Default Export ──────────────────────────────────────
export interface AttemptModeCardProps {
  variant?: "outline" | "filled";
  onStart: () => void;
  disabled?: boolean;
}

export default function AttemptModeCard({
  variant = "outline",
  onStart,
  disabled = false,
}: AttemptModeCardProps) {
  if (variant === "filled") {
    return <AttemptAtOnceCard onStart={onStart} disabled={disabled} />;
  }
  return <InstantFeedbackCard onStart={onStart} disabled={disabled} />;
}

