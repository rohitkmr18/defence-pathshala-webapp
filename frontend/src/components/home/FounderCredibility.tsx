import Link from "next/link";

export default function FounderCredibility() {
  return <section className="border-y border-slate-200 bg-white px-4 py-8 text-center sm:px-6">
    <h2 className="text-sm font-semibold text-slate-600">Built by Rohit Kumar</h2>
    <p className="mx-auto mt-2 max-w-3xl text-lg font-bold leading-relaxed text-slate-900">CAPF AC AIR 163 | IIT Kanpur | CDS Written Qualified 4×</p>
    <Link href="/about" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 underline underline-offset-4">Meet the founder →</Link>
  </section>;
}
