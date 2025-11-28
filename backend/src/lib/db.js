import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const DB = process.env.DATABASE_URL;

async function connectDB() {
  try {
    await mongoose.connect(DB);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
}

export default connectDB; 