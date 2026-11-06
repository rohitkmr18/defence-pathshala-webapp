import Link from "next/link";
import type { Metadata } from "next";
import ExamModeSwitcher from "@/components/layout/ExamModeSwitcher";
import AfcatDashboardClient from "./AfcatDashboardClient";

export const metadata: Metadata = {
  title: "AFCAT Dashboard – Defence Pathshala",
  description: "Your AFCAT mock scores, section accuracy and weakest topics.",
  robots: { index: false, follow: false },
};

export default function AfcatDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/afcat/dashboard" className="flex items-center gap-2 text-sm font-bold">
            <span className="rounded-lg bg-blue-600 px-2.5 py-2 text-white">DP</span>
            Defence Pathshala
          </Link>
          <ExamModeSwitcher compact />
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">AFCAT</p>
            <h1 className="text-3xl font-black tracking-tight">Your AFCAT dashboard</h1>
          </div>
          <Link href="/afcat" className="text-sm font-bold text-blue-700 hover:underline">All AFCAT mocks →</Link>
        </div>
        <AfcatDashboardClient />
      </div>
    </main>
  );
}
