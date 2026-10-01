import mongoose from 'mongoose';
import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';
import Store from '../models/Store.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import { removeImageFile } from '../middlewares/upload.middleware.js';

// --- HELPERS ---

const slugify = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

const getUniqueSlug = async (title, currentId = null) => {
  const base = slugify(title) || `product-${Date.now()}`;
  let slug = base;
  let counter = 1;
  while (await Product.findOne({ slug, ...(currentId ? { _id: { $ne: currentId } } : {}) })) {
    slug = `${base}-${counter++}`;
  }
  return slug;
};

const parseJSON = (val, fallback = []) => {
  if (!val) return fallback;
  if (Array.isArray(val)) return val;
  if (typeof val === 'object') return [val];
  try {
    return JSON.parse(val);
  } catch {
    return typeof val === 'string' && val.includes(',')
      ? val.split(',').map((s) => s.trim()).filter(Boolean)
      : [val];
  }
};

const findProduct = async (id, populate = false) => {
  if (!id) return null;
  const isMongoId = mongoose.Types.ObjectId.isValid(id);
  const query = isMongoId ? { _id: id } : { $or: [{ slug: id }, { sku: id }] };
  let q = Product.findOne(query);
  if (populate) q = q.populate('store', 'name slug logo email phone').populate('category', 'name slug');
  return q;
};

const deleteProductImages = async (images = []) => {
  for (const img of images) {
    const url = typeof img === 'string' ? img : img?.url;
    const publicId = typeof img === 'object' ? img?.public_id : null;
    if (url) await removeImageFile(url, publicId);
  }
};

const normalizeImages = (rawImages, reqFiles = null, existing = []) => {
  let list = [...existing];

  if (rawImages) {
    const parsed = parseJSON(rawImages);
    if (parsed.length > 0) {
      list = parsed.map((item, idx) => ({
        url: typeof item === 'string' ? item : item.url,
        public_id: typeof item === 'object' ? item.public_id || null : null,
        isPrimary: typeof item === 'object' ? Boolean(item.isPrimary) : idx === 0
      }));
    }
  }

  if (reqFiles) {
    if (Array.isArray(reqFiles.images)) {
      reqFiles.images.forEach((f) => {
        list.push({ url: `/uploads/products/${f.filename}`, public_id: null, isPrimary: list.length === 0 });
      });
    }
    if (Array.isArray(reqFiles.image) && reqFiles.image.length > 0) {
      list.unshift({ url: `/uploads/products/${reqFiles.image[0].filename}`, public_id: null, isPrimary: true });
    }
  }

  if (list.length === 0) {
    list.push({
      url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      public_id: null,
      isPrimary: true
    });
  }

  if (!list.some((i) => i.isPrimary)) list[0].isPrimary = true;
  return list;
};

const resolveStore = async (input, user) => {
  try {
    // 1. If explicit valid Store ObjectId was provided in the product payload
    if (input && mongoose.Types.ObjectId.isValid(input)) {
      const existing = await Store.findById(input);
      if (existing) return existing._id;
    }

    // 2. If logged in vendor/admin is importing products, associate with their store
    if (user?._id) {
      let userStore = await Store.findOne({ owner: user._id });
      if (!userStore) {
        // Automatically create a boutique storefront for the logged-in vendor
        const storeName = `${user.name || 'Vendor'}'s Boutique`;
        userStore = await Store.create({
          owner: user._id,
          name: storeName,
          slug: `${slugify(storeName)}-${Date.now().toString().slice(-4)}`,
          description: 'Official verified boutique storefront catalog',
          status: 'active',
          isVerified: true
        });
      }
      return userStore._id;
    }

    // 3. Fallback to store name match or default flagship store
    const name = input || 'Atelier Flagship Store';
    let store = await Store.findOne({ $or: [{ name }, { slug: slugify(name) }] });
    if (!store) {
      const owner = (await User.findOne({ role: { $in: ['admin', 'vendor'] } }))?._id || new mongoose.Types.ObjectId();
      store = await Store.create({
        owner,
        name,
        slug: `${slugify(name)}-${Date.now().toString().slice(-4)}`,
        description: 'Official flagship boutique catalog store',
        status: 'active',
        isVerified: true
      });
    }
    return store?._id;
  } catch {
    return (await Store.findOne())?._id || null;
  }
};

