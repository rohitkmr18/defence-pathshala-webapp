import Link from "next/link";

export default function MissingEdition() {
  return <section className="mx-auto max-w-2xl px-4 py-10">
    <h1 className="text-2xl font-bold text-slate-950">No edition for this date</h1>
    <p className="mt-3 text-base leading-7 text-slate-600">Choose a published edition from the Current Affairs archive.</p>
    <Link href="/current-affairs" className="mt-4 inline-flex min-h-11 items-center font-bold text-blue-700">Browse editions</Link>
  </section>;
}
