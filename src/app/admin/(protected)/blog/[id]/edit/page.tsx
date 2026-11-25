export const instant = false;

import { notFound } from "next/navigation";
import { BlogForm } from "@/components/admin/blog-form";
import { getPostById } from "@/lib/services/blog";
import { getCategoriesByKind } from "@/lib/services/categories";
import { getAllTags } from "@/lib/services/tags";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const [post, categories, tags] = await Promise.all([getPostById(id), getCategoriesByKind("blog"), getAllTags()]);
  if (!post) notFound();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
      <BlogForm post={post} categories={categories} tags={tags} />
    </div>
  );
}
