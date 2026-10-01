import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { removeImageFile } from '../middlewares/upload.middleware.js';

// --- UTILITY HELPERS ---

/**
 * Generate a clean URL-friendly slug
 */
const slugify = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Ensure unique slug by appending numeric increment if needed
 */
const getUniqueCategorySlug = async (name, currentId = null) => {
  const base = slugify(name) || `cat-${Date.now()}`;
  let slug = base;
  let counter = 1;

  while (
    await Category.findOne({
      slug,
      ...(currentId ? { _id: { $ne: currentId } } : {})
    })
  ) {
    slug = `${base}-${counter++}`;
  }
  return slug;
};

/**
 * Check if targetParentId is a descendant of categoryId to prevent circular tree loops
 */
const isDescendant = async (categoryId, targetParentId) => {
  if (!targetParentId) return false;
  if (categoryId.toString() === targetParentId.toString()) return true;

  let current = await Category.findById(targetParentId);
  while (current && current.parentCategory) {
    if (current.parentCategory.toString() === categoryId.toString()) {
      return true;
    }
    current = await Category.findById(current.parentCategory);
  }
  return false;
};

/**
 * Helper to process image payload from req.file or req.body
 */
const processCategoryImage = (req) => {
  if (req.file) {
    return {
      url: `/uploads/categories/${req.file.filename}`,
      public_id: null
    };
  }

  if (req.body.image) {
    if (typeof req.body.image === 'string') {
      try {
        const parsed = JSON.parse(req.body.image);
        return {
          url: parsed.url || null,
          public_id: parsed.public_id || null
        };
      } catch {
        return {
          url: req.body.image.trim(),
          public_id: null
        };
      }
    } else if (typeof req.body.image === 'object') {
      return {
        url: req.body.image.url || null,
        public_id: req.body.image.public_id || null
      };
    }
  }

  if (req.body.imageUrl) {
    return {
      url: req.body.imageUrl.trim(),
      public_id: null
    };
  }

  return null;
};

// --- CONTROLLERS ---

/**
 * @desc    Create a new Category
 * @route   POST /api/categories
 * @access  Public / Admin
 */
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, parentCategory, isActive, displayOrder } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.'
      });
    }

    // Validate parent category existence if provided
    let validatedParentId = null;
    if (parentCategory && parentCategory !== 'null' && parentCategory !== 'none') {
      if (!mongoose.Types.ObjectId.isValid(parentCategory)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid parentCategory ID format.'
        });
      }
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res.status(404).json({
          success: false,
          message: 'Specified parent category does not exist.'
        });
      }
      validatedParentId = parentCategory;
    }

    // Slug calculation
    const finalSlug = slug ? await getUniqueCategorySlug(slug) : await getUniqueCategorySlug(name);

    // Process image
    const image = processCategoryImage(req) || {
      url: null,
      public_id: null
    };

    const newCategory = new Category({
      name: name.trim(),
      slug: finalSlug,
      description: description ? description.trim() : '',
      image,
      parentCategory: validatedParentId,
      isActive: isActive !== undefined ? String(isActive) === 'true' || isActive === true : true,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0
    });

    await newCategory.save();

    const populatedCategory = await Category.findById(newCategory._id).populate(
      'parentCategory',
      'name slug'
    );

    return res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: populatedCategory
    });
  } catch (error) {
    console.error('Error creating category:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A category with this slug or name already exists.'
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while creating category.'
    });
  }
};

