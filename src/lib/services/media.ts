import "server-only";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { Media } from "@/models/media";
import { mapMedia } from "./mappers";
import type { MediaDTO, Paginated } from "@/types";
import type { ListQuery } from "@/lib/validations/common";

export async function getMediaItems(query: ListQuery): Promise<Paginated<MediaDTO>> {
  await connectAndRegisterModels();
  const filter: Record<string, unknown> = {};
  if (query.search) filter.filename = { $regex: query.search, $options: "i" };

  const total = await Media.countDocuments(filter);
  const { page, limit } = query;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const docs = await Media.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return { items: docs.map(mapMedia), meta: { page, limit, total, totalPages } };
}

export async function getMediaById(id: string): Promise<MediaDTO | null> {
  await connectAndRegisterModels();
  const doc = await Media.findById(id).lean();
  return doc ? mapMedia(doc) : null;
}

export async function getTotalMediaSize(): Promise<number> {
  await connectAndRegisterModels();
  const result = await Media.aggregate([{ $group: { _id: null, total: { $sum: "$size" } } }]);
  return result[0]?.total ?? 0;
}
