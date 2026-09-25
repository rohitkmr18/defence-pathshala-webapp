import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const body = await req.json();

  const { data: post, error } = await supabase
    .from("current_affairs_posts")
    .insert({
      date: body.date,
      title: body.title,
      slug: body.date,
      summary: body.summary,
      total_stories: body.slides.length,
      total_slides: body.slides.length,
      published: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(error, { status: 400 });
  }

  const slideRows = body.slides.map((slide: any) => ({
    post_id: post.id,
    story_id: slide.slideNumber,
    slide_number: slide.slideNumber,
    image_url: slide.imageUrl,
  }));

  await supabase.from("current_affairs_slides").insert(slideRows);

  return NextResponse.json({ success: true });
}