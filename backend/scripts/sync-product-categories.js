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

const slugify = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

const toTitleCase = (str = '') =>
  str
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bAnd\b/gi, '&');

async function syncCategories() {
  await connectDB();

  console.log('Fetching all categories...');
  const categories = await Category.find({});
  console.log(`Found ${categories.length} categories.`);

  const categoryMap = new Map();
  const registerCategory = (cat) => {
    const id = cat._id;
    categoryMap.set(id.toString(), id);
    categoryMap.set(cat.slug, id);
    categoryMap.set(cat.name.toLowerCase(), id);
    categoryMap.set(slugify(cat.name), id);
    categoryMap.set(slugify(cat.slug), id);
    categoryMap.set(cat.slug.replace(/-and-/g, '-'), id);
    categoryMap.set(cat.slug.replace(/'/g, ''), id);
    categoryMap.set(slugify(cat.name).replace(/'/g, ''), id);
  };

  categories.forEach(registerCategory);

  const getOrCreateCategory = async (rawNameOrSlug) => {
    if (!rawNameOrSlug) return null;
    const clean = rawNameOrSlug.toString().trim().toLowerCase();
    const slugKey = slugify(clean);
    const altSlug = slugKey.replace(/-and-/g, '-');
    const noApos = slugKey.replace(/'/g, '');

    if (categoryMap.has(clean)) return categoryMap.get(clean);
    if (categoryMap.has(slugKey)) return categoryMap.get(slugKey);
    if (categoryMap.has(altSlug)) return categoryMap.get(altSlug);
    if (categoryMap.has(noApos)) return categoryMap.get(noApos);

    // Try finding in DB
    const existing = await Category.findOne({
      $or: [
        { slug: slugKey },
        { slug: altSlug },
        { slug: new RegExp(slugKey, 'i') },
        { name: new RegExp(`^${toTitleCase(clean)}$`, 'i') }
      ]
    });

    if (existing) {
      registerCategory(existing);
      return existing._id;
    }

    // Auto-create category
    const catName = toTitleCase(clean);
    const newCat = await Category.create({
      name: catName,
      slug: slugKey,
      description: `Premium curated ${catName} boutique collection`,
      isActive: true
    });

    registerCategory(newCat);
    console.log(`Created new category: "${catName}" (${slugKey})`);
    return newCat._id;
  };

  console.log('Fetching all products...');
  const products = await Product.find({});
  console.log(`Found ${products.length} products to evaluate.`);

  let updatedCount = 0;
  for (const prod of products) {
    let matchedCatId = null;

    // Check tags for category matches
    const tags = Array.isArray(prod.tags) ? prod.tags : [];
    for (const tag of tags) {
      const cleanTag = tag.trim().toLowerCase();
      // Skip brand names or generic words if we have specific tags
      if (['catalog', 'boutique', 'general', 'amazon', 'h', 'play', 'tommy', 'adidas', 'safari', 'samsung', 'decathlon', 'vero', 'javascript'].includes(cleanTag)) {
        continue;
      }
      matchedCatId = await getOrCreateCategory(cleanTag);
      if (matchedCatId) break;
    }

    // If still no category match from specific tags, test all tags
    if (!matchedCatId) {
      for (const tag of tags) {
        matchedCatId = await getOrCreateCategory(tag);
        if (matchedCatId) break;
      }
    }

    if (matchedCatId && prod.category?.toString() !== matchedCatId.toString()) {
      await Product.updateOne({ _id: prod._id }, { $set: { category: matchedCatId } });
      updatedCount++;
    }
  }

  console.log(`Successfully mapped and updated ${updatedCount} products into their proper categories!`);
  process.exit(0);
}

syncCategories().catch((err) => {
  console.error('Error during syncCategories:', err);
  process.exit(1);
});
