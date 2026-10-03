// ─────────────────────────────────────────────────────────────────────────────
// Canonical Question Set Filter Contract (question-filters.ts)
// Single source of truth for Explore <-> Practice filter serialization & URLs.
// ─────────────────────────────────────────────────────────────────────────────

export interface QuestionSetFilters {
  exams: string[];
  years: number[];
  cycles: string[];
  subjects: string[];
  topics: string[];
  subtopics: string[];
  difficulties: string[];
  intelligenceOnly?: boolean;
  limit?: number;
  mode?: "instant" | "attempt" | "full_paper";
  returnTo?: string;
}

export const EMPTY_QUESTION_SET_FILTERS: QuestionSetFilters = {
  exams: [],
  years: [],
  cycles: [],
  subjects: [],
  topics: [],
  subtopics: [],
  difficulties: [],
  intelligenceOnly: false,
};

/**
 * Split a comma-separated query string or array into trimmed unique strings.
 */
export function parseListParam(value: string | string[] | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .flatMap((item) => (item ? item.split(",") : []))
          .map((item) => item.trim())
          .filter(Boolean)
      )
    );
  }
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

/**
 * Split a comma-separated query string into valid numbers.
 */
export function parseNumberListParam(value: string | string[] | null | undefined): number[] {
  const list = parseListParam(value);
  return list.map(Number).filter((n) => Number.isFinite(n) && n > 0);
}

/**
 * Parses URLSearchParams or Next.js SearchParams object into canonical QuestionSetFilters.
 */
export function parseFiltersFromSearchParams(
  params:
    | URLSearchParams
    | { get: (k: string) => string | null }
    | Record<string, string | string[] | undefined>
): QuestionSetFilters {
  if (params instanceof URLSearchParams || (typeof (params as any)?.get === "function")) {
    const getter = params as { get: (k: string) => string | null };
    return {
      exams: parseListParam(getter.get("exam") || getter.get("exams")),
      years: parseNumberListParam(getter.get("year") || getter.get("years")),
      cycles: parseListParam(getter.get("cycle") || getter.get("cycles")),
      subjects: parseListParam(getter.get("subject") || getter.get("subjects")),
      topics: parseListParam(getter.get("topic") || getter.get("topics")),
      subtopics: parseListParam(getter.get("subtopic") || getter.get("subtopics")),
      difficulties: parseListParam(getter.get("difficulty") || getter.get("difficulties")),
      intelligenceOnly: getter.get("intelligence_only") === "true",
      limit: getter.get("limit") ? parseInt(getter.get("limit")!, 10) : undefined,
      mode: (getter.get("mode") as any) || undefined,
      returnTo: getter.get("returnTo") || undefined,
    };
  }

  const record = params as Record<string, string | string[] | undefined>;
  return {
    exams: parseListParam(record.exam || record.exams),
    years: parseNumberListParam(record.year || record.years),
    cycles: parseListParam(record.cycle || record.cycles),
    subjects: parseListParam(record.subject || record.subjects),
    topics: parseListParam(record.topic || record.topics),
    subtopics: parseListParam(record.subtopic || record.subtopics),
    difficulties: parseListParam(record.difficulty || record.difficulties),
    intelligenceOnly: record.intelligence_only === "true" || record.intelligenceOnly === "true",
    limit: record.limit ? parseInt(String(record.limit), 10) : undefined,
    mode: (record.mode as any) || undefined,
    returnTo: typeof record.returnTo === "string" ? record.returnTo : undefined,
  };
}

/**
 * Serializes QuestionSetFilters into standard URLSearchParams.
 */
export function serializeFiltersToSearchParams(
  filters: Partial<QuestionSetFilters>
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.exams && filters.exams.length > 0) {
    params.set("exam", filters.exams.join(","));
  }
  if (filters.years && filters.years.length > 0) {
    params.set("year", filters.years.join(","));
  }
  if (filters.cycles && filters.cycles.length > 0) {
    params.set("cycle", filters.cycles.join(","));
  }
  if (filters.subjects && filters.subjects.length > 0) {
    params.set("subject", filters.subjects.join(","));
  }
  if (filters.topics && filters.topics.length > 0) {
    params.set("topic", filters.topics.join(","));
  }
  if (filters.subtopics && filters.subtopics.length > 0) {
    params.set("subtopic", filters.subtopics.join(","));
  }
  if (filters.difficulties && filters.difficulties.length > 0) {
    params.set("difficulty", filters.difficulties.join(","));
  }
  if (filters.intelligenceOnly) {
    params.set("intelligence_only", "true");
  }
  if (filters.limit) {
    params.set("limit", String(filters.limit));
  }
  if (filters.mode) {
    params.set("mode", filters.mode);
  }
  if (filters.returnTo) {
    params.set("returnTo", filters.returnTo);
  }

  return params;
}

/**
 * Canonical URL builder for Practice launcher.
 */
export function buildPracticeUrl(
  filters: Partial<QuestionSetFilters>,
  options?: { mode?: "instant" | "attempt" | "full_paper"; returnTo?: string }
): string {
  const merged: Partial<QuestionSetFilters> = {
    ...filters,
    mode: options?.mode || filters.mode,
    returnTo: options?.returnTo || filters.returnTo,
  };
  const qs = serializeFiltersToSearchParams(merged).toString();
  return qs ? `/dashboard/practice?${qs}` : "/dashboard/practice";
}

/**
 * Canonical URL builder for Practice Session player.
 */
export function buildPracticeSessionUrl(
  filters: Partial<QuestionSetFilters>,
  options?: { mode?: "instant" | "attempt"; returnTo?: string }
): string {
  const merged: Partial<QuestionSetFilters> = {
    ...filters,
    mode: options?.mode || filters.mode || "instant",
    returnTo: options?.returnTo || filters.returnTo,
  };
  const qs = serializeFiltersToSearchParams(merged).toString();
  return qs ? `/dashboard/practice/session?${qs}` : "/dashboard/practice/session";
}

/**
 * Canonical URL builder for Explore / Question Bank.
 */
export function buildExploreUrl(filters: Partial<QuestionSetFilters>): string {
  const params = new URLSearchParams();
  if (filters.exams && filters.exams.length > 0) params.set("exam", filters.exams.join(","));
  if (filters.years && filters.years.length > 0) params.set("year", filters.years.join(","));
  if (filters.cycles && filters.cycles.length > 0) params.set("cycle", filters.cycles.join(","));
  const qs = params.toString();
  return qs ? `/dashboard/question-bank?${qs}` : "/dashboard/question-bank";
}
