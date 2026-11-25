import type { Metadata } from "next";
import Image from "next/image";
import { getAbout } from "@/lib/services/about";
import { getExperiences } from "@/lib/services/experience";
import { getEducations } from "@/lib/services/education";
import { getSkills } from "@/lib/services/skills";
import { formatMonthYear } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Md Shamim Mia — background, experience, and skills.",
};

export default async function AboutPage() {
  const [about, experiences, educations, skills] = await Promise.all([
    getAbout(),
    getExperiences(),
    getEducations(),
    getSkills(),
  ]);

  if (!about) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted">
        About information has not been added yet.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <section className="flex flex-col md:flex-row gap-10 items-start">
        {about.profileImage && (
          <div className="relative w-48 h-48 shrink-0 rounded-2xl overflow-hidden border border-border-base">
            <Image src={about.profileImage} alt={about.name} fill className="object-cover" sizes="192px" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{about.name}</h1>
          <p className="text-primary font-medium">{about.title}</p>
          {about.location && <p className="mt-1 text-sm text-muted">{about.location}</p>}
          <p className="mt-4 text-muted leading-relaxed">{about.introduction}</p>
          {about.biography && (
            <div className="mt-4 prose" dangerouslySetInnerHTML={{ __html: about.biography }} />
          )}
        </div>
      </section>

      {experiences.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Experience</h2>
          <div className="space-y-8 border-l-2 border-border-base pl-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative">
                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-primary bg-background" />
                <h3 className="font-semibold">{exp.role}</h3>
                <p className="text-sm text-primary">{exp.company} · {exp.employmentType}</p>
                <p className="text-xs text-muted mt-0.5">
                  {formatMonthYear(exp.startDate)} — {exp.current ? "Present" : exp.endDate ? formatMonthYear(exp.endDate) : ""}
                </p>
                {exp.description && <p className="mt-2 text-sm text-muted">{exp.description}</p>}
                {exp.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {exp.technologies.map((t) => <Badge key={t} variant="primary">{t}</Badge>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {educations.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Education</h2>
          <div className="space-y-6">
            {educations.map((ed) => (
              <div key={ed.id} className="rounded-xl border border-border-base bg-surface p-5">
                <h3 className="font-semibold">{ed.degree}</h3>
                <p className="text-sm text-primary">{ed.institution}</p>
                <p className="text-xs text-muted mt-0.5">
                  {formatMonthYear(ed.startDate)} — {ed.current ? "Present" : ed.endDate ? formatMonthYear(ed.endDate) : ""}
                </p>
                {ed.field && <p className="text-sm text-muted mt-1">{ed.field}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <Badge key={s.id} variant="primary">{s.name}</Badge>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
