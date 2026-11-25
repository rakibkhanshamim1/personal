import { BlogForm } from "@/components/admin/blog-form";
import { getCategoriesByKind } from "@/lib/services/categories";
import { getAllTags } from "@/lib/services/tags";

export default async function NewBlogPage() {
  const [categories, tags] = await Promise.all([getCategoriesByKind("blog"), getAllTags()]);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Blog Post</h1>
      <BlogForm categories={categories} tags={tags} />
    </div>
  );
}
