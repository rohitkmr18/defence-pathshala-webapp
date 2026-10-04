"use client";

import Link from "next/link";
import { Compass, Target, House } from "lucide-react";
import { MOBILE_LEARNING_NAV, isMobileLearningNavActive, showGlobalMobileNav } from "@/lib/learning-navigation";

const icons = { Home: House, Explore: Compass, Practice: Target };

export default function MobileLearningNavigation({ pathname }: { pathname: string }) {
  if (!showGlobalMobileNav(pathname)) return null;
  return (
    <nav aria-label="Mobile learning navigation" className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/95 px-3 pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(15,23,42,0.04)] backdrop-blur-md lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        {MOBILE_LEARNING_NAV.map(item => {
          const active = isMobileLearningNavActive(item.href, pathname);
          const Icon = icons[item.name];
          const emphasis = active
            ? "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800";
          return <Link key={item.name} href={item.href} aria-current={active ? "page" : undefined}
            className={`flex min-h-14 min-w-11 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${emphasis}`}>
            <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
            <span>{item.name}</span>
          </Link>;
        })}
      </div>
    </nav>
  );
}
