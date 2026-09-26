"use client";

import { FormEvent, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Shield, ArrowRight, CheckCircle2 } from "lucide-react";

// ─── Inner component that reads search params ───────────────────────────────

function LoginForm() {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Redirect to next URL or dashboard
    window.location.href = nextUrl;
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5" noValidate>
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-slate-700"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="you@example.com"
        />
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-slate-700"
          >
            Password
          </label>
          <button
            type="button"
            className="text-xs font-semibold text-blue-600 hover:text-blue-500 focus:outline-none focus-visible:underline"
          >
            Forgot password?
          </button>
        </div>

        <div className="relative mt-2">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 pr-12 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-slate-600 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Signing in…
          </>
        ) : (
          <>
            Log In
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Sign up link */}
      <p className="text-center text-sm text-slate-500">
        New here?{" "}
        <Link
          href="/auth/signup"
          className="font-semibold text-blue-600 hover:text-blue-500 transition"
        >
          Create a free account
        </Link>
      </p>
    </form>
  );
}

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
              Access 730+ PYQs for CDS, CAPF AC, NDA and AFCAT. Track
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
                Welcome back
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Sign in to your PYQ Intelligence dashboard.
              </p>
            </div>

            <Suspense fallback={<div className="text-sm text-slate-500">Loading…</div>}>
              <LoginForm />
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
