"use client";

import { Suspense } from "react";
import Link from "next/link";
import EmailOtpForm from "@/components/auth/EmailOtpForm";
import { Shield, CheckCircle2 } from "lucide-react";

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* ── Left panel (branding) ─────────────────────────────────────── */}
        <div className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:w-1/2 lg:flex-col lg:items-start lg:justify-between lg:p-12">
          {/* Background glows */}
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
              AI-Powered Exam Prep
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white">
              Practice with{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                intelligence.
              </span>
            </h1>

            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
              Access 1500+ PYQs for CDS, CAPF AC, NDA and AFCAT. Track
              your progress and target your weak areas.
            </p>

            {/* Feature list */}
            <ul className="space-y-3">
              {[
                "Subject-wise PYQ Intelligence",
                "Targeted Practice Sessions",
                "Performance Analytics",
                "Built by a BSF Officer · AIR 163",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom quote */}
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm italic text-slate-300">
              &ldquo;Built by someone who has cleared CAPF AC with AIR 163 — not just
              taught it.&rdquo;
            </p>
            <p className="mt-2 text-xs font-semibold text-blue-400">
              Rohit Kumar · IIT Kanpur · BSF AC
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
                Sign in or create an account
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                One email code. No password to remember.
              </p>
            </div>

            <Suspense fallback={<div className="text-sm text-slate-500">Loading…</div>}>
              <EmailOtpForm />
            </Suspense>

            {/* Explore without login */}
            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <p className="text-xs text-slate-500">
                Want to explore first?{" "}
                <Link
                  href="/dashboard"
                  className="font-semibold text-slate-800 hover:text-blue-600 transition"
                >
                  Browse without an account →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
