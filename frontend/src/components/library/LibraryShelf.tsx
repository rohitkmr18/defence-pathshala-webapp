"use client";

import { useEffect, useMemo, useState } from "react";
import { trackLearningEvent } from "@/lib/learning-events";
import type { LibraryBook } from "@/lib/library/books";
import LibraryBookCard from "./LibraryBookCard";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-10 rounded-full px-4 text-sm font-semibold transition ${
        active ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700"
      }`}
    >
      {children}
    </button>
  );
}

export default function LibraryShelf({ books }: { books: LibraryBook[] }) {
  const [subject, setSubject] = useState<string | null>(null);
  const subjects = useMemo(() => [...new Set(books.map((b) => b.subject))].sort(), [books]);
  const shown = books.filter((b) => (!subject || b.subject === subject));

  useEffect(() => {
    trackLearningEvent("library_hub_view", { books: books.length }, "library_hub");
  }, [books.length]);

  return (
    <div>
      <div className="space-y-3">
        {subjects.length > 1 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by subject">
            <Chip active={!subject} onClick={() => setSubject(null)}>All subjects</Chip>
            {subjects.map((s) => (
              <Chip key={s} active={subject === s} onClick={() => setSubject(s)}>{s}</Chip>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {shown.map((b) => <LibraryBookCard key={b.slug} book={b} />)}
      </div>
      {shown.length === 0 && (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          No eBooks for this filter yet. More subjects are on the way.
        </p>
      )}
    </div>
  );
}