/**
 * @desc    Get all categories with pagination, search, parent filtering & sorting
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      isActive,
      parentCategory,
      rootOnly,
      sort = 'displayOrder',
      order = 'asc',
      all = 'false'
    } = req.query;

    const query = {};

    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = String(isActive) === 'true';
    }

    // Filter by parent
    if (rootOnly === 'true' || parentCategory === 'null' || parentCategory === 'none') {
      query.parentCategory = null;
    } else if (parentCategory && mongoose.Types.ObjectId.isValid(parentCategory)) {
      query.parentCategory = parentCategory;
    }

    // Search filter (name or description)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { description: searchRegex }, { slug: searchRegex }];
    }

    // Sort setup
    const sortObj = {};
    const sortField = sort || 'displayOrder';
    const sortDirection = order === 'desc' ? -1 : 1;
    sortObj[sortField] = sortDirection;
    if (sortField !== 'createdAt') {
      sortObj.createdAt = 1;
    }

    // If all=true, return unpaginated list for dropdowns
    if (String(all) === 'true') {
      const categories = await Category.find(query)
        .populate('parentCategory', 'name slug')
        .sort(sortObj);

      return res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
      });
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(200, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [categories, totalCategories] = await Promise.all([
      Category.find(query)
        .populate('parentCategory', 'name slug')
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum),
      Category.countDocuments(query)
    ]);

    // Attach product counts
    const categoryIds = categories.map((c) => c._id);
    const productCounts = await Product.aggregate([
      { $match: { category: { $in: categoryIds } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const productCountMap = {};
    productCounts.forEach((item) => {
      productCountMap[item._id.toString()] = item.count;
    });

    const enrichedCategories = categories.map((cat) => {
      const catObj = cat.toObject();
      catObj.productsCount = productCountMap[cat._id.toString()] || 0;
      return catObj;
    });

    return res.status(200).json({
      success: true,
      totalCategories,
      totalPages: Math.ceil(totalCategories / limitNum),
      currentPage: pageNum,
      limit: limitNum,
      count: enrichedCategories.length,
      data: enrichedCategories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching categories.'
    });
  }
};

/**
 * @desc    Get complete hierarchical category tree (Root -> Subcategories -> Sub-subcategories)
 * @route   GET /api/categories/tree
 * @access  Public
 */
export const getCategoryTree = async (req, res) => {
  try {
    const { includeInactive = 'false' } = req.query;
    const query = {};

    if (String(includeInactive) !== 'true') {
      query.isActive = true;
    }

    // Retrieve all categories sorted by displayOrder
    const allCategories = await Category.find(query).sort({ displayOrder: 1, name: 1 }).lean();

    // Fetch product counts per category for rich navigation
    const productCounts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const countMap = new Map();
    productCounts.forEach((p) => countMap.set(p._id.toString(), p.count));

    // Build hierarchical tree
    const categoryMap = new Map();
    const roots = [];

    allCategories.forEach((cat) => {
      cat.productsCount = countMap.get(cat._id.toString()) || 0;
      cat.children = [];
      categoryMap.set(cat._id.toString(), cat);
    });

    allCategories.forEach((cat) => {
      if (cat.parentCategory && categoryMap.has(cat.parentCategory.toString())) {
        categoryMap.get(cat.parentCategory.toString()).children.push(cat);
      } else {
        roots.push(cat);
      }
    });

    return res.status(200).json({
      success: true,
      totalRoots: roots.length,
      totalCategories: allCategories.length,
      data: roots
    });
  } catch (error) {
    console.error('Error building category tree:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while building category tree.'
    });
  }
};

/**
 * @desc    Get single category by MongoDB ID or slug
 * @route   GET /api/categories/:id
 * @access  Public
 */
