import "server-only";
import { createHash } from "node:crypto";
import { env } from "@/lib/env";

type Bucket = { count: number; resetAt: number };

/**
 * Fixed-window limiter held in process memory. Each server instance keeps its
 * own counters, so this is a first line of defence against bursts rather than a
 * global quota — login also has a database-backed account lockout behind it.
 */
const globalForLimiter = globalThis as unknown as {
  __rateLimitBuckets?: Map<string, Bucket>;
};

const buckets: Map<string, Bucket> = (globalForLimiter.__rateLimitBuckets ??=
  new Map());

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);

  if (existing.count > limit) {
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  // Opportunistic cleanup keeps the map from growing without bound.
  if (buckets.size > 5000) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  return {
    allowed: true,
    remaining: limit - existing.count,
    retryAfterSeconds: 0,
  };
}

/** Best-effort client IP from the proxy headers set by common hosts. */
export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? headers.get("cf-connecting-ip") ?? "unknown";
}

/**
 * Hashes an IP with the app secret so stored values can be compared for rate
 * limiting but can't be reversed back to an address.
 */
export function hashIp(ip: string): string {
  return createHash("sha256")
    .update(`${ip}:${env.authSecret}`)
    .digest("hex")
    .slice(0, 32);
}
