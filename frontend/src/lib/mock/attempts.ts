"use client";

import { useEffect, useState } from "react";

export type MockAttempt = {
  sessionId: string; testId: string; code: string; title: string;
  status: "IN_PROGRESS" | "SUBMITTED" | "EXPIRED"; startedAt: string; deadline: string; expired: boolean;
  result: { score: number; maxMarks: number; correct: number; incorrect: number; unanswered: number; completedAt: string } | null;
};

export const DP_MOCKS_ENABLED = process.env.NEXT_PUBLIC_MOCK_CDS_ENABLED === "true";
export const DP_MOCKS_HREF = "/dashboard/practice?mode=full_paper&fp=dp";

/** Learner's DP mock attempts. `attempts` is null while loading; signed-out learners get an empty list. */
export function useMockAttempts(enabled = DP_MOCKS_ENABLED) {
  const [attempts, setAttempts] = useState<MockAttempt[] | null>(enabled ? null : []);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    fetch("/api/mock/sessions", { cache: "no-store" })
      .then(async (r) => (r.status === 401 ? { attempts: [] } : r.ok ? r.json() : Promise.reject(new Error("unavailable"))))
      .then((d) => { if (alive) setAttempts(Array.isArray(d.attempts) ? d.attempts : []); })
      .catch(() => { if (alive) { setError(true); setAttempts([]); } });
    return () => { alive = false; };
  }, [enabled]);
  return { attempts, error };
}

export const completedAttempts = (list: MockAttempt[]) =>
  list.filter((a) => a.result).sort((a, b) => Date.parse(a.result!.completedAt) - Date.parse(b.result!.completedAt));
