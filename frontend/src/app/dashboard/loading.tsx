export default function DashboardLoading() {
  return (
    <div role="status" aria-label="Loading dashboard" className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <span className="sr-only">Loading your preparation dashboard…</span>
      <div aria-hidden="true" className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="h-5 w-32 rounded bg-blue-100" />
        <div className="mt-5 h-10 w-56 rounded bg-slate-200" />
        <div className="mt-4 h-5 w-3/4 rounded bg-slate-100" />
        <div className="mt-6 h-32 rounded-2xl bg-slate-100" />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[0, 1, 2, 3].map((item) => <div key={item} className="h-28 rounded-2xl bg-slate-100" />)}
        </div>
      </div>
    </div>
  );
}
