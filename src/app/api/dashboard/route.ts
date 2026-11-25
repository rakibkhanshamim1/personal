import { requireAdminApi } from "@/lib/auth/dal";
import { getDashboardStats, getRecentActivity, getContentTrends } from "@/lib/services/dashboard";
import { withApiHandler } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

export const GET = withApiHandler(async () => {
  await requireAdminApi();
  const [stats, activity, trends] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    getContentTrends(),
  ]);
  return ok({ stats, activity, trends });
});
