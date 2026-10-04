"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLocalSession, PRACTICE_SESSION_UPDATED_EVENT, retryPracticePersistence } from "@/lib/practice-session-client";
import type { PracticeQuestion } from "@/lib/practice-types";

export default function PracticePersistenceStatus({ questions = [] }: { questions?: PracticeQuestion[] }) {
  const [status, setStatus] = useState<string>();
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string>();
  const [loginHref, setLoginHref] = useState("/auth/login?next=%2Fdashboard");
  useEffect(() => {
    const refresh = () => {
      setStatus(getLocalSession()?.cloud_status);
      const next = new URL(window.location.href);
      next.searchParams.set("claim", "1");
      setLoginHref(`/auth/login?next=${encodeURIComponent(next.pathname + next.search)}`);
    };
    refresh();
    window.addEventListener(PRACTICE_SESSION_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(PRACTICE_SESSION_UPDATED_EVENT, refresh);
  }, []);
  return <div role={status === "error" ? "alert" : "status"} className="mb-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
    {status === "error" ? "Cloud save failed. Your pending progress is retained on this device. Sign in again if your login expired, then retry."
      : status === "local" ? (
        <span>
          Practicing as a guest.{" "}
          <Link href={loginHref} className="font-bold text-blue-700 underline underline-offset-2">
            Log in to save this session and personalise your dashboard.
          </Link>
        </span>
      )
      : status === "saved" ? "Progress saved to your account and dashboard."
      : "Saving progress…"}
    {status === "error" && <button type="button" disabled={retrying} className="ml-3 font-bold underline disabled:opacity-50" onClick={async () => {
      setRetrying(true); setError(undefined);
      try { await retryPracticePersistence(questions); }
      catch (err) { setError(err instanceof Error ? err.message : "Save failed. Please retry."); }
      finally { setRetrying(false); }
    }}>{retrying ? "Retrying…" : "Retry save"}</button>}
    {error && <p>{error}</p>}
  </div>;
}
