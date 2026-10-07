import { createClient } from "@/lib/supabase/server";

export type CurrentAffairsSlide = {
  slideNumber: number;
  imageUrl: string;
};

export type CurrentAffairsMcq = {
  id: string;
  questionNumber: number;
  question: string;
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  correctOption: "A" | "B" | "C" | "D";
  explanation: string | null;
  examEdge: string | null;
  difficulty: string | null;
  subject: string | null;
  topic: string | null;
  examTags: string[];
};

export type CurrentAffairsStory = {
  id: string;
  storyNumber: number;
  headline: string;
  summary: string | null;
  whatHappened: string | null;
  whyItMatters: string | null;
  keyFacts: string[];
  conceptualLinkage: string | null;
  staticLink: string | null;
  examRelevance: string | null;
  subject: string | null;
  topic: string | null;
  subtopic: string | null;
  theme: string | null;
  examTags: string[];
  sourceName: string | null;
  sourceUrl: string | null;
  sourceDate: string | null;
  mcqs: CurrentAffairsMcq[];
};

export type CurrentAffairsPost = {
  id: string;
  date: string;
  formattedDate: string;
  title: string;
  summary: string | null;
  storyCount: number;
  quizCount: number;
  slideCount: number;
  readingTimeMinutes: number;
  slides: CurrentAffairsSlide[];
  stories: CurrentAffairsStory[];
  isLatest?: boolean;
};

type RawMcq = {
  id: string;
  question_number: number | null;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "A" | "B" | "C" | "D";
  explanation: string | null;
  exam_edge: string | null;
  difficulty: string | null;
  subject: string | null;
  topic: string | null;
  exam_tags: string[] | null;
};

type RawStory = {
  id: string;
  story_number: number;
  headline: string;
  summary: string | null;
  what_happened: string | null;
  why_it_matters: string | null;
  key_facts: unknown;
  conceptual_linkage: string | null;
  static_link: string | null;
  exam_relevance: string | null;
  subject: string | null;
  topic: string | null;
  subtopic: string | null;
  theme: string | null;
  exam_tags: string[] | null;
  source_name: string | null;
  source_url: string | null;
  source_date: string | null;
  current_affairs_mcqs: RawMcq[] | null;
};

type RawPost = {
  id: string;
  date: string;
  title: string;
  summary: string | null;
  total_stories: number | null;
  current_affairs_stories: RawStory[] | null;
};

function formatDisplayDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function normalizeMcq(row: RawMcq, fallbackNumber: number): CurrentAffairsMcq {
  return {
    id: row.id,
    questionNumber: row.question_number ?? fallbackNumber,
    question: row.question,
    options: [
      { key: "A", text: row.option_a },
      { key: "B", text: row.option_b },
      { key: "C", text: row.option_c },
      { key: "D", text: row.option_d },
    ],
    correctOption: row.correct_option,
    explanation: row.explanation,
    examEdge: row.exam_edge,
    difficulty: row.difficulty,
    subject: row.subject,
    topic: row.topic,
    examTags: row.exam_tags ?? [],
  };
}

function normalizePost(row: RawPost): CurrentAffairsPost {
  const stories = (row.current_affairs_stories ?? [])
    .sort((a, b) => a.story_number - b.story_number)
    .map((story) => ({
      id: story.id,
      storyNumber: story.story_number,
      headline: story.headline,
      summary: story.summary,
      whatHappened: story.what_happened,
      whyItMatters: story.why_it_matters,
      keyFacts: stringArray(story.key_facts),
      conceptualLinkage: story.conceptual_linkage,
      staticLink: story.static_link,
      examRelevance: story.exam_relevance,
      subject: story.subject,
      topic: story.topic,
      subtopic: story.subtopic,
      theme: story.theme,
      examTags: story.exam_tags ?? [],
      sourceName: story.source_name,
      sourceUrl: story.source_url,
      sourceDate: story.source_date,
      mcqs: (story.current_affairs_mcqs ?? [])
        .sort((a, b) => (a.question_number ?? 999) - (b.question_number ?? 999))
        .map((mcq, index) => normalizeMcq(mcq, index + 1)),
    }));

  return {
    id: row.id,
    date: row.date,
    formattedDate: formatDisplayDate(row.date),
    title: row.title,
    summary: row.summary,
    storyCount: row.total_stories ?? stories.length,
    quizCount: stories.reduce((sum, story) => sum + story.mcqs.length, 0),
    slideCount: 0,
    readingTimeMinutes: Math.max(2, Math.ceil(stories.length * 1.5)),
    slides: [],
    stories,
  };
}

const nestedSelect = `
  id,date,title,summary,total_stories,
  current_affairs_stories (
    id,story_number,headline,summary,what_happened,why_it_matters,key_facts,
    conceptual_linkage,static_link,exam_relevance,subject,topic,subtopic,theme,
    exam_tags,source_name,source_url,source_date,
    current_affairs_mcqs (
      id,question_number,question,option_a,option_b,option_c,option_d,correct_option,
      explanation,exam_edge,difficulty,subject,topic,exam_tags
    )
  )
`;

export async function getDailyCurrentAffairsList(): Promise<CurrentAffairsPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("current_affairs_posts")
    .select(nestedSelect)
    .eq("published", true)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error retrieving current affairs:", error);
    return [];
  }

  const posts = ((data ?? []) as unknown as RawPost[]).map(normalizePost);
  if (posts[0]) posts[0].isLatest = true;
  return posts;
}

export async function getCurrentAffairsByDate(date: string): Promise<CurrentAffairsPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("current_affairs_posts")
    .select(nestedSelect)
    .eq("published", true)
    .eq("date", date)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("Error retrieving current affairs day:", error);
    return null;
  }

  return normalizePost(data as unknown as RawPost);
}

export async function getAdjacentDays(currentDate: string) {
  const supabase = await createClient();
  const [{ data: previous }, { data: next }] = await Promise.all([
    supabase.from("current_affairs_posts").select("date").eq("published", true).lt("date", currentDate).order("date", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("current_affairs_posts").select("date").eq("published", true).gt("date", currentDate).order("date", { ascending: true }).limit(1).maybeSingle(),
  ]);

  return { prevDate: previous?.date ?? null, nextDate: next?.date ?? null };
}
