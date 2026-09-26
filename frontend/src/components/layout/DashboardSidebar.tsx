"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Pencil,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogIn,
  X,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const items = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "PYQ Insights",
    href: "/dashboard/question-bank",
    icon: Database,
  },
  {
    name: "Targeted Practice",
    href: "/dashboard/practice",
    icon: Pencil,
  },
  {
    name: "About Defence Pathshala",
    href: "/about",
    icon: Shield,
  },
];

interface SidebarProps {
  collapsed?: boolean;
  mobile?: boolean;
  closeMobile?: () => void;
  setCollapsed?: (value: boolean) => void;
  user?: SupabaseUser | null;
}

export default function DashboardSidebar({
  collapsed = false,
  mobile = false,
  closeMobile,
  setCollapsed,
  user,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        ${mobile ? "w-72" : collapsed ? "w-[72px]" : "w-64"}
        border-r border-slate-200 bg-white
        flex flex-col shrink-0
        ${mobile ? "" : "hidden lg:flex"}
        transition-all duration-300 ease-out
        min-h-screen
      `}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="relative border-b border-slate-100 p-4">
        <div className="flex items-center justify-between">
          {mobile && (
            <button
              onClick={closeMobile}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {!collapsed && (
            <Link href="/" className="group block">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white text-sm font-black shadow-md shadow-blue-600/20 transition group-hover:bg-blue-500">
                  DP
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Defence Pathshala
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    PYQ Intelligence
                  </p>
                </div>
              </div>
            </Link>
          )}

          {collapsed && !mobile && (
            <Link
              href="/"
              className="group flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white text-sm font-black shadow-md shadow-blue-600/20 transition group-hover:bg-blue-500"
            >
              DP
            </Link>
          )}

          {!mobile && (
            <button
              onClick={() => setCollapsed?.(!collapsed)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="flex-1 p-3" aria-label="Main navigation">
        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => closeMobile?.()}
                title={collapsed && !mobile ? item.name : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 ${
                  active
                    ? "border border-blue-200/80 bg-blue-50 text-blue-700 font-bold shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    active ? "text-blue-600" : "text-slate-500"
                  }`}
                />

                {(!collapsed || mobile) && (
                  <span className="text-sm">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Auth CTA at bottom ───────────────────────────────────────────── */}
      {!collapsed && (
        <div className="border-t border-slate-100 p-4">
          {user ? (
            <div className="flex items-center gap-2.5 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-2xs">
                {user.email?.slice(0, 2).toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">
                  {user.email?.split("@")[0]}
                </p>
                <p className="text-[10px] font-semibold text-blue-600">Signed in</p>
              </div>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-2.5 text-sm font-bold text-blue-700 shadow-2xs transition hover:bg-blue-100"
            >
              <LogIn className="h-4 w-4 text-blue-600" />
              Login to Practice
            </Link>
          )}
        </div>
      )}
    </aside>
  );
}