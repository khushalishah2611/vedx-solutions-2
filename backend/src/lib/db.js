import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL?.trim();
const hasValidMongoUri = Boolean(uri) && /^mongodb(\+srv)?:\/\//i.test(uri);
export const hasMongoConfig = hasValidMongoUri;

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
  const warning = uri
    ? "DATABASE_URL is set to a non-Mongo URI (for example, a MySQL connection string); MongoDB-specific features are disabled."
    : "DATABASE_URL is missing; MongoDB features are disabled.";
  console.info(warning);
}

export default async function connectDB() {
  if (!hasMongoConfig) return null;
  return clientPromise;
}
