import mongoose from "mongoose";

let isConnected = false;

export const connectToMongoDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGO_URL) return console.log("MONGO_URL not found");

  if (isConnected) return console.log("=> using existing connection");

  try {
    await mongoose.connect(process.env.MONGO_URL);

    isConnected = true;

    console.log("MongoDBConnected New connection");
  } catch (error) {
    console.log(error);
  }
};
