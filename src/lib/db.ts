import mongoose from "mongoose";

interface CachedMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: CachedMongoose | undefined;
}

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached: CachedMongoose = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  try {
    console.log("Starting DB connection attempt...");

    if (cached.conn) {
      console.log("Using cached connection");
      return cached.conn;
    }

    if (!cached.promise) {
      console.log("No cached promise, creating new connection...");
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(MONGO_URL!, opts);
    }

    try {
      console.log("Awaiting connection...");
      cached.conn = await cached.promise;
      console.log("Successfully connected to MongoDB");
    } catch (e) {
      console.error("Error while awaiting connection:", e);
      cached.promise = null;
      throw e;
    }

    return mongoose;
  } catch (error) {
    console.error("Database connection error:", error);
    console.error(
      "MongoDB URL (redacted):",
      MONGO_URL?.substring(0, 10) + "..."
    );
    throw error;
  }
}

export default dbConnect;
