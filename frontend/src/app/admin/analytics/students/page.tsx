import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = {
  title: "Learning Engagement | Defence Pathshala Admin",
  robots: { index: false, follow: false },
};

type EventRow = { user_id: string; [key: string]: unknown };
type Student = {
  id: string;
  name: string;
  questions: number;
  pyq: number;
  ca: number;
  afcat: number;
  mock: number;
  correct: number;
  graded: number;
  activeDates: Set<string>;
  lastActive: string | null;
  sessions: number;
  completed: number;
};
const PAGE_SIZE = 500;
const MAX_ROWS_PER_TABLE = 20000;
const TZ = "Asia/Kolkata";

function localDate(value: unknown): string | null {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) return null;
  // en-CA renders an unambiguous YYYY-MM-DD date in Asia/Kolkata.
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric",
  }).formatToParts(new Date(value));
  const get = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function registerDate(student: Student, value: unknown) {
  const date = localDate(value);
  if (!date) return;
  student.activeDates.add(date);
  if (!student.lastActive || date > student.lastActive) student.lastActive = date;
}

async function fetchAll(
  client: ReturnType<typeof createServiceClient>,
  table: string,
  columns: string,
): Promise<{ rows: EventRow[]; truncated: boolean }> {
  const rows: EventRow[] = [];
  for (let offset = 0; offset < MAX_ROWS_PER_TABLE; offset += PAGE_SIZE) {
    const { data, error } = await client
      .from(table).select(columns).range(offset, offset + PAGE_SIZE - 1);
    if (error) throw new Error(`Unable to retrieve ${table}`);
    const batch = (data ?? []) as EventRow[];
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) return { rows, truncated: false };
  }
  // Never silently report incomplete data as a comprehensive audit.
  return { rows, truncated: true };
}

