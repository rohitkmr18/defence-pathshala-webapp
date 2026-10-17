"use client";

import Link from "next/link";

export default function CurrentAffairsError({ retry }: { retry: () => void }) {
  return <section role="alert" className="mx-auto max-w-2xl px-4 py-10">
    <h1 className="text-2xl font-bold text-slate-950">Current Affairs is temporarily unavailable</h1>
    <p className="mt-3 text-base leading-7 text-slate-600">We couldn’t load this edition. Please try again in a moment.</p>
    <div className="mt-5 flex flex-wrap gap-3">
      <button onClick={retry} className="min-h-11 rounded-xl bg-blue-700 px-4 py-3 font-bold text-white">Try again</button>
      <Link href="/current-affairs" className="inline-flex min-h-11 items-center px-4 font-bold text-blue-700">Browse editions</Link>
    </div>
  </section>;
}