export const getCategoryByIdOrSlug = async (req, res) => {
  try {
    const { id } = req.params;

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = isMongoId ? { _id: id } : { slug: id.toLowerCase().trim() };

    const category = await Category.findOne(query)
      .populate('parentCategory', 'name slug description image')
      .populate('subCategories', 'name slug image isActive displayOrder');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category not found with identifier '${id}'.`
      });
    }

    // Associated products count
    const productsCount = await Product.countDocuments({ category: category._id });

    const result = category.toObject();
    result.productsCount = productsCount;

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching category.'
    });
  }
};

/**
 * @desc    Update an existing Category
 * @route   PUT /api/categories/:id
 * @access  Public / Admin
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, parentCategory, isActive, displayOrder } = req.body;

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const category = await Category.findOne(isMongoId ? { _id: id } : { slug: id });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category not found with identifier '${id}'.`
      });
    }

    // Name update
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Category name cannot be empty.'
        });
      }
      category.name = name.trim();
    }

    // Slug update
    if (slug !== undefined && slug.trim()) {
      const cleanedSlug = slugify(slug);
      if (cleanedSlug !== category.slug) {
        category.slug = await getUniqueCategorySlug(cleanedSlug, category._id);
      }
    } else if (name && !slug) {
      // If name was updated and no explicit slug given, update slug
      category.slug = await getUniqueCategorySlug(name, category._id);
    }

    // Description update
    if (description !== undefined) {
      category.description = description.trim();
    }

    // Parent category update with loop protection
    if (parentCategory !== undefined) {
      if (!parentCategory || parentCategory === 'null' || parentCategory === 'none') {
        category.parentCategory = null;
      } else {
        if (!mongoose.Types.ObjectId.isValid(parentCategory)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid parentCategory ID format.'
          });
        }

        if (parentCategory.toString() === category._id.toString()) {
          return res.status(400).json({
            success: false,
            message: 'A category cannot be its own parent category.'
          });
        }

        // Circular loop check: cannot set parent to one of its descendants
        const isLoop = await isDescendant(category._id, parentCategory);
        if (isLoop) {
          return res.status(400).json({
            success: false,
            message: 'Cannot set parent to a category that is a descendant of this category.'
          });
        }

        const parentExists = await Category.findById(parentCategory);
        if (!parentExists) {
          return res.status(404).json({
            success: false,
            message: 'Specified parent category does not exist.'
          });
        }

        category.parentCategory = parentCategory;
      }
    }

    // Active status
    if (isActive !== undefined) {
      category.isActive = String(isActive) === 'true' || isActive === true;
    }

    // Display order
    if (displayOrder !== undefined) {
      category.displayOrder = Number(displayOrder);
    }

    // Image update / replacement
    const newImage = processCategoryImage(req);
    if (newImage) {
      // Clean up old image if replaced
      if (category.image && category.image.url && category.image.url !== newImage.url) {
        await removeImageFile(category.image.url, category.image.public_id);
      }
      category.image = newImage;
    }

    await category.save();

    const updatedCategory = await Category.findById(category._id)
      .populate('parentCategory', 'name slug')
      .populate('subCategories', 'name slug image isActive displayOrder');

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A category with this slug already exists.'
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while updating category.'
    });
  }
};

/**
 * @desc    Toggle category active status
 * @route   PATCH /api/categories/:id/status
 * @access  Public / Admin
 */
