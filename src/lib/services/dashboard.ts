import "server-only";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { Project } from "@/models/project";
import { BlogPost } from "@/models/blog-post";
import { Video } from "@/models/video";
import { ContactMessage } from "@/models/contact-message";
import { Media } from "@/models/media";
import { Category } from "@/models/category";
import { Tag } from "@/models/tag";
import type { DashboardStats, ActivityItem, ContentTrendPoint } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  await connectAndRegisterModels();

  const [pTotal, pPub, pDraft, pFeat] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: "published" }),
    Project.countDocuments({ status: "draft" }),
    Project.countDocuments({ featured: true }),
  ]);

  const [bTotal, bPub, bDraft, bFeat] = await Promise.all([
    BlogPost.countDocuments(),
    BlogPost.countDocuments({ status: "published" }),
    BlogPost.countDocuments({ status: "draft" }),
    BlogPost.countDocuments({ featured: true }),
  ]);

  const [vTotal, vPub, vDraft, vFeat] = await Promise.all([
    Video.countDocuments(),
    Video.countDocuments({ status: "published" }),
    Video.countDocuments({ status: "draft" }),
    Video.countDocuments({ featured: true }),
  ]);

  const [mTotal, mUnread, mArchived] = await Promise.all([
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ status: "unread" }),
    ContactMessage.countDocuments({ status: "archived" }),
  ]);

  const [mediaTotal, mediaSizeAgg, catCount, tagCount] = await Promise.all([
    Media.countDocuments(),
    Media.aggregate([{ $group: { _id: null, total: { $sum: "$size" } } }]),
    Category.countDocuments(),
    Tag.countDocuments(),
  ]);

  return {
    projects: { total: pTotal, published: pPub, draft: pDraft, featured: pFeat },
    blog: { total: bTotal, published: bPub, draft: bDraft, featured: bFeat },
    videos: { total: vTotal, published: vPub, draft: vDraft, featured: vFeat },
    messages: { total: mTotal, unread: mUnread, archived: mArchived },
    media: { total: mediaTotal, totalSize: mediaSizeAgg[0]?.total ?? 0 },
    taxonomy: { categories: catCount, tags: tagCount },
  };
}

export async function getRecentActivity(limit = 10): Promise<ActivityItem[]> {
  await connectAndRegisterModels();

  const [projects, posts, videos, messages] = await Promise.all([
    Project.find().sort({ updatedAt: -1 }).limit(limit).select("title status updatedAt slug").lean(),
    BlogPost.find().sort({ updatedAt: -1 }).limit(limit).select("title status updatedAt slug").lean(),
    Video.find().sort({ updatedAt: -1 }).limit(limit).select("title status updatedAt slug").lean(),
    ContactMessage.find().sort({ createdAt: -1 }).limit(limit).select("name status createdAt subject").lean(),
  ]);

  const items: ActivityItem[] = [
    ...projects.map((p) => ({
      id: p._id.toString(),
      type: "project" as const,
      title: p.title,
      status: p.status,
      href: `/admin/projects/${p._id}`,
      timestamp: p.updatedAt.toISOString(),
    })),
    ...posts.map((p) => ({
      id: p._id.toString(),
      type: "blog" as const,
      title: p.title,
      status: p.status,
      href: `/admin/blog/${p._id}`,
      timestamp: p.updatedAt.toISOString(),
    })),
    ...videos.map((v) => ({
      id: v._id.toString(),
      type: "video" as const,
      title: v.title,
      status: v.status,
      href: `/admin/videos/${v._id}`,
      timestamp: v.updatedAt.toISOString(),
    })),
    ...messages.map((m) => ({
      id: m._id.toString(),
      type: "message" as const,
      title: m.subject || `Message from ${m.name}`,
      status: m.status,
      href: `/admin/messages/${m._id}`,
      timestamp: m.createdAt.toISOString(),
    })),
  ];

  items.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return items.slice(0, limit);
}

export async function getContentTrends(months = 6): Promise<ContentTrendPoint[]> {
  await connectAndRegisterModels();
  const now = new Date();
  const points: ContentTrendPoint[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const range = { $gte: start, $lt: end };

    const [projects, posts, videos] = await Promise.all([
      Project.countDocuments({ createdAt: range }),
      BlogPost.countDocuments({ createdAt: range }),
      Video.countDocuments({ createdAt: range }),
    ]);

    const label = start.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
    points.push({ month: label, projects, posts, videos });
  }

  return points;
}
