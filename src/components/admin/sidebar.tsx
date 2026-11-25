"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderOpen, FileText, Video, Tags, Tag,
  Image as ImageIcon, User, Briefcase, GraduationCap, Sparkles,
  Link2, Mail, Settings, Home, Navigation, FileCode, Shield,
  ChevronDown, ChevronRight, Menu, X, LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils/cn";
import type { AdminUserDTO } from "@/types";

type NavGroup = { label: string; items: { href: string; label: string; icon: React.ReactNode }[] };

const navGroups: NavGroup[] = [
  { label: "Overview", items: [
    { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  ]},
  { label: "Content Management", items: [
    { href: "/admin/projects", label: "Projects", icon: <FolderOpen className="h-4 w-4" /> },
    { href: "/admin/blog", label: "Blog Posts", icon: <FileText className="h-4 w-4" /> },
    { href: "/admin/videos", label: "Videos", icon: <Video className="h-4 w-4" /> },
    { href: "/admin/categories", label: "Categories", icon: <Tags className="h-4 w-4" /> },
    { href: "/admin/tags", label: "Tags", icon: <Tag className="h-4 w-4" /> },
    { href: "/admin/media", label: "Media Library", icon: <ImageIcon className="h-4 w-4" /> },
  ]},
  { label: "Personal Information", items: [
    { href: "/admin/about", label: "About", icon: <User className="h-4 w-4" /> },
    { href: "/admin/experience", label: "Experience", icon: <Briefcase className="h-4 w-4" /> },
    { href: "/admin/education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
    { href: "/admin/skills", label: "Skills", icon: <Sparkles className="h-4 w-4" /> },
  ]},
  { label: "Communication", items: [
    { href: "/admin/messages", label: "Messages", icon: <Mail className="h-4 w-4" /> },
  ]},
  { label: "Website", items: [
    { href: "/admin/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ]},
  { label: "Account", items: [
    { href: "/admin/profile", label: "Profile", icon: <Shield className="h-4 w-4" /> },
  ]},
];

export function AdminSidebar({ admin }: { admin: AdminUserDTO }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  const sidebar = (
    <aside className={cn(
      "flex flex-col h-full bg-surface border-r border-border-base theme-transition",
      collapsed ? "w-16" : "w-64",
    )}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-border-base">
        {!collapsed && <span className="font-bold text-lg">Admin</span>}
        <button type="button" onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg text-muted hover:bg-muted-surface hidden md:block">
          <Menu className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6 scrollbar-thin">
        {navGroups.map((g) => (
          <div key={g.label}>
            {!collapsed && <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">{g.label}</p>}
            <div className="space-y-0.5">
              {g.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    pathname.startsWith(item.href) ? "bg-primary-soft text-primary font-medium" : "text-muted hover:text-foreground hover:bg-muted-surface",
                    collapsed && "justify-center px-0",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!collapsed && item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border-base p-3 space-y-2">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!collapsed && (
            <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:text-danger hover:bg-danger/10 transition-colors w-full">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-surface border border-border-base p-2 md:hidden"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 md:hidden transform transition-transform",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
      )}>
        {sidebar}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block h-screen sticky top-0">
        {sidebar}
      </div>
    </>
  );
}
