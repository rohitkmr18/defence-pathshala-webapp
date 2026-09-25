import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <section className="mx-auto flex max-w-5xl flex-col items-start justify-center gap-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
          Defence Pathshala
        </p>

        <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
          Practice smarter for UPSC Defence exams.
        </h1>

        <p className="max-w-xl text-lg text-slate-300">
          Build consistency with targeted PYQ practice, exam filters, and
          focused preparation insights.
        </p>

        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500"
          >
            Targeted Practice
          </Link>
        </div>
      </section>
    </main>
  );
}
