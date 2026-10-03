"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathTextProps {
  text: string | null | undefined;
  className?: string;
  as?: React.ElementType;
}

interface Segment {
  type: "text" | "math";
  content: string;
  display?: boolean;
}

// Global cache for rendered KaTeX HTML strings to maximize rendering speed
const mathCache = new Map<string, string>();

function renderMathToString(math: string, displayMode: boolean): string {
  const cacheKey = `${displayMode ? "D" : "I"}:${math}`;
  const cached = mathCache.get(cacheKey);
  if (cached) return cached;

  try {
    const html = katex.renderToString(math, {
      displayMode,
      throwOnError: false,
      output: "htmlAndMathml",
      strict: false,
    });
    mathCache.set(cacheKey, html);
    return html;
  } catch {
    return math;
  }
}

// Regex to identify LaTeX math delimiters:
// 1. \[ ... \] -> display math
// 2. $$ ... $$ -> display math
// 3. \( ... \) -> inline math
// 4. $ ... $   -> inline math
const MATH_REGEX =
  /(?:\\\\|\\)\[([\s\S]*?)(?:\\\\|\\)\]|\$\$([\s\S]*?)\$\$|(?:\\\\|\\)\(([\s\S]*?)(?:\\\\|\\)\)|\$([^\$\n]+?)\$/g;

export function cleanMathText(raw: string): string {
  if (!raw) return "";
  return raw
    // Clean AI citation artifacts like [cite: 2] or [cite: 2, 3]
    .replace(/\[cite:\s*[^\]]+\]/gi, "")
    // Normalize escaped line endings
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\r\n?/g, "\n");
}

export function parseMathSegments(rawText: string): Segment[] {
  const cleaned = cleanMathText(rawText);
  if (!cleaned) return [];

  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  MATH_REGEX.lastIndex = 0;

  while ((match = MATH_REGEX.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: cleaned.slice(lastIndex, match.index),
      });
    }

    const isDisplay = Boolean(match[1] || match[2]);
    const mathContent = (match[1] || match[2] || match[3] || match[4] || "").trim();

    if (mathContent) {
      segments.push({
        type: "math",
        content: mathContent,
        display: isDisplay,
      });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < cleaned.length) {
    segments.push({
      type: "text",
      content: cleaned.slice(lastIndex),
    });
  }

  return segments;
}

export default function MathText({
  text,
  className = "",
  as: Component = "span",
}: MathTextProps) {
  const segments = useMemo(() => {
    if (!text) return [];
    return parseMathSegments(text);
  }, [text]);

  if (!text) return null;
  if (segments.length === 0) return null;

  return (
    <Component className={className}>
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return <React.Fragment key={index}>{segment.content}</React.Fragment>;
        }

        const renderedHtml = renderMathToString(
          segment.content,
          Boolean(segment.display)
        );

        if (segment.display) {
          return (
            <span
              key={index}
              className="my-3 block text-center overflow-x-auto py-1"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          );
        }

        return (
          <span
            key={index}
            className="inline-block align-baseline mx-0.5"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        );
      })}
    </Component>
  );
}
