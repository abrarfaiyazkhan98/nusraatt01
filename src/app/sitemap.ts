import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getAllPosts } from "@/lib/diary";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/diary`, changeFrequency: "weekly", priority: 0.8 },
    ...getAllPosts().map((p) => ({ url: `${site.url}/diary/${p.slug}`, lastModified: p.date, priority: 0.6 })),
  ];
}
