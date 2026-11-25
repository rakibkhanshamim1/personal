export const instant = false;

import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { getProjectById } from "@/lib/services/projects";
import { getCategoriesByKind } from "@/lib/services/categories";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const [project, categories] = await Promise.all([
    getProjectById(id),
    getCategoriesByKind("project"),
  ]);
  if (!project) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
      <ProjectForm project={project} categories={categories} />
    </div>
  );
}
