import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { getSettings } from "@/lib/services/settings";
import { getAbout } from "@/lib/services/about";
import {
  Mail, MapPin, Phone, Clock, ArrowUpRight, Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — send a message or find my contact details.",
};

export default async function ContactPage() {
  const [settings, about] = await Promise.all([getSettings(), getAbout()]);
  const c = settings.contact;
  const socials = settings.socialLinks ?? about?.socialLinks ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary-soft text-primary text-sm font-medium mb-4">
          {c.formHeading || "Get in Touch"}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Let&apos;s Work <span className="text-primary">Together</span>
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          {c.formDescription || "Have a project in mind or just want to say hello? I'd love to hear from you. Fill out the form below or reach out through any of the channels listed."}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-5">
        {/* Left Column — Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info Cards */}
          <div className="rounded-2xl border border-border-base bg-surface p-6 space-y-5">
            <h2 className="text-lg font-semibold">Contact Information</h2>

            {c.email && (
              <a href={`mailto:${c.email}`} className="group flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-muted-surface/50 transition-colors">
                <div className="rounded-xl bg-primary-soft p-3 text-primary shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted">Email</p>
                  <p className="font-medium truncate group-hover:text-primary transition-colors">{c.email}</p>
                </div>
              </a>
            )}

            {c.phone && (
              <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="group flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-muted-surface/50 transition-colors">
                <div className="rounded-xl bg-primary-soft p-3 text-primary shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted">Phone</p>
                  <p className="font-medium group-hover:text-primary transition-colors">{c.phone}</p>
                </div>
              </a>
            )}

            {c.location && (
              <div className="flex items-start gap-4 p-3 -mx-3">
                <div className="rounded-xl bg-primary-soft p-3 text-primary shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted">Location</p>
                  <p className="font-medium">{c.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Availability */}
          {about?.availableForWork && (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                </span>
                <h3 className="font-semibold text-green-600 dark:text-green-400">Available for Work</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                I&apos;m currently open to new opportunities — freelance projects, full-time roles, or collaborations. Let&apos;s discuss how I can help!
              </p>
            </div>
          )}

          {/* Response Time */}
          <div className="rounded-2xl border border-border-base bg-surface p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-xl bg-primary-soft p-2.5 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Response Time</h3>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              I typically respond within <strong className="text-foreground">24 hours</strong>. For urgent matters, feel free to reach out via phone or social media.
            </p>
          </div>

          {/* Social Links */}
          {socials.length > 0 && (
            <div className="rounded-2xl border border-border-base bg-surface p-6">
              <h3 className="font-semibold mb-4">Find Me Online</h3>
              <div className="grid grid-cols-2 gap-3">
                {socials.map((link) => {
                  const Icon = Globe;
                  return (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-border-base p-3 hover:border-primary/40 hover:bg-primary-soft/50 transition-all"
                    >
                      <Icon className="h-5 w-5 text-muted group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{link.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 ml-auto text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column — Form */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border-base bg-surface p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-1">Send a Message</h2>
            <p className="text-sm text-muted mb-6">Fill out the form and I&apos;ll get back to you as soon as possible.</p>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
