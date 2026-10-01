import mongoose from 'mongoose';

const connectDB = async (retries = 3) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (retries > 0) {
      console.log(`⏳ Retrying MongoDB connection in 3 seconds... (${retries} retries left)`);
      setTimeout(() => connectDB(retries - 1), 3000);
    } else {
      console.warn(`⚠️ Could not connect to MongoDB Atlas. Please verify internet connection or IP whitelist on MongoDB Atlas.`);
    }
  }
};

export default connectDB;
