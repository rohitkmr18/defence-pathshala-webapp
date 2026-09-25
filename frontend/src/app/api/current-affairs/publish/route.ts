import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // Security: only logged-in admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { date, title, summary, slides } = body;

    // Create today's post
    const { data: post, error: postError } = await supabase
      .from("current_affairs_posts")
      .insert({
        date,
        title,
        slug: date,
        summary,
        total_stories: slides.length,
        total_slides: slides.length,
        published: true,
      })
      .select()
      .single();

    if (postError) throw postError;

    // Save slide URLs
    const slidePayload = slides.map((slide: any) => ({
      post_id: post.id,
      slide_number: slide.slideNumber,
      image_url: slide.imageUrl,
    }));

    const { error: slideError } = await supabase
      .from("current_affairs_slides")
      .insert(slidePayload);

    if (slideError) throw slideError;

    return NextResponse.json({
      success: true,
      postId: post.id,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}