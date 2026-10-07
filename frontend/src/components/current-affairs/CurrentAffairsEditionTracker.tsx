"use client";

import { useEffect } from "react";
import { trackLearningEvent } from "@/lib/learning-events";

export default function CurrentAffairsEditionTracker({
  date,
  storyCount,
  quizCount,
}: {
  date: string;
  storyCount: number;
  quizCount: number;
}) {
  useEffect(() => {
    trackLearningEvent(
      "current_affairs_view",
      {
        source_surface: "current_affairs",
        edition_date: date,
        story_count: storyCount,
        quiz_count: quizCount,
      },
      date,
    );
  }, [date, storyCount, quizCount]);

  return null;
}
