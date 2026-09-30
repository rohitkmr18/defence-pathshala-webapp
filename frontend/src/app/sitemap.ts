import { MetadataRoute } from "next";
import { getAllEligibleSeoRoutes } from "@/lib/seo-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.defencepathshala.in";

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const eligibleRoutes = await getAllEligibleSeoRoutes();
    const dynamicEntries: MetadataRoute.Sitemap = eligibleRoutes.map((r) => ({
      url: `${base}${r.path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: r.priority,
    }));

    return [...staticEntries, ...dynamicEntries];
  } catch (err) {
    console.error("[Sitemap] Failed to generate dynamic routes:", err);
    return staticEntries;
  }
}
