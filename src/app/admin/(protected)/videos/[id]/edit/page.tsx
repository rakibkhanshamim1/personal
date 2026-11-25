export const instant = false;

import { notFound } from "next/navigation";
import { getVideoById } from "@/lib/services/videos";
import { VideoEditForm } from "./form";

type Props = { params: Promise<{ id: string }> };

export default async function EditVideoPage({ params }: Props) {
  const { id } = await params;
  const video = await getVideoById(id);
  if (!video) notFound();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Video</h1>
      <VideoEditForm video={video} />
    </div>
  );
}
