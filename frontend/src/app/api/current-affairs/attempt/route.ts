import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const validOptions = new Set(["A", "B", "C", "D"]);

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ saved: false, reason: "guest" }, { status: 200 });
  }

  const body = await req.json().catch(() => null);
  const mcqId = typeof body?.mcqId === "string" ? body.mcqId : "";
  const selectedOption = typeof body?.selectedOption === "string" ? body.selectedOption.toUpperCase() : "";
  const timeTaken = Number.isInteger(body?.timeTaken) && body.timeTaken >= 0 ? body.timeTaken : null;

  if (!mcqId || !validOptions.has(selectedOption)) {
    return NextResponse.json({ error: "Invalid attempt payload." }, { status: 400 });
  }

  const { data: mcq, error: mcqError } = await supabase
    .from("current_affairs_mcqs")
    .select("id,correct_option")
    .eq("id", mcqId)
    .maybeSingle();

  if (mcqError || !mcq) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }

  const isCorrect = mcq.correct_option === selectedOption;
  const { error } = await supabase.from("current_affairs_quiz_attempts").insert({
    user_id: user.id,
    mcq_id: mcqId,
    selected_option: selectedOption,
    is_correct: isCorrect,
    time_taken: timeTaken,
  });

  if (error) {
    return NextResponse.json({ error: "Attempt could not be saved." }, { status: 500 });
  }

  return NextResponse.json({ saved: true, isCorrect });
}
