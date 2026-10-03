// ─────────────────────────────────────────────────────────────────────────────
// Practice Session Client & Attempt Persistence (practice-session-client.ts)
// Seamless synchronization between client player, localStorage, and Supabase.
// ─────────────────────────────────────────────────────────────────────────────

import type { OptionKey, PracticeQuestion } from "./practice-types";
import type { QuestionSetFilters } from "./question-filters";

export interface ActivePracticeSession {
  id: string;
  server_id?: string;
  cloud_status?: "local" | "saving" | "saved" | "error";
  pending_attempts?: Record<string, { selectedOption: OptionKey; timeTakenSeconds?: number }>;
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
const creations = new Map<string, Promise<string | null>>();
const failedSessions = new Set<string>();
const completionWrites = new Map<string, Promise<void>>();
const submittedAnswers = new Map<string, Set<string>>();
const inFlightAttempts = new Map<string, Promise<void>>();
const failedAttempts = new Map<string, Map<string, Parameters<typeof recordQuestionAttempt>[0]>>();

function setCloudStatus(id: string, status: ActivePracticeSession["cloud_status"]) {
  if (status === "error") failedSessions.add(id);
  const latest = getLocalSession();
  if (latest?.id === id) saveLocalSession({ ...latest,
    cloud_status: failedSessions.has(id) ? "error" : status });
}

async function resolveCloudId(id?: string): Promise<string | null> {
  if (!id) return null;
  const pending = creations.get(id);
  if (pending) return pending;
  const latest = getLocalSession();
  if (latest?.id === id) {
    if (latest.server_id) return latest.server_id;
    if (latest.cloud_status === "local") return null;
  }
  if (id.startsWith("sess_") || id.startsWith("guest_")) {
    throw new Error("Session is only on this device; cloud creation failed.");
  }
  return id;
}

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

  setCloudStatus(session.id, "saving");
  const creation = (async () => {
    const res = await fetch("/api/practice/session", {
      method: "POST", headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({ title: session.title, mode: session.mode,
        filters: session.filters, question_ids: session.question_ids,
        total_questions: session.total_questions }),
    });
    if (!res.ok) throw new Error("Session creation failed");
    const data = await res.json();
    if (data.guest) { setCloudStatus(session.id, "local"); return null; }
    if (!data.session?.id || data.session.id.startsWith("sess_")) {
      throw new Error("Session creation was not confirmed");
    }
    const latest = getLocalSession();
    if (latest?.id === session.id) {
      saveLocalSession({ ...latest, server_id: data.session.id });
      updateSessionProgress(latest.id, {
        current_index: latest.current_index, answers: latest.answers,
        is_completed: latest.is_completed, correct_count: latest.correct_count,
        incorrect_count: latest.incorrect_count, time_spent_seconds: latest.time_spent_seconds,
      });
    }
    return data.session.id as string;
  })();
  creations.set(session.id, creation);
  // Keep the result available to attempts started before or after a session switch.
  // Bound memory without dropping unresolved creates.
  void creation.catch(() => setCloudStatus(session.id, "error"));
  if (creations.size > 100) {
    const oldest = creations.keys().next().value;
    if (oldest) void creations.get(oldest)?.then(() => creations.delete(oldest), () => creations.delete(oldest));
  }

  return session;
}

/**
 * Records an individual question attempt immediately at interaction time.
 */
export function recordQuestionAttempt(params: {
  question: PracticeQuestion;
  selectedOption: OptionKey;
  isCorrect: boolean;
  timeTakenSeconds?: number;
  sessionId?: string;
  mode?: string;
}): Promise<void> {
  const key = `${params.sessionId || "standalone"}:${params.question.id}:${params.selectedOption}`;
  const pending = inFlightAttempts.get(key);
  if (pending) return pending;
  const write = persistQuestionAttempt(params);
  inFlightAttempts.set(key, write);
  void write.then(() => inFlightAttempts.delete(key), () => inFlightAttempts.delete(key));
  return write;
}

