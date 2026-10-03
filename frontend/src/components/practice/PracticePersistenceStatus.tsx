"use client";

import { useEffect, useState } from "react";
import { getLocalSession, PRACTICE_SESSION_UPDATED_EVENT, retryPracticePersistence } from "@/lib/practice-session-client";
import type { PracticeQuestion } from "@/lib/practice-types";

export default function PracticePersistenceStatus({ questions = [] }: { questions?: PracticeQuestion[] }) {
  const [status, setStatus] = useState<string>();
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string>();
  useEffect(() => {
    const refresh = () => setStatus(getLocalSession()?.cloud_status);
    refresh();
    window.addEventListener(PRACTICE_SESSION_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(PRACTICE_SESSION_UPDATED_EVENT, refresh);
  }, []);
  return <div role={status === "error" ? "alert" : "status"} className="mb-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
    {status === "error" ? "Cloud save failed. Your pending progress is retained on this device. Sign in again if your login expired, then retry."
      : status === "local" ? "Guest practice: progress is stored on this device."
      : status === "saved" ? "Progress saved to your account."
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