const resolveCategory = async (input) => {
  try {
    if (input && mongoose.Types.ObjectId.isValid(input)) {
      const existing = await Category.findById(input);
      if (existing) return existing._id;
    }
    const name = input || 'Outerwear';
    const slug = slugify(name) || 'outerwear';
    let category = await Category.findOne({ $or: [{ slug }, { name: new RegExp(`^${name}$`, 'i') }] });
    if (!category) {
      let uniqueSlug = slug;
      let counter = 1;
      while (await Category.findOne({ slug: uniqueSlug })) uniqueSlug = `${slug}-${counter++}`;
      category = await Category.create({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        slug: uniqueSlug,
        description: `${name} collection catalog`,
        isActive: true
      });
    }
    return category?._id;
  } catch {
    return (await Category.findOne())?._id || null;
  }
};

// --- CONTROLLERS ---

export const getProducts = async (req, res) => {
  try {
    const { search, category, store, brand, minPrice, maxPrice, isFeatured, isActive, sort, page = 1, limit = 100 } = req.query;
    const query = {};

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { description: regex }, { brand: regex }, { sku: regex }, { tags: regex }];
    }

    if (category && category !== 'all') {
      const cleanCat = String(category).trim();
      const slugKey = slugify(cleanCat);
      const altSlug = slugKey.replace(/-and-/g, '-');
      const noApos = slugKey.replace(/'/g, '');

      if (mongoose.Types.ObjectId.isValid(cleanCat)) {
        query.$or = [
          { category: cleanCat },
          { category: new mongoose.Types.ObjectId(cleanCat) }
        ];
      } else {
        const cat = await Category.findOne({
          $or: [
            { slug: cleanCat.toLowerCase() },
            { slug: slugKey },
            { slug: altSlug },
            { slug: noApos },
            { name: new RegExp(`^${cleanCat}$`, 'i') },
            { slug: new RegExp(slugKey, 'i') }
          ]
        });

        if (cat) {
          query.$or = [
            { category: cat._id },
            { tags: cat.slug },
            { tags: cleanCat.toLowerCase() },
            { tags: slugKey },
            { tags: altSlug }
          ];
        } else {
          query.$or = [
            { tags: cleanCat.toLowerCase() },
            { tags: slugKey },
            { tags: new RegExp(cleanCat, 'i') }
          ];
        }
      }
    }

    if (store && store !== 'all') {
      if (mongoose.Types.ObjectId.isValid(store)) {
        query.store = store;
      } else {
        const s = await Store.findOne({ slug: store });
        if (s) query.store = s._id;
      }
    }

    if (brand) query.brand = new RegExp(brand.trim(), 'i');

    if (minPrice != null || maxPrice != null) {
      query.basePrice = {};
      if (minPrice != null) query.basePrice.$gte = Number(minPrice);
      if (maxPrice != null) query.basePrice.$lte = Number(maxPrice);
    }

    if (isFeatured != null) query.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (isActive != null) query.isActive = isActive === 'true' || isActive === true;

    const sortMap = {
      price_asc: { basePrice: 1 },
      price_desc: { basePrice: -1 },
      oldest: { createdAt: 1 },
      rating: { ratingsAverage: -1 },
      title_asc: { title: 1 }
    };
    const sortOption = sortMap[sort] || { createdAt: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [totalCount, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .populate('store', 'name slug logo')
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
    ]);

    return res.status(200).json({
      success: true,
      count: products.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: products
    });
  } catch (error) {
    console.error('getProducts error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error fetching products.' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await findProduct(req.params.id, true);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('getProductById error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error fetching product.' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      name,
      slug,
      description,
      desc,
      brand,
      sku,
      category,
      store,
      basePrice,
      price,
      discountPrice,
      comparePrice,
      stock,
      stockQuantity,
      hasVariants,
      attributes,
      tags,
      isFeatured,
      isActive,
      status,
      images: rawImages
    } = req.body;

    const resolvedTitle = (title || name || '').trim();
    const resolvedDesc = (description || desc || 'Curated luxury fashion and lifestyle atelier consignment.').trim();
    const resolvedBasePrice = basePrice != null && basePrice !== ''
      ? Number(basePrice)
      : (price != null && price !== '' ? Number(price) : null);

    if (!resolvedTitle || resolvedBasePrice == null || isNaN(resolvedBasePrice)) {
      return res.status(400).json({ success: false, message: 'Title/name and basePrice/price are required.' });
    }

    const [resolvedStore, resolvedCategory] = await Promise.all([
      resolveStore(store, req.user),
      resolveCategory(category)
    ]);

    if (!resolvedStore || !resolvedCategory) {
      return res.status(400).json({ success: false, message: 'Invalid store or category reference.' });
    }

    const uniqueSlug = slug ? await getUniqueSlug(slug) : await getUniqueSlug(resolvedTitle);
    const finalSku = (sku && String(sku).trim()) || `SKU-${Date.now().toString().slice(-6)}`;
    const imageList = normalizeImages(rawImages, req.files);

    const resolvedDiscountPrice = discountPrice != null && discountPrice !== ''
      ? Number(discountPrice)
      : (comparePrice != null && comparePrice !== '' ? Number(comparePrice) : null);

    const resolvedStock = stock != null && stock !== ''
      ? Math.max(0, parseInt(stock, 10))
      : (stockQuantity != null && stockQuantity !== '' ? Math.max(0, parseInt(stockQuantity, 10)) : 15);

    const resolvedIsActive = isActive != null
      ? (isActive !== 'false' && isActive !== false)
      : (status ? status.toLowerCase() === 'active' : true);

    const resolvedIsFeatured = isFeatured != null
      ? (isFeatured === 'true' || isFeatured === true)
      : true;

    const product = new Product({
      store: resolvedStore,
      category: resolvedCategory,
      title: resolvedTitle,
      slug: uniqueSlug,
      description: resolvedDesc,
      brand: (brand && String(brand).trim()) || 'Atelier Studio',
      sku: finalSku,
      basePrice: resolvedBasePrice,
      discountPrice: resolvedDiscountPrice,
      stock: resolvedStock,
      hasVariants: hasVariants === 'true' || hasVariants === true,
      images: imageList,
      attributes: parseJSON(attributes).filter((a) => a && a.name && a.value),
      tags: parseJSON(tags).map((t) => String(t).trim().toLowerCase()),
      isFeatured: resolvedIsFeatured,
      isActive: resolvedIsActive
    });

    await product.save();
    const populated = await Product.findById(product._id).populate('store category');

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: populated,
      product: populated
    });
  } catch (error) {
    console.error('createProduct error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error creating product.' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await findProduct(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const { title, slug, description, brand, sku, category, store, basePrice, discountPrice, stock, hasVariants, attributes, tags, isFeatured, isActive, images: rawImages, deletedImageUrls } = req.body;

    if (title !== undefined) product.title = title.trim();
    if (description !== undefined) product.description = description.trim();
    if (brand !== undefined) product.brand = brand.trim();
    if (sku !== undefined) product.sku = sku.trim();
    if (slug !== undefined) product.slug = await getUniqueSlug(slug, product._id);
    if (basePrice !== undefined) product.basePrice = Number(basePrice);
    if (discountPrice !== undefined) product.discountPrice = discountPrice ? Number(discountPrice) : null;
    if (stock !== undefined) product.stock = Math.max(0, parseInt(stock, 10));
    if (hasVariants !== undefined) product.hasVariants = Boolean(hasVariants);
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);
    if (isActive !== undefined) product.isActive = Boolean(isActive);

    if (category) product.category = await resolveCategory(category);
    if (store) product.store = await resolveStore(store, req.user);
    if (attributes !== undefined) product.attributes = parseJSON(attributes).filter((a) => a && a.name && a.value);
    if (tags !== undefined) product.tags = parseJSON(tags).map((t) => String(t).trim().toLowerCase());

    if (deletedImageUrls) {
      const toDelete = parseJSON(deletedImageUrls);
      await deleteProductImages(toDelete);
      const deleteUrls = new Set(toDelete.map((i) => (typeof i === 'string' ? i : i?.url)));
      product.images = product.images.filter((img) => !deleteUrls.has(img.url));
    }

    product.images = normalizeImages(rawImages, req.files, product.images);

    await product.save();
    const populated = await Product.findById(product._id).populate('store category');

    return res.status(200).json({ success: true, message: 'Product updated successfully.', data: populated });
  } catch (error) {
    console.error('updateProduct error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error updating product.' });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const { imageUrl, imageId } = req.body;
    const product = await findProduct(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const imgIndex = product.images.findIndex((img) => {
      if (imageId && img._id && img._id.toString() === imageId.toString()) return true;
      return imageUrl && img.url === imageUrl;
    });

    if (imgIndex === -1) return res.status(404).json({ success: false, message: 'Image not found in product.' });

    const [removed] = product.images.splice(imgIndex, 1);
    await removeImageFile(removed.url, removed.public_id);

    if (removed.isPrimary && product.images.length > 0) product.images[0].isPrimary = true;

    await product.save();
    return res.status(200).json({ success: true, message: 'Image removed successfully.', data: product.images });
  } catch (error) {
    console.error('deleteProductImage error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error removing image.' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await findProduct(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    await deleteProductImages(product.images);
    await Product.findByIdAndDelete(product._id);

    return res.status(200).json({ success: true, message: `Product '${product.title}' deleted successfully.` });
  } catch (error) {
    console.error('deleteProduct error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error deleting product.' });
  }
};

export const deleteMultipleProducts = async (req, res) => {
  try {
    const rawIds = req.body?.ids || req.body?.productIds || req.body;
    const idList = parseJSON(rawIds);

    if (idList.length === 0) return res.status(400).json({ success: false, message: 'Array of product IDs required.' });

    const validObjectIds = idList.filter((id) => mongoose.Types.ObjectId.isValid(id));
    const stringIds = idList.filter((id) => typeof id === 'string' && !mongoose.Types.ObjectId.isValid(id));

    const products = await Product.find({
      $or: [{ _id: { $in: validObjectIds } }, { slug: { $in: stringIds } }, { sku: { $in: stringIds } }]
    });

    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No matching products found to delete.',
        deletedCount: 0,
        deletedIds: []
      });
    }

    for (const prod of products) await deleteProductImages(prod.images);

    const matchedIds = products.map((p) => p._id);
    await Product.deleteMany({ _id: { $in: matchedIds } });

    return res.status(200).json({
      success: true,
      message: `Deleted ${products.length} products.`,
      deletedCount: products.length,
      deletedIds: matchedIds
    });
  } catch (error) {
    console.error('deleteMultipleProducts error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error deleting products.' });
  }
};

