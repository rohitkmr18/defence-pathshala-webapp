import SessionPageClient from "./SessionPageClient";

interface SessionPageProps {
  searchParams: Promise<{
    mode?: string;
    exam?: string;
    year?: string;
    cycle?: string;
    subject?: string;
    topic?: string;
  }>;
}

export default async function SessionPage({ searchParams }: SessionPageProps) {
  const params = await searchParams;

  // Normalise mode — default to instant
  const mode = params.mode === "attempt" ? "attempt" : "instant";

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <SessionPageClient
          mode={mode}
          exam={params.exam}
          year={params.year}
          cycle={params.cycle}
          subject={params.subject}
          topic={params.topic}
        />
      </div>
    </main>
  );
}
