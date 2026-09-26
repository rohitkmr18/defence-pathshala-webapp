import PracticePageClient from "./components/PracticePageClient";

export const metadata = {
  title: "Targeted Practice – Defence Pathshala",
  description:
    "Create custom PYQ sessions filtered by exam, year, subject and topic. Practice the way the exam demands.",
};

export default function PracticePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Page header */}
        <div className="mb-8 sm:mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
            Defence Pathshala
          </p>

          <h1 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
            Targeted Practice
          </h1>

          <p className="max-w-3xl text-base text-slate-600 sm:text-lg">
            Create a custom PYQ session or attempt an entire paper.
          </p>
        </div>

        <PracticePageClient />
      </div>
    </main>
  );
}