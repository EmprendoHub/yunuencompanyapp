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
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(MONGO_URL!, opts);
    }

    try {
      cached.conn = await cached.promise;
    } catch (e) {
      console.error("Error while awaiting connection:", e);
      cached.promise = null;
      throw e;
    }

    return mongoose;
  } catch (error) {
    console.error("Database connection error:", error);

    throw error;
  }
}

export default dbConnect;
