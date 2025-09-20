import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment variables");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var _mongoose: MongooseCache | undefined;
}

const globalCache: MongooseCache = global._mongoose || {
  conn: null,
  promise: null,
};

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    const DB_NAME = process.env.MONGODB_DB_NAME;
    if (!DB_NAME) {
      throw new Error("Missing MONGODB_DB_NAME in environment variables");
    }
    globalCache.promise = mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
    });
  }

  globalCache.conn = await globalCache.promise;
  global._mongoose = globalCache;
  return globalCache.conn;
}