export const clearAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({}, '_id images');
    for (const prod of allProducts) await deleteProductImages(prod.images);
    await Product.deleteMany({});

    return res.status(200).json({
      success: true,
      message: `Catalog cleared. Removed ${allProducts.length} products.`,
      deletedCount: allProducts.length
    });
  } catch (error) {
    console.error('clearAllProducts error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error clearing catalog.' });
  }
};

export const createBulkProducts = async (req, res) => {
  try {
    // Step 1: Normalize incoming payload (accepts array or { products: [...] })
    let items = req.body;
    if (typeof items === 'string') {
      try { items = JSON.parse(items); } catch { }
    }
    if (items?.products) items = items.products;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of products or an object containing a "products" list.'
      });
    }

    // Step 2: Pre-fetch stores, categories, and existing product identifiers in parallel (fast!)
    const [defaultStoreId, allStores, allCategories, existingProducts] = await Promise.all([
      resolveStore(null, req.user),
      Store.find({}, '_id name slug'),
      Category.find({}, '_id name slug'),
      Product.find({}, '_id slug sku store')
    ]);

    const storeMap = new Map();
    allStores.forEach((s) => {
      storeMap.set(s._id.toString(), s._id);
      storeMap.set(s.slug, s._id);
      storeMap.set(s.name.toLowerCase(), s._id);
    });

    const categoryMap = new Map();
    allCategories.forEach((c) => {
      categoryMap.set(c._id.toString(), c._id);
      categoryMap.set(c.slug, c._id);
      categoryMap.set(c.name.toLowerCase(), c._id);
    });

    // Default category fallback
    let fallbackCatId = allCategories[0]?._id;
    if (!fallbackCatId) {
      const createdFallback = await Category.create({
        name: 'General',
        slug: 'general',
        description: 'General product collection',
        isActive: true
      });
      fallbackCatId = createdFallback._id;
      categoryMap.set(createdFallback._id.toString(), createdFallback._id);
    }

    // Existing products lookup tables (in-memory O(1))
    const existingSkuMap = new Map();
    const existingSlugMap = new Map();
    const existingIdMap = new Map();

    existingProducts.forEach((p) => {
      existingIdMap.set(p._id.toString(), p);
      if (p.sku) existingSkuMap.set(String(p.sku).trim(), p);
      if (p.slug) existingSlugMap.set(String(p.slug).trim(), p);
    });

    const bulkOps = [];
    const processed = [];
    const errors = [];

    const getCategoryId = (catVal) => {
      if (!catVal) return fallbackCatId;
      if (categoryMap.has(catVal?.toString?.())) return categoryMap.get(catVal.toString());
      const key = String(catVal).trim().toLowerCase();
      if (categoryMap.has(key)) return categoryMap.get(key);
      return fallbackCatId;
    };

    const getStoreId = (storeVal) => {
      if (!storeVal) return defaultStoreId;
      if (storeMap.has(storeVal?.toString?.())) return storeMap.get(storeVal.toString());
      const key = String(storeVal).trim().toLowerCase();
      if (storeMap.has(key)) return storeMap.get(key);
      return defaultStoreId;
    };

    // Step 3: Fast in-memory document preparation
    for (let i = 0; i < items.length; i++) {
      const p = items[i];
      try {
        const title = (p?.title || p?.name || '').trim();
        const rawPrice = p?.basePrice != null ? p.basePrice : p?.price;

        if (!title || rawPrice == null) {
          errors.push({
            index: i,
            title: title || `Item #${i + 1}`,
            error: 'Product title (or name) and basePrice (or price) are required.'
          });
          continue;
        }

        const storeId = getStoreId(p.store);
        const categoryId = getCategoryId(p.category || p.categoryName);

        const basePriceNum = Number(rawPrice) || 0;
        let discountPriceNum = p.discountPrice != null
          ? Number(p.discountPrice)
          : (p.compareAtPrice != null ? Number(p.compareAtPrice) : null);

        // Schema constraint: discountPrice must be <= basePrice
        if (discountPriceNum != null && discountPriceNum > basePriceNum) {
          discountPriceNum = null;
        }

        const stockNum = p.stock != null
          ? Math.max(0, parseInt(p.stock, 10))
          : (p.quantity != null ? Math.max(0, parseInt(p.quantity, 10)) : 25);

        // Normalize images
        const rawImages = p.images || p.image || p.imageUrl || [];
        let imgList = normalizeImages(rawImages);
        if (imgList.length === 0) {
          imgList = [{
            url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800',
            public_id: null,
            isPrimary: true
          }];
        }

        // Check if item already exists by _id, sku, or slug
        let existingMatch = null;
        if (p._id && existingIdMap.has(String(p._id))) {
          existingMatch = existingIdMap.get(String(p._id));
        } else if (p.sku && existingSkuMap.has(String(p.sku).trim())) {
          existingMatch = existingSkuMap.get(String(p.sku).trim());
        } else if (p.slug && existingSlugMap.has(slugify(p.slug))) {
          existingMatch = existingSlugMap.get(slugify(p.slug));
        }

        const cleanAttributes = Array.isArray(p.attributes)
          ? p.attributes.filter((a) => a && a.name && a.value)
          : [];
        const cleanTags = Array.isArray(p.tags)
          ? p.tags.map((t) => String(t).trim().toLowerCase())
          : ['catalog', 'boutique'];

        if (existingMatch) {
          // Prepare update operation (prevents duplicate key errors!)
          const updateDoc = {
            title,
            basePrice: basePriceNum,
            discountPrice: discountPriceNum,
            stock: stockNum,
            description: p.description || existingMatch.description || `${title} from our curated boutique collection.`,
            brand: (p.brand && String(p.brand).trim()) || existingMatch.brand || 'Atelier Studio',
            hasVariants: Boolean(p.hasVariants),
            images: imgList,
            attributes: cleanAttributes,
            tags: cleanTags,
            ratingsAverage: Number(p.ratingsAverage) || existingMatch.ratingsAverage || 4.5,
            numReviews: Number(p.numReviews) || existingMatch.numReviews || 12,
            isFeatured: Boolean(p.isFeatured),
            isActive: p.isActive !== false,
            store: storeId,
            category: categoryId
          };

          bulkOps.push({
            updateOne: {
              filter: { _id: existingMatch._id },
              update: { $set: updateDoc }
            }
          });

          processed.push({ _id: existingMatch._id, title, status: 'updated' });
        } else {
          // Generate unique slug in-memory
          let baseSlug = slugify(p.slug || title) || `product-${Date.now()}`;
          let uniqueSlug = baseSlug;
          let sc = 1;
          while (existingSlugMap.has(uniqueSlug)) {
            uniqueSlug = `${baseSlug}-${sc++}`;
          }
          existingSlugMap.set(uniqueSlug, true);

          // Generate unique SKU in-memory
          let finalSku = p.sku ? String(p.sku).trim() : `SKU-${Date.now().toString().slice(-4)}${i}`;
          let kc = 1;
          while (existingSkuMap.has(finalSku)) {
            finalSku = `${p.sku || 'SKU'}-${Date.now().toString().slice(-3)}-${kc++}`;
          }
          existingSkuMap.set(finalSku, true);

          const newDoc = {
            store: storeId,
            category: categoryId,
            title,
            slug: uniqueSlug,
            description: p.description || `${title} from our curated boutique collection.`,
            brand: (p.brand && String(p.brand).trim()) || 'Atelier Studio',
            sku: finalSku,
            basePrice: basePriceNum,
            discountPrice: discountPriceNum,
            stock: stockNum,
            hasVariants: Boolean(p.hasVariants),
            images: imgList,
            attributes: cleanAttributes,
            tags: cleanTags,
            ratingsAverage: Number(p.ratingsAverage) || 4.5,
            numReviews: Number(p.numReviews) || Math.floor(10 + Math.random() * 20),
            isFeatured: Boolean(p.isFeatured),
            isActive: p.isActive !== false
          };

          // If valid 24-char ObjectId provided in payload and not conflicting, preserve it
          if (p._id && mongoose.Types.ObjectId.isValid(p._id) && !existingIdMap.has(String(p._id))) {
            newDoc._id = new mongoose.Types.ObjectId(p._id);
            existingIdMap.set(String(p._id), true);
          }

          bulkOps.push({
            insertOne: {
              document: newDoc
            }
          });

          processed.push({ title, sku: finalSku, status: 'created' });
        }
      } catch (err) {
        errors.push({ index: i, title: p?.title || `Item #${i + 1}`, error: err.message });
      }
    }

    // Step 4: Execute ultra-fast bulkWrite in a single database network call
    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps, { ordered: false });
    }

    return res.status(201).json({
      success: true,
      message: `Successfully processed ${processed.length} products into boutique catalog.`,
      count: processed.length,
      errors: errors.length > 0 ? errors : undefined,
      data: processed
    });
  } catch (error) {
    console.error('createBulkProducts error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error occurred during bulk product creation.'
    });
  }
};

