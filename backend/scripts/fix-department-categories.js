import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const DEPARTMENT_DEFS = [
  { name: 'Televisions & Home Theater', slug: 'televisions-home-theater', tags: ['televisions-home-theater', 'televisions-and-home-theater', 'tv', 'television', 'smart-tv'] },
  { name: "Men's Shirts", slug: 'mens-shirts', tags: ['mens-shirts', "men's-shirts", 'shirt', 'formal-shirt', 'casual-shirt'] },
  { name: "Women's Dresses", slug: 'womens-dresses', tags: ['womens-dresses', "women's-dresses", 'dress', 'gown', 'saree', 'kurti'] },
  { name: "Boys' Clothing", slug: 'boys-clothing', tags: ['boys-clothing', "boys'-clothing", 'dungaree', 'kids'] },
  { name: "Men's Shoes", slug: 'mens-shoes', tags: ['mens-shoes', "men's-shoes", 'sneakers', 'loafers', 'shoes'] },
  { name: 'Backpacks', slug: 'backpacks', tags: ['backpacks', 'backpack', 'rucksack', 'school-bag'] },
  { name: 'Watches & Horology', slug: 'watches', tags: ['watches', 'watch', 'timepiece', 'chronograph'] },
  { name: 'Glasses & Sunglasses', slug: 'glasses-sunglasses', tags: ['glasses-sunglasses', 'sunglasses', 'aviator', 'shades', 'eyewear'] },
  { name: 'Jewelry & Accessories', slug: 'jewelry-accessories', tags: ['jewelry-accessories', 'jewelry', 'pendant', 'necklace', 'earrings', 'bracelet'] },
  { name: 'Makeup & Cosmetics', slug: 'makeup', tags: ['makeup', 'cosmetics', 'lipstick', 'foundation', 'mascara'] },
  { name: 'Mobiles & Smartphones', slug: 'mobiles', tags: ['mobiles', 'mobile', 'smartphone', 'phone', '5g'] },
  { name: 'Books & Stationery', slug: 'books-stationery', tags: ['books-stationery', 'books', 'book', 'stationery', 'novel', 'guide'] },
  { name: 'Toys & Games', slug: 'toys-games', tags: ['toys-games', 'toys', 'toy', 'games', 'game', 'play-doh', 'board-game'] },
  { name: "Women's Jeans & Pants", slug: 'womens-jeans-pants', tags: ['womens-jeans-pants', "women's-jeans-pants", 'trousers', 'jeans', 'pants'] },
  { name: 'Travel Bags & Luggage', slug: 'travel-bags', tags: ['travel-bags', 'luggage', 'suitcase', 'trolley'] },
  { name: 'Sports Shoes', slug: 'sports-shoes', tags: ['sports-shoes', 'running-shoes', 'trainers', 'cleats'] },
  { name: 'Sports & Fitness', slug: 'sports-fitness', tags: ['sports-fitness', 'fitness', 'exercise', 'dumbbell', 'gym', 'racket'] },
  { name: 'Home Decor & Living', slug: 'home-decor', tags: ['home-decor', 'decor', 'plant', 'vase', 'cushion', 'curtain'] },
  { name: 'Furniture & Living', slug: 'furniture', tags: ['furniture', 'chair', 'table', 'sofa', 'desk', 'bed', 'mattress'] },
  { name: 'Pet Supplies', slug: 'pet-supplies', tags: ['pet-supplies', 'pet', 'dog', 'cat', 'pedigree', 'whiskas', 'drools'] },
  { name: 'Beauty & Skincare', slug: 'skincare', tags: ['skincare', 'face-wash', 'serum', 'lotion', 'cream', 'sunscreen'] },
  { name: 'Automotive & Tools', slug: 'automotive', tags: ['automotive', 'car', 'bike', 'engine', 'tool', 'accessories'] },
  { name: 'Fragrances & Candles', slug: 'fragrances', tags: ['fragrances', 'perfume', 'deodorant', 'candle', 'diffuser'] }
];

async function fixCategories() {
  await connectDB();

  console.log('Ensuring all core department categories exist...');
  const deptMap = new Map();

  for (const def of DEPARTMENT_DEFS) {
    let cat = await Category.findOne({
      $or: [
        { slug: def.slug },
        { name: def.name }
      ]
    });

    if (!cat) {
      cat = await Category.create({
        name: def.name,
        slug: def.slug,
        description: `Premium collection of ${def.name}`,
        isActive: true
      });
      console.log(`Created department: ${def.name}`);
    } else {
      cat.name = def.name;
      cat.isActive = true;
      await cat.save();
    }

    deptMap.set(def.slug, cat._id);
    for (const tag of def.tags) {
      deptMap.set(tag.toLowerCase(), cat._id);
      deptMap.set(tag.toLowerCase().replace(/'/g, ''), cat._id);
    }
  }

  console.log('Evaluating all products for department assignment...');
  const products = await Product.find({});
  let updatedCount = 0;

  for (const p of products) {
    let targetCatId = null;

    // 1. Check product tags against department definitions
    const tags = Array.isArray(p.tags) ? p.tags.map(t => String(t).trim().toLowerCase()) : [];
    for (const t of tags) {
      if (deptMap.has(t)) {
        targetCatId = deptMap.get(t);
        break;
      }
      const noApos = t.replace(/'/g, '');
      if (deptMap.has(noApos)) {
        targetCatId = deptMap.get(noApos);
        break;
      }
    }

    // 2. If not found in tags, check title keywords
    if (!targetCatId) {
      const titleLower = (p.title || '').toLowerCase();
      for (const def of DEPARTMENT_DEFS) {
        if (def.tags.some(tag => titleLower.includes(tag.replace(/-/g, ' ')))) {
          targetCatId = deptMap.get(def.slug);
          break;
        }
      }
    }

    if (targetCatId) {
      await Product.updateOne({ _id: p._id }, { $set: { category: targetCatId } });
      updatedCount++;
    }
  }

  console.log(`Successfully mapped ${updatedCount} products into real departments!`);

  // Remove orphaned brand categories that have 0 products
  const allCats = await Category.find({});
  let removedCount = 0;
  for (const c of allCats) {
    // If it's not a core department
    const isCore = DEPARTMENT_DEFS.some(d => d.slug === c.slug || d.name === c.name);
    if (!isCore && c.slug !== 'general') {
      const prodCount = await Product.countDocuments({ category: c._id });
      if (prodCount === 0) {
        await Category.deleteOne({ _id: c._id });
        removedCount++;
      }
    }
  }

  console.log(`Cleaned up ${removedCount} unused temporary categories.`);
  process.exit(0);
}

fixCategories().catch((err) => {
  console.error('fixCategories error:', err);
  process.exit(1);
});
