"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Cloud, CloudOff, Loader2 } from "lucide-react";
import { getLocalSession, PRACTICE_SESSION_UPDATED_EVENT, retryPracticePersistence } from "@/lib/practice-session-client";
import type { PracticeQuestion } from "@/lib/practice-types";

export default function PracticePersistenceStatus({
  questions = [],
  variant = "default",
}: {
  questions?: PracticeQuestion[];
  variant?: "default" | "exam";
}) {
  const [status, setStatus] = useState<string>();
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string>();
  const [online, setOnline] = useState(true);
  const [loginHref, setLoginHref] = useState("/auth/login?next=%2Fdashboard");

  useEffect(() => {
    const refresh = () => {
      setStatus(getLocalSession()?.cloud_status);
      setOnline(navigator.onLine);
      const next = new URL(window.location.href);
      next.searchParams.set("claim", "1");
      setLoginHref(`/auth/login?next=${encodeURIComponent(next.pathname + next.search)}`);
    };
    refresh();
    window.addEventListener(PRACTICE_SESSION_UPDATED_EVENT, refresh);
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    return () => {
      window.removeEventListener(PRACTICE_SESSION_UPDATED_EVENT, refresh);
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
    };
  }, []);

  const retry = async () => {
    setRetrying(true);
    setError(undefined);
    try {
      await retryPracticePersistence(questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed. Please retry.");
    } finally {
      setRetrying(false);
    }
  };

  if (variant === "exam") {
    const examLabel =
      status === "error"
        ? online
          ? "Sync paused — answers safe on this device"
          : "Offline — answers safe on this device"
        : status === "saved"
        ? "All answers saved"
        : status === "local"
        ? "Saved on this device"
        : "Saving answers…";

    const Icon =
      status === "error" || status === "local"
        ? CloudOff
        : status === "saved"
        ? CheckCircle2
        : Loader2;

    return (
      <div
        role={status === "error" ? "alert" : "status"}
        className="flex min-h-9 items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 sm:px-6"
      >
        <Icon className={`h-3.5 w-3.5 shrink-0 ${status === "saved" ? "text-emerald-600" : status === "error" || status === "local" ? "text-amber-600" : "animate-spin text-blue-600"}`} />
        <span className="min-w-0 flex-1 truncate">{examLabel}</span>
        {status === "error" && (
          <button
            type="button"
            disabled={retrying}
            className="shrink-0 font-bold text-blue-700 underline underline-offset-2 disabled:opacity-50"
            onClick={() => void retry()}
          >
            {retrying ? "Retrying…" : "Retry sync"}
          </button>
        )}
        {error && <span className="sr-only">{error}</span>}
      </div>
    );
  }

  return (
    <div role={status === "error" ? "alert" : "status"} className="mb-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
      {status === "error" ? "Cloud save failed. Your pending progress is retained on this device. Sign in again if your login expired, then retry."
        : status === "local" ? (
          <span>
            Practicing as a guest.{" "}
            <Link href={loginHref} className="font-bold text-blue-700 underline underline-offset-2">
              Log in
            </Link>{" "}
            to save this session and personalise your dashboard.
          </span>
        )
        : status === "saved" ? "Progress saved to your account and dashboard."
        : "Saving progress…"}
      {status === "error" && <button type="button" disabled={retrying} className="ml-3 font-bold underline disabled:opacity-50" onClick={() => void retry()}>{retrying ? "Retrying…" : "Retry save"}</button>}
      {error && <p>{error}</p>}
    </div>
  );
}
