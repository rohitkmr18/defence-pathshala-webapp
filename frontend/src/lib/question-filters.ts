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
  origin?: string;
  progress?: {
    checked_ids: string[];
    marked_for_review_ids?: string[];
    question_times: Record<string, number>;
  };
}

function parseMode(value: unknown): QuestionSetFilters["mode"] {
  return value === "instant" || value === "attempt" || value === "full_paper" ? value : undefined;
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
  if (params instanceof URLSearchParams || ("get" in params && typeof params.get === "function")) {
    const getter = params as {
      get: (k: string) => string | null;
      getAll?: (k: string) => string[];
    };
    const v2 = getter.get("filter_format") === "v2";
    const exactList = (singular: string, plural: string): string[] => {
      if (v2 && typeof getter.getAll === "function") {
        const values = getter.getAll(singular);
        if (values.length > 0) {
          return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
        }
        const pluralValues = getter.getAll(plural);
        if (pluralValues.length > 0) {
          return Array.from(new Set(pluralValues.map((value) => value.trim()).filter(Boolean)));
        }
      }
      return parseListParam(getter.get(singular) || getter.get(plural));
    };
    const exactNumbers = (singular: string, plural: string): number[] =>
      exactList(singular, plural)
        .map(Number)
        .filter((value) => Number.isFinite(value) && value > 0);

    return {
      exams: exactList("exam", "exams"),
      years: exactNumbers("year", "years"),
      cycles: exactList("cycle", "cycles"),
      subjects: exactList("subject", "subjects"),
      topics: exactList("topic", "topics"),
      subtopics: exactList("subtopic", "subtopics"),
      difficulties: exactList("difficulty", "difficulties"),
      intelligenceOnly: getter.get("intelligence_only") === "true",
      limit: getter.get("limit") ? parseInt(getter.get("limit")!, 10) : undefined,
      mode: parseMode(getter.get("mode")),
      returnTo: getter.get("returnTo") || undefined,
      origin: getter.get("origin") || undefined,
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
    mode: parseMode(record.mode),
    returnTo: typeof record.returnTo === "string" ? record.returnTo : undefined,
    origin: typeof record.origin === "string" ? record.origin : undefined,
  };
}

/**
 * Serializes QuestionSetFilters into standard URLSearchParams.
 */
export function serializeFiltersToSearchParams(
  filters: Partial<QuestionSetFilters>
): URLSearchParams {
  const params = new URLSearchParams();

  // v2 uses repeated query keys rather than comma-joined values. Taxonomy
  // labels legitimately contain commas (for example "Industrial, Materials &
  // Applied Chemistry"), so comma-separated serialization is lossy.
  params.set("filter_format", "v2");

  const appendStrings = (key: string, values?: string[]) => {
    for (const value of values ?? []) {
      const cleaned = value.trim();
      if (cleaned) params.append(key, cleaned);
    }
  };
  const appendNumbers = (key: string, values?: number[]) => {
    for (const value of values ?? []) {
      if (Number.isFinite(value) && value > 0) params.append(key, String(value));
    }
  };

  appendStrings("exam", filters.exams);
  appendNumbers("year", filters.years);
  appendStrings("cycle", filters.cycles);
  appendStrings("subject", filters.subjects);
  appendStrings("topic", filters.topics);
  appendStrings("subtopic", filters.subtopics);
  appendStrings("difficulty", filters.difficulties);

  if (filters.intelligenceOnly) params.set("intelligence_only", "true");
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.mode) params.set("mode", filters.mode);
  if (filters.returnTo) params.set("returnTo", filters.returnTo);
  if (filters.origin) params.set("origin", filters.origin);

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
  const params = serializeFiltersToSearchParams(filters);
  const qs = params.toString();
  return qs ? `/dashboard/question-bank?${qs}` : "/dashboard/question-bank";
}
