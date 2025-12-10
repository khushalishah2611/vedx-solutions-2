import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;
export const hasMongoConfig = Boolean(uri);

let client;
let clientPromise;

const options = {
  serverSelectionTimeoutMS: 15000,
};

if (hasMongoConfig) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  console.warn("DATABASE_URL is missing; MongoDB features are disabled.");
}

export default async function connectDB() {
  if (!hasMongoConfig) return null;
  return clientPromise;
}
