// ─────────────────────────────────────────────────────────────────────────────
// Mock History & Dashboard Integration (mockHistory.ts)
// Client-side attempt tracking that updates Dashboard instantly without refresh.
// ─────────────────────────────────────────────────────────────────────────────

export interface CompletedMockRecord {
  id: string;
  examTitle: string;
  exam: string;
  date: string;
  timestamp: number;
  netScore: number;
  maxMarks: number;
  accuracyRate: number;
  attemptRate: number;
  correct: number;
  incorrect: number;
  skipped: number;
  total: number;
  durationSeconds: number;
  weakTopics: string[];
  recoverableMarks?: number;
}

const STORAGE_KEY = "upsc_mock_history_v1";
export const MOCK_SAVED_EVENT = "upsc_mock_history_updated";

export function saveCompletedMock(
  attempt: Omit<CompletedMockRecord, "id" | "date" | "timestamp">
): CompletedMockRecord {
  const record: CompletedMockRecord = {
    ...attempt,
    id: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    timestamp: Date.now(),
  };

  if (typeof window !== "undefined") {
    try {
      const existing = getMockHistory();
      const updated = [record, ...existing].slice(0, 50); // Keep last 50 attempts
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(MOCK_SAVED_EVENT, { detail: record }));
    } catch {
      // Ignore quota errors in private browsing
    }
  }

  return record;
}

export function getMockHistory(): CompletedMockRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CompletedMockRecord[];
  } catch {
    return [];
  }
}

export interface WeakAreaSummary {
  topic: string;
  count: number;
}

export interface DashboardPreparationSnapshot {
  mocksCompleted: number;
  totalQuestionsAttempted: number;
  averageScore: number;
  averageAccuracy: number;
  totalRecoverableMarks: number;
  lastMockTitle: string;
  weakAreas: WeakAreaSummary[];
  recentScores: number[];
  trendDirection: "up" | "down" | "flat";
}

export function computeDashboardSnapshot(): DashboardPreparationSnapshot {
  const history = getMockHistory();

  if (history.length === 0) {
    return {
      mocksCompleted: 0,
      totalQuestionsAttempted: 0,
      averageScore: 0,
      averageAccuracy: 0,
      totalRecoverableMarks: 0,
      lastMockTitle: "None",
      weakAreas: [],
      recentScores: [],
      trendDirection: "flat",
    };
  }

  const mocksCompleted = history.length;
  const totalQuestionsAttempted = history.reduce(
    (acc, h) => acc + (h.correct + h.incorrect),
    0
  );
  const totalScore = history.reduce((acc, h) => acc + h.netScore, 0);
  const totalAccuracy = history.reduce((acc, h) => acc + h.accuracyRate, 0);
  const averageScore = Math.round((totalScore / mocksCompleted) * 10) / 10;
  const averageAccuracy = Math.round((totalAccuracy / mocksCompleted) * 10) / 10;
  const lastMockTitle = history[0]?.examTitle || "Recent Mock";
  const totalRecoverableMarks =
    history[0]?.recoverableMarks ??
    history.reduce((max, h) => Math.max(max, h.recoverableMarks || 0), 0);

  // Aggregate weak areas from recent 5 attempts
  const topicFrequency: Record<string, number> = {};
  history.slice(0, 5).forEach((mock) => {
    (mock.weakTopics || []).forEach((topic) => {
      topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
    });
  });

  const weakAreas: WeakAreaSummary[] = Object.entries(topicFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([topic, count]) => ({ topic, count }));

  // Scores chronological for sparkline (oldest to newest, up to last 7)
  const recentScores = history
    .slice(0, 7)
    .reverse()
    .map((h) => h.netScore);

  // Calculate score trend direction
  let trendDirection: "up" | "down" | "flat" = "flat";
  if (recentScores.length >= 2) {
    const latest = recentScores[recentScores.length - 1];
    const prev = recentScores[recentScores.length - 2];
    if (latest > prev + 1) trendDirection = "up";
    else if (latest < prev - 1) trendDirection = "down";
    else trendDirection = "flat";
  }

  return {
    mocksCompleted,
    totalQuestionsAttempted,
    averageScore,
    averageAccuracy,
    totalRecoverableMarks,
    lastMockTitle,
    weakAreas,
    recentScores,
    trendDirection,
  };
}
