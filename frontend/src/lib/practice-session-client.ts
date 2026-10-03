// ─────────────────────────────────────────────────────────────────────────────
// Practice Session Client & Attempt Persistence (practice-session-client.ts)
// Seamless synchronization between client player, localStorage, and Supabase.
// ─────────────────────────────────────────────────────────────────────────────

import type { OptionKey, PracticeQuestion } from "./practice-types";
import type { QuestionSetFilters } from "./question-filters";

export interface ActivePracticeSession {
  id: string;
  server_id?: string;
  title: string;
  mode: "instant" | "attempt" | "full_paper";
  filters: Partial<QuestionSetFilters>;
  question_ids: string[];
  current_index: number;
  answers: Record<string, OptionKey>;
  is_completed: boolean;
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  time_spent_seconds: number;
  started_at: string;
  updated_at: string;
}

const LOCAL_ACTIVE_SESSION_KEY = "dp_active_practice_session_v1";
export const PRACTICE_SESSION_UPDATED_EVENT = "dp_practice_session_updated";
const progressWrites = new Map<string, Promise<void>>();

/**
 * Initializes a new practice session locally and triggers backend persistence.
 */
export async function initializeSession(params: {
  title: string;
  mode: "instant" | "attempt" | "full_paper";
  filters: Partial<QuestionSetFilters>;
  questions: PracticeQuestion[];
}): Promise<ActivePracticeSession> {
  const session: ActivePracticeSession = {
    id: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: params.title,
    mode: params.mode,
    filters: params.filters,
    question_ids: params.questions.map((q) => q.id),
    current_index: 0,
    answers: {},
    is_completed: false,
    total_questions: params.questions.length,
    correct_count: 0,
    incorrect_count: 0,
    time_spent_seconds: 0,
    started_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  saveLocalSession(session);

  // Background sync to backend API
  try {
    fetch("/api/practice/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: session.title,
        mode: session.mode,
        filters: session.filters,
        question_ids: session.question_ids,
        total_questions: session.total_questions,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.session?.id) {
          const latest = getLocalSession();
          // A late create response must not erase progress or replace a newer session.
          if (latest?.id !== session.id) return;
          saveLocalSession({ ...latest, server_id: data.session.id });
          updateSessionProgress(latest.id, {
            current_index: latest.current_index,
            answers: latest.answers,
            is_completed: latest.is_completed,
            correct_count: latest.correct_count,
            incorrect_count: latest.incorrect_count,
            time_spent_seconds: latest.time_spent_seconds,
          });
        }
      })
      .catch((error) => { console.warn("Session remains local; cloud persistence failed:", error); });
  } catch {
    // Keep local session
  }

  return session;
}

/**
 * Records an individual question attempt immediately at interaction time.
 */
export async function recordQuestionAttempt(params: {
  question: PracticeQuestion;
  selectedOption: OptionKey;
  isCorrect: boolean;
  timeTakenSeconds?: number;
  sessionId?: string;
  mode?: string;
}): Promise<void> {
  // 1. Dispatch event for real-time local listeners
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("dp_question_attempted", {
        detail: {
          question_id: params.question.id,
          selected_option: params.selectedOption,
          is_correct: params.isCorrect,
          timestamp: Date.now(),
        },
      })
    );
  }

  // 2. Persist to Supabase backend API
  try {
    const response = await fetch("/api/practice/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: params.question.id,
        selected_option: params.selectedOption,
        is_correct: params.isCorrect,
        time_taken: params.timeTakenSeconds || 0,
        session_id: getLocalSession()?.id === params.sessionId
          ? (getLocalSession()?.server_id || (params.sessionId?.startsWith("sess_") ? undefined : params.sessionId))
          : params.sessionId,
        mode: params.mode || "instant",
      }),
    });
    if (!response.ok) throw new Error("Attempt persistence failed");
  } catch (err) {
    console.warn("Could not persist attempt to backend immediately:", err);
  }
}

/**
 * Updates session progress locally and asynchronously to the server.
 */
export function updateSessionProgress(
  sessionId: string,
  update: {
    current_index?: number;
    answers?: Record<string, OptionKey>;
    is_completed?: boolean;
    correct_count?: number;
    incorrect_count?: number;
    time_spent_seconds?: number;
  }
): void {
  const current = getLocalSession();
  if (current && current.id === sessionId) {
    const updated: ActivePracticeSession = {
      ...current,
      ...update,
      answers: update.answers !== undefined ? { ...update.answers } : current.answers,
      updated_at: new Date().toISOString(),
    };
    saveLocalSession(updated);

    // Wait for background creation before using a local-only ID on the server.
    if (!current.server_id && sessionId.startsWith("sess_")) return;
    const serverId = current.server_id || sessionId;
    const payload = {
      session_id: serverId,
      current_index: updated.current_index,
      answers: updated.answers,
      is_completed: updated.is_completed,
      correct_count: updated.correct_count,
      incorrect_count: updated.incorrect_count,
      time_spent_seconds: updated.time_spent_seconds,
    };
    // Serialize snapshots so an older network response cannot regress saved progress.
    const write = (progressWrites.get(serverId) || Promise.resolve()).then(async () => {
      await fetch("/api/practice/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }).catch(() => {});
    progressWrites.set(serverId, write);
    void write.finally(() => {
      if (progressWrites.get(serverId) === write) progressWrites.delete(serverId);
    });
  }
}

/** Restore the requested saved session before any question query is issued. */
export async function loadResumeSession(sessionId?: string): Promise<ActivePracticeSession> {
  let session = getLocalSession();
  if (!session || (sessionId && session.id !== sessionId && session.server_id !== sessionId)) {
    const query = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : "";
    const response = await fetch(`/api/practice/session${query}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load your saved session. Please try again.");
    session = (await response.json()).activeSession;
  }
  if (!session || session.is_completed || !Array.isArray(session.question_ids) || !session.question_ids.length) {
    throw new Error("This saved session is no longer available. Return to Practice to start a new session.");
  }
  return session;
}

/** Database order is irrelevant: a resume must retain the original question order. */
export function restoreQuestionOrder(ids: string[], questions: PracticeQuestion[]): PracticeQuestion[] {
  const byId = new Map(questions.map((question) => [question.id, question]));
  return ids.map((id) => {
    const question = byId.get(id);
    if (!question) throw new Error("Some saved questions are unavailable. Your saved progress has been preserved.");
    return question;
  });
}

export function saveLocalSession(session: ActivePracticeSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_ACTIVE_SESSION_KEY, JSON.stringify(session));
    window.dispatchEvent(
      new CustomEvent(PRACTICE_SESSION_UPDATED_EVENT, { detail: session })
    );
  } catch {
    // Ignore storage quota
  }
}

export function getLocalSession(): ActivePracticeSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_ACTIVE_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ActivePracticeSession;
  } catch {
    return null;
  }
}

export function clearLocalSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LOCAL_ACTIVE_SESSION_KEY);
    window.dispatchEvent(new CustomEvent(PRACTICE_SESSION_UPDATED_EVENT));
  } catch {
    // Ignore
  }
}
