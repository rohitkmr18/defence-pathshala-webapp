import { localReadsEnabled, readCorpus } from "@/lib/capf-p2/read-contract";
import { readPublished } from "@/lib/capf-p2/server";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  return readCorpus(request, readPublished, localReadsEnabled(process.env));
}
