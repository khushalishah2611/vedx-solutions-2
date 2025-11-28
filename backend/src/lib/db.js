import { MongoClient } from 'mongodb';

const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

if (!process.env.DATABASE_URL) {
  throw new Error('Please add your MongoDB URI to .env as DATABASE_URL');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(process.env.DATABASE_URL, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client
  client = new MongoClient(process.env.DATABASE_URL, options);
  clientPromise = client.connect();
}

// Export the promise to get the connected client
const connectDB = async () => {
  try {
    const client = await clientPromise;
    console.log('✅ MongoDB connected successfully');
    return client;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
};

export default connectDB;
export { clientPromise };