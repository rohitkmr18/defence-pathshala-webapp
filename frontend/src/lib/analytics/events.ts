export const PRODUCT_EVENT_NAMES = [
  "dashboard_logged_out_viewed",
  "explore_viewed",
  "exam_selected",
  "subject_selected",
  "topic_selected",
  "pyq_insight_viewed",
  "practice_cta_clicked",
  "practice_configuration_viewed",
  "practice_started",
  "practice_resumed",
  "auth_started",
  "otp_requested",
  "otp_verified",
  "onboarding_started",
  "onboarding_completed",
  "auth_return_completed",
  "question_viewed",
  "question_answered",
  "answer_checked",
  "next_question_clicked",
  "question_skipped",
  "question_revisited",
  "practice_completed",
  "practice_abandoned",
  "mistake_list_viewed",
  "mistake_review_started",
  "mistake_question_opened",
  "related_practice_started",
  "mistake_resolved",
  "dashboard_viewed",
  "next_best_action_viewed",
  "next_best_action_clicked",
  "next_best_action_completed",
  "needs_attention_clicked",
  "recent_activity_clicked",
  "full_paper_started",
  "full_paper_resumed",
  "full_paper_submitted",
  "mock_debrief_viewed",
  "debrief_recommendation_clicked",
] as const;

export type ProductEventName = (typeof PRODUCT_EVENT_NAMES)[number];

export type AnalyticsValue = string | number | boolean | null | undefined;

export type ProductEventProperties = Record<string, AnalyticsValue>;

export const PRODUCT_EVENT_VERSION = 1;
