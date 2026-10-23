import Link from "next/link";
import type { CurrentAffairsStory } from "@/lib/current-affairs";

/** Illustrates planned organisation; only the allowlisted sample is interactive. */
export default function MonthlyWorkspacePreview({ story }: { story?: CurrentAffairsStory }) {
  return <section aria-label="Illustrative monthly workspace" className="mt-8 border-t border-slate-200 pt-6">
    <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Illustrative Monthly Intelligence workspace</p>
    <h2 className="mt-2 text-xl font-bold text-slate-950">A month you can study, practise and revise.</h2>
    <p className="mt-3 text-sm leading-6 text-slate-600">Full-edition features are planned. Only the labelled free sample is available now; chapter coverage will be finalised after editorial approval.</p>
    <dl className="mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200 px-4 sm:px-5">
      <div className="py-4">
        <dt className="font-bold text-slate-950">Subject-wise monthly chapters <span className="ml-1 text-xs font-medium text-slate-500">· Planned</span></dt>
        <dd className="mt-2 text-sm leading-6 text-slate-600">Group approved lessons by subject and concept for focused study.</dd>
        {story ? <dd className="mt-3 border-l-2 border-blue-600 pl-3">
          <p className="text-xs font-bold text-blue-700">Working free sample · {story.subject}</p>
          <Link href="/current-affairs/monthly/2026-10/sample" className="mt-1 block py-2 text-sm font-semibold leading-6 text-blue-800 underline underline-offset-4">{story.headline} →</Link>
        </dd> : <dd className="mt-2 text-sm text-slate-500">The approved sample is temporarily unavailable.</dd>}
      </div>
      {[
        ["Consolidated MCQ practice", "Practise approved questions across the month, with explanations and exam feedback."],
        ["Linked PYQ connections", "Connect approved lessons to eligible canonical historical PYQs."],
        ["Revision & progress workspace", "Track lesson progress, bookmark facts and return to a consolidated revision queue."],
        ["Monthly eBook companion", "A downloadable eBook is included in the planned ₹79 edition. The October eBook is not yet available."],
      ].map(([title, description]) => <div key={title} className="py-4">
        <dt className="font-bold text-slate-950">{title} <span className="ml-1 text-xs font-medium text-slate-500">· Planned</span></dt>
        <dd className="mt-2 text-sm leading-6 text-slate-600">{description}</dd>
      </div>)}
    </dl>
  </section>;
}
