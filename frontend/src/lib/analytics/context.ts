import type { QuestionSetFilters } from "../question-filters";
import type { PracticeQuestion } from "../practice-types";
import type { ActivePracticeSession } from "../practice-session-client";
import type { ProductEventProperties } from "./events";

export function learningContext(
  filters: Partial<QuestionSetFilters> = {},
  question?: Partial<PracticeQuestion>
): ProductEventProperties {
  const list = (values?: (string | number)[]) => values?.length ? values.join(",") : undefined;
  const origin = filters.origin === "dashboard" ? "dashboard_resume" : !filters.origin || filters.origin === "practice" ? "direct_practice" : filters.origin;
  return {
    exam: list(filters.exams) || question?.exam,
    year: list(filters.years) || question?.year,
    cycle: list(filters.cycles) || question?.cycle || undefined,
    subject: list(filters.subjects) || question?.taxonomy_subject || question?.subject,
    topic: list(filters.topics) || question?.taxonomy_topic || question?.topic,
    concept: question?.taxonomy_concept || question?.concept || undefined,
    practice_mode: filters.mode,
    mode: filters.mode,
    source_surface: origin,
    origin,
    question_id: question?.id,
  };
}

export function practiceContext(session: ActivePracticeSession, question?: Partial<PracticeQuestion>): ProductEventProperties {
  const durable = Boolean(session.server_id) || (!session.creation_id && session.cloud_status !== "local" && /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(session.id));
  return {
    ...learningContext({ ...session.filters, mode: session.mode }, question),
    practice_session_id: durable ? session.server_id || session.id : undefined,
    local_session_id: durable ? undefined : session.id,
  };
}

export function hasPracticeProgress(session: ActivePracticeSession): boolean {
  return session.current_index > 0 || Object.keys(session.answers || {}).length > 0 ||
    Boolean(session.checked_ids?.length || session.filters.progress?.checked_ids?.length) || session.time_spent_seconds > 0;
}

/** Attribution comes from structured recommendation navigation, never display labels. */
export function recommendationContext(recommendation: { type: string; href: string }): ProductEventProperties {
  const targetHref = recommendationDestination(recommendation.href);
  const url = new URL(targetHref, "https://learning.invalid");
  return {
    source_surface: "dashboard_next_best_move",
    recommendation_type: recommendation.type,
    target_href: targetHref,
    target_exam: url.searchParams.get("exam") || undefined,
    target_subject: url.searchParams.get("subject") || undefined,
    target_topic: url.searchParams.get("topic") || undefined,
    target_session_id: url.searchParams.get("session_id") || undefined,
  };
}

export function recommendationDestination(href: string): string {
  const url = new URL(href, "https://learning.invalid");
  url.searchParams.set("origin", "dashboard_next_best_move");
  return `${url.pathname}${url.search}`;
}

export function practiceDestination(href: string, origin: string): string {
  const url = new URL(href, "https://learning.invalid");
  url.searchParams.set("origin", origin);
  return `${url.pathname}${url.search}`;
}
