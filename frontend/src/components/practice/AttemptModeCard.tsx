"use client";

import type { LucideIcon } from "lucide-react";

export interface AttemptModeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  /** Both variants use the same filled CTA treatment. */
  variant: "outline" | "filled";
  onStart: () => void;
  disabled?: boolean;
}

export default function AttemptModeCard({
  icon: Icon,
  title,
  description,
  ctaLabel,
  variant,
  onStart,
  disabled = false,
}: AttemptModeCardProps) {
  return (
    <div
      className={`
        flex flex-col rounded-3xl border border-slate-200 bg-white p-6
        shadow-[0_10px_30px_rgba(15,23,42,0.06)]
        transition-all duration-200
        ${disabled ? "opacity-60" : "hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.10)]"}
      `}
    >
      {/* Icon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        <Icon className="h-5 w-5" />
      </div>

      {/* Text */}
      <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
        {description}
      </p>

      {/* CTA */}
      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={onStart}
          disabled={disabled}
          className={`
            w-full rounded-xl py-3 text-sm font-semibold transition-all active:scale-[0.98]
            ${
              variant === "filled"
                ? "bg-black text-white hover:bg-slate-800 disabled:bg-slate-300"
                : "bg-black text-white hover:bg-slate-800 disabled:bg-slate-300"
            }
          `}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
