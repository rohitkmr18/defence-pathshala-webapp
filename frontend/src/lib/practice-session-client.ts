// ─────────────────────────────────────────────────────────────────────────────
// Practice Session Client & Attempt Persistence (practice-session-client.ts)
// Seamless synchronization between client player, localStorage, and Supabase.
// ─────────────────────────────────────────────────────────────────────────────

import type { OptionKey, PracticeQuestion } from "./practice-types";
import type { QuestionSetFilters } from "./question-filters";

export interface ActivePracticeSession {
  id: string;
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
          session.id = data.session.id;
          saveLocalSession(session);
        }
      })
      .catch(() => {});
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
    await fetch("/api/practice/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: params.question.id,
        selected_option: params.selectedOption,
        is_correct: params.isCorrect,
        time_taken: params.timeTakenSeconds || 0,
        session_id: params.sessionId,
        mode: params.mode || "instant",
      }),
    });
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
      answers: update.answers !== undefined ? { ...current.answers, ...update.answers } : current.answers,
      updated_at: new Date().toISOString(),
    };
    saveLocalSession(updated);

    // Sync to API
    try {
      fetch("/api/practice/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          ...update,
        }),
      }).catch(() => {});
    } catch {
      // Ignore network errors
    }
  }
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