/**
 * @desc    Get products belonging to current vendor's store
 * @route   GET /api/products/my-products
 * @access  Private (Vendor / Seller / Admin)
 */
export const getMyProducts = async (req, res) => {
  try {
    let store = await Store.findOne({ owner: req.user._id });
    if (!store && (req.user.role === 'admin' || req.user.role === 'vendor' || req.user.role === 'seller')) {
      store = await Store.findOne({ status: 'active' }) || await Store.findOne();
    }

    if (!store) {
      return res.status(200).json({
        success: true,
        count: 0,
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        data: []
      });
    }

    const { search, category, isActive, sort, page = 1, limit = 50 } = req.query;
    const query = { store: store._id };

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { description: regex }, { sku: regex }, { tags: regex }];
    }

    if (category && category !== 'all') {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) query.category = cat._id;
      }
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true' || isActive === true;
    }

    const sortMap = {
      price_asc: { basePrice: 1 },
      price_desc: { basePrice: -1 },
      oldest: { createdAt: 1 },
      stock_asc: { stock: 1 },
      stock_desc: { stock: -1 }
    };
    const sortOption = sortMap[sort] || { createdAt: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [totalCount, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
    ]);

    return res.status(200).json({
      success: true,
      count: products.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: products
    });
  } catch (error) {
    console.error('getMyProducts error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch vendor products.', error: error.message });
  }
};

