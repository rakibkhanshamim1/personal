"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Login failed");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="mt-1 text-sm text-muted">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="email" type="email" placeholder="Email" required autoFocus />
          <Input name="password" type="password" placeholder="Password" required />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign In"} <LogIn className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
