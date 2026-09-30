import Link from "next/link";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white text-sm font-black shadow-md shadow-blue-600/30">
                DP
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Defence Pathshala
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Targeted previous year question intelligence and mock practice for UPSC CDS and CAPF (AC) aspirants.
            </p>
          </div>

          {/* Examinations */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Examinations
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/exams/cds" className="text-slate-400 hover:text-white transition">
                  CDS Examination
                </Link>
              </li>
              <li>
                <Link href="/exams/capf" className="text-slate-400 hover:text-white transition">
                  CAPF (AC) Examination
                </Link>
              </li>
            </ul>
          </div>

          {/* PYQ Archives */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              PYQ Archives
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/pyqs/cds" className="text-slate-400 hover:text-white transition">
                  CDS Previous Year Questions
                </Link>
              </li>
              <li>
                <Link href="/pyqs/capf" className="text-slate-400 hover:text-white transition">
                  CAPF (AC) Previous Year Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Platform
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition">
                  About Defence Pathshala
                </Link>
              </li>
              <li>
                <Link href="/dashboard/practice" className="text-slate-400 hover:text-white transition">
                  Interactive Practice Hub
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-slate-400 hover:text-white transition">
                  Candidate Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} Defence Pathshala. All rights reserved.</p>
          <p>Built for serious defence service aspirants.</p>
        </div>
      </div>
    </footer>
  );
}

