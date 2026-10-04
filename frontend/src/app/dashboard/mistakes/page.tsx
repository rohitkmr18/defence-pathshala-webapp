"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenCheck, RefreshCcw } from "lucide-react";
import type { LearnerIntelligence } from "@/lib/learner-intelligence";

export default function MistakesPage() {
  const [data, setData] = useState<LearnerIntelligence | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/learner-intelligence", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Failed");
        return response.json();
      })
      .then((next: LearnerIntelligence) => {
        if (active) setData(next);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
                Mistake Review
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                Understand → re-practise → resolve
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                This queue shows questions whose latest saved attempt is still
                incorrect. A later correct attempt resolves the mistake.
              </p>
            </div>

            {data?.mistakes.practiceHref && (
              <Link
                href={data.mistakes.practiceHref}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
              >
                <RefreshCcw className="h-4 w-4" />
                Practise unresolved
              </Link>
            )}
          </div>
        </section>

        {!data && !failed && (
          <div className="mt-6 h-48 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        )}

        {failed && (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <p className="font-bold text-slate-900">Mistake history unavailable.</p>
            <p className="mt-1 text-sm text-slate-600">
              Your saved attempts have not been modified. Return to the dashboard
              or continue practice.
            </p>
          </div>
        )}

        {data && data.mistakes.recent.length === 0 && (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <BookOpenCheck className="mx-auto h-8 w-8 text-emerald-700" />
            <h2 className="mt-3 text-xl font-black text-slate-900">
              No unresolved mistakes
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
              Either you have not answered enough questions yet, or your latest
              attempts have resolved the earlier errors.
            </p>
            <Link
              href="/dashboard/practice"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white"
            >
              Start Practice
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {data && data.mistakes.recent.length > 0 && (
          <section className="mt-6 space-y-3">
            <div className="flex items-center justify-between gap-4 px-1">
              <h2 className="text-lg font-black text-slate-900">
                {data.mistakes.unresolved} unresolved mistake
                {data.mistakes.unresolved === 1 ? "" : "s"}
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                Showing latest {data.mistakes.recent.length}
              </span>
            </div>

            {data.mistakes.recent.map((mistake) => (
              <article
                key={mistake.questionId}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {mistake.exam} · {mistake.subject} · {mistake.topic}
                </p>
                <h3 className="mt-2 line-clamp-3 text-base font-bold leading-relaxed text-slate-900 sm:text-lg">
                  {mistake.question}
                </h3>

                <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                  <span className="rounded-lg bg-rose-50 px-3 py-1.5 text-rose-700">
                    Your answer: {mistake.selectedOption}
                  </span>
                  {mistake.correctOption && (
                    <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-emerald-700">
                      Correct: {mistake.correctOption}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={mistake.understandHref}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Understand Answer
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={mistake.practiceHref}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
                  >
                    Practise Related PYQs
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
