"use client";

interface QuestionCountCardProps {
  count: number | null;
  loading: boolean;
}

export default function QuestionCountCard({
  count,
  loading,
}: QuestionCountCardProps) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3.5 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-amber-900">
              No questions match your current filters.
            </p>
            <p className="mt-1 text-sm text-amber-700">
              Try expanding the year range or removing one filter.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
            Matching questions
          </p>
          <p className="mt-1.5 text-3xl font-bold text-slate-900">
            {count !== null ? `${count} Questions` : "—"}
          </p>
        </div>

        {count !== null && count > 0 && (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Ready
          </span>
        )}
      </div>
    </div>
  );
}
