"use client";

import type { OptionKey } from "@/lib/practice-types";
import { renderOptionText } from "./renderers/renderQuestionText";

interface Option {
  key: OptionKey;
  text: string;
}

interface OptionListProps {
  options: Option[];
  selected: OptionKey | null;
  correct: OptionKey | null;
  revealed: boolean;
  disabled: boolean;
  onSelect: (key: OptionKey) => void;
}

function getOptionStyle(
  key: OptionKey,
  selected: OptionKey | null,
  correct: OptionKey | null,
  revealed: boolean
): string {
  const base =
    "w-full text-left rounded-xl border px-5 py-4 text-sm font-medium transition-all duration-200 flex items-start gap-4 group";

  if (!revealed) {
    if (selected === key) {
      return `${base} border-blue-600 bg-blue-50 text-blue-900 shadow-[0_0_0_2px_rgba(37,99,235,0.25)]`;
    }
    return `${base} border-slate-200 bg-white text-slate-800 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md`;
  }

  // Post-reveal states
  if (key === correct) {
    return `${base} border-emerald-500 bg-emerald-50 text-emerald-900`;
  }
  if (key === selected && selected !== correct) {
    return `${base} border-red-400 bg-red-50 text-red-900`;
  }
  return `${base} border-slate-100 bg-white text-slate-400 opacity-60`;
}

function OptionIndicator({
  optKey,
  selected,
  correct,
  revealed,
}: {
  optKey: OptionKey;
  selected: OptionKey | null;
  correct: OptionKey | null;
  revealed: boolean;
}) {
  const isCorrect = revealed && optKey === correct;
  const isWrong = revealed && optKey === selected && selected !== correct;

  const base =
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold border transition-all duration-200";

  if (isCorrect) return <span className={`${base} border-emerald-500 bg-emerald-500 text-white`}>{optKey}</span>;
  if (isWrong)   return <span className={`${base} border-red-400 bg-red-400 text-white`}>{optKey}</span>;
  if (!revealed && selected === optKey)
    return <span className={`${base} border-blue-600 bg-blue-600 text-white`}>{optKey}</span>;
  return <span className={`${base} border-slate-300 bg-white text-slate-500`}>{optKey}</span>;
}

export default function OptionList({
  options,
  selected,
  correct,
  revealed,
  disabled,
  onSelect,
}: OptionListProps) {
  return (
    <div className="space-y-3" role="radiogroup" aria-label="Answer options">
      {options.map(({ key, text }) => (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={selected === key}
          disabled={disabled}
          onClick={() => onSelect(key)}
          className={getOptionStyle(key, selected, correct, revealed)}
        >
          <OptionIndicator
            optKey={key}
            selected={selected}
            correct={correct}
            revealed={revealed}
          />
          <span className="mt-0.5 whitespace-pre-line leading-[1.6]">
            {renderOptionText(text, key)}
          </span>
        </button>
      ))}
    </div>
  );
}
