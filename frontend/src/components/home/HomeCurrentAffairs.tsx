import Link from "next/link";
import { getDailyCurrentAffairsList } from "@/lib/current-affairs";
import { latestMonthlyCapsule } from "@/lib/monthly-capsules";

type EditionPreview = { date: string; formattedDate: string; title: string; headlines: string[] };

export function CurrentAffairsEntries({ quizHref, edition }: { quizHref?: string; edition?: EditionPreview }) {
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
        {edition && <article className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Latest published edition · {edition.formattedDate}</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">{edition.title}</h3>
          {edition.headlines.length > 0 && <ul className="mt-3 space-y-2 text-sm text-slate-700">{edition.headlines.map((headline, index) => <li key={index} className="border-l-2 border-blue-500 pl-3">{headline}</li>)}</ul>}
          <Link href={`/current-affairs/${edition.date}`} className="mt-3 inline-flex min-h-11 items-center font-semibold text-blue-700 underline underline-offset-4">Read latest edition →</Link>
        </article>}
        <p className="mt-4 text-sm leading-relaxed text-slate-600">Understand what happened, why it matters and how it connects to your exam.</p>
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
  const latest = posts[0];
  const edition = latest ? { date: latest.date, formattedDate: latest.formattedDate, title: latest.title, headlines: latest.stories.slice(0, 3).map(story => story.headline) } : undefined;
  return <CurrentAffairsEntries edition={edition} quizHref={quizEdition ? `/current-affairs/${quizEdition.date}#quiz` : undefined} />;
}
