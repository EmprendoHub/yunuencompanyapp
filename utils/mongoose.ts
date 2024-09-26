import mongoose from "mongoose";

let isConnected = false;

export const connectToMongoDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_OFERTAZOS_URL)
    return console.log("MONGODB_OFERTAZOS_URL not found");

  if (isConnected) return console.log("=> using existing connection");

  try {
    await mongoose.connect(process.env.MONGODB_OFERTAZOS_URL);

    isConnected = true;

    console.log("MongoDBConnected New connection");
  } catch (error) {
    console.log(error);
  }
};
