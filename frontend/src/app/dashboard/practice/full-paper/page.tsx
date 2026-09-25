import FullPaperClient from "./FullPaperClient";

interface FullPaperPageProps {
  searchParams: Promise<{
    exam?: string;
    year?: string;
    cycle?: string;
  }>;
}

export default async function FullPaperPage({ searchParams }: FullPaperPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen">
      <FullPaperClient
        initialExam={params.exam}
        initialYear={params.year}
        initialCycle={params.cycle}
      />
    </div>
  );
}
