import "server-only";
import mongoose from "mongoose";
import { env } from "@/lib/env";

/**
 * Next.js reloads modules between requests in development and may run several
 * server instances in production, so the connection promise is cached on the
 * global object. Without this, every request would open a new pool.
 */
type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as unknown as {
  __mongooseCache?: MongooseCache;
};

const cache: MongooseCache = (globalForMongoose.__mongooseCache ??= {
  connection: null,
  promise: null,
});

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.connection) return cache.connection;

  if (!cache.promise) {
    mongoose.set("strictQuery", true);

    cache.promise = mongoose
      .connect(env.mongodbUri, {
        // Fail fast instead of hanging a request for 30s when Mongo is down.
        serverSelectionTimeoutMS: 8000,
        maxPoolSize: 10,
      })
      .catch((error: unknown) => {
        // Clear the memo so the next request retries rather than reusing a
        // permanently rejected promise.
        cache.promise = null;
        throw error;
      });
  }

  cache.connection = await cache.promise;
  return cache.connection;
}

/**
 * Registers every model exactly once. Importing this from the data layer
 * guarantees that `ref`-based populate calls can always resolve their target
 * model, regardless of which route happened to load first.
 */
export async function connectAndRegisterModels() {
  const connection = await connectToDatabase();
  await import("@/models");
  return connection;
}