async function persistQuestionAttempt(params: Parameters<typeof recordQuestionAttempt>[0]): Promise<void> {
  const local = getLocalSession();
  if (local && local.id === params.sessionId) saveLocalSession({ ...local,
    pending_attempts: { ...local.pending_attempts, [params.question.id]: {
      selectedOption: params.selectedOption, timeTakenSeconds: params.timeTakenSeconds,
    } } });
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

  try {
    const cloudId = await resolveCloudId(params.sessionId);
    const response = await fetch("/api/practice/attempt", {
      method: "POST", headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({ question_id: params.question.id,
        selected_option: params.selectedOption, is_correct: params.isCorrect,
        time_taken: params.timeTakenSeconds || 0, session_id: cloudId || undefined,
        mode: params.mode || "instant" }),
    });
    if (!response.ok) throw new Error("Attempt persistence failed");
    const result = await response.json();
    if (cloudId && result.guest) throw new Error("Sign in again to save your attempt.");
    if (!result.guest && result.persisted !== true) throw new Error("Attempt save was not confirmed");
    if (params.sessionId) failedAttempts.get(params.sessionId)?.delete(params.question.id);
    const latest = getLocalSession();
    if (latest && latest.id === params.sessionId && latest.pending_attempts?.[params.question.id]?.selectedOption === params.selectedOption) {
      const pending = { ...latest.pending_attempts };
      delete pending[params.question.id];
      saveLocalSession({ ...latest, pending_attempts: pending });
    }
  } catch (error) {
    if (params.sessionId) {
      const pending = failedAttempts.get(params.sessionId) || new Map();
      pending.set(params.question.id, params);
      failedAttempts.set(params.sessionId, pending);
      setCloudStatus(params.sessionId, "error");
    }
    throw error;
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
    if (current.cloud_status === "local" || (!current.server_id && sessionId.startsWith("sess_"))) return;
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
    setCloudStatus(sessionId, "saving");
    // Serialize snapshots so an older network response cannot regress saved progress.
    const write = (progressWrites.get(serverId) || Promise.resolve()).catch(() => {}).then(async () => {
      const response = await fetch("/api/practice/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error("Session progress save failed");
      const result = await response.json();
      if (result.guest || result.success !== true || result.session?.id !== serverId) {
        throw new Error("Cloud progress save was not confirmed. Sign in again if your session expired.");
      }
      if (getLocalSession()?.updated_at === updated.updated_at && progressWrites.get(serverId) === write) {
        setCloudStatus(sessionId, "saved");
      }
    });
    void write.catch(() => setCloudStatus(sessionId, "error"));
    progressWrites.set(serverId, write);
    void write.then(() => {
      if (progressWrites.get(serverId) === write) progressWrites.delete(serverId);
    }, () => { /* Keep the rejected write so completion cannot claim success. */ });
  }
}

/** Wait for creation and all queued progress before claiming completion. */
export function completePracticeSession(params: {
  sessionId: string; questions: PracticeQuestion[]; answers: Record<string, OptionKey>;
  mode: "instant" | "attempt" | "full_paper"; timeSpentSeconds: number;
}): Promise<void> {
  const pending = completionWrites.get(params.sessionId);
  if (pending) return pending;
  const completion = persistCompletion(params);
  completionWrites.set(params.sessionId, completion);
  void completion.then(() => completionWrites.delete(params.sessionId), () => completionWrites.delete(params.sessionId));
  return completion;
}

async function persistCompletion(params: {
  sessionId: string; questions: PracticeQuestion[]; answers: Record<string, OptionKey>;
  mode: "instant" | "attempt" | "full_paper"; timeSpentSeconds: number;
}): Promise<void> {
  const cloudId = await resolveCloudId(params.sessionId);
  if (getLocalSession()?.id !== params.sessionId) throw new Error("The active session changed; completion was not saved.");
  if (cloudId && params.mode === "instant") {
    for (const [questionId, pending] of Object.entries(getLocalSession()?.pending_attempts || {})) {
      const question = params.questions.find(q => q.id === questionId);
      if (!question) throw new Error("An unsaved answer is unavailable; your progress is preserved.");
      await recordQuestionAttempt({ question, ...pending, sessionId: params.sessionId,
        mode: params.mode, isCorrect: pending.selectedOption === question.final_opt });
    }
  }
  if (params.mode !== "instant" && cloudId) {
    const saved = submittedAnswers.get(params.sessionId) || new Set<string>();
    submittedAnswers.set(params.sessionId, saved);
    for (const question of params.questions) {
      const selectedOption = params.answers[question.id];
      if (!selectedOption) continue;
      const key = `${question.id}:${selectedOption}`;
      if (saved.has(key)) continue;
      await recordQuestionAttempt({ question, selectedOption,
        isCorrect: selectedOption === question.final_opt,
        sessionId: params.sessionId, mode: params.mode });
      saved.add(key);
    }
  }
  if (getLocalSession()?.id !== params.sessionId) throw new Error("The active session changed; completion was not saved.");
  updateSessionProgress(params.sessionId, {
    answers: params.answers, is_completed: true,
    correct_count: params.questions.filter(q => params.answers[q.id] === q.final_opt).length,
    incorrect_count: params.questions.filter(q => params.answers[q.id] && params.answers[q.id] !== q.final_opt).length,
    time_spent_seconds: params.timeSpentSeconds,
  });
  if (cloudId) {
    try { await progressWrites.get(cloudId); }
    catch (error) {
      const latest = getLocalSession();
      if (latest?.id === params.sessionId) saveLocalSession({ ...latest, is_completed: false, cloud_status: "error" });
      throw error;
    }
  }
  // All known failed attempts and the final progress snapshot are now confirmed.
  if (cloudId && !failedAttempts.get(params.sessionId)?.size) {
    failedSessions.delete(params.sessionId);
    setCloudStatus(params.sessionId, "saved");
  }
}

/** Restore the requested saved session before any question query is issued. */
export async function loadResumeSession(sessionId?: string): Promise<ActivePracticeSession> {
  let session = getLocalSession();
  const cloudId = session?.server_id || (session?.id && /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(session.id) ? session.id : null);
  if (session && cloudId && (!sessionId || session.id === sessionId || cloudId === sessionId)) {
    const response = await fetch(`/api/practice/session?session_id=${encodeURIComponent(cloudId)}`, { cache: "no-store" });
    if (!response.ok || !(await response.json()).activeSession) throw new Error("Saved session unavailable for this account.");
  }
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
