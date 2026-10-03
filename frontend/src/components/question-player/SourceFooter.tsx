import { BookOpen } from "lucide-react";

interface SourceFooterProps {
  source?: string | null;
}

export default function SourceFooter({ source }: SourceFooterProps) {
  if (!source || !source.trim()) {
    return null;
  }

  return (
    <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-slate-800 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-100 transition-colors">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
        <BookOpen className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
          Official Source
        </p>
        <p className="mt-0.5 text-xs sm:text-sm font-medium leading-relaxed break-words text-slate-700 dark:text-slate-300">
          {source}
        </p>
      </div>
    </div>
  );
}
