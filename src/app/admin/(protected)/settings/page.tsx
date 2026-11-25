"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/loading";
import { toast } from "sonner";
import type { SiteSettingsDTO } from "@/types";

export default function AdminSettingsPage() {
  const [data, setData] = useState<SiteSettingsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((j) => { if (j.success) setData(j.data); setLoading(false); });
  }, []);

  function socialVal(platform: string): string {
    if (!data?.socialLinks) return "";
    const link = data.socialLinks.find((l) => l.icon === platform || l.label.toLowerCase() === platform);
    return link?.url ?? "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSaving(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      siteTitle: fd.get("siteTitle"), siteDescription: fd.get("siteDescription"),
      logoText: fd.get("logoText"), logoImage: fd.get("logoImage"), favicon: fd.get("favicon"),
      hero: {
        badge: fd.get("heroBadge"), greeting: fd.get("heroGreeting"),
        headline: fd.get("heroHeadline"), subheadline: fd.get("heroSubheadline"),
        description: fd.get("heroDescription"),
        primaryCtaLabel: fd.get("heroPrimaryCtaLabel"), primaryCtaHref: fd.get("heroPrimaryCtaHref"),
        secondaryCtaLabel: fd.get("heroSecondaryCtaLabel"), secondaryCtaHref: fd.get("heroSecondaryCtaHref"),
        codeCardName: fd.get("codeCardName"), codeCardRole: fd.get("codeCardRole"),
        codeCardStack: fd.get("codeCardStack"), codeCardTechBadge: fd.get("codeCardTechBadge"),
      },
      contact: {
        email: fd.get("contactEmail"), phone: fd.get("contactPhone"),
        location: fd.get("contactLocation"),
        formHeading: fd.get("contactFormHeading"), formDescription: fd.get("contactFormDescription"),
      },
      footer: { tagline: fd.get("footerTagline"), copyright: fd.get("footerCopyright") },
      socialLinks: [
        { label: "GitHub", url: fd.get("github") as string, icon: "github" },
        { label: "LinkedIn", url: fd.get("linkedin") as string, icon: "linkedin" },
        { label: "Twitter", url: fd.get("twitter") as string, icon: "twitter" },
        { label: "YouTube", url: fd.get("youtube") as string, icon: "youtube" },
      ].filter((l) => l.url),
      analytics: { googleAnalyticsId: fd.get("gaId") },
    };
    const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json(); setSaving(false);
    if (!res.ok) { toast.error(json.error ?? "Failed"); return; }
    toast.success("Settings saved"); setData(json.data);
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner className="h-8 w-8" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Site Settings</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-3">General</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="text-sm font-medium">Site Title</label><Input name="siteTitle" defaultValue={data?.siteTitle} required /></div>
              <div><label className="text-sm font-medium">Logo Text</label><Input name="logoText" defaultValue={data?.logoText} /></div>
            </div>
            <div><label className="text-sm font-medium">Description</label><Textarea name="siteDescription" defaultValue={data?.siteDescription} rows={2} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="text-sm font-medium">Logo Image URL</label><Input name="logoImage" defaultValue={data?.logoImage} /></div>
              <div><label className="text-sm font-medium">Favicon URL</label><Input name="favicon" defaultValue={data?.favicon} /></div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-3">Hero Section</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="text-sm font-medium">Badge</label><Input name="heroBadge" defaultValue={data?.hero?.badge} /></div>
              <div><label className="text-sm font-medium">Greeting</label><Input name="heroGreeting" defaultValue={data?.hero?.greeting} /></div>
            </div>
            <div><label className="text-sm font-medium">Headline</label><Input name="heroHeadline" defaultValue={data?.hero?.headline} /></div>
            <div><label className="text-sm font-medium">Subheadline</label><Input name="heroSubheadline" defaultValue={data?.hero?.subheadline} /></div>
            <div><label className="text-sm font-medium">Description</label><Textarea name="heroDescription" defaultValue={data?.hero?.description} rows={2} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="text-sm font-medium">Primary CTA Label</label><Input name="heroPrimaryCtaLabel" defaultValue={data?.hero?.primaryCtaLabel} /></div>
              <div><label className="text-sm font-medium">Primary CTA Link</label><Input name="heroPrimaryCtaHref" defaultValue={data?.hero?.primaryCtaHref} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="text-sm font-medium">Secondary CTA Label</label><Input name="heroSecondaryCtaLabel" defaultValue={data?.hero?.secondaryCtaLabel} /></div>
              <div><label className="text-sm font-medium">Secondary CTA Link</label><Input name="heroSecondaryCtaHref" defaultValue={data?.hero?.secondaryCtaHref} /></div>
            </div>
            <h3 className="text-sm font-semibold text-muted mt-6 mb-2 uppercase tracking-wide">Code Card (Hero Right Side)</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="text-sm font-medium">Display Name</label><Input name="codeCardName" defaultValue={data?.hero?.codeCardName} placeholder="Defaults to headline" /></div>
              <div><label className="text-sm font-medium">Display Role</label><Input name="codeCardRole" defaultValue={data?.hero?.codeCardRole} placeholder="Defaults to subheadline" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="text-sm font-medium">Tech Stack (comma-separated)</label><Input name="codeCardStack" defaultValue={data?.hero?.codeCardStack} placeholder="React, Next.js, Node.js" /></div>
              <div><label className="text-sm font-medium">Tech Badge</label><Input name="codeCardTechBadge" defaultValue={data?.hero?.codeCardTechBadge} placeholder="Next.js 16 ⚡" /></div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-3">Contact Info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-medium">Email</label><Input name="contactEmail" defaultValue={data?.contact?.email} /></div>
            <div><label className="text-sm font-medium">Phone</label><Input name="contactPhone" defaultValue={data?.contact?.phone} /></div>
          </div>
          <div className="mt-4"><label className="text-sm font-medium">Location</label><Input name="contactLocation" defaultValue={data?.contact?.location} /></div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-medium">Form Heading</label><Input name="contactFormHeading" defaultValue={data?.contact?.formHeading} /></div>
            <div><label className="text-sm font-medium">Form Description</label><Input name="contactFormDescription" defaultValue={data?.contact?.formDescription} /></div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-3">Social Links</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-medium">GitHub</label><Input name="github" defaultValue={socialVal("github")} /></div>
            <div><label className="text-sm font-medium">LinkedIn</label><Input name="linkedin" defaultValue={socialVal("linkedin")} /></div>
            <div><label className="text-sm font-medium">Twitter / X</label><Input name="twitter" defaultValue={socialVal("twitter")} /></div>
            <div><label className="text-sm font-medium">YouTube</label><Input name="youtube" defaultValue={socialVal("youtube")} /></div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-3">Footer & Analytics</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-medium">Footer Tagline</label><Input name="footerTagline" defaultValue={data?.footer?.tagline} /></div>
            <div><label className="text-sm font-medium">Footer Copyright</label><Input name="footerCopyright" defaultValue={data?.footer?.copyright} /></div>
          </div>
          <div className="mt-4"><label className="text-sm font-medium">Google Analytics ID</label><Input name="gaId" defaultValue={data?.analytics?.googleAnalyticsId} /></div>
        </section>
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Settings"}</Button>
      </form>
    </div>
  );
}
