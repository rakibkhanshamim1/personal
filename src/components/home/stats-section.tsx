import type { SiteSettingsDTO } from "@/types";

export function StatsSection({ settings }: { settings: SiteSettingsDTO }) {
  if (!settings.stats.length) return null;

  return (
    <section className="border-y border-border-base bg-surface py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {settings.stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
