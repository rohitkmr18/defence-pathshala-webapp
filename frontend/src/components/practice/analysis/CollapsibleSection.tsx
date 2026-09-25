"use client";

import { useState, ReactNode } from "react";
import { ChevronDown, Info } from "lucide-react";

interface CollapsibleSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  defaultOpen?: boolean;
  isEligible?: boolean;
  minThresholdNotice?: string;
  children: ReactNode;
}

export default function CollapsibleSection({
  id,
  title,
  subtitle,
  badge,
  defaultOpen = false,
  isEligible = true,
  minThresholdNotice,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // If section is not statistically eligible, render friendly notice
  if (!isEligible) {
    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 shadow-2xs backdrop-blur-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Info className="h-4 w-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        </div>
        <p className="mt-1.5 text-xs text-slate-500">
          {minThresholdNotice ||
            "Not enough sample size in this attempt to generate reliable patterns. Complete a full session to unlock."}
        </p>
      </div>
    );
  }

  return (
    <div
      id={id}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition hover:border-slate-300"
    >
      {/* Collapsible Click Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        className="flex w-full items-center justify-between p-6 text-left transition hover:bg-slate-50/50 sm:p-7 focus:outline-none"
      >
        <div className="flex-1 pr-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              {title}
            </h3>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">{subtitle}</p>
          )}
        </div>

        {/* Chevron Toggle */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-transform duration-300 ${
            isOpen ? "rotate-180 bg-slate-100 text-slate-900" : ""
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>

      {/* Accordion Content Area */}
      <div
        id={`${id}-content`}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 p-6 sm:p-8 pt-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
