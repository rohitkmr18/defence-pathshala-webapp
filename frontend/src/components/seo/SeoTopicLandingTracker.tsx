"use client";

import { useEffect } from "react";
import { trackLearningEvent } from "@/lib/learning-events";

interface SeoTopicLandingTrackerProps {
  exam: string;
  subject: string;
  topic: string;
  questionCount: number;
}

export default function SeoTopicLandingTracker({
  exam,
  subject,
  topic,
  questionCount,
}: SeoTopicLandingTrackerProps) {
  useEffect(() => {
    trackLearningEvent(
      "seo_topic_landing_view",
      {
        source_surface: "seo_topic",
        exam,
        subject,
        topic,
        question_count: questionCount,
      },
      `${exam}:${subject}:${topic}`
    );
  }, [exam, subject, topic, questionCount]);

  return null;
}
