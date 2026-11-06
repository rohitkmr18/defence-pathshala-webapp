"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, BookOpen, ClipboardCheck, Newspaper } from "lucide-react";

import { trackLearningEvent } from "@/lib/learning-events";
import { latestMonthlyCapsule } from "@/lib/monthly-capsules";

const tileClass =
  "group relative flex min-h-[112px] flex-col justify-between overflow-hidden rounded-2xl border border-blue-400/20 bg-white/[0.045] p-4 text-left backdrop-blur-sm transition-all duration-200 hover:border-blue-400/40 hover:bg-blue-500/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.99] sm:min-h-[118px] sm:p-5";

/** Secondary free tools. Kept below the first screen so the hero asks one question only. */
export default function HomeMoreTools() {
  const capsule = latestMonthlyCapsule();
  return (
    <section className="bg-slate-950 px-4 pb-14 pt-2 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-sm font-bold uppercase tracking-[0.16em] text-blue-300">More free tools</h2>
        <p className="mt-2 text-center text-sm text-slate-400">Everything else in Defence Pathshala, one tap away.</p>
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/dashboard/question-bank"
              className="group flex min-h-[112px] flex-col justify-between rounded-2xl border border-blue-400/20 bg-white/[0.045] p-4 text-left backdrop-blur-sm transition-all duration-200 hover:border-blue-400/40 hover:bg-blue-500/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.99] sm:min-h-[118px] sm:p-5"
            >
              <span className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-inset ring-blue-400/20">
                  <BarChart3 className="h-4.5 w-4.5 text-blue-300" />
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-blue-300" />
              </span>
              <span>
                <span className="block text-sm font-bold text-white sm:text-base">
                  Decode PYQs
                </span>
                <span className="mt-1 block text-[11px] font-medium leading-snug text-slate-400 sm:text-xs">
                  Trends &amp; weightage
                </span>
              </span>
            </Link>

            <Link
              href="/current-affairs"
              className="group relative flex min-h-[112px] flex-col justify-between overflow-hidden rounded-2xl border border-blue-400/20 bg-white/[0.045] p-4 text-left backdrop-blur-sm transition-all duration-200 hover:border-blue-400/40 hover:bg-blue-500/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.99] sm:min-h-[118px] sm:p-5"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-orange-400 via-white to-emerald-500 opacity-80"
              />
              <span className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-inset ring-blue-400/20">
                  <Newspaper className="h-4.5 w-4.5 text-blue-300" />
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-blue-300" />
              </span>
              <span>
                <span className="block text-sm font-bold text-white sm:text-base">
                  Daily Current Affairs
                </span>
                <span className="mt-1 block text-[11px] font-medium leading-snug text-slate-400 sm:text-xs">
                  Today&apos;s exam briefs
                </span>
              </span>
            </Link>

            <Link
              href="/afcat"
              onClick={() => trackLearningEvent("home_tile_click", { tile: "afcat_mocks" })}
              className={tileClass}
            >
              <span className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-inset ring-blue-400/20">
                  <ClipboardCheck className="h-4.5 w-4.5 text-blue-300" />
                </span>
                <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">Free</span>
              </span>
              <span>
                <span className="block text-sm font-bold text-white sm:text-base">
                  AFCAT Full Mocks
                </span>
                <span className="mt-1 block text-[11px] font-medium leading-snug text-slate-400 sm:text-xs">
                  100 Qs &middot; instant analysis
                </span>
              </span>
            </Link>

            {capsule && (
              <Link
                href={`/current-affairs/monthly/${capsule.edition}`}
                onClick={() => trackLearningEvent("home_tile_click", { tile: "monthly_capsule", edition: capsule.edition })}
                className={tileClass}
              >
                <span className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-inset ring-blue-400/20">
                    <BookOpen className="h-4.5 w-4.5 text-blue-300" />
                  </span>
                  <span className="rounded-full bg-blue-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300">New</span>
                </span>
                <span>
                  <span className="block text-sm font-bold text-white sm:text-base">
                    {capsule.label} Capsule
                  </span>
                  <span className="mt-1 block text-[11px] font-medium leading-snug text-slate-400 sm:text-xs">
                    Monthly CA &middot; read online
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
