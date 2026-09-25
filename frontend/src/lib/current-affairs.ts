import { createClient } from "@/lib/supabase/server";

export interface CurrentAffairsSlide {
  slideNumber: number;
  imageUrl: string;
}

export interface CurrentAffairsPost {
  date: string;
  formattedDate: string;
  title: string;
  summary: string;
  slideCount: number;
  readingTimeMinutes: number;
  slides: CurrentAffairsSlide[];
  isLatest?: boolean;
}

type CurrentAffairsRow = {
  id: string;
  date: string;
  title?: string | null;
  summary?: string | null;
  total_slides?: number | null;
  reading_time_minutes?: number | null;
};

type CurrentAffairsSlideRow = {
  slide_number: number;
  image_url: string;
};

function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) {
    return dateStr;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function normalizePost(
  row: CurrentAffairsRow,
  slideRows: CurrentAffairsSlideRow[],
): CurrentAffairsPost {
  const slides = slideRows.map((slide) => ({
    slideNumber: slide.slide_number,
    imageUrl: slide.image_url,
  }));

  return {
    date: row.date,
    formattedDate: formatDisplayDate(row.date),
    title: row.title?.trim() || `Daily Current Affairs · ${formatDisplayDate(row.date)}`,
    summary: row.summary?.trim() || "Exam-focused daily current affairs briefing.",
    slideCount: row.total_slides ?? slides.length,
    readingTimeMinutes:
      row.reading_time_minutes ?? Math.max(2, Math.ceil(slides.length * 0.4)),
    slides,
  };
}

export async function getDailyCurrentAffairsList(): Promise<CurrentAffairsPost[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("current_affairs_posts")
      .select("*")
      .eq("published", true)
      .order("date", { ascending: false });

    if (error) {
      throw error;
    }

    const posts = await Promise.all(
      (data as CurrentAffairsRow[] | null ?? []).map(async (post) => {
        const { data: slides, error: slidesError } = await supabase
          .from("current_affairs_slides")
          .select("*")
          .eq("post_id", post.id)
          .order("slide_number", { ascending: true });

        if (slidesError) {
          throw slidesError;
        }

        return normalizePost(
          post,
          (slides as CurrentAffairsSlideRow[] | null) ?? [],
        );
      }),
    );
    if (posts.length > 0) {
      posts[0].isLatest = true;
    }

    return posts;
  } catch (error) {
    console.error("Error retrieving published current affairs:", error);
    return [];
  }
}

export async function getCurrentAffairsByDate(
  date: string,
): Promise<CurrentAffairsPost | null> {
  const posts = await getDailyCurrentAffairsList();
  return posts.find((post) => post.date === date) ?? null;
}

export async function getAdjacentDays(
  currentDate: string,
): Promise<{ prevDate: string | null; nextDate: string | null }> {
  const posts = await getDailyCurrentAffairsList();
  const currentIndex = posts.findIndex((post) => post.date === currentDate);

  if (currentIndex === -1) {
    return { prevDate: null, nextDate: null };
  }

  return {
    prevDate: posts[currentIndex + 1]?.date ?? null,
    nextDate: posts[currentIndex - 1]?.date ?? null,
  };
}
