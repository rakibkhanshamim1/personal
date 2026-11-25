/**
 * Centralised environment access.
 *
 * Values are read lazily so that importing a module never crashes a build on a
 * machine that has not configured secrets yet — the error surfaces at the point
 * of use with a message that names the missing variable.
 */

function required(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

export const env = {
  get mongodbUri(): string {
    return required("MONGODB_URI", process.env.MONGODB_URI);
  },

  get authSecret(): string {
    const secret = required("AUTH_SECRET", process.env.AUTH_SECRET);
    if (secret.length < 32) {
      throw new Error("AUTH_SECRET must be at least 32 characters long.");
    }
    return secret;
  },

  get sessionMaxAge(): number {
    const parsed = Number(process.env.SESSION_MAX_AGE);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 60 * 60 * 24 * 7;
  },

  get siteUrl(): string {
    const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (raw) return raw.replace(/\/$/, "");
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    return "http://localhost:3000";
  },

  get uploadProvider(): "local" | "cloudinary" {
    return process.env.IMAGE_UPLOAD_PROVIDER === "cloudinary"
      ? "cloudinary"
      : "local";
  },

  get maxUploadBytes(): number {
    const mb = Number(process.env.MAX_UPLOAD_MB);
    return (Number.isFinite(mb) && mb > 0 ? mb : 5) * 1024 * 1024;
  },

  get cloudinary() {
    return {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
      apiKey: process.env.CLOUDINARY_API_KEY ?? "",
      apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
      folder: process.env.CLOUDINARY_FOLDER ?? "portfolio",
    };
  },

  get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  },
};

export const seedEnv = {
  get adminEmail(): string {
    return required("ADMIN_EMAIL", process.env.ADMIN_EMAIL);
  },
  get adminPassword(): string {
    const password = required("ADMIN_PASSWORD", process.env.ADMIN_PASSWORD);
    if (password.length < 10) {
      throw new Error("ADMIN_PASSWORD must be at least 10 characters long.");
    }
    return password;
  },
  get adminName(): string {
    return process.env.ADMIN_NAME?.trim() || "Site Admin";
  },
};
