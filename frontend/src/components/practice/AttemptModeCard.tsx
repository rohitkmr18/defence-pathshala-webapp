"use client";

import type { LucideIcon } from "lucide-react";

export interface AttemptModeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
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
        ${disabled ? "opacity-60" : "hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"}
      `}
    >
      {/* Icon */}
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-2xs">
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
            w-full rounded-2xl py-3 text-sm font-bold transition-all active:scale-[0.98]
            ${
              variant === "filled"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                : "border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-50 disabled:border-slate-200 disabled:text-slate-400"
            }
          `}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
