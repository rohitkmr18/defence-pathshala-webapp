import Link from "next/link";

export default function FounderCredibility() {
  return (
    <section className="border-y border-slate-200 bg-white px-4 py-10 sm:px-6 sm:py-14" aria-labelledby="founder-title">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Why Defence Pathshala exists</p>
        <h2 id="founder-title" className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Built from real examination experience.</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">Exam preparation should not depend on guesswork. Defence Pathshala combines examination experience with technology to help aspirants understand patterns, practise with purpose and review their progress.</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">Our priorities are accessible learning, transparent academic standards and continuous improvement through student feedback.</p>
        <p className="mt-5 font-bold text-slate-900">Rohit Kumar · Founder</p>
        <dl className="mt-3 grid grid-cols-1 gap-3 min-[375px]:grid-cols-3">
          {[["AIR 163", "UPSC CAPF AC"], ["IIT Kanpur", "Alumnus"], ["4×", "CDS written qualified"]].map(([value, label]) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <dt className="text-xs text-slate-600">{label}</dt>
              <dd className="mt-1 text-lg font-black text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
        <Link href="/about" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 underline underline-offset-4">Meet the founder and explore our mission →</Link>
        <p className="mt-2 text-xs text-slate-500">An independent educational initiative, not an official examination authority.</p>
      </div>
    </section>
  );
}
