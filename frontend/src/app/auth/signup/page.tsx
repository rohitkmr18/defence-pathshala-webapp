"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  CheckCircle2,
  Check,
  X,
} from "lucide-react";

// ─── Password strength ────────────────────────────────────────────────────────

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score, label: "Fair", color: "bg-amber-500" };
  if (score <= 3) return { score, label: "Good", color: "bg-yellow-500" };
  if (score <= 4) return { score, label: "Strong", color: "bg-emerald-500" };
  return { score, label: "Very Strong", color: "bg-emerald-600" };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setMessage(null);
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Account created! Check your email to verify your account before logging in."
    );
    setLoading(false);
  }

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
              Create your free account and get access to 730+ curated PYQs,
              targeted practice sessions, and performance analytics.
            </p>

            <ul className="space-y-3">
              {[
                "Free to join",
                "730+ PYQs across 4 exams",
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
                Start using Defence Pathshala PYQ Intelligence — free.
              </p>
            </div>

            {/* Success message */}
            {message ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
                <h3 className="mt-3 text-base font-bold text-emerald-900">
                  Check your email!
                </h3>
                <p className="mt-2 text-sm text-emerald-700">{message}</p>
                <Link
                  href="/auth/login"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500"
                >
                  Go to Login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSignup} className="space-y-5" noValidate>
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
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 pr-12 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= strength.score
                                ? strength.color
                                : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">
                        Strength:{" "}
                        <span className="font-semibold text-slate-700">
                          {strength.label}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Confirm password
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`block w-full rounded-xl border bg-slate-50/50 px-4 py-3.5 pr-12 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:bg-white focus:outline-none focus:ring-2 ${
                        passwordsMatch
                          ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                          : passwordsMismatch
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                      }`}
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center gap-0.5 pr-4">
                      {passwordsMatch && (
                        <Check className="h-4 w-4 text-emerald-500" />
                      )}
                      {passwordsMismatch && (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="ml-1 text-slate-400 hover:text-slate-600"
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                      >
                        {showConfirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  {passwordsMismatch && (
                    <p className="mt-1 text-xs text-red-600">
                      Passwords do not match.
                    </p>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
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
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Sign in link */}
                <p className="text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="font-semibold text-blue-600 hover:text-blue-500 transition"
                  >
                    Log in
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