export const toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, cascade = 'false' } = req.body;

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const category = await Category.findOne(isMongoId ? { _id: id } : { slug: id });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category not found with identifier '${id}'.`
      });
    }

    const nextStatus = isActive !== undefined ? String(isActive) === 'true' || isActive === true : !category.isActive;
    category.isActive = nextStatus;
    await category.save();

    // Optionally cascade status change to subcategories
    if (String(cascade) === 'true') {
      await Category.updateMany({ parentCategory: category._id }, { $set: { isActive: nextStatus } });
    }

    return res.status(200).json({
      success: true,
      message: `Category status updated to ${nextStatus ? 'active' : 'inactive'}.`,
      data: {
        id: category._id,
        name: category.name,
        slug: category.slug,
        isActive: category.isActive
      }
    });
  } catch (error) {
    console.error('Error toggling category status:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while updating category status.'
    });
  }
};

/**
 * @desc    Delete a Category
 * @route   DELETE /api/categories/:id
 * @access  Public / Admin
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { force = 'false', cascade = 'false', reassignProductsTo } = req.query;

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const category = await Category.findOne(isMongoId ? { _id: id } : { slug: id });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category not found with identifier '${id}'.`
      });
    }

    // Check associated products
    const productCount = await Product.countDocuments({ category: category._id });

    if (productCount > 0) {
      if (reassignProductsTo && mongoose.Types.ObjectId.isValid(reassignProductsTo)) {
        const replacementCat = await Category.findById(reassignProductsTo);
        if (!replacementCat) {
          return res.status(400).json({
            success: false,
            message: 'Target replacement category does not exist.'
          });
        }
        await Product.updateMany(
          { category: category._id },
          { $set: { category: replacementCat._id } }
        );
      } else if (String(force) !== 'true') {
        return res.status(400).json({
          success: false,
          message: `Cannot delete category '${category.name}' because it is assigned to ${productCount} product(s). Please reassign them using ?reassignProductsTo=<id> or pass ?force=true.`,
          associatedProductsCount: productCount
        });
      }
    }

    // Check subcategories
    const childCategories = await Category.find({ parentCategory: category._id });

    if (childCategories.length > 0) {
      if (String(cascade) === 'true') {
        // Cascade delete child categories and their images
        for (const child of childCategories) {
          if (child.image && child.image.url) {
            await removeImageFile(child.image.url, child.image.public_id);
          }
          await Category.findByIdAndDelete(child._id);
        }
      } else {
        // Detach subcategories and promote them to root
        await Category.updateMany(
          { parentCategory: category._id },
          { $set: { parentCategory: null } }
        );
      }
    }

    // Remove category image
    if (category.image && category.image.url) {
      await removeImageFile(category.image.url, category.image.public_id);
    }

    await Category.findByIdAndDelete(category._id);

    return res.status(200).json({
      success: true,
      message: `Category '${category.name}' was deleted successfully.`
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while deleting category.'
    });
  }
};

/**
 * @desc    Bulk delete multiple categories
 * @route   POST /api/categories/bulk-delete or DELETE /api/categories/bulk
 * @access  Public / Admin
 */
