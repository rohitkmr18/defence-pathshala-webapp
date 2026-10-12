import type { CurrentAffairsStory } from "../current-affairs";

export function storyPreview(story: CurrentAffairsStory): string {
  const text = story.summary || story.whatHappened || story.editorialMarkdown || "";
  // Literal excerpt only; line-clamping supplies the visual preview. Complete text stays in the reader.
  return text.length > 220 ? `${text.slice(0, 220).trimEnd()}…` : text;
}

export function storyReadingText(story: CurrentAffairsStory): string {
  return story.editorialMarkdown || [story.summary, story.whatHappened, story.whyItMatters,
    ...story.keyFacts, story.conceptualLinkage, story.staticLink, story.examRelevance, story.futureAngle].filter(Boolean).join(" ");
}

export function readingMinutes(text: string): number {
  return Math.max(1, Math.ceil(text.trim().split(/\s+/u).filter(Boolean).length / 200));
}
