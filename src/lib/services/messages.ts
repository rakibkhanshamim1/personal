import "server-only";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { ContactMessage } from "@/models/contact-message";
import { mapMessage } from "./mappers";
import type { ContactMessageDTO, Paginated, MessageStatus } from "@/types";
import type { ListQuery } from "@/lib/validations/common";

export async function getMessages(
  query: ListQuery & { messageStatus?: MessageStatus },
): Promise<Paginated<ContactMessageDTO>> {
  await connectAndRegisterModels();
  const filter: Record<string, unknown> = {};
  if (query.search) filter.$or = [
    { name: { $regex: query.search, $options: "i" } },
    { email: { $regex: query.search, $options: "i" } },
    { subject: { $regex: query.search, $options: "i" } },
  ];
  if (query.messageStatus) filter.status = query.messageStatus;

  const total = await ContactMessage.countDocuments(filter);
  const { page, limit } = query;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const docs = await ContactMessage.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return { items: docs.map(mapMessage), meta: { page, limit, total, totalPages } };
}

export async function getMessageById(id: string): Promise<ContactMessageDTO | null> {
  await connectAndRegisterModels();
  const doc = await ContactMessage.findById(id).lean();
  return doc ? mapMessage(doc) : null;
}

export async function getUnreadCount(): Promise<number> {
  await connectAndRegisterModels();
  return ContactMessage.countDocuments({ status: "unread" });
}
