import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { AboutDTO } from "@/types";

export function AboutPreview({ about }: { about: AboutDTO | null }) {
  if (!about) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          {about.profileImage && (
            <div className="relative aspect-square max-w-sm mx-auto md:mx-0 rounded-2xl overflow-hidden border border-border-base">
              <Image
                src={about.profileImage}
                alt={about.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 384px"
              />
            </div>
          )}
          <div>
            <h2 className="text-3xl font-bold">
              About <span className="text-primary">Me</span>
            </h2>
            <p className="mt-1 text-sm text-muted">{about.title}</p>
            <p className="mt-4 text-muted leading-relaxed">{about.introduction}</p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 text-primary hover:text-primary-hover text-sm font-medium transition-colors"
            >
              Learn more about me <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
