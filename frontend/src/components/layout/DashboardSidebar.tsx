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
} from "lucide-react";

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
}

export default function DashboardSidebar({
  collapsed = false,
  mobile = false,
  closeMobile,
  setCollapsed,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        ${mobile ? "w-72" : collapsed ? "w-[72px]" : "w-64"}
        border-r border-gray-200 bg-white
        flex flex-col
        ${mobile ? "" : "hidden lg:flex"}
        transition-all duration-300
      `}
    >
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                Defence Pathshala
              </p>

              <h1 className="mt-2 text-xl font-bold">PYQ Intelligence</h1>
            </div>
          )}

          {!mobile && (
            <button
              onClick={() => setCollapsed?.(!collapsed)}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => closeMobile?.()}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  active
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />

                {!collapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}