import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const defaultUsers = [
  {
    name: 'Atelier Administrator',
    email: 'admin@atelier.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 98765 43210',
    isVerified: true,
    status: 'active'
  },
  {
    name: 'Maison Luxe Vendor',
    email: 'vendor@atelier.com',
    password: 'vendor123',
    role: 'vendor',
    phone: '+91 98765 43211',
    isVerified: true,
    status: 'active'
  },
  {
    name: 'Eleanor Vance',
    email: 'client@atelier.com',
    password: 'password123',
    role: 'customer',
    phone: '+91 98765 43212',
    isVerified: true,
    status: 'active'
  }
];

const seedUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected.`);

    for (const u of defaultUsers) {
      const existing = await User.findOne({ email: u.email });
      if (existing) {
        // Ensure role, verification, and status are correct
        existing.role = u.role;
        existing.isVerified = true;
        existing.status = 'active';
        existing.password = u.password; // pre-save hook will hash if modified
        await existing.save();
        console.log(`Updated existing user: ${u.email} [Role: ${u.role}]`);
      } else {
        const newUser = new User(u);
        await newUser.save();
        console.log(`Created new user: ${u.email} [Role: ${u.role}]`);
      }
    }

    console.log('🎉 Default users seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
