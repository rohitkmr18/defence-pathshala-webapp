"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ExamModeSwitcherProps = { compact?: boolean };

export default function ExamModeSwitcher({ compact = false }: ExamModeSwitcherProps) {
  const pathname = usePathname();
  const isAfcat = pathname === "/afcat" || pathname.startsWith("/afcat/");
  return (
    <nav aria-label="Exam mode" className={compact ? "flex items-center gap-2" : "space-y-2"}>
      {!compact && <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Exam Mode</p>}
      <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
        <Link href="/dashboard" aria-current={!isAfcat ? "page" : undefined}
          className={`flex-1 rounded-lg px-2 py-2 text-center text-xs font-semibold transition-colors ${!isAfcat ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:bg-white/70"}`}>
          UPSC
        </Link>
        <Link href="/afcat" aria-current={isAfcat ? "page" : undefined}
          className={`flex-1 rounded-lg px-2 py-2 text-center text-xs font-semibold transition-colors ${isAfcat ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:bg-white/70"}`}>
          AFCAT
        </Link>
      </div>
    </nav>
  );
}
