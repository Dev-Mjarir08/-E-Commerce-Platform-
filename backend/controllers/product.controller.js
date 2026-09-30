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
    if (input && mongoose.Types.ObjectId.isValid(input)) {
      const existing = await Store.findById(input);
      if (existing) return existing._id;
    }
    if (user?._id) {
      const userStore = await Store.findOne({ owner: user._id });
      if (userStore) return userStore._id;
    }
    const name = input || 'Atelier Flagship Store';
    let store = await Store.findOne({ $or: [{ name }, { slug: slugify(name) }] });
    if (!store) {
      const owner = user?._id || (await User.findOne({ role: { $in: ['admin', 'vendor'] } }))?._id || new mongoose.Types.ObjectId();
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
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({
          $or: [{ slug: category.toLowerCase() }, { name: new RegExp(`^${category}$`, 'i') }]
        });
        if (cat) query.category = cat._id;
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

    if (products.length === 0) return res.status(404).json({ success: false, message: 'No matching products found.' });

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
    let items = req.body;
    if (typeof items === 'string') {
      try { items = JSON.parse(items); } catch { }
    }
    if (items?.products) items = items.products;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of products.' });
    }

    const processed = [];
    const errors = [];

    for (let i = 0; i < items.length; i++) {
      const p = items[i];
      try {
        if (!p?.title || p.basePrice == null) {
          errors.push({ index: i, error: 'Title and basePrice are required.' });
          continue;
        }

        const [storeId, categoryId] = await Promise.all([
          resolveStore(p.store, req.user),
          resolveCategory(p.category)
        ]);

        const imgList = normalizeImages(p.images || p.image);

        let existing = null;
        if (p.sku) existing = await Product.findOne({ sku: String(p.sku).trim() });
        if (!existing && p.slug) existing = await Product.findOne({ slug: slugify(p.slug) });

        if (existing) {
          existing.title = p.title.trim();
          existing.basePrice = Number(p.basePrice);
          if (p.discountPrice !== undefined) existing.discountPrice = p.discountPrice ? Number(p.discountPrice) : null;
          if (p.stock !== undefined) existing.stock = Number(p.stock);
          if (p.description) existing.description = p.description;
          if (p.brand) existing.brand = p.brand;
          if (imgList.length > 0) existing.images = imgList;
          if (storeId) existing.store = storeId;
          if (categoryId) existing.category = categoryId;
          await existing.save();
          processed.push(existing);
        } else {
          const uniqueSlug = await getUniqueSlug(p.slug || p.title);
          let finalSku = p.sku ? String(p.sku).trim() : `SKU-${Date.now().toString().slice(-4)}${i}`;
          let c = 1;
          while (await Product.findOne({ sku: finalSku })) {
            finalSku = `${p.sku || 'SKU'}-${Date.now().toString().slice(-3)}-${c++}`;
          }

          const doc = new Product({
            store: storeId,
            category: categoryId,
            title: p.title.trim(),
            slug: uniqueSlug,
            description: p.description || `${p.title} handcrafted with premium materials.`,
            brand: p.brand || 'Atelier Studio',
            sku: finalSku,
            basePrice: Number(p.basePrice),
            discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
            stock: p.stock != null ? Number(p.stock) : 20,
            hasVariants: Boolean(p.hasVariants),
            images: imgList,
            attributes: Array.isArray(p.attributes) ? p.attributes : [],
            tags: Array.isArray(p.tags) ? p.tags.map((t) => String(t).toLowerCase()) : ['catalog'],
            ratingsAverage: p.ratingsAverage || 4.8,
            numReviews: p.numReviews || Math.floor(10 + Math.random() * 30),
            isFeatured: Boolean(p.isFeatured),
            isActive: p.isActive !== false
          });

          await doc.save();
          processed.push(doc);
        }
      } catch (err) {
        errors.push({ index: i, title: p?.title, error: err.message });
      }
    }

    return res.status(201).json({
      success: true,
      message: `Processed ${processed.length} products.`,
      count: processed.length,
      errors: errors.length > 0 ? errors : undefined,
      data: processed
    });
  } catch (error) {
    console.error('createBulkProducts error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error during bulk creation.' });
  }
};

export const seedFiftyProducts = async (req, res) => {
  try {
    const { seedProductsData } = await import('../data/seedProductsData.js');
    const createdList = [];

    for (const item of seedProductsData) {
      const [store, category] = await Promise.all([
        resolveStore(item.store, req.user),
        resolveCategory(item.category)
      ]);
      const slug = item.slug || slugify(item.title);

      let existing = await Product.findOne({ $or: [{ slug }, { sku: item.sku }] });

      if (existing) {
        Object.assign(existing, item, { store, category });
        await existing.save();
        createdList.push(existing);
      } else {
        const prod = new Product({ ...item, store, category });
        await prod.save();
        createdList.push(prod);
      }
    }

    return res.status(201).json({
      success: true,
      message: `Seeded ${createdList.length} products!`,
      count: createdList.length,
      data: createdList
    });
  } catch (error) {
    console.error('seedFiftyProducts error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error seeding products.' });
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

