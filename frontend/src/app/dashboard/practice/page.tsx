import { Suspense } from "react";
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
        <Suspense
          fallback={
            <div className="h-96 rounded-3xl border border-slate-200 bg-white p-8 animate-pulse flex items-center justify-center">
              <div className="h-8 w-48 bg-slate-200 rounded-xl" />
            </div>
          }
        >
          <PracticePageClient />
        </Suspense>
      </div>
    </main>
  );
}