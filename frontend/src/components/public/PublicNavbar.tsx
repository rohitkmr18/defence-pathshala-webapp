import Link from "next/link";

export default function PublicNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white text-sm font-black shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              DP
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              Defence Pathshala
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/exams/cds" className="hover:text-blue-600 transition">
              CDS Exam
            </Link>
            <Link href="/exams/capf" className="hover:text-blue-600 transition">
              CAPF Exam
            </Link>
            <Link href="/pyqs/cds" className="hover:text-blue-600 transition">
              CDS PYQs
            </Link>
            <Link href="/pyqs/capf" className="hover:text-blue-600 transition">
              CAPF PYQs
            </Link>
            <Link href="/about" className="hover:text-blue-600 transition">
              About
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-2 text-xs sm:text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            Login
          </Link>
          <Link
            href="/dashboard/practice"
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95"
          >
            Start Practicing Free
          </Link>
        </div>
      </div>
    </nav>
  );
}

