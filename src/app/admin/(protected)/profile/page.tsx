"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/loading";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((j) => { if (j.success) setAdmin(j.data); setLoading(false); });
  }, []);

  async function handleProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSavingProfile(true);
    const fd = new FormData(e.currentTarget);
    const body = { name: fd.get("name"), email: fd.get("email"), avatar: fd.get("avatar") };
    const res = await fetch("/api/auth/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json(); setSavingProfile(false);
    if (!res.ok) { toast.error(json.error ?? "Failed"); return; }
    toast.success("Profile updated"); setAdmin(json.data);
  }

  async function handlePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSavingPassword(true);
    const fd = new FormData(e.currentTarget);
    const currentPassword = fd.get("currentPassword") as string;
    const newPassword = fd.get("newPassword") as string;
    const confirmPassword = fd.get("confirmPassword") as string;
    if (newPassword !== confirmPassword) { toast.error("Passwords don't match"); setSavingPassword(false); return; }
    const res = await fetch("/api/auth/password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword }) });
    const json = await res.json(); setSavingPassword(false);
    if (!res.ok) { toast.error(json.error ?? "Failed"); return; }
    toast.success("Password changed"); (e.target as HTMLFormElement).reset();
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <section className="rounded-xl border border-border-base bg-surface p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Account Details</h2>
        <form onSubmit={handleProfile} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-medium">Name</label><Input name="name" defaultValue={admin?.name} required /></div>
            <div><label className="text-sm font-medium">Email</label><Input name="email" type="email" defaultValue={admin?.email} required /></div>
          </div>
          <div><label className="text-sm font-medium">Avatar URL</label><Input name="avatar" defaultValue={admin?.avatar} /></div>
          <Button type="submit" disabled={savingProfile}>{savingProfile ? "Saving…" : "Update Profile"}</Button>
        </form>
      </section>
      <section className="rounded-xl border border-border-base bg-surface p-6">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePassword} className="space-y-4">
          <div><label className="text-sm font-medium">Current Password</label><Input name="currentPassword" type="password" required /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-medium">New Password</label><Input name="newPassword" type="password" required minLength={8} /></div>
            <div><label className="text-sm font-medium">Confirm New Password</label><Input name="confirmPassword" type="password" required minLength={8} /></div>
          </div>
          <Button type="submit" disabled={savingPassword}>{savingPassword ? "Saving…" : "Change Password"}</Button>
        </form>
      </section>
    </div>
  );
}
