import "server-only";
import { env } from "@/lib/env";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
  "application/pdf",
]);

type UploadResult = {
  url: string;
  publicId: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  provider: "local" | "cloudinary";
};

export function validateFile(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error(`File type "${file.type}" is not allowed`);
  }
  if (file.size > env.maxUploadBytes) {
    throw new Error(`File exceeds the ${env.maxUploadBytes / 1024 / 1024}MB limit`);
  }
}

export async function uploadFile(file: File): Promise<UploadResult> {
  validateFile(file);

  if (env.uploadProvider === "cloudinary") {
    return uploadToCloudinary(file);
  }
  return uploadToLocal(file);
}

async function uploadToLocal(file: File): Promise<UploadResult> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.name) || ".bin";
  const id = crypto.randomBytes(12).toString("hex");
  const filename = `${id}${ext}`;
  const filePath = path.join(uploadsDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return {
    url: `/uploads/${filename}`,
    publicId: filename,
    filename: file.name,
    mimeType: file.type,
    size: file.size,
    width: null,
    height: null,
    provider: "local",
  };
}

async function uploadToCloudinary(file: File): Promise<UploadResult> {
  const { cloudName, apiKey, apiSecret, folder } = env.cloudinary;
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const paramsToSign = folder
    ? `folder=${folder}&timestamp=${timestamp}`
    : `timestamp=${timestamp}`;

  const signature = crypto
    .createHash("sha1")
    .update(`${paramsToSign}${apiSecret}`)
    .digest("hex");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("signature", signature);
  if (folder) form.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${text}`);
  }

  const data = await res.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
    filename: file.name,
    mimeType: file.type,
    size: data.bytes,
    width: data.width ?? null,
    height: data.height ?? null,
    provider: "cloudinary",
  };
}

export async function deleteFile(publicId: string, provider: "local" | "cloudinary") {
  if (provider === "local") {
    const filePath = path.join(process.cwd(), "public", "uploads", publicId);
    await fs.unlink(filePath).catch(() => {});
    return;
  }

  const { cloudName, apiKey, apiSecret } = env.cloudinary;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = crypto
    .createHash("sha1")
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_id: publicId, api_key: apiKey, timestamp, signature }),
  });
}
