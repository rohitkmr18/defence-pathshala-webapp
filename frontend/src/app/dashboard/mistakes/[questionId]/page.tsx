"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AnswerReveal from "@/components/practice/player/AnswerReveal";
import QuestionCard from "@/components/practice/player/QuestionCard";
import type { LearnerIntelligence, LearnerMistake } from "@/lib/learner-intelligence";
import type { PracticeQuestion, OptionKey } from "@/lib/practice-types";
import { trackProductEvent } from "@/lib/analytics/track";

export default function MistakeReviewPage({
  params,
}: {
  params: Promise<{ questionId: string }>;
}) {
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [mistake, setMistake] = useState<LearnerMistake | null>(null);
  const [question, setQuestion] = useState<PracticeQuestion | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    void params.then(({ questionId: id }) => {
      if (active) setQuestionId(id);
    });
    return () => {
      active = false;
    };
  }, [params]);

  useEffect(() => {
    if (!questionId) return;
    let active = true;

    void Promise.all([
      fetch("/api/learner-intelligence", { cache: "no-store" }).then((response) => {
        if (!response.ok) throw new Error("Learner intelligence unavailable");
        return response.json() as Promise<LearnerIntelligence>;
      }),
      fetch(`/api/practice/questions?id=${encodeURIComponent(questionId)}`, {
        cache: "no-store",
      }).then((response) => {
        if (!response.ok) throw new Error("Question unavailable");
        return response.json() as Promise<{ questions: PracticeQuestion[] }>;
      }),
    ])
      .then(([intelligence, payload]) => {
        if (!active) return;
        const found = intelligence.mistakes.recent.find(
          (item) => item.questionId === questionId
        );
        if (!found || !payload.questions?.[0]) {
          throw new Error("Mistake already resolved or unavailable");
        }
        setMistake(found);
        setQuestion(payload.questions[0]);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, [questionId]);

  useEffect(() => {
    if (!mistake || !questionId) return;
    trackProductEvent(
      "mistake_question_opened",
      {
        source_surface: "mistakes",
        question_id: questionId,
        exam: mistake.exam,
        subject: mistake.subject,
        topic: mistake.topic,
      },
      questionId
    );
  }, [mistake, questionId]);

  const selectedOption = useMemo<OptionKey | null>(() => {
    const value = mistake?.selectedOption;
    return value === "A" || value === "B" || value === "C" || value === "D"
      ? value
      : null;
  }, [mistake]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/mistakes"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Mistakes
        </Link>

        {!question && !failed && (
          <div className="mt-4 h-80 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        )}

        {failed && (
          <section className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <h1 className="text-xl font-black text-slate-900">
              This mistake is no longer available for review.
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              It may already have been resolved by a later correct attempt, or
              the question is no longer in the learner-facing corpus.
            </p>
            <Link
              href="/dashboard/mistakes"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white"
            >
              Return to Mistakes
            </Link>
          </section>
        )}

        {question && mistake && (
          <div className="mt-4 space-y-5">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
              <p className="font-black">Reviewing your saved mistake</p>
              <p className="mt-1 text-xs leading-relaxed text-blue-800">
                This uses your historical selected answer. Reviewing it does not
                create a new attempt; the mistake resolves only after a later
                correct practice attempt.
              </p>
            </div>

            <QuestionCard
              question={question}
              questionNumber={1}
              selectedOption={selectedOption}
              revealed
              onSelect={() => {}}
            />

            <AnswerReveal
              question={question}
              selectedOption={selectedOption}
              visible
              timeSpentSeconds={mistake.timeTakenSeconds}
            />

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-slate-900">
                  Close the loop with fresh retrieval
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Practise related PYQs; a later correct attempt resolves this
                  item from your Mistakes queue.
                </p>
              </div>
              <Link
                href={mistake.practiceHref}
                onClick={() =>
                  trackProductEvent("related_practice_started", {
                    source_surface: "check_answer_related_practice",
                    question_id: mistake.questionId,
                    exam: mistake.exam,
                    subject: mistake.subject,
                    topic: mistake.topic,
                  })
                }
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"
              >
                Practise Related PYQs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
