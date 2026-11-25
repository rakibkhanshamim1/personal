import { requireAdminApi } from "@/lib/auth/dal";
import { connectAndRegisterModels } from "@/lib/db/connect";
import { ContactMessage } from "@/models";
import { contactMessageSchema, messageStatusSchema } from "@/lib/validations/site";
import { listQuerySchema } from "@/lib/validations/common";
import { getMessages } from "@/lib/services/messages";
import { mapMessage } from "@/lib/services/mappers";
import { rateLimit, clientIpFrom, hashIp } from "@/lib/auth/rate-limit";
import { withApiHandler, parseJsonBody, assertSameOrigin, ApiError } from "@/lib/api/handler";
import { ok, created, fail } from "@/lib/api/response";
import type { NextRequest } from "next/server";
import type { MessageStatus } from "@/types";

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAdminApi();
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const query = listQuerySchema.parse(params);
  const messageStatus = request.nextUrl.searchParams.get("messageStatus") as MessageStatus | null;

  const result = await getMessages({ ...query, messageStatus: messageStatus ?? undefined });
  return ok(result.items, { meta: result.meta });
});

export const POST = withApiHandler(async (request: Request) => {
  const ip = clientIpFrom(new Headers(request.headers));
  const ipKey = hashIp(ip);

  const rl = rateLimit(`contact:${ipKey}`, 3, 60 * 60);
  if (!rl.allowed) {
    return fail("You have already sent several messages recently. Please try again later.", 429);
  }

  const body = await parseJsonBody(request, contactMessageSchema);

  if (body.website) {
    return ok({ message: "Thank you for your message!" });
  }

  await connectAndRegisterModels();
  const doc = await ContactMessage.create({
    ...body,
    ipHash: ipKey,
    userAgent: request.headers.get("user-agent") ?? "",
  });

  return created({ message: "Thank you for your message!", id: doc._id.toString() });
});
