import Link from "next/link";
import { getDailyCurrentAffairsList } from "@/lib/current-affairs";
import { latestMonthlyCapsule } from "@/lib/monthly-capsules";

export function CurrentAffairsEntries({ quizHref }: { quizHref?: string }) {
  const capsule = latestMonthlyCapsule();
  const entries = [
    { title: "Daily Current Affairs", text: "Exam-focused news and analysis.", href: "/current-affairs" },
    { title: "Daily CA Quiz", text: "Test what you learned with MCQs.", href: quizHref },
    { title: "Monthly CA Capsule", text: "Structured revision, one month at a time.", href: capsule ? `/current-affairs/monthly/${capsule.edition}` : undefined },
  ];
  return (
    <section aria-labelledby="home-current-affairs" className="border-b border-slate-200 bg-white px-4 py-7 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <h2 id="home-current-affairs" className="text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl">Current Affairs That Actually Matter.</h2>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">Read. Revise. Test yourself. Stay exam-ready.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {entries.map(entry => {
            const content = <><h3 className="font-bold text-slate-900">{entry.title}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{entry.text}</p>{!entry.href && <p className="mt-1 text-xs text-slate-500">Check back for availability.</p>}</>;
            const className = "block rounded-xl border border-slate-200 bg-slate-50 p-4";
            return entry.href ? <Link key={entry.title} href={entry.href} className={`${className} hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}>{content}</Link> : <div key={entry.title} aria-disabled="true" className={className}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}

export default async function HomeCurrentAffairs() {
  // Read only published canonical editions. Never invent a date or quiz route.
  const posts = await getDailyCurrentAffairsList().catch(() => []);
  const quizEdition = posts.find(post => post.quizCount > 0);
  return <CurrentAffairsEntries quizHref={quizEdition ? `/current-affairs/${quizEdition.date}#quiz` : undefined} />;
}
