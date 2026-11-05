import { MetadataRoute } from "next";
import { getAllEligibleSeoRoutes } from "@/lib/seo-data";
import { getPublishedCurrentAffairsEditions, toLastModified } from "@/lib/current-affairs-sitemap";
import { summariseMonths } from "@/lib/current-affairs-calendar";
import { MONTHLY_CAPSULES } from "@/lib/monthly-capsules";

const base = "https://www.defencepathshala.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/afcat`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/current-affairs`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    ...MONTHLY_CAPSULES.map((c) => ({
      url: `${base}/current-affairs/monthly/${c.edition}`,
      lastModified: new Date(`${c.publishedOn}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  const [pyqEntries, currentAffairsEntries] = await Promise.all([
    getAllEligibleSeoRoutes()
      .then((routes): MetadataRoute.Sitemap =>
        routes.map((r) => ({ url: `${base}${r.path}`, changeFrequency: "weekly", priority: r.priority }))
      )
      .catch((err) => {
        console.error("[Sitemap] Failed to generate PYQ routes:", err);
        return [];
      }),
    getPublishedCurrentAffairsEditions()
      .then((editions): MetadataRoute.Sitemap => {
        const newest = editions[0];
        const hub = staticEntries.find((e) => e.url === `${base}/current-affairs`);
        if (hub && newest) hub.lastModified = toLastModified(newest.updatedAt) ?? toLastModified(newest.date);
        const editionEntries: MetadataRoute.Sitemap = editions.map((edition) => ({
          url: `${base}/current-affairs/${edition.date}`,
          lastModified: toLastModified(edition.updatedAt) ?? toLastModified(edition.date),
          changeFrequency: "monthly",
          priority: 0.7,
        }));
        const monthEntries: MetadataRoute.Sitemap = summariseMonths(editions.map((e) => e.date)).map((m) => ({
          url: `${base}/current-affairs/month/${m.month}`,
          changeFrequency: "weekly",
          priority: 0.6,
        }));
        return [...monthEntries, ...editionEntries];
      })
      .catch((err) => {
        console.error("[Sitemap] Failed to generate Current Affairs routes:", err);
        return [];
      }),
  ]);

  return [...staticEntries, ...pyqEntries, ...currentAffairsEntries];
}
