"use client";

import { Suspense } from "react";
import EmailOtpForm from "@/components/auth/EmailOtpForm";
import { CheckCircle2, Shield } from "lucide-react";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* ── Left panel (branding) ─────────────────────────────────────── */}
        <div className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:w-1/2 lg:flex-col lg:items-start lg:justify-between lg:p-12">
          <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-indigo-600/15 blur-3xl" />

          {/* Logo */}
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 text-sm font-black">
              DP
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                Defence Pathshala
              </p>
              <p className="text-sm font-semibold text-slate-300">
                PYQ Intelligence
              </p>
            </div>
          </div>

          {/* Main copy */}
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-blue-300">
              <Shield className="h-3.5 w-3.5" />
              Join the Beta
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white">
              Start your{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                smart prep journey.
              </span>
            </h1>

            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
              Create your free account and get access to 1500+ curated PYQs,
              targeted practice sessions, and performance analytics.
            </p>

            <ul className="space-y-3">
              {[
                "Free to join",
                "1500+ PYQs across 4 exams",
                "No coaching centre fluff",
                "Built by AIR 163 CAPF AC",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm italic text-slate-300">
              &ldquo;I analysed thousands of PYQs after clearing CAPF AC — and
              built this so you don&apos;t have to do it alone.&rdquo;
            </p>
            <p className="mt-2 text-xs font-semibold text-blue-400">
              Rohit Kumar · IIT Kanpur · BSF AC · AIR 163
            </p>
          </div>
        </div>

        {/* ── Right panel (form) ───────────────────────────────────────── */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8 lg:px-12">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white text-sm font-black shadow-md shadow-blue-600/20">
              DP
            </div>
            <span className="text-sm font-bold text-slate-900">
              Defence Pathshala
            </span>
          </div>

          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Create your account
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Verify your email with a code and start preparing — free.
              </p>
            </div>

            <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
              <EmailOtpForm mode="signup" />
            </Suspense>

          </div>
        </div>
      </div>
    </main>
  );
}
