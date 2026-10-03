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

  if (count === null) {
    return (
      <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-2xs">
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
                <circle cx="12" cy="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
                <path d="m9.17 14.83-4.24 4.24" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-900">
                Choose an exam above to configure practice
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Select your target defence examination or click &ldquo;Select All Exams&rdquo; to begin practicing questions.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto shrink-0 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-600 shadow-2xs">
            Awaiting Exam Selection
          </span>
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
