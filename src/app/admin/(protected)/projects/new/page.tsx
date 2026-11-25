import { ProjectForm } from "@/components/admin/project-form";
import { getCategoriesByKind } from "@/lib/services/categories";

export default async function NewProjectPage() {
  const categories = await getCategoriesByKind("project");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Project</h1>
      <ProjectForm categories={categories} />
    </div>
  );
}
