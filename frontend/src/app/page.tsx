import Link from "next/link";
import { latestMonthlyCapsule } from "@/lib/monthly-capsules";
import HeroSection from "@/components/home/HeroSection";
import ProductShowcase from "@/components/home/ProductShowcase";
import FounderCredibility from "@/components/home/FounderCredibility";
import ObjectionAndFinalCtaSection from "@/components/home/ObjectionAndFinalCtaSection";
import DPLogo from "@/components/common/DPLogo";
import PublicExploreLinks from "@/components/public/PublicExploreLinks";

export default function HomePage() {
  const capsule = latestMonthlyCapsule();
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <DPLogo className="h-9 w-auto transition-transform group-hover:scale-105" />
            <span className="text-base font-bold text-slate-900 tracking-tight">
              Defence Pathshala
            </span>
          </Link>

          <div className="flex items-center">
            <Link
              href="/auth/login"
              className="rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-2 text-xs sm:text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section (Screen 1 - 100% Untouched) ────────────────────── */}
      <HeroSection />

      {/* ── Screen 2: Product Showcase (Visual Difference & Core Value) ─── */}
      <ProductShowcase />

      {/* ── Screen 3: Verified Founder Authority & Trust ────────────────── */}
      <FounderCredibility />

      {/* ── Screen 4: FAQs & High-Converting Final CTA ──────────────────── */}
      <ObjectionAndFinalCtaSection />

      {/* ── Crawlable public hubs: exam, subject, mock and current-affairs links ── */}
      <PublicExploreLinks className="border-t border-slate-200/80 bg-slate-50" />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200/80 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <DPLogo className="h-7 w-auto" />
            <span className="font-semibold text-slate-800">
              Defence Pathshala
            </span>
            <span>&bull; India&apos;s First PYQ Intelligence Platform</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/pyqs/cds" className="hover:text-blue-600 transition">
              CDS PYQs
            </Link>
            <Link href="/pyqs/capf" className="hover:text-blue-600 transition">
              CAPF PYQs
            </Link>
            <Link href="/exams/cds" className="hover:text-blue-600 transition">
              CDS Exam
            </Link>
            <Link href="/exams/capf" className="hover:text-blue-600 transition">
              CAPF Exam
            </Link>
            <Link href="/afcat" className="hover:text-blue-600 transition">
              AFCAT Free Mocks
            </Link>
            <Link href="/current-affairs" className="hover:text-blue-600 transition">
              Current Affairs
            </Link>
            {capsule && (
              <Link href={`/current-affairs/monthly/${capsule.edition}`} className="hover:text-blue-600 transition">
                Monthly Capsule
              </Link>
            )}
            <Link href="/about" className="hover:text-blue-600 transition">
              About
            </Link>
            <Link href="/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <Link href="/dashboard/question-bank?paper=gs" className="hover:text-blue-600 transition">
              Question Bank
            </Link>
            <Link href="/auth/login" className="hover:text-blue-600 transition">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
