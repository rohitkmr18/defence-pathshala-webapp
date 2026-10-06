import SessionPageClient from "./SessionPageClient";

interface SessionPageProps {
  searchParams: Promise<{
    mode?: string;
    exam?: string;
    year?: string;
    cycle?: string;
    subject?: string;
    topic?: string;
    subtopic?: string;
    difficulty?: string;
    intelligence_only?: string;
    limit?: string;
    returnTo?: string;
    origin?: string;
    resume?: string;
    ids?: string;
    session_id?: string;
    analysis?: string;
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
          subtopic={params.subtopic}
          difficulty={params.difficulty}
          intelligenceOnly={params.intelligence_only === "true"}
          limit={params.limit ? parseInt(params.limit, 10) : undefined}
          returnTo={params.returnTo}
          origin={params.origin}
          resume={params.resume === "true"}
          specificIds={params.ids}
          resumeSessionId={params.session_id}
          analysis={params.analysis === "true"}
        />
      </div>
    </main>
  );
}
