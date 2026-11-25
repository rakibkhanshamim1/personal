"use client";

import { useState } from "react";
import { Send, CheckCircle, User, Mail, MessageSquare, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ContactForm() {
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
      if (!res.ok) {
        toast.error(json.error ?? "Something went wrong");
        return;
      }
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-green-500/10 p-4 mb-4">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
        <p className="text-muted max-w-sm mb-6">
          Thank you for reaching out. I&apos;ll review your message and get back to you within 24 hours.
        </p>
        <Button variant="outline" onClick={() => setSent(false)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-muted" /> Name <span className="text-red-500">*</span>
          </label>
          <Input name="name" placeholder="John Doe" required minLength={2} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-muted" /> Email <span className="text-red-500">*</span>
          </label>
          <Input name="email" type="email" placeholder="john@example.com" required />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
          <Type className="h-3.5 w-3.5 text-muted" /> Subject
        </label>
        <Input name="subject" placeholder="What's this about?" />
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-muted" /> Message <span className="text-red-500">*</span>
        </label>
        <Textarea
          name="message"
          placeholder="Tell me about your project, idea, or just say hi..."
          required
          minLength={10}
          rows={6}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto px-8">
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </>
        ) : (
          <>Send Message <Send className="ml-2 h-4 w-4" /></>
        )}
      </Button>
    </form>
  );
}
