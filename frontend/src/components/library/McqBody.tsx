import type { KeySource, LibraryMcq } from "@/lib/library/quiz";

const LIST_LETTERS = ["A", "B", "C", "D", "E", "F"];

export function SourceBadge({ q }: { q: LibraryMcq }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {q.source.kind === "pyq" ? (
        <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          PYQ · {q.source.label}
        </span>
      ) : (
        <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-700">
          DP Original · Practice
        </span>
      )}
      <span className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {q.format}
      </span>
    </div>
  );
}

export function keySourceNote(source: KeySource): string {
  if (source === "official") return "Official UPSC key.";
  if (source === "dp-solution") return "Key source: Defence Pathshala solution — official UPSC key not yet recorded.";
  return "DP Original practice question.";
}

/** Stem, statements, match lists and prompt — everything above the options. */
export default function McqBody({ q }: { q: LibraryMcq }) {
  return (
    <div className="space-y-4">
      <p className="text-base font-semibold leading-7 text-slate-900">{q.stem}</p>

      {q.statements && (
        <ol className="space-y-2 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-800">
          {q.statements.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono font-bold text-slate-500">{i + 1}.</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      )}

      {q.lists && (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{q.lists.leftTitle}</p>
              <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-800">
                {q.lists.left.map((item, i) => (
                  <li key={i} className="flex gap-2"><span className="font-mono font-bold text-blue-700">{LIST_LETTERS[i]}.</span>{item}</li>
                ))}
              </ul>
            </div>
            <div className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{q.lists.rightTitle}</p>
              <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-800">
                {q.lists.right.map((item, i) => (
                  <li key={i} className="flex gap-2"><span className="font-mono font-bold text-slate-500">{i + 1}.</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {q.prompt && <p className="text-sm font-semibold leading-6 text-slate-800">{q.prompt}</p>}
      {q.lists?.codeOrder && (
        <p className="font-mono text-xs font-semibold text-slate-500">Code order: {q.lists.codeOrder}</p>
      )}
    </div>
  );
}
