import Link from "next/link";
import DPLogo from "@/components/common/DPLogo";
import HomeNavMenu from "@/components/home/HomeNavMenu";

/** Share the same visible hamburger and mobile navigation as the homepage. */
export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <DPLogo className="h-9 w-auto shrink-0 transition-transform group-hover:scale-105" />
          <span className="truncate text-base font-bold tracking-tight text-slate-900">
            Defence Pathshala
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/auth/login"
            className="inline-flex min-h-11 items-center rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 sm:text-sm"
          >
            Login
          </Link>
          <HomeNavMenu />
        </div>
      </div>
    </header>
  );
}
