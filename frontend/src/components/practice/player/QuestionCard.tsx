"use client";

import type { PracticeQuestion, OptionKey } from "@/lib/practice-types";
import { getOptions, getCorrectKey } from "@/lib/practice-types";
import OptionList from "./OptionList";
import QuestionRenderer from "./renderers/QuestionRenderer";

interface QuestionCardProps {
  question: PracticeQuestion;
  questionNumber: number;
  selectedOption: OptionKey | null;
  revealed: boolean;
  onSelect: (key: OptionKey) => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  selectedOption,
  revealed,
  onSelect,
}: QuestionCardProps) {
  const options = getOptions(question);
  const correctKey = getCorrectKey(question);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
      {/* Breadcrumb */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {question.subject}
        </span>
        <span className="text-slate-300" aria-hidden="true">›</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          {question.topic}
        </span>
        <span className="ml-auto text-xs text-slate-400">
          Q{questionNumber} · {question.exam} {question.year}
        </span>
      </div>

      {/* Question text */}
      <div className="mb-8 text-base font-medium leading-[1.65] text-slate-900">
        <QuestionRenderer text={question.question} pattern={question.q_pattern} />
      </div>

      {/* Options */}
      <OptionList
        options={options}
        selected={selectedOption}
        correct={revealed ? correctKey : null}
        revealed={revealed}
        disabled={revealed}
        onSelect={onSelect}
      />
    </div>
  );
}
