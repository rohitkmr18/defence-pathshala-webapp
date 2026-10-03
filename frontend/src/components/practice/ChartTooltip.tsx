"use client";

interface TooltipPayloadItem {
  value: number;
  payload: {
    key: string;
    label: string;
    count: number;
  };
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  groupBy?: "cycle" | "year" | "exam";
}

export default function ChartTooltip({
  active,
  payload,
  groupBy,
}: ChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0]?.payload;
  const count = payload[0]?.value ?? 0;

  if (!data) return null;

  const dimensionName =
    groupBy === "cycle"
      ? "Cycle"
      : groupBy === "year"
      ? "Exam Year"
      : "Examination";

  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-xs transition-all dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {dimensionName}
        </span>
      </div>
      <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
        {data.label}
      </p>
      <div className="mt-2 flex items-baseline gap-1.5 border-t border-slate-100 pt-2 dark:border-slate-800">
        <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
          {count.toLocaleString()}
        </span>
        <span className="text-xs text-slate-600 dark:text-slate-300">
          {count === 1 ? "question" : "questions"}
        </span>
      </div>
      <p className="mt-1 text-[10px] font-medium text-blue-500/80">
        Click bar to filter
      </p>
    </div>
  );
}
