"use client";

export default function DashboardError({ reset }: { reset: () => void }) {
  return <div className="mx-auto max-w-md space-y-4 p-8">
    <h1 className="text-xl font-bold">We couldn&apos;t load this page</h1>
    <p role="alert">Please try again.</p>
    <button onClick={reset} className="rounded-xl bg-blue-600 px-5 py-3 text-white">Retry</button>
  </div>;
}
