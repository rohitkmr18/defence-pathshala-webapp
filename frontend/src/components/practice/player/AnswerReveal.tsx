"use client";

import type { PracticeQuestion, OptionKey } from "@/lib/practice-types";
import { getCorrectKey } from "@/lib/practice-types";

interface AnswerRevealProps {
  question: PracticeQuestion;
  selectedOption: OptionKey | null;
  visible: boolean;
}

interface MetaItemProps {
  label: string;
  value: string | number | null | undefined;
}

function MetaItem({ label, value }: MetaItemProps) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
}

function DifficultyPill({ category }: { category?: string | null }) {
  if (!category) return null;

  const map: Record<string, string> = {
    Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Hard: "bg-red-50 text-red-700 border-red-200",
  };

  const style =
    map[category] ?? "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style}`}>
      {category}
    </span>
  );
}

export default function AnswerReveal({
  question,
  selectedOption,
  visible,
}: AnswerRevealProps) {
  const correctKey = getCorrectKey(question);
  const isCorrect = selectedOption !== null && selectedOption === correctKey;

  return (
    <div
      className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${visible ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}
      `}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mt-4 space-y-4">
        {/* Result badge */}
        <div
          className={`flex items-center gap-3 rounded-2xl border px-5 py-4 ${
            isCorrect
              ? "border-emerald-200 bg-emerald-50"
              : "border-red-100 bg-red-50"
          }`}
        >
          <span className="text-2xl" aria-hidden="true">
            {isCorrect ? "✅" : "❌"}
          </span>
          <div>
            <p
              className={`font-bold ${
                isCorrect ? "text-emerald-800" : "text-red-800"
              }`}
            >
              {isCorrect ? "Correct!" : "Incorrect"}
            </p>
            {!isCorrect && correctKey && (
              <p className="text-sm text-red-700">
                The correct answer was <strong>Option {correctKey}</strong>.
              </p>
            )}
          </div>
        </div>

        {/* Explanation */}
        {question.explanation && (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Explanation
            </p>
            <p className="text-sm leading-relaxed text-slate-700">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Metadata grid */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            PYQ Intelligence
          </p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            <MetaItem label="Subject" value={question.subject} />
            <MetaItem label="Topic" value={question.topic} />
            <MetaItem label="Subtopic" value={question.subtopic} />
            <MetaItem label="Theme" value={question.theme} />
            <MetaItem label="Exam" value={question.exam} />
            <MetaItem label="Year" value={question.year} />
            <MetaItem label="Pattern" value={question.q_pattern} />
            <MetaItem label="Type" value={question.q_type} />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                Difficulty
              </span>
              <div className="flex items-center gap-2">
                <DifficultyPill category={question.difficulty_category} />
                {question.difficulty_score != null && (
                  <span className="text-xs text-slate-500">
                    {question.difficulty_score.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
