import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.defencepathshala.in";

  return [
    {
      url: base,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${base}/dashboard`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${base}/current-affairs`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${base}/practice`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      priority: 0.7,
    },
  ];
}