import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import ProductShowcase from "@/components/home/ProductShowcase";
import FounderCredibility from "@/components/home/FounderCredibility";
import ObjectionAndFinalCtaSection from "@/components/home/ObjectionAndFinalCtaSection";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white text-sm font-black shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              DP
            </div>
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

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200/80 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-black shadow-xs">
              DP
            </div>
            <span className="font-semibold text-slate-800">
              Defence Pathshala
            </span>
            <span>&bull; India&apos;s First PYQ Intelligence Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-blue-600 transition">
              About
            </Link>
            <Link href="/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <Link href="/dashboard/question-bank" className="hover:text-blue-600 transition">
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
