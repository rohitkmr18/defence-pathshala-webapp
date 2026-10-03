"use client";

export default function SetupError({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-md space-y-4 p-8">
    <h1 className="text-xl font-bold">We couldn&apos;t load your setup</h1>
    <p role="alert">Please retry. Your destination is saved.</p>
    <button onClick={reset} className="rounded-xl bg-blue-600 px-5 py-3 text-white">Retry</button>
  </main>;
}
