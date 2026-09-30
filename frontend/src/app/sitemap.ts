import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.defencepathshala.in";

  return [
    {
      url: `${base}/`,
      priority: 1,
    },
    {
      url: `${base}/about`,
      priority: 0.8,
    },
  ];
}
