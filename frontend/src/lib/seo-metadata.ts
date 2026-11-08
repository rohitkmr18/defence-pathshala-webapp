import type { Metadata } from "next";

export const SITE_URL = "https://www.defencepathshala.in";
export const DEFAULT_OG_IMAGE = "/og-image.png";

interface PageMetadataInput {
  /** Page title without the site suffix; the root layout template appends " | Defence Pathshala". */
  title: string;
  description: string;
  /** Site-relative canonical path, e.g. "/current-affairs/2026-11-06". */
  path: string;
  /** Site-relative or absolute image URL. Defaults to the shared OG image. */
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  type?: "website" | "article";
}

/**
 * Builds title, description, canonical, Open Graph and Twitter metadata for one page.
 *
 * Next.js replaces (not merges) a parent's `openGraph` and `twitter` objects when a child defines
 * them, and inherits them unchanged when a child omits them. A page that only sets title and
 * description therefore shares the homepage's social title, description and URL. Use this helper
 * so every public page declares all of them together.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt,
  imageWidth = 1200,
  imageHeight = 630,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const alt = imageAlt ?? title;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url,
      siteName: "Defence Pathshala",
      title,
      description,
      images: [{ url: image, width: imageWidth, height: imageHeight, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