/**
 * @desc    Toggle or update product active status
 * @route   PATCH /api/products/:id/status
 * @access  Private (Vendor / Seller / Admin)
 */
export const updateProductStatus = async (req, res) => {
  try {
    const product = await findProduct(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    if (req.body.isActive !== undefined) {
      product.isActive = Boolean(req.body.isActive);
    } else if (req.body.status !== undefined) {
      product.isActive = req.body.status === 'active' || req.body.status === true;
    } else {
      product.isActive = !product.isActive;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product status updated to ${product.isActive ? 'active' : 'inactive'}.`,
      data: product
    });
  } catch (error) {
    console.error('updateProductStatus error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update product status.', error: error.message });
  }
};

/**
 * @desc    Upload / add images to product
 * @route   POST /api/products/:id/images
 * @access  Private (Vendor / Seller / Admin)
 */
export const addProductImages = async (req, res) => {
  try {
    const product = await findProduct(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const newImages = normalizeImages(req.body.images || req.body.image, req.files, []);

    if (newImages.length === 0) {
      return res.status(400).json({ success: false, message: 'No images provided.' });
    }

    // Append to existing images
    product.images = [...(product.images || []), ...newImages];
    if (!product.images.some((i) => i.isPrimary) && product.images.length > 0) {
      product.images[0].isPrimary = true;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Images added successfully.',
      data: product.images
    });
  } catch (error) {
    console.error('addProductImages error:', error);
    return res.status(500).json({ success: false, message: 'Failed to add product images.', error: error.message });
  }
};

/**
 * @desc    Delete a specific product image by imageId
 * @route   DELETE /api/products/:id/images/:imageId
 * @access  Private (Vendor / Seller / Admin)
 */
export const deleteProductImageById = async (req, res) => {
  try {
    const product = await findProduct(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const { imageId } = req.params;
    const imgIndex = product.images.findIndex(
      (img) => (img._id && img._id.toString() === imageId) || img.public_id === imageId
    );

    if (imgIndex === -1) {
      return res.status(404).json({ success: false, message: 'Image not found on this product.' });
    }

    const [removed] = product.images.splice(imgIndex, 1);
    await removeImageFile(removed.url, removed.public_id);

    if (removed.isPrimary && product.images.length > 0) {
      product.images[0].isPrimary = true;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product image deleted successfully.',
      data: product.images
    });
  } catch (error) {
    console.error('deleteProductImageById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete product image.', error: error.message });
  }
};

// ==========================================
// PRODUCT VARIANTS CONTROLLERS
// ==========================================

/**
 * @desc    Create product variant
 * @route   POST /api/products/:productId/variants
 * @access  Private (Vendor / Seller / Admin)
 */
export const createProductVariant = async (req, res) => {
  try {
    const product = await findProduct(req.params.productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const { title, sku, price, discountPrice, stock, images, attributes, isActive } = req.body;

    if (!title || price == null) {
      return res.status(400).json({ success: false, message: 'Variant title and price are required.' });
    }

    let variantSku = sku ? sku.trim() : `${product.sku || 'VAR'}-${Date.now().toString().slice(-4)}`;
    let counter = 1;
    while (await ProductVariant.findOne({ sku: variantSku })) {
      variantSku = `${sku || product.sku || 'VAR'}-${Date.now().toString().slice(-3)}-${counter++}`;
    }

    let parsedAttributes = parseJSON(attributes);
    if (!Array.isArray(parsedAttributes) || parsedAttributes.length === 0) {
      parsedAttributes = [{ name: 'Default', value: title }];
    }

    const variant = new ProductVariant({
      product: product._id,
      title: title.trim(),
      sku: variantSku,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: stock != null ? Math.max(0, parseInt(stock, 10)) : 0,
      images: parseJSON(images),
      attributes: parsedAttributes,
      isActive: isActive !== false
    });

    await variant.save();

    if (!product.hasVariants) {
      product.hasVariants = true;
      await product.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Product variant created successfully.',
      data: variant
    });
  } catch (error) {
    console.error('createProductVariant error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create product variant.', error: error.message });
  }
};

/**
 * @desc    Get all variants for a product
 * @route   GET /api/products/:productId/variants
 * @access  Public / Private
 */
export const getProductVariants = async (req, res) => {
  try {
    const product = await findProduct(req.params.productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const variants = await ProductVariant.find({ product: product._id }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: variants.length,
      data: variants
    });
  } catch (error) {
    console.error('getProductVariants error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch product variants.', error: error.message });
  }
};

/**
 * @desc    Get single product variant
 * @route   GET /api/products/:productId/variants/:variantId
 * @access  Public / Private
 */
export const getProductVariantById = async (req, res) => {
  try {
    const variant = await ProductVariant.findOne({
      _id: req.params.variantId,
      product: req.params.productId
    });

    if (!variant) {
      return res.status(404).json({ success: false, message: 'Product variant not found.' });
    }

    return res.status(200).json({
      success: true,
      data: variant
    });
  } catch (error) {
    console.error('getProductVariantById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch variant.', error: error.message });
  }
};

/**
 * @desc    Update a product variant
 * @route   PATCH /api/products/:productId/variants/:variantId
 * @access  Private (Vendor / Seller / Admin)
 */
export const updateProductVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findOne({
      _id: req.params.variantId,
      product: req.params.productId
    });

    if (!variant) {
      return res.status(404).json({ success: false, message: 'Product variant not found.' });
    }

    const { title, sku, price, discountPrice, stock, images, attributes, isActive } = req.body;

    if (title !== undefined) variant.title = title.trim();
    if (sku !== undefined) variant.sku = sku.trim();
    if (price !== undefined) variant.price = Number(price);
    if (discountPrice !== undefined) variant.discountPrice = discountPrice ? Number(discountPrice) : null;
    if (stock !== undefined) variant.stock = Math.max(0, parseInt(stock, 10));
    if (images !== undefined) variant.images = parseJSON(images);
    if (attributes !== undefined) variant.attributes = parseJSON(attributes);
    if (isActive !== undefined) variant.isActive = Boolean(isActive);

    await variant.save();

    return res.status(200).json({
      success: true,
      message: 'Product variant updated successfully.',
      data: variant
    });
  } catch (error) {
    console.error('updateProductVariant error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update variant.', error: error.message });
  }
};

/**
 * @desc    Delete a product variant
 * @route   DELETE /api/products/:productId/variants/:variantId
 * @access  Private (Vendor / Seller / Admin)
 */
export const deleteProductVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findOneAndDelete({
      _id: req.params.variantId,
      product: req.params.productId
    });

    if (!variant) {
      return res.status(404).json({ success: false, message: 'Product variant not found.' });
    }

    // Check if remaining variants exist
    const remainingCount = await ProductVariant.countDocuments({ product: req.params.productId });
    if (remainingCount === 0) {
      await Product.findByIdAndUpdate(req.params.productId, { hasVariants: false });
    }

    return res.status(200).json({
      success: true,
      message: 'Product variant deleted successfully.'
    });
  } catch (error) {
    console.error('deleteProductVariant error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete variant.', error: error.message });
  }
};

