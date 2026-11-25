"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error ?? "Something went wrong"); return; }
      setSent(true);
      form.reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <section className="py-20" id="contact">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="rounded-full bg-green-500/10 p-4 inline-block mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
          <p className="text-muted mb-6">Thank you for reaching out. I&apos;ll get back to you soon.</p>
          <Button variant="outline" onClick={() => setSent(false)}>Send Another</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20" id="contact">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary-soft text-primary text-sm font-medium mb-4">
          Contact
        </span>
        <h2 className="text-3xl font-bold">
          Get in <span className="text-primary">Touch</span>
        </h2>
        <p className="mt-2 text-muted">Have a project in mind? Let&apos;s talk about it.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="name" placeholder="Your name" required minLength={2} />
            <Input name="email" type="email" placeholder="Your email" required />
          </div>
          <Input name="subject" placeholder="Subject (optional)" />
          <Textarea name="message" placeholder="Your message" required minLength={10} rows={5} />
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Sending…" : "Send Message"} <Send className="ml-1 h-4 w-4" />
          </Button>
        </form>
      </div>
    </section>
  );
}
