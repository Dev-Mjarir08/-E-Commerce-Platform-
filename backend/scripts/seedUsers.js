import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

// Demo users list removed as requested
const defaultUsers = [];

// Demo user emails to delete from database
const demoEmails = [
  'admin@atelier.com',
  'vendor@atelier.com',
  'client@atelier.com'
];

const seedUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected.`);

    // Automatically remove existing demo users from database
    const deleteResult = await User.deleteMany({ email: { $in: demoEmails } });
    if (deleteResult.deletedCount > 0) {
      console.log(`🧹 Removed ${deleteResult.deletedCount} demo user(s) from database: ${demoEmails.join(', ')}`);
    } else {
      console.log(`✨ No demo users found in database.`);
    }

    if (defaultUsers.length > 0) {
      for (const u of defaultUsers) {
        const existing = await User.findOne({ email: u.email });
        if (existing) {
          existing.role = u.role;
          existing.isVerified = true;
          existing.status = 'active';
          existing.password = u.password;
          await existing.save();
          console.log(`Updated user: ${u.email} [Role: ${u.role}]`);
        } else {
          const newUser = new User(u);
          await newUser.save();
          console.log(`Created user: ${u.email} [Role: ${u.role}]`);
        }
      }
    }

    console.log('✅ User database is clean without demo accounts.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error in seed script:', error);
    process.exit(1);
  }
};

seedUsers();
