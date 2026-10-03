
import { errorMessage } from "@/lib/error-message";
import { checkIsAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // Security: only logged-in admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !(await checkIsAdmin()).isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { date, title, summary, slides } = body;

    if (!date || !title || !Array.isArray(slides) || slides.length === 0 ||
        slides.some((slide: { slideNumber?: number; imageUrl?: string }) => !slide.slideNumber || !slide.imageUrl)) {
      return NextResponse.json({ error: "Date, title and valid slides required" }, { status: 400 });
    }

    // Create today's post
    const { data: post, error: postError } = await supabase
      .from("current_affairs_posts")
      .insert({
        date,
        title,
        slug: date,
        summary,
        total_stories: 1,
        total_slides: slides.length,
        published: false,
      })
      .select()
      .single();

    if (postError) throw postError;

    // Existing schema links slides through stories, not directly to posts.
    const { data: story, error: storyError } = await supabase.from("current_affairs_stories")
      .insert({ post_id: post.id, story_number: 1, headline: title, summary })
      .select("id").single();
    if (storyError) throw storyError;

    // Save slide URLs
    const slidePayload = slides.map((slide: { slideNumber: number; imageUrl: string }) => ({
      story_id: story.id,
      slide_number: slide.slideNumber,
      image_url: slide.imageUrl,
    }));

    const { error: slideError } = await supabase
      .from("current_affairs_slides")
      .insert(slidePayload);

    if (slideError) throw slideError;

    const { error: publishError } = await supabase.from("current_affairs_posts")
      .update({ published: true }).eq("id", post.id);
    if (publishError) throw publishError;

    return NextResponse.json({
      success: true,
      postId: post.id,
    });

  } catch (error: unknown) {
    return NextResponse.json(
      { error: errorMessage(error) },
      { status: 500 }
    );
  }
}