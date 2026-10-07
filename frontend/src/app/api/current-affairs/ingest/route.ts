import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Option = "A" | "B" | "C" | "D";

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter(nonEmpty).map((item) => item.trim()) : [];
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !/^\d{4}-\d{2}-\d{2}$/.test(body.date ?? "") || !Array.isArray(body.stories) || body.stories.length === 0) {
    return NextResponse.json({ error: "Invalid edition payload." }, { status: 400 });
  }

  const allMcqs = body.stories.flatMap((story: any) => Array.isArray(story.mcqs) ? story.mcqs : []);
  if (allMcqs.length < 3 || allMcqs.length > 5) {
    return NextResponse.json({ error: "A daily edition must contain 3 to 5 MCQs." }, { status: 400 });
  }

  for (const [storyIndex, story] of body.stories.entries()) {
    if (!nonEmpty(story.headline) || !nonEmpty(story.whatHappened) || !Array.isArray(story.keyFacts) || story.keyFacts.length === 0) {
      return NextResponse.json({ error: `Story ${storyIndex + 1} is missing required structured content.` }, { status: 400 });
    }

    for (const [mcqIndex, mcq] of (story.mcqs ?? []).entries()) {
      const correct = String(mcq.correctOption ?? "").toUpperCase() as Option;
      const options = mcq.options ?? {};
      if (!nonEmpty(mcq.question) || !["A", "B", "C", "D"].includes(correct) || !["A", "B", "C", "D"].every((key) => nonEmpty(options[key]))) {
        return NextResponse.json({ error: `Invalid MCQ at story ${storyIndex + 1}, question ${mcqIndex + 1}.` }, { status: 400 });
      }
      if (new Set(["A", "B", "C", "D"].map((key) => options[key].trim().toLowerCase())).size !== 4) {
        return NextResponse.json({ error: `Duplicate MCQ options at story ${storyIndex + 1}, question ${mcqIndex + 1}.` }, { status: 400 });
      }
    }
  }

  const { data: post, error: postError } = await supabase
    .from("current_affairs_posts")
    .upsert({
      date: body.date,
      slug: body.date,
      title: nonEmpty(body.title) ? body.title.trim() : `Daily Current Affairs — ${body.date}`,
      summary: nonEmpty(body.summary) ? body.summary.trim() : "Exam-focused daily current affairs briefing.",
      total_stories: body.stories.length,
      total_slides: 0,
      published: body.published !== false,
      updated_at: new Date().toISOString(),
    }, { onConflict: "date" })
    .select("id")
    .single();

  if (postError || !post) {
    return NextResponse.json({ error: postError?.message ?? "Could not save edition." }, { status: 500 });
  }

  const { error: clearError } = await supabase.from("current_affairs_stories").delete().eq("post_id", post.id);
  if (clearError) {
    return NextResponse.json({ error: clearError.message }, { status: 500 });
  }

  let globalQuestionNumber = 1;

  for (const [index, story] of body.stories.entries()) {
    const normalizedForHash = JSON.stringify({
      date: body.date,
      headline: story.headline.trim(),
      sourceUrl: nonEmpty(story.sourceUrl) ? story.sourceUrl.trim() : "",
    });
    const contentHash = createHash("sha256").update(normalizedForHash).digest("hex");

    const { data: savedStory, error: storyError } = await supabase
      .from("current_affairs_stories")
      .insert({
        post_id: post.id,
        story_number: index + 1,
        headline: story.headline.trim(),
        summary: nonEmpty(story.summary) ? story.summary.trim() : null,
        category: nonEmpty(story.category) ? story.category.trim() : null,
        subject: nonEmpty(story.subject) ? story.subject.trim() : null,
        topic: nonEmpty(story.topic) ? story.topic.trim() : null,
        subtopic: nonEmpty(story.subtopic) ? story.subtopic.trim() : null,
        theme: nonEmpty(story.theme) ? story.theme.trim() : null,
        exam_relevance: nonEmpty(story.examRelevance) ? story.examRelevance.trim() : null,
        future_angle: nonEmpty(story.futureAngle) ? story.futureAngle.trim() : null,
        keywords: asStringArray(story.keywords),
        what_happened: story.whatHappened.trim(),
        why_it_matters: nonEmpty(story.whyItMatters) ? story.whyItMatters.trim() : null,
        key_facts: asStringArray(story.keyFacts),
        conceptual_linkage: nonEmpty(story.conceptualLinkage) ? story.conceptualLinkage.trim() : null,
        static_link: nonEmpty(story.staticLink) ? story.staticLink.trim() : null,
        exam_tags: asStringArray(story.examTags),
        source_name: nonEmpty(story.sourceName) ? story.sourceName.trim() : null,
        source_url: nonEmpty(story.sourceUrl) ? story.sourceUrl.trim() : null,
        source_date: nonEmpty(story.sourceDate) ? story.sourceDate : null,
        content_hash: contentHash,
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (storyError || !savedStory) {
      await supabase.from("current_affairs_posts").delete().eq("id", post.id);
      return NextResponse.json({ error: storyError?.message ?? "Could not save story." }, { status: 500 });
    }

    const mcqRows = (story.mcqs ?? []).map((mcq: any) => ({
      story_id: savedStory.id,
      question_number: globalQuestionNumber++,
      question: mcq.question.trim(),
      option_a: mcq.options.A.trim(),
      option_b: mcq.options.B.trim(),
      option_c: mcq.options.C.trim(),
      option_d: mcq.options.D.trim(),
      correct_option: String(mcq.correctOption).toUpperCase(),
      explanation: nonEmpty(mcq.explanation) ? mcq.explanation.trim() : null,
      difficulty: ["Easy", "Moderate", "Hard"].includes(mcq.difficulty) ? mcq.difficulty : "Moderate",
      subject: nonEmpty(mcq.subject) ? mcq.subject.trim() : (nonEmpty(story.subject) ? story.subject.trim() : null),
      topic: nonEmpty(mcq.topic) ? mcq.topic.trim() : (nonEmpty(story.topic) ? story.topic.trim() : null),
      subtopic: nonEmpty(mcq.subtopic) ? mcq.subtopic.trim() : null,
      concept: nonEmpty(mcq.concept) ? mcq.concept.trim() : null,
      exam_tags: asStringArray(mcq.examTags?.length ? mcq.examTags : story.examTags),
      question_type: nonEmpty(mcq.questionType) ? mcq.questionType.trim() : null,
      exam_edge: nonEmpty(mcq.examEdge) ? mcq.examEdge.trim() : null,
      mock_eligible: mcq.mockEligible !== false,
      content_status: mcq.contentStatus === "VERIFIED" ? "VERIFIED" : "VALIDATED",
      source_url: nonEmpty(story.sourceUrl) ? story.sourceUrl.trim() : null,
      updated_at: new Date().toISOString(),
    }));

    if (mcqRows.length) {
      const { error: mcqError } = await supabase.from("current_affairs_mcqs").insert(mcqRows);
      if (mcqError) {
        await supabase.from("current_affairs_posts").delete().eq("id", post.id);
        return NextResponse.json({ error: mcqError.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ success: true, postId: post.id, stories: body.stories.length, mcqs: allMcqs.length });
}
