"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { requestEmailCode, verifyEmailCode } from "@/lib/email-otp";

import { authUrl } from "@/lib/auth-redirect";
import { trackProductEvent } from "@/lib/analytics/track";

export default function EmailOtpForm({ mode = "login" }: { mode?: "login" | "signup" }) {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(searchParams.has("error") ? "Sign-in could not be completed. Please try again." : null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inFlight = useRef(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function sendCode() {
    if (inFlight.current || cooldown > 0) return;
    inFlight.current = true;
    setBusy(true);
    setError(null);
    try {
      trackProductEvent("auth_started", {
        source_surface: mode === "signup" ? "signup" : "login",
        auth_method: "email_otp",
      });
      const normalized = await requestEmailCode(createClient().auth, sentEmail || email);
      trackProductEvent("otp_requested", {
        source_surface: mode === "signup" ? "signup" : "login",
        auth_method: "email_otp",
      });
      setSentEmail(normalized);
      setCode("");
      setCooldown(60);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Could not send a code. Please try again.");
      // Avoid rapid repeated requests after a delivery/rate-limit failure.
      setCooldown(60);
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!sentEmail) {
      await sendCode();
      return;
    }
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError(null);
    try {
      await verifyEmailCode(createClient().auth, sentEmail, code);
      trackProductEvent("otp_verified", {
        source_surface: mode === "signup" ? "signup" : "login",
        auth_method: "email_otp",
      });
      // Authentication establishes the session; the canonical resolver owns routing.
      window.location.replace(authUrl("/auth/continue", searchParams.get("next")));
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "That code could not be verified. Please try again.");
      inFlight.current = false;
      setBusy(false);
    }
  }

  const inputClass = "mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20";
  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Email OTP only for this release; Google implementation is retained separately. */}
      {sentEmail ? (
        <>
          <p role="status" className="text-sm text-slate-600">
            Enter the code sent to <strong>{sentEmail}</strong>. Check your spam folder if it hasn&apos;t arrived.
          </p>
          <div>
            <label htmlFor="email-code" className="block text-sm font-semibold text-slate-700">Verification code</label>
            <input id="email-code" name="token" type="text" inputMode="numeric" autoComplete="one-time-code"
              required pattern="[0-9]{6,10}" maxLength={10} autoFocus disabled={busy}
              value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
              className={`${inputClass} text-center text-xl tracking-[0.3em]`} placeholder="Enter code" />
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <button type="button" disabled={busy || cooldown > 0} onClick={sendCode}
              className="font-semibold text-blue-600 disabled:text-slate-400">
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
            <button type="button" disabled={busy} onClick={() => { setSentEmail(null); setCode(""); setError(null); }}
              className="font-semibold text-slate-600 disabled:opacity-50">Change email</button>
          </div>
        </>
      ) : (
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email address</label>
          <input id="email" name="email" type="email" required autoComplete="email" disabled={busy}
            value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} placeholder="you@example.com" />
          <p className="mt-2 text-xs text-slate-500">We&apos;ll email you a sign-in code. No password needed.</p>
        </div>
      )}
      {error && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={busy || (!sentEmail && cooldown > 0)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60">
        {busy ? <><Loader2 className="h-4 w-4 animate-spin" />{sentEmail ? "Verifying…" : "Sending code…"}</> :
          <>{sentEmail ? "Verify & Continue" : cooldown > 0 ? `Try again in ${cooldown}s` : "Continue with email"}<ArrowRight className="h-4 w-4" /></>}
      </button>
      <p className="text-center text-sm text-slate-500">
        <Link href={authUrl(mode === "login" ? "/auth/signup" : "/auth/login", searchParams.get("next"))}
          className="font-semibold text-blue-600">{mode === "login" ? "Create an account" : "Log in"}</Link>
      </p>
      <p className="text-center text-xs text-slate-500">New here? Your account is created when you verify your email.</p>
    </form>
  );
}
