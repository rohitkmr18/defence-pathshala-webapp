import Link from "next/link";

const steps = [
  { title: "Decode the exam", text: "Explore previous year questions by subject and topic to understand what your examination asks.", href: "/dashboard/question-bank?paper=gs", action: "Explore question patterns" },
  { title: "Practise with purpose", text: "Choose relevant subjects and topics for CDS GK, English and Mathematics or CAPF AC Paper I.", href: "/dashboard/practice?paper=gs", action: "Choose your practice" },
  { title: "Analyse your readiness", text: "Attempt available full-length papers and review your performance. AFCAT written mocks use a dedicated exam engine.", href: "/dashboard/practice?paper=gs&mode=full_paper", action: "See CDS / CAPF papers" },
  { title: "Improve through review", text: "Review your answers and explanations, identify gaps and return to targeted practice.", href: "/dashboard/practice?paper=gs", action: "Continue practising" },
];

export default function ProductShowcase() {
  return (
    <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-16" aria-labelledby="products-title">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">The DP Preparation Loop</p>
        <h2 id="products-title" className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Prepare with a clear next step.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">Decode. Practise. Analyse. Improve. Turn every practice session into a more informed preparation decision.</p>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <p className="text-xs font-bold text-blue-700">0{index + 1}</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.text}</p>
              <Link href={step.href} className="mt-3 inline-flex min-h-11 items-center font-semibold text-blue-700 underline underline-offset-4">{step.action} →</Link>
              {index === 2 && <Link href="/afcat" className="flex min-h-11 items-center font-semibold text-blue-700 underline underline-offset-4">Explore AFCAT mocks →</Link>}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs leading-relaxed text-slate-600">Available papers and practice modes vary by exam. Check the relevant exam catalogue for current availability.</p>
      </div>
    </section>
  );
}
