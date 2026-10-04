"use client";

import { Suspense, useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { authUrl } from "@/lib/auth-redirect";
import MobileLearningNavigation from "./MobileLearningNavigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import DashboardSidebar from "./DashboardSidebar";
import {
  Menu,
  LogIn,
  LogOut,
  ChevronDown,
  Target,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import EditTargetModal from "@/components/dashboard/EditTargetModal";

// ─── User avatar / menu ──────────────────────────────────────────────────────

function UserMenu({ user }: { user: SupabaseUser }) {
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const initials =
    user.email?.slice(0, 2).toUpperCase() ?? "U";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="User menu"
        aria-expanded={open}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-2xs">
          {initials}
        </span>
        <span className="hidden sm:block max-w-[120px] truncate">
          {user.email?.split("@")[0]}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-xs font-semibold text-slate-500">Signed in as</p>
              <p className="mt-0.5 truncate text-sm font-bold text-slate-900">
                {user.email}
              </p>
            </div>
            <div className="p-1 space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setEditModalOpen(true);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
              >
                <Target className="h-4 w-4 text-blue-600" />
                Edit Target Exams
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}

      <EditTargetModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
    </div>
  );
}

// ─── Main Shell ───────────────────────────────────────────────────────────────

function subscribeHashChange(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  window.addEventListener("dp:learning-location-change", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("dp:learning-location-change", onChange);
  };
}
const getHash = () => window.location.hash;
const getServerHash = () => "";

function DashboardShellContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const pathname = usePathname();
  const hash = useSyncExternalStore(subscribeHashChange, getHash, getServerHash);
  useEffect(() => {
    // Next commits cross-page anchor URLs after rendering the new pathname.
    // Refresh the hash snapshot after that commit as well as native hash changes.
    window.dispatchEvent(new Event("dp:learning-location-change"));
  }, [pathname]);
  const searchParams = useSearchParams();
  const loginHref = authUrl("/auth/login", `${pathname}${searchParams.size ? `?${searchParams}` : ""}`);

  // Fetch auth state client-side
  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const close = window.setTimeout(() => setMobileOpen(false), 0);
    return () => window.clearTimeout(close);
  }, [pathname]);

  return (
    <div className="flex min-h-screen max-w-full overflow-x-hidden bg-gray-50">
      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <DashboardSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        user={user}
      />

      {/* ── Mobile sidebar overlay ───────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile sidebar drawer ────────────────────────────────────────── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardSidebar
          mobile
          collapsed={false}
          closeMobile={() => setMobileOpen(false)}
          user={user}
        />
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-x-hidden pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-nav lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Brand */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-black shadow-md shadow-blue-600/20">
                DP
              </div>
              <span className="text-sm font-bold text-slate-900">
                Defence Pathshala
              </span>
            </Link>

            {/* Auth state in top bar */}
            {authLoading ? (
              <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse" />
            ) : user ? (
              <UserMenu user={user} />
            ) : (
              <Link
                href={loginHref}
                className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-2xs transition hover:bg-blue-100"
              >
                <LogIn className="h-3.5 w-3.5 text-blue-600" />
                Login
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <div className="w-full">{children}</div>
      </main>
      <MobileLearningNavigation pathname={pathname} hash={hash} />
    </div>
  );
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return <Suspense><DashboardShellContent>{children}</DashboardShellContent></Suspense>;
}
