import { requireAdmin } from "@/lib/auth/dal";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Toaster } from "sonner";

export const instant = false;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar admin={admin} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between border-b border-border-base bg-background/80 backdrop-blur-lg px-6">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">{admin.name}</span>
            <div className="h-8 w-8 rounded-full bg-primary-soft flex items-center justify-center text-xs font-medium text-primary">
              {admin.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