export default async function StudentEngagementPage() {
  const userClient = await createClient();
  const { data: auth, error } = await userClient.auth.getUser();
  if (error || auth.user?.app_metadata?.role !== "admin") notFound();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) {
    return <main className="mx-auto max-w-5xl px-6 py-12"><h1 className="text-2xl font-bold">Student engagement</h1><p className="mt-4 text-red-700">Server-side analytics credentials are not configured. No data was loaded.</p></main>;
  }
  // This privileged client is constructed strictly after verified Auth app_metadata authorization.
  // Never import it into a client component or return its key in an error message.
  const db = createServiceClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const specs = [
    ["profiles", "id,full_name,role"],
    ["user_attempts", "user_id,attempted_at,is_correct"],
    ["current_affairs_quiz_attempts", "user_id,attempted_at,is_correct"],
    ["afcat_responses", "user_id,answered_at,selected_option"],
    ["mock_responses", "user_id,answered_at,selected_option"],
    ["practice_sessions", "user_id,started_at,is_completed"],
    ["afcat_sessions", "user_id,started_at,status"],
    ["mock_sessions", "user_id,started_at,status"],
  ] as const;

  let retrieved: { rows: EventRow[]; truncated: boolean }[];
  try {
    retrieved = await Promise.all(specs.map(([table, columns]) => fetchAll(db, table, columns)));
  } catch {
    return <main className="mx-auto max-w-5xl px-6 py-12"><h1 className="text-2xl font-bold">Student engagement</h1><p role="alert" className="mt-4 text-red-700">Unable to retrieve analytics. Verify server configuration and database access.</p></main>;
  }
  const [profiles, attempts, caAttempts, afcatResponses, mockResponses, practice, afcatSessions, mockSessions] = retrieved;
  const students = new Map<string, Student>();
  for (const profile of profiles.rows) {
    if (profile.role !== "student" || typeof profile.id !== "string") continue;
    students.set(profile.id, {
      id: profile.id,
      name: typeof profile.full_name === "string" && profile.full_name.trim() ? profile.full_name.trim() : `Unnamed · ${profile.id.slice(0, 8)}`,
      questions: 0, pyq: 0, ca: 0, afcat: 0, mock: 0,
      correct: 0, graded: 0, activeDates: new Set(), lastActive: null,
      sessions: 0, completed: 0,
    });
  }
  function countQuestions(rows: EventRow[], feature: "pyq" | "ca" | "afcat" | "mock", timestamp: string, graded: boolean) {
    for (const row of rows) {
      const student = students.get(row.user_id);
      if (!student) continue;
      if ((feature === "afcat" || feature === "mock") && row.selected_option == null) continue;
      student.questions++;
      student[feature]++;
      if (graded) {
        student.graded++;
        if (row.is_correct === true) student.correct++;
      }
      registerDate(student, row[timestamp]);
    }
  }
  countQuestions(attempts.rows, "pyq", "attempted_at", true);
  countQuestions(caAttempts.rows, "ca", "attempted_at", true);
  countQuestions(afcatResponses.rows, "afcat", "answered_at", false);
  countQuestions(mockResponses.rows, "mock", "answered_at", false);

  function countSessions(rows: EventRow[], completed: (row: EventRow) => boolean) {
    for (const row of rows) {
      const student = students.get(row.user_id);
      if (!student) continue;
      student.sessions++;
      if (completed(row)) student.completed++;
      registerDate(student, row.started_at);
    }
  }
  countSessions(practice.rows, row => row.is_completed === true);
  countSessions(afcatSessions.rows, row => row.status === "SUBMITTED");
  countSessions(mockSessions.rows, row => row.status === "SUBMITTED");

  const ordered = [...students.values()].sort((a, b) =>
    b.questions - a.questions || b.activeDates.size - a.activeDates.size ||
    b.completed - a.completed || a.id.localeCompare(b.id)
  );
  const learningActive = ordered.filter(s => s.activeDates.size > 0);
  const recurring = learningActive.filter(s => s.activeDates.size > 1);
  const nowDate = localDate(new Date().toISOString())!;
  const sevenDaysAgo = localDate(new Date(Date.now() - 6 * 86_400_000).toISOString())!;
  const active7d = learningActive.filter(s => s.lastActive && s.lastActive >= sevenDaysAgo);
  const truncated = retrieved.some(r => r.truncated);
  const featureCounts = {
    "PYQ": ordered.reduce((n, s) => n + s.pyq, 0),
    "Current Affairs": ordered.reduce((n, s) => n + s.ca, 0),
    "AFCAT": ordered.reduce((n, s) => n + s.afcat, 0),
    "Full Mock": ordered.reduce((n, s) => n + s.mock, 0),
  };
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 text-slate-900 sm:px-6">
      <header>
        <Link className="text-sm text-blue-700 hover:underline" href="/dashboard/admin">← Admin</Link>
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-blue-700">Defence Pathshala · Private analytics</p>
        <h1 className="mt-2 text-3xl font-bold">Student engagement analytics · v1</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Read-only learning records, not website analytics. Questions answered are the primary ranking metric.
          Time spent is intentionally omitted because session durations can include idle browser time.
          Generated on {nowDate} (IST).
        </p>
      </header>
      {truncated && <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">Data cap reached (20,000 rows per table). Counts may be incomplete; do not use this snapshot for decisions without increasing pagination capacity.</p>}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Student engagement summary">
        {[
          ["Student profiles", ordered.length],
          ["Observed learners", learningActive.length],
          ["Repeat-day learners", recurring.length],
          ["Learning-active in 7 days", active7d.length],
        ].map(([label, count]) => <div key={label} className="rounded-xl border bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold tabular-nums">{count}</p></div>)}
      </section>
      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-lg font-bold">Recorded answered questions by feature</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {Object.entries(featureCounts).map(([label, count]) => <div key={label} className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold tabular-nums">{count}</p></div>)}
        </div>
        <p className="mt-3 text-xs text-slate-500">AFCAT and full-mock answer rows are counted only when selected_option is present. Only graded PYQ/Current Affairs questions contribute to accuracy.</p>
      </section>
      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-lg font-bold">Top 20 student learners</h2>
        <p className="mt-1 text-xs text-slate-500">Ordered by answered questions, then distinct activity days, then completed sessions. Unnamed users are distinguished by a truncated internal identifier.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs text-slate-600">
              <tr>{["#", "Student", "Answered", "PYQ", "CA", "AFCAT", "Mock", "Active days", "Completed / total", "Accuracy", "Last activity (IST)"].map(h => <th key={h} scope="col" className="whitespace-nowrap px-3 py-3 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {ordered.slice(0, 20).map((s, index) => <tr key={s.id} className="border-b last:border-0">
                <td className="px-3 py-3 tabular-nums">{index + 1}</td><td className="px-3 py-3 font-medium">{s.name}</td>
                {[s.questions, s.pyq, s.ca, s.afcat, s.mock, s.activeDates.size].map((value, i) => <td key={i} className="px-3 py-3 tabular-nums">{value}</td>)}
                <td className="px-3 py-3 tabular-nums">{s.completed} / {s.sessions}</td>
                <td className="px-3 py-3 tabular-nums">{s.graded ? `${(100 * s.correct / s.graded).toFixed(1)}%` : "—"}</td>
                <td className="whitespace-nowrap px-3 py-3 tabular-nums">{s.lastActive ?? "—"}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm">
        <h2 className="font-bold">Interpretation and limitations</h2>
        <p className="mt-2">An active day means at least one stored practice session start or question interaction in Asia/Kolkata. Repeat-day learner does not imply D1/D7 cohort retention. No visits, page views, anonymous exploration, or acquisition attribution are included. The absence of a learning record does not mean the user never visited.</p>
        <p className="mt-2">This private page is authorized only by verified Supabase Auth app_metadata.role=admin. The service-role credential remains on the server. Do not expose learner-level data in public routes, caching layers, client event payloads, or third-party analytics.</p>
      </section>
    </main>
  );
}
