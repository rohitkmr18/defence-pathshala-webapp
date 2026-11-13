import { localReadsEnabled, readCorpus } from "@/lib/capf-p2/read-contract";
import { readPublished } from "@/lib/capf-p2/server";

export const dynamic = "force-dynamic";
export async function GET(request: Request, context: { params: Promise<{ recordId: string }> }) {
  const { recordId } = await context.params;
  return readCorpus(request, readPublished, localReadsEnabled(process.env), recordId);
}
