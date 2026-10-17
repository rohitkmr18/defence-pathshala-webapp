import EditorialMarkdown from "./EditorialMarkdown";
import { parseStatementQuestion } from "@/lib/current-affairs/question-display";

export default function CurrentAffairsQuestion({ source, approved }: { source: string; approved?: boolean }) {
  const parsed = parseStatementQuestion(source);
  if (!parsed) return approved
    ? <EditorialMarkdown source={source} />
    : <h3 className="whitespace-pre-wrap text-[17px] font-black leading-7 text-slate-950 sm:text-lg">{source}</h3>;
  return <div className="text-base leading-7 text-slate-800">
    <p className="whitespace-pre-wrap font-semibold">{parsed.intro}</p>
    <ol aria-label="Question statements" className="mt-4 list-none space-y-3">
      {parsed.statements.map((statement, index) => <li key={index} className="rounded-xl bg-slate-50 px-4 py-3 whitespace-pre-wrap">{statement}</li>)}
    </ol>
    <p className="mt-4 whitespace-pre-wrap font-semibold">{parsed.prompt}</p>
  </div>;
}
