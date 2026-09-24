import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Store from '../models/Store.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import connectDB from '../config/db.js';

dotenv.config();

export const seedDevData = async () => {
  try {
    await connectDB();
    console.log('--- Starting Development Database Seeder ---');

    // 1. Create or Find Vendor User
    let vendor = await User.findOne({ email: 'vendor@atelier.com' });
    if (!vendor) {
      vendor = await User.create({
        name: 'Aura Studio Vendor',
        email: 'vendor@atelier.com',
        password: 'vendor123',
        role: 'vendor',
        phone: '+1 415 555 0199',
        status: 'active',
        isVerified: true
      });
      console.log('✅ Created Vendor User: vendor@atelier.com / vendor123');
    } else {
      vendor.role = 'vendor';
      vendor.password = 'vendor123';
      vendor.status = 'active';
      vendor.isVerified = true;
      await vendor.save();
      console.log('✅ Updated existing Vendor User: vendor@atelier.com');
    }

    // 2. Create or Find Admin User
    let admin = await User.findOne({ email: 'admin@atelier.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Atelier Administrator',
        email: 'admin@atelier.com',
        password: 'admin123',
        role: 'admin',
        phone: '+1 415 555 0100',
        status: 'active',
        isVerified: true
      });
      console.log('✅ Created Admin User: admin@atelier.com / admin123');
    } else {
      admin.role = 'admin';
      admin.password = 'admin123';
      admin.status = 'active';
      admin.isVerified = true;
      await admin.save();
    }

    // 3. Create or Find Customer User
    let customer = await User.findOne({ email: 'client@atelier.com' });
    if (!customer) {
      customer = await User.create({
        name: 'Alex Johnson',
        email: 'client@atelier.com',
        password: 'password123',
        role: 'customer',
        phone: '+1 415 555 0142',
        status: 'active',
        isVerified: true
      });
      console.log('✅ Created Customer User: client@atelier.com / password123');
    } else {
      customer.password = 'password123';
      await customer.save();
    }

    // 4. Create or Find Categories
    const categoriesData = [
      { name: 'Electronics', slug: 'electronics', description: 'Audio gear, devices, and intelligent tech essentials' },
      { name: 'Furniture', slug: 'furniture', description: 'Ergonomic studio furniture and architectural workspace decor' },
      { name: 'Accessories', slug: 'accessories', description: 'Curated lifestyle accessories and artisan leather goods' },
      { name: 'Apparel', slug: 'apparel', description: 'Tailored luxury minimalist silhouettes and outerwear' }
    ];

    const categoryMap = {};
    for (const cat of categoriesData) {
      let existingCat = await Category.findOne({ slug: cat.slug });
      if (!existingCat) {
        existingCat = await Category.create(cat);
        console.log(`✅ Created Category: ${cat.name}`);
      }
      categoryMap[cat.slug] = existingCat;
    }

    // 5. Create or Find Store for Vendor
    let store = await Store.findOne({ owner: vendor._id });
    if (!store) {
      store = await Store.create({
        owner: vendor._id,
        name: 'Aura Tech & Lifestyle Atelier',
        slug: 'aura-tech-lifestyle',
        description: 'Curated ergonomic accessories, workspace essentials, and acoustic audio products.',
        email: 'support@auratech.com',
        phone: '+1 (555) 019-2834',
        logo: {
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80'
        },
        banner: {
          url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80'
        },
        address: {
          street: '742 Evergreen Terrace, Suite 100',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94107',
          country: 'United States'
        },
        status: 'active',
        isVerified: true,
        ratingAverage: 4.9,
        ratingCount: 18
      });
      console.log('✅ Created Store for Vendor: Aura Tech & Lifestyle Atelier');
    }

    // 6. Seed Initial Products for Vendor Store
    let products = await Product.find({ store: store._id });
    if (products.length === 0) {
      const productsToSeed = [
        {
          store: store._id,
          category: categoryMap['electronics']._id,
          title: 'Wireless Noise-Canceling Headphones',
          slug: 'wireless-noise-canceling-headphones',
          description: 'High-fidelity acoustic isolation with 30-hour active battery.',
          basePrice: 149.99,
          stock: 42,
          isActive: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', isPrimary: true }
          ]
        },
        {
          store: store._id,
          category: categoryMap['furniture']._id,
          title: 'Ergonomic Leather Office Chair',
          slug: 'ergonomic-leather-office-chair',
          description: 'Premium top-grain leather with contoured lumbar support.',
          basePrice: 289.00,
          stock: 8,
          isActive: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=500', isPrimary: true }
          ]
        },
        {
          store: store._id,
          category: categoryMap['electronics']._id,
          title: 'Smart Fitness Watch V2',
          slug: 'smart-fitness-watch-v2',
          description: 'Heart rate tracker, sleep analytics and waterproof aluminum casing.',
          basePrice: 99.50,
          stock: 0,
          isActive: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', isPrimary: true }
          ]
        },
        {
          store: store._id,
          category: categoryMap['accessories']._id,
          title: 'Stainless Steel Water Bottle (1L)',
          slug: 'stainless-steel-water-bottle',
          description: 'Vacuum insulated dual-walled steel keeps liquids cold 24 hours.',
          basePrice: 24.99,
          stock: 115,
          isActive: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', isPrimary: true }
          ]
        }
      ];

      products = [];
      for (const prod of productsToSeed) {
        const createdProd = await Product.create(prod);
        products.push(createdProd);
      }
      console.log(`✅ Seeded ${products.length} Products for Vendor Store`);
    }

    // 7. Seed Order & OrderItems for Vendor Metrics
    const existingOrders = await OrderItem.countDocuments({ store: store._id });
    if (existingOrders === 0 && products.length > 0) {
      const order1 = await Order.create({
        orderNumber: 'ORD-2026-001',
        user: customer._id,
        shippingAddress: {
          recipientName: 'Alex Johnson',
          phone: '+1 415 555 0142',
          street: '100 Market St',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94105',
          country: 'United States'
        },
        paymentMethod: 'stripe',
        paymentStatus: 'paid',
        orderStatus: 'delivered',
        subtotal: 149.99,
        totalPrice: 159.99
      });

      await OrderItem.create({
        order: order1._id,
        store: store._id,
        product: products[0]._id,
        name: products[0].title,
        image: products[0].images?.[0]?.url || '',
        price: 149.99,
        quantity: 1,
        subtotal: 149.99,
        status: 'delivered'
      });

      const order2 = await Order.create({
        orderNumber: 'ORD-2026-002',
        user: customer._id,
        shippingAddress: {
          recipientName: 'Alex Johnson',
          phone: '+1 415 555 0142',
          street: '100 Market St',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94105',
          country: 'United States'
        },
        paymentMethod: 'stripe',
        paymentStatus: 'paid',
        orderStatus: 'processing',
        subtotal: 289.00,
        totalPrice: 299.00
      });

      await OrderItem.create({
        order: order2._id,
        store: store._id,
        product: products[1]._id,
        name: products[1].title,
        image: products[1].images?.[0]?.url || '',
        price: 289.00,
        quantity: 1,
        subtotal: 289.00,
        status: 'processing'
      });

      console.log('✅ Seeded Orders & OrderItems for Store Analytics');
    }

    // 8. Seed Notification for Vendor
    const existingNotif = await Notification.countDocuments({ recipient: vendor._id });
    if (existingNotif === 0) {
      await Notification.create({
        recipient: vendor._id,
        title: 'Welcome to Atelier Vendor Suite',
        message: 'Your store Aura Tech & Lifestyle Atelier has been verified and is ready for commerce.',
        type: 'system',
        isRead: false
      });
      await Notification.create({
        recipient: vendor._id,
        title: 'New Order Received',
        message: 'Order #ORD-2026-002 has been placed and requires fulfillment.',
        type: 'order',
        isRead: false
      });
      console.log('✅ Seeded initial Notifications for Vendor');
    }

    console.log('\n✨ Database seeding completed successfully!');
    console.log('====================================================');
    console.log('🔑 TEST CREDENTIALS:');
    console.log('   VENDOR:   vendor@atelier.com / vendor123');
    console.log('   ADMIN:    admin@atelier.com  / admin123');
    console.log('   CUSTOMER: client@atelier.com / password123');
    console.log('====================================================');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

// Execute if run directly
if (process.argv[1]?.includes('seedDevData')) {
  seedDevData().then(() => process.exit(0));
}