export const bulkDeleteCategories = async (req, res) => {
  try {
    const ids = req.body?.ids || req.body?.categoryIds || req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of category IDs to delete.'
      });
    }

    const validMongoIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
    const categories = await Category.find({
      $or: [
        ...(validMongoIds.length > 0 ? [{ _id: { $in: validMongoIds } }] : []),
        { slug: { $in: ids } }
      ]
    });

    if (!categories || categories.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No matching categories found in database (they may have already been deleted).',
        deletedCount: 0,
        deletedIds: ids
      });
    }

    const matchedIds = categories.map((c) => c._id);

    // Clean up category image files if any
    for (const cat of categories) {
      if (cat.image && cat.image.url) {
        await removeImageFile(cat.image.url, cat.image.public_id).catch(() => {});
      }
    }

    // Detach subcategories whose parent is being deleted
    await Category.updateMany(
      { parentCategory: { $in: matchedIds } },
      { $set: { parentCategory: null } }
    );

    // Detach deleted categories from products so products aren't orphaned
    await Product.updateMany(
      { category: { $in: matchedIds } },
      { $unset: { category: 1 } }
    );

    const result = await Category.deleteMany({ _id: { $in: matchedIds } });

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} categories.`,
      deletedCount: result.deletedCount,
      deletedIds: ids
    });
  } catch (error) {
    console.error('Error bulk deleting categories:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while bulk deleting categories.'
    });
  }
};

/**
 * @desc    Bulk create categories
 * @route   POST /api/categories/bulk
 * @access  Public / Admin
 */
export const bulkCreateCategories = async (req, res) => {
  try {
    let categories = req.body?.categories;
    if (!categories && Array.isArray(req.body)) {
      categories = req.body;
    }
    if (typeof categories === 'string') {
      try { categories = JSON.parse(categories); } catch { }
    }
    if (categories && !Array.isArray(categories) && Array.isArray(categories?.categories)) {
      categories = categories.categories;
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Expected a non-empty array of categories under the "categories" key or as a direct array.'
      });
    }

    const created = [];
    const errors = [];

    for (let i = 0; i < categories.length; i++) {
      const item = categories[i];
      try {
        if (!item?.name || !item.name.trim()) {
          errors.push({ index: i, item, error: 'Name is required' });
          continue;
        }

        const slug = item.slug
          ? await getUniqueCategorySlug(item.slug)
          : await getUniqueCategorySlug(item.name);

        const img = typeof item.image === 'string'
          ? { url: item.image, public_id: null }
          : (item.image || { url: null, public_id: null });

        const newCat = await Category.create({
          name: item.name.trim(),
          slug,
          description: item.description || '',
          image: img,
          parentCategory: item.parentCategory || null,
          isActive: item.isActive !== undefined ? item.isActive : true,
          displayOrder: item.displayOrder !== undefined ? Number(item.displayOrder) : 0
        });

        created.push(newCat);
      } catch (err) {
        errors.push({ index: i, item, error: err.message });
      }
    }

    return res.status(201).json({
      success: true,
      message: `Successfully created ${created.length} categories.`,
      createdCount: created.length,
      errorCount: errors.length,
      data: created,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error bulk creating categories:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during bulk category creation.'
    });
  }
};

/**
 * @desc    Seed standard e-commerce categories with hierarchies
 * @route   POST /api/categories/seed
 * @access  Public / Admin
 */
export const seedCategories = async (req, res) => {
  try {
    const initialCategories = [
      {
        name: "Men's Fashion",
        slug: 'mens-fashion',
        description: 'Premium apparel, footwear, and accessories tailored for men.',
        image: {
          url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
          public_id: null
        },
        displayOrder: 1,
        subcategories: ['T-Shirts & Polos', 'Shirts', 'Denim & Jeans', 'Jackets & Coats', 'Footwear']
      },
      {
        name: "Women's Fashion",
        slug: 'womens-fashion',
        description: 'Chic, contemporary, and timeless designer clothing for women.',
        image: {
          url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
          public_id: null
        },
        displayOrder: 2,
        subcategories: ['Dresses', 'Tops & Blouses', 'Skirts', 'Pants & Leggings', 'Handbags']
      },
      {
        name: 'Footwear & Sneakers',
        slug: 'footwear-sneakers',
        description: 'Curated athletic, casual, and formal luxury shoes.',
        image: {
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
          public_id: null
        },
        displayOrder: 3,
        subcategories: ['Running Shoes', 'Casual Sneakers', 'Boots', 'Formal Loafers']
      },
      {
        name: 'Accessories & Jewelry',
        slug: 'accessories-jewelry',
        description: 'Signature watches, fine jewelry, sunglasses, and leather belts.',
        image: {
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
          public_id: null
        },
        displayOrder: 4,
        subcategories: ['Watches', 'Sunglasses', 'Wallets & Belts', 'Hats & Caps']
      },
      {
        name: 'Electronics & Gadgets',
        slug: 'electronics-gadgets',
        description: 'Smart tech, high-fidelity audio, and modern lifestyle essentials.',
        image: {
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          public_id: null
        },
        displayOrder: 5,
        subcategories: ['Headphones & Audio', 'Smartwatches', 'Mobile Accessories']
      }
    ];

    let seededCount = 0;

    for (const catData of initialCategories) {
      let root = await Category.findOne({ slug: catData.slug });
      if (!root) {
        root = await Category.create({
          name: catData.name,
          slug: catData.slug,
          description: catData.description,
          image: catData.image,
          displayOrder: catData.displayOrder,
          isActive: true
        });
        seededCount++;
      }

      if (catData.subcategories && catData.subcategories.length > 0) {
        for (let i = 0; i < catData.subcategories.length; i++) {
          const subName = catData.subcategories[i];
          const subSlug = slugify(`${catData.slug}-${subName}`);
          const subExists = await Category.findOne({ slug: subSlug });
          if (!subExists) {
            await Category.create({
              name: subName,
              slug: subSlug,
              description: `${subName} under ${catData.name}`,
              parentCategory: root._id,
              displayOrder: i + 1,
              isActive: true
            });
            seededCount++;
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Category seed completed. Created/ensured ${seededCount} categories and subcategories.`,
      seededCount
    });
  } catch (error) {
    console.error('Error seeding categories:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while seeding categories.'
    });
  }
};
