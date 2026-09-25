import PracticePageClient from "./components/PracticePageClient";

export default function PracticePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        {/* Page header */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Defence Pathshala
          </p>

          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
            Targeted Practice
          </h1>

          <p className="max-w-3xl text-lg text-slate-600">
            Create a custom PYQ session or attempt an entire paper.
          </p>
        </div>

        <PracticePageClient />
      </div>
    </main>
  );
}