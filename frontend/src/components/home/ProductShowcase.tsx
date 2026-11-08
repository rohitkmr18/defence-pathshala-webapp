import Link from "next/link";

export default function ProductShowcase() {
  const products = [
    { title: "Practice Questions", text: "Build targeted sessions for CDS GK, English and Mathematics, or CAPF AC Paper I. Choose subjects and topics, then review your answers.", href: "/dashboard/practice?paper=gs", action: "Choose your practice" },
    { title: "Full-Length Mock Tests", text: "Attempt CDS GK and CAPF Paper I previous-year papers. AFCAT written mocks use a separate exam engine. CDS English and Mathematics full-paper mocks are coming soon.", href: "/dashboard/practice?paper=gs&mode=full_paper", action: "See CDS / CAPF papers" },
    { title: "Decode PYQs", text: "Explore CDS and CAPF GS questions by subject and topic to understand paper patterns. English and Mathematics practice is available through the CDS paper tabs.", href: "/dashboard/question-bank?paper=gs", action: "Explore question patterns" },
  ];
  return <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-16" aria-labelledby="products-title"><div className="mx-auto max-w-5xl">
    <h2 id="products-title" className="text-2xl font-black text-slate-900 sm:text-3xl">Prepare with a clear next step.</h2>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">{products.map((product, index) => <article key={product.title} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><p className="text-xs font-bold text-blue-700">0{index + 1}</p><h3 className="mt-2 text-xl font-bold text-slate-900">{product.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{product.text}</p><Link href={product.href} className="mt-3 inline-flex min-h-11 items-center font-semibold text-blue-700 underline underline-offset-4">{product.action} →</Link>{index === 1 && <Link href="/afcat" className="flex min-h-11 items-center font-semibold text-blue-700 underline underline-offset-4">Explore AFCAT mocks →</Link>}</article>)}</div>
  </div></section>;
}
