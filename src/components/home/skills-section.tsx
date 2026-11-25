import type { SkillDTO } from "@/types";

const GROUP_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend & Tools",
  tools: "Tools",
  other: "Other",
};

export function SkillsSection({ skills }: { skills: SkillDTO[] }) {
  if (!skills.length) return null;

  const groups = skills.reduce<Record<string, SkillDTO[]>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          Skills & <span className="text-primary">Technologies</span>
        </h2>

        <div className="grid gap-10 md:grid-cols-2">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-lg font-semibold mb-4">{GROUP_LABELS[group] ?? group}</h3>
              <div className="space-y-3">
                {items.map((s) => (
                  <div key={s.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-muted">{s.level}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted-surface overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${s.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
