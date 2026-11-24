import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Activity = { user_id: string; question: string; date: string; feature: string };
type Row = { id: string; user_id: string; question_id?: string; mcq_id?: string; attempted_at?: string; answered_at?: string; selected_option?: string; session_id?: string; completed_at?: string };
const sources = [
  ["user_attempts","question_id","attempted_at","PYQ"],
  ["current_affairs_quiz_attempts","mcq_id","attempted_at","Current affairs"],
  ["mock_responses","question_id","answered_at","Mock"],
  ["afcat_responses","question_id","answered_at","AFCAT"],
] as const;
const day = (value: string | number) => new Date(new Date(value).getTime()+19800000).toISOString().slice(0,10);
const shift = (date: string,n: number) => new Date(Date.parse(date)+n*86400000).toISOString().slice(0,10);
const pct = (a:number,b:number) => b ? (100*a/b).toFixed(1)+"%" : "—";
const distinct = (a: Activity[]) => new Set(a.map(x=>x.user_id)).size;
const questions = (a: Activity[]) => new Set(a.map(x=>x.feature+":"+x.question)).size;

async function report(period: number) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Unavailable");
  // Never allow preview deployments to query production.
  if (process.env.VERCEL_ENV !== "production" && new URL(url).hostname !== "pxfstrzceyxnweeaydvz.supabase.co") throw new Error("Environment not allowed");
  const db = createAdmin(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const end=shift(day(Date.now()),-1), start=shift(end,1-period);
  const cutoff=new Date(Date.parse(shift(end,1))-19800000).toISOString();
  const accounts=new Set<string>();
  for(let p=1;p<=100;p++){
    const {data,error}=await db.auth.admin.listUsers({page:p,perPage:500});
    if(error) throw error;
    for(const u of data.users) if(u.app_metadata?.role!=="admin") accounts.add(u.id);
    if(data.users.length<500) break;
    if(p===100) throw new Error("Account limit");
  }
  const events: Activity[]=[];
  for(const [table,q,t,feature] of sources){
    for(let offset=0;offset<100000;offset+=500){
      const {data,error}=await db.from(table).select("id,user_id,"+q+","+t+",selected_option").not("selected_option","is",null).lt(t,cutoff).order("id").range(offset,offset+499);
      if(error) throw error;
      const rows=(data??[]) as unknown as Row[];
      for(const row of rows){
        const ts=row[t], question=row[q];
        if(ts && question && row.selected_option?.trim() && accounts.has(row.user_id)) events.push({user_id:row.user_id,question,date:day(ts),feature});
      }
      if(rows.length<500) break;
      if(offset===99500) throw new Error("Activity limit");
    }
  }
  const completed=new Set<string>();
  for(const table of ["mock_session_results","afcat_session_results"]){
    for(let offset=0;offset<100000;offset+=500){
      const select=table==="afcat_session_results"?"session_id,user_id,completed_at,afcat_sessions!inner(afcat_tests!inner(kind))":"session_id,user_id,completed_at";
      let query=db.from(table).select(select).gte("completed_at",new Date(Date.parse(shift(end,-6))-19800000).toISOString()).lt("completed_at",cutoff);
      if(table==="afcat_session_results") query=query.eq("afcat_sessions.afcat_tests.kind","FULL_MOCK");
      const {data,error}=await query.order("session_id").range(offset,offset+499);
      if(error) throw error;
      for(const row of (data??[]) as unknown as Row[]) if(accounts.has(row.user_id)) completed.add(row.user_id);
      if((data??[]).length<500) break;
      if(offset===99500) throw new Error("Completion limit");
    }
  }
  const daily=events.filter(x=>x.date===end), weekly=events.filter(x=>x.date>=shift(end,-6)), monthly=events.filter(x=>x.date>=shift(end,-29));
  const grouped=(a:Activity[])=>{const m=new Map<string,Activity[]>(); for(const x of a){const arr=m.get(x.user_id)??[];arr.push(x);m.set(x.user_id,arr);}return m;};
  const meaningful=new Set(completed);
  for(const [id,a] of grouped(weekly)) if(questions(a)>=20) meaningful.add(id);
  const engaged=[...grouped(daily).values()].filter(a=>questions(a)>=10).length;
  const cohorts=new Map<string,{n:number;eligible:number[];returned:number[]}>();
  for(const a of grouped(events).values()){
    const dates=[...new Set(a.map(x=>x.date))].sort(), first=dates[0];
    if(first<start) continue;
    const monday=shift(first,-((new Date(first).getUTCDay()+6)%7));
    const c=cohorts.get(monday)??{n:0,eligible:[0,0,0],returned:[0,0,0]};
    c.n++;
    [1,7,30].forEach((n,i)=>{const target=shift(first,n);if(target<=end){c.eligible[i]++;if(dates.includes(target))c.returned[i]++;}});
    cohorts.set(monday,c);
  }
  const selected=events.filter(x=>x.date>=start);
  const trend=Array.from({length:period},(_,i)=>{const date=shift(start,i);return {date,n:distinct(selected.filter(x=>x.date===date))};});
  return {end,start,dal:distinct(daily),wal:distinct(weekly),mal:distinct(monthly),wmal:meaningful.size,engaged,cohorts:[...cohorts.entries()].sort(),trend,features:sources.map(s=>{const a=selected.filter(x=>x.feature===s[3]);return {name:s[3],answers:a.length,learners:distinct(a)};})};
}
export default async function RetentionPage({searchParams}:{searchParams:Promise<{period?:string}>}){
  const auth=await createClient();
  const {data,error}=await auth.auth.getUser();
  if(error || data.user?.app_metadata?.role!=="admin") notFound();
  const p=(await searchParams).period;
  const period=p==="7"?7:p==="90"?90:30;
  let r:Awaited<ReturnType<typeof report>>;
  try{r=await report(period);}catch{return <main className="mx-auto max-w-6xl p-6"><h1 className="text-2xl font-bold">Learning retention</h1><p role="alert">Analytics unavailable. Verify server configuration and database access. No partial figures displayed.</p></main>;}
  const metrics=[["Weekly meaningfully active learners",r.wmal],["Daily active learners",r.dal],["Weekly active learners",r.wal],["Monthly active learners",r.mal],["Daily engaged learners",r.engaged],["Daily / monthly learners",pct(r.dal,r.mal)],["Daily / weekly learners",pct(r.dal,r.wal)],["Weekly / monthly learners",pct(r.wal,r.mal)]];
  const peak=Math.max(1,...r.trend.map(x=>x.n));
  return <main className="mx-auto max-w-6xl space-y-6 p-5">
    <header><p className="text-sm text-blue-700">Defence Pathshala · Private analytics</p><h1 className="text-3xl font-bold">Learning engagement &amp; retention</h1><p className="text-sm">As of {r.end} IST · completed days · recorded answers only</p></header>
    <nav className="flex gap-3">{[7,30,90].map(n=><Link key={n} prefetch={false} aria-current={period===n?"page":undefined} className="rounded border px-4 py-2" href={"/admin/analytics/retention?period="+n}>{n} days</Link>)}</nav>
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">{metrics.map(([label,value])=><div key={label} className="rounded-xl border p-4"><p className="text-sm">{label}</p><p className="text-2xl font-bold">{value}</p></div>)}</section>
    <p className="text-xs">KPI windows are fixed at 1, 7 and 30 days; date selection controls trend, feature activity and first-activity cohorts. Engaged: 10 distinct questions/day. Meaningful: 20 distinct questions/week or completed full mock.</p>
    <section className="rounded-xl border p-4"><h2 className="font-bold">Daily active learners</h2><div className="mt-4 flex h-36 items-end gap-px" aria-hidden="true">{r.trend.map(x=><div key={x.date} title={x.date+": "+x.n} className="flex-1 bg-blue-600" style={{height:(100*x.n/peak)+"%"}}/>)}</div><p className="text-xs">{r.start} — {r.end} · peak {peak===1?Math.max(...r.trend.map(x=>x.n)):peak}</p><details><summary>Daily values</summary><ul>{r.trend.map(x=><li key={x.date}>{x.date}: {x.n}</li>)}</ul></details></section>
    <section className="rounded-xl border p-4"><h2 className="font-bold">Feature activity</h2><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th scope="col" className="text-left">Feature</th><th scope="col">Learners</th><th scope="col">Answer records</th></tr></thead><tbody>{r.features.map(x=><tr key={x.name}><td>{x.name}</td><td className="text-center">{x.learners}</td><td className="text-center">{x.answers}</td></tr>)}</tbody></table></div></section>
    <section className="rounded-xl border p-4"><h2 className="font-bold">First recorded answer cohorts</h2><p className="text-xs">Exact-day returns; eligible learners only. Cells show returned / eligible. — means no mature cohort members.</p><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr>{["Week starting","Learners","D1","D7","D30"].map(x=><th key={x} scope="col">{x}</th>)}</tr></thead><tbody>{r.cohorts.map(([date,c])=><tr key={date}><td>{date}</td><td className="text-center">{c.n}</td>{c.eligible.map((n,i)=><td key={i} className="text-center">{pct(c.returned[i],n)}{n>0?" ("+c.returned[i]+"/"+n+")":""}</td>)}</tr>)}</tbody></table></div>{!r.cohorts.length&&<p>No cohorts in selected period.</p>}</section>
    <p className="text-xs">Excludes trusted admin accounts; other test accounts may remain. Distinct questions are scoped by feature. Mock response timestamps reflect stored records, not necessarily first answers. GA4, PostHog attribution and exam segmentation are not connected in V1.</p>
  </main>;
}
