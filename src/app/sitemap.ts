import type { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/db/connect";
import { Project } from "@/models";
import { BlogPost } from "@/models";
import { Video } from "@/models";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectToDatabase();

  const [projects, posts, videos] = await Promise.all([
    Project.find({ status: "published" }).select("slug updatedAt").lean(),
    BlogPost.find({ status: "published", publishedAt: { $lte: new Date() } }).select("slug updatedAt").lean(),
    Video.find({ status: "published", publishedAt: { $lte: new Date() } }).select("slug updatedAt").lean(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/videos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((p: { slug: string; updatedAt: Date }) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = posts.map((p: { slug: string; updatedAt: Date }) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const videoPages: MetadataRoute.Sitemap = videos.map((v: { slug: string; updatedAt: Date }) => ({
    url: `${SITE_URL}/videos/${v.slug}`,
    lastModified: v.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...blogPages, ...videoPages];
}
