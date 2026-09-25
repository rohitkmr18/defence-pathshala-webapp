"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import { Menu, X } from "lucide-react";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardSidebar
          mobile
          collapsed={false}
          closeMobile={() => setMobileOpen(false)}
        />
      </div>

      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-30 border-b bg-white lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setMobileOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>

            <h1 className="font-semibold">Defence Pathshala</h1>

            <button onClick={() => setMobileOpen(false)}>
              <X className="h-5 w-5 opacity-0" />
            </button>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
