import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import type { SiteSettingsDTO } from "@/types";

export function HeroSection({ settings }: { settings: SiteSettingsDTO }) {
  const h = settings.hero;
  const cardName = h.codeCardName || h.headline || "Md Shamim Mia";
  const cardRole = h.codeCardRole || h.subheadline || "Full-Stack Developer";
  const cardStack = (h.codeCardStack || "React, Next.js, Node.js").split(",").map((s) => s.trim());
  const techBadge = h.codeCardTechBadge || "Next.js 16 ⚡";

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="dot-grid absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left — Text */}
          <div>
            {h.badge && (
              <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary-soft px-3 py-1 text-xs font-medium text-primary mb-6">
                {h.badge}
              </span>
            )}
            {h.greeting && (
              <p className="text-lg text-muted mb-2">{h.greeting}</p>
            )}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance-pretty">
              {h.headline || "Building digital experiences"}
            </h1>
            {h.subheadline && (
              <p className="mt-3 text-xl font-medium text-primary">{h.subheadline}</p>
            )}
            {h.description && (
              <p className="mt-6 text-lg leading-relaxed text-muted max-w-xl">{h.description}</p>
            )}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={h.primaryCtaHref}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-contrast hover:bg-primary-hover transition-colors"
              >
                {h.primaryCtaLabel} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={h.secondaryCtaHref}
                className="inline-flex items-center gap-2 rounded-lg border border-border-base px-6 py-3 text-sm font-medium text-foreground hover:bg-muted-surface transition-colors"
              >
                <Mail className="h-4 w-4" /> {h.secondaryCtaLabel}
              </Link>
            </div>
          </div>

          {/* Right — Code Card */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="rounded-2xl border border-border-base bg-elevated shadow-xl overflow-hidden">
                {/* Title Bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border-base bg-muted-surface">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="text-xs text-muted font-mono">app/page.tsx</span>
                  <div className="w-12" />
                </div>
                {/* Code Content */}
                <div className="p-6 font-mono text-sm leading-7">
                  <CodeLine>
                    <Kw>import</Kw> <Tok>{`{ `}</Tok><Typ>Hero</Typ><Tok>{` }`}</Tok> <Kw>from</Kw> <Str>&quot;@/components&quot;</Str>
                  </CodeLine>
                  <br />
                  <CodeLine>
                    <Kw>export default function</Kw> <Fn>Page</Fn><Tok>() {"{"}</Tok>
                  </CodeLine>
                  <CodeLine indent={2}>
                    <Kw>const</Kw> <Typ>dev</Typ> <Tok>= {"{"}</Tok>
                  </CodeLine>
                  <CodeLine indent={3}>
                    <Prop>name</Prop><Tok>: </Tok><Str>&quot;{cardName}&quot;</Str><Tok>,</Tok>
                  </CodeLine>
                  <CodeLine indent={3}>
                    <Prop>role</Prop><Tok>: </Tok><Str>&quot;{cardRole}&quot;</Str><Tok>,</Tok>
                  </CodeLine>
                  <CodeLine indent={3}>
                    <Prop>stack</Prop><Tok>: [</Tok>
                    {cardStack.map((s, i) => (
                      <span key={s}><Str>&quot;{s}&quot;</Str>{i < cardStack.length - 1 && <Tok>, </Tok>}</span>
                    ))}
                    <Tok>],</Tok>
                  </CodeLine>
                  <CodeLine indent={3}>
                    <Prop>passion</Prop><Tok>: </Tok><Num>Infinity</Num><Tok>,</Tok>
                  </CodeLine>
                  <CodeLine indent={2}>
                    <Tok>{"}"}</Tok>
                  </CodeLine>
                  <br />
                  <CodeLine indent={2}>
                    <Kw>return</Kw> <Tok>{"<"}</Tok><Typ>Hero</Typ> <Tok>{"{"}</Tok><Prop>...dev</Prop><Tok>{"}"}</Tok> <Tok>/{">"}</Tok>
                  </CodeLine>
                  <CodeLine>
                    <Tok>{"}"}</Tok>
                  </CodeLine>
                </div>
              </div>

              {/* Performance Badge */}
              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-border-base bg-surface px-5 py-3 shadow-lg">
                <p className="text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">Performance</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-foreground">99</span>
                  <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400">+38%</span>
                </div>
              </div>

              {/* Tech Badge */}
              {techBadge && (
                <div className="absolute -top-3 -right-3 rounded-xl bg-primary px-4 py-2 shadow-lg rotate-3">
                  <span className="font-bold text-primary-contrast text-sm">{techBadge}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeLine({ children, indent = 0 }: { children: React.ReactNode; indent?: number }) {
  return <div style={{ paddingLeft: `${indent * 1.25}rem` }}>{children}</div>;
}

function Kw({ children }: { children: React.ReactNode }) {
  return <span className="text-purple-600 dark:text-purple-400">{children}</span>;
}

function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-green-600 dark:text-green-400">{children}</span>;
}

function Typ({ children }: { children: React.ReactNode }) {
  return <span className="text-amber-600 dark:text-amber-400">{children}</span>;
}

function Fn({ children }: { children: React.ReactNode }) {
  return <span className="text-primary">{children}</span>;
}

function Prop({ children }: { children: React.ReactNode }) {
  return <span className="text-rose-600 dark:text-rose-400">{children}</span>;
}

function Num({ children }: { children: React.ReactNode }) {
  return <span className="text-orange-600 dark:text-orange-400">{children}</span>;
}

function Tok({ children }: { children: React.ReactNode }) {
  return <span className="text-foreground/70">{children}</span>;
}
