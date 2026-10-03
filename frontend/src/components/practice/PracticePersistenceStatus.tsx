"use client";

import { useEffect, useState } from "react";
import { getLocalSession, PRACTICE_SESSION_UPDATED_EVENT } from "@/lib/practice-session-client";

export default function PracticePersistenceStatus() {
  const [status, setStatus] = useState<string>();
  useEffect(() => {
    const refresh = () => setStatus(getLocalSession()?.cloud_status);
    refresh();
    window.addEventListener(PRACTICE_SESSION_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(PRACTICE_SESSION_UPDATED_EVENT, refresh);
  }, []);
  if (!status || status === "saved") return null;
  return <p role={status === "error" ? "alert" : "status"} className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
    {status === "error" ? "Cloud save failed. Keep this page open; your progress is preserved on this device."
      : status === "local" ? "Guest practice: progress is stored on this device."
      : "Saving progress…"}
  </p>;
}
