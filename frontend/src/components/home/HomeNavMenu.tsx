"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const MENU_LINKS = [
  { href: "/dashboard/practice?paper=gs", label: "Start Practicing Free" },
  { href: "/library", label: "Free Library" },
  { href: "/current-affairs", label: "Current Affairs" },
  { href: "/afcat", label: "AFCAT Free Mocks" },
  { href: "/pyqs/cds", label: "CDS PYQs" },
  { href: "/pyqs/capf", label: "CAPF PYQs" },
  { href: "/exams/cds", label: "CDS Exam" },
  { href: "/exams/capf", label: "CAPF Exam" },
  { href: "/about", label: "About" },
];

export default function HomeNavMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="home-nav-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </button>
      {open && (
        <nav
          id="home-nav-menu"
          aria-label="Site menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl"
        >
          {MENU_LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex min-h-11 items-center px-4 text-sm font-semibold hover:bg-blue-50 hover:text-blue-700 ${
                i === 0 ? "text-blue-700" : "text-slate-700"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
