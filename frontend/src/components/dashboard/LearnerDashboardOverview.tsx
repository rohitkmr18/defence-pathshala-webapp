"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock3,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  Target,
} from "lucide-react";
import type { LearnerIntelligence } from "@/lib/learner-intelligence";
import MockPerformanceHub from "./MockPerformanceHub";
import SectionHeader from "@/components/ui/SectionHeader";

interface Props {
  firstName: string;
  targetExams: string[];
}

function formatDuration(seconds: number) {
  if (!seconds) return "0m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export default function LearnerDashboardOverview({
  firstName,
  targetExams,
}: Props) {
  const [data, setData] = useState<LearnerIntelligence | null>(null);
  const [error, setError] = useState(false);
  const [activityOpen, setActivityOpen] = useState(true);
  const [showAllSessions, setShowAllSessions] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setError(false);
        const response = await fetch("/api/learner-intelligence", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Learner intelligence unavailable");
        const next = (await response.json()) as LearnerIntelligence;
        if (active) setData(next);
      } catch {
        if (active) setError(true);
      }
    };

    void load();

    const refresh = () => void load();
    window.addEventListener("dp_question_attempted", refresh);
    window.addEventListener("dp_practice_session_updated", refresh);
    return () => {
      active = false;
      window.removeEventListener("dp_question_attempted", refresh);
      window.removeEventListener("dp_practice_session_updated", refresh);
    };
  }, []);

  if (!data && !error) {
    return (
      <section
        aria-label="Loading learner intelligence"
        className="grid gap-5 animate-pulse"
      >
        <div className="h-52 rounded-3xl border border-slate-200 bg-slate-50" />
        <div className="h-32 rounded-3xl border border-slate-200 bg-slate-50" />
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
          Preparation intelligence temporarily unavailable
        </p>
        <h1 className="mt-2 text-2xl font-black text-slate-900">
          Hi, {firstName}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-600">
          Your saved attempts are safe. Continue practice while the dashboard
          read model reconnects.
        </p>
        <Link
          href={
            targetExams[0]
              ? `/dashboard/practice?exam=${encodeURIComponent(targetExams[0])}`
              : "/dashboard/practice"
          }
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
        >
          Continue Practice
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-lg sm:p-8">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
              Your preparation, your path
            </p>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
              {targetExams.length
                ? targetExams.join(" + ")
                : "Set your target exam"}
            </span>
          </div>

          <h1 className="mt-4 break-words text-3xl font-black tracking-tight sm:text-4xl">
            Welcome back, {firstName.trim() || "Aspirant"}.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {data.overview.attempts > 0
              ? `${data.overview.attempts} saved answers · ${data.overview.uniqueQuestionsSolved} unique PYQs · ${data.overview.accuracy}% accuracy`
              : "Every question is a step towards your uniform. Let’s begin."}
          </p>
          <div className="mt-6 border-t border-white/15 pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">Next Best Move</p>
            <h2 className="mt-2 max-w-3xl break-words text-2xl font-black tracking-tight line-clamp-2 sm:text-3xl">
              {data.nextBestMove.title}
            </h2>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 line-clamp-2 sm:text-base">
            {data.nextBestMove.reason}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={data.nextBestMove.href}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-400"
            >
              {data.nextBestMove.type === "resume_session"
                ? "Resume Practice"
                : data.nextBestMove.type === "review_mistakes"
                  ? "Review Mistakes"
                  : "Start Now"}
              <ArrowRight className="h-4 w-4" />
            </Link>

            {data.mistakes.unresolved > 0 &&
              data.nextBestMove.type !== "review_mistakes" && (
                <Link
                  href="/dashboard/mistakes"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  <RefreshCcw className="h-4 w-4" />
                  {data.mistakes.unresolved} unresolved mistakes
                </Link>
              )}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Preparation Snapshot
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-900">
              How you are performing
            </h2>
          </div>
          <span className="hidden text-xs font-medium text-slate-500 sm:block">
            Canonical saved attempts
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Attempts"
            value={String(data.overview.attempts)}
            detail="All saved answers"
          />
          <MetricCard
            icon={<Brain className="h-4 w-4" />}
            label="Unique PYQs"
            value={String(data.overview.uniqueQuestionsSolved)}
            detail="Distinct questions solved"
          />
          <MetricCard
            icon={<Target className="h-4 w-4" />}
            label="Accuracy"
            value={`${data.overview.accuracy}%`}
            detail={`${data.overview.correct} correct · ${data.overview.incorrect} incorrect`}
          />
          <MetricCard
            icon={<Clock3 className="h-4 w-4" />}
            label="Practice Time"
            value={formatDuration(data.overview.practiceTimeSeconds)}
            detail={`${data.overview.completedSessions} completed sessions`}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Needs Attention
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-900">
              Highest-impact weak areas
            </h2>
          </div>
          {data.mistakes.unresolved > 0 && (
            <Link
              href="/dashboard/mistakes"
              className="text-sm font-bold text-blue-700 hover:underline"
            >
              View mistakes
            </Link>
          )}
        </div>

        {data.needsAttention.length ? (
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {data.needsAttention.map((area) => (
              <div
                key={`${area.exam}-${area.subject}-${area.topic}`}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {area.exam} · {area.subject}
                </p>
                <h3 className="mt-1 line-clamp-2 font-black text-slate-900">
                  {area.topic}
                </h3>
                <p className="mt-2 text-sm font-semibold text-rose-700">
                  {area.accuracy}% accuracy · {area.attempts} attempts
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {area.corpusQuestions} relevant PYQs in the corpus
                </p>
                <Link
                  href={area.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:underline"
                >
                  Practice 10 PYQs
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <p className="font-bold text-slate-900">
              More evidence needed for weak-area ranking.
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Complete a few targeted practice sets. DP requires at least three
              attempts in a topic before calling it a weak area.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-7">
        <button
          type="button"
          onClick={() => setActivityOpen((open) => !open)}
          className="flex w-full items-start justify-between gap-4 text-left"
          aria-expanded={activityOpen}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recent Activity
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-900">
              Your practice sessions
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {data.recentActivity.length} session{data.recentActivity.length === 1 ? "" : "s"} opened or attempted
            </p>
          </div>
          <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
            {activityOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </button>

        {activityOpen && (data.recentActivity.length ? (
          <>
            <div className="mt-4 divide-y divide-slate-100">
              {(showAllSessions ? data.recentActivity : data.recentActivity.slice(0, 3)).map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900">{session.title}</p>
                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                      {session.mode.replace("_", " ")} · {session.correct} correct · {session.incorrect} incorrect
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        session.isCompleted
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {session.isCompleted ? "Completed" : "In progress"}
                    </span>
                    {session.isCompleted && session.analysisHref ? (
                      <Link
                        href={session.analysisHref}
                        className="text-xs font-bold text-blue-700 hover:underline"
                      >
                        View analysis
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/practice/session?resume=true&session_id=${encodeURIComponent(session.id)}&returnTo=%2Fdashboard&origin=dashboard`}
                        className="text-xs font-bold text-blue-700 hover:underline"
                      >
                        Resume
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {data.recentActivity.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllSessions((show) => !show)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                aria-expanded={showAllSessions}
              >
                {showAllSessions ? "Show latest 3" : `Show all ${data.recentActivity.length} sessions`}
                {showAllSessions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            )}
          </>
        ) : (
          <p className="mt-4 text-sm text-slate-600">
            Your completed and in-progress sessions will appear here.
          </p>
        ))}
      </section>

      <section id="performance-coach" className="mt-10 scroll-mt-20">
        <SectionHeader
          eyebrow="DP Performance Coach"
          title="Mock Test Analytics & Diagnostics"
          description="Durable full-paper performance trajectory, recurring weak spots, and recovery upside across your saved attempts."
        />
        <div className="mt-6">
          <MockPerformanceHub snapshot={data.performanceCoach} />
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-[11px] font-medium text-slate-500 sm:text-xs">
        {detail}
      </p>
    </div>
  );
}
