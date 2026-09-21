import mongoose from 'mongoose';
import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';
import Store from '../models/Store.js';
import InventoryLog from '../models/InventoryLog.js';

const getVendorStore = async (user) => {
  let store = await Store.findOne({ owner: user._id });
  if (!store && (user.role === 'admin' || user.role === 'vendor' || user.role === 'seller')) {
    store = (await Store.findOne({ status: 'active' })) || (await Store.findOne());
  }
  return store;
};

/**
 * @desc    Get inventory summary and product stock list
 * @route   GET /api/inventory
 * @access  Private (Vendor / Seller / Admin)
 */
export const getInventory = async (req, res) => {
  try {
    const store = await getVendorStore(req.user);
    const query = store ? { store: store._id } : {};

    const { search, status, page = 1, limit = 50 } = req.query;

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { sku: regex }];
    }

    if (status === 'low_stock') {
      query.stock = { $gt: 0, $lte: 5 };
    } else if (status === 'out_of_stock') {
      query.stock = 0;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [totalCount, products, totalInventoryValue, outOfStockCount, lowStockCount] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .select('title slug sku basePrice discountPrice stock hasVariants images isActive createdAt')
        .sort({ stock: 1 })
        .skip(skip)
        .limit(limitNum),
      Product.aggregate([
        { $match: query },
        { $group: { _id: null, totalVal: { $sum: { $multiply: ['$basePrice', '$stock'] } } } }
      ]),
      Product.countDocuments({ ...query, stock: 0 }),
      Product.countDocuments({ ...query, stock: { $gt: 0, $lte: 5 } })
    ]);

    // Populate variant counts for products that have variants
    const productsWithVariants = await Promise.all(
      products.map(async (p) => {
        const prodObj = p.toObject();
        if (prodObj.hasVariants) {
          prodObj.variants = await ProductVariant.find({ product: p._id }).select('title sku price stock isActive');
        }
        return prodObj;
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalProducts: totalCount,
          totalValue: totalInventoryValue[0]?.totalVal || 0,
          outOfStockCount,
          lowStockCount
        },
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          totalCount
        },
        products: productsWithVariants
      }
    });
  } catch (error) {
    console.error('getInventory error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch inventory.', error: error.message });
  }
};

/**
 * @desc    Get products with low stock (<= 5)
 * @route   GET /api/inventory/low-stock
 * @access  Private (Vendor / Seller / Admin)
 */
export const getLowStockInventory = async (req, res) => {
  try {
    const store = await getVendorStore(req.user);
    const threshold = parseInt(req.query.threshold, 10) || 5;
    const query = {
      ...(store ? { store: store._id } : {}),
      stock: { $gt: 0, $lte: threshold }
    };

    const products = await Product.find(query)
      .select('title slug sku basePrice stock hasVariants images store')
      .populate('store', 'name')
      .sort({ stock: 1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      threshold,
      data: products
    });
  } catch (error) {
    console.error('getLowStockInventory error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch low stock inventory.', error: error.message });
  }
};

/**
 * @desc    Get products out of stock (stock == 0)
 * @route   GET /api/inventory/out-of-stock
 * @access  Private (Vendor / Seller / Admin)
 */
export const getOutOfStockInventory = async (req, res) => {
  try {
    const store = await getVendorStore(req.user);
    const query = {
      ...(store ? { store: store._id } : {}),
      stock: 0
    };

    const products = await Product.find(query)
      .select('title slug sku basePrice stock hasVariants images store')
      .populate('store', 'name')
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('getOutOfStockInventory error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch out of stock inventory.', error: error.message });
  }
};

/**
 * @desc    Get product inventory details & variant stocks
 * @route   GET /api/inventory/:productId
 * @access  Private (Vendor / Seller / Admin)
 */
export const getProductInventory = async (req, res) => {
  try {
    const { productId } = req.params;
    const isMongoId = mongoose.Types.ObjectId.isValid(productId);
    const query = isMongoId ? { _id: productId } : { $or: [{ slug: productId }, { sku: productId }] };

    const product = await Product.findOne(query).populate('store', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const [variants, recentLogs] = await Promise.all([
      ProductVariant.find({ product: product._id }),
      InventoryLog.find({ product: product._id })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('performedBy', 'name email')
        .populate('variant', 'title sku')
    ]);

    return res.status(200).json({
      success: true,
      data: {
        product: {
          id: product._id,
          title: product.title,
          sku: product.sku,
          stock: product.stock,
          hasVariants: product.hasVariants,
          basePrice: product.basePrice,
          store: product.store
        },
        variants,
        recentLogs
      }
    });
  } catch (error) {
    console.error('getProductInventory error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch product inventory.', error: error.message });
  }
};

/**
 * @desc    Directly update product stock count
 * @route   PATCH /api/inventory/:productId
 * @access  Private (Vendor / Seller / Admin)
 */
export const updateProductStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock, reason } = req.body;

    if (stock == null || isNaN(stock) || Number(stock) < 0) {
      return res.status(400).json({ success: false, message: 'Valid non-negative stock number required.' });
    }

    const isMongoId = mongoose.Types.ObjectId.isValid(productId);
    const query = isMongoId ? { _id: productId } : { $or: [{ slug: productId }, { sku: productId }] };

    const product = await Product.findOne(query);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const prevStock = product.stock || 0;
    const newStock = Math.max(0, parseInt(stock, 10));
    const qtyChanged = newStock - prevStock;

    product.stock = newStock;
    await product.save();

    const log = await InventoryLog.create({
      product: product._id,
      store: product.store,
      changeType: 'adjustment',
      quantityChanged: qtyChanged,
      previousStock: prevStock,
      newStock,
      reason: reason || 'Manual inventory stock adjustment',
      performedBy: req.user._id
    });

    return res.status(200).json({
      success: true,
      message: `Product stock updated to ${newStock}.`,
      data: {
        productId: product._id,
        stock: product.stock,
        log
      }
    });
  } catch (error) {
    console.error('updateProductStock error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update stock.', error: error.message });
  }
};

/**
 * @desc    Restock product (+ quantity)
 * @route   POST /api/inventory/:productId/restock
 * @access  Private (Vendor / Seller / Admin)
 */
export const restockProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, reason } = req.body;

    const restockQty = parseInt(quantity, 10);
    if (!restockQty || restockQty <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive integer.' });
    }

    const isMongoId = mongoose.Types.ObjectId.isValid(productId);
    const query = isMongoId ? { _id: productId } : { $or: [{ slug: productId }, { sku: productId }] };

    const product = await Product.findOne(query);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const prevStock = product.stock || 0;
    const newStock = prevStock + restockQty;

    product.stock = newStock;
    await product.save();

    const log = await InventoryLog.create({
      product: product._id,
      store: product.store,
      changeType: 'restock',
      quantityChanged: restockQty,
      previousStock: prevStock,
      newStock,
      reason: reason || 'Vendor restock shipment received',
      performedBy: req.user._id
    });

    return res.status(200).json({
      success: true,
      message: `Successfully restocked ${restockQty} units. Total stock: ${newStock}.`,
      data: {
        productId: product._id,
        stock: product.stock,
        log
      }
    });
  } catch (error) {
    console.error('restockProduct error:', error);
    return res.status(500).json({ success: false, message: 'Failed to restock product.', error: error.message });
  }
};

/**
 * @desc    Get inventory history/logs for a product
 * @route   GET /api/inventory/:productId/history
 * @access  Private (Vendor / Seller / Admin)
 */
export const getProductInventoryHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const isMongoId = mongoose.Types.ObjectId.isValid(productId);
    const query = isMongoId ? { _id: productId } : { $or: [{ slug: productId }, { sku: productId }] };

    const product = await Product.findOne(query);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const history = await InventoryLog.find({ product: product._id })
      .sort({ createdAt: -1 })
      .populate('performedBy', 'name email avatar')
      .populate('variant', 'title sku');

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    console.error('getProductInventoryHistory error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch inventory history.', error: error.message });
  }
};

/**
 * @desc    Update stock quantity for a variant
 * @route   PATCH /api/inventory/:productId/variants/:variantId
 * @access  Private (Vendor / Seller / Admin)
 */
export const updateVariantStock = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const { stock, reason } = req.body;

    if (stock == null || isNaN(stock) || Number(stock) < 0) {
      return res.status(400).json({ success: false, message: 'Valid non-negative stock number required.' });
    }

    const [product, variant] = await Promise.all([
      Product.findById(productId),
      ProductVariant.findOne({ _id: variantId, product: productId })
    ]);

    if (!product || !variant) {
      return res.status(404).json({ success: false, message: 'Product or variant not found.' });
    }

    const prevStock = variant.stock || 0;
    const newStock = Math.max(0, parseInt(stock, 10));
    const qtyChanged = newStock - prevStock;

    variant.stock = newStock;
    await variant.save();

    const log = await InventoryLog.create({
      product: product._id,
      variant: variant._id,
      store: product.store,
      changeType: 'adjustment',
      quantityChanged: qtyChanged,
      previousStock: prevStock,
      newStock,
      reason: reason || `Manual variant stock adjustment (${variant.title})`,
      performedBy: req.user._id
    });

    return res.status(200).json({
      success: true,
      message: `Variant '${variant.title}' stock updated to ${newStock}.`,
      data: {
        variantId: variant._id,
        stock: variant.stock,
        log
      }
    });
  } catch (error) {
    console.error('updateVariantStock error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update variant stock.', error: error.message });
  }
};

/**
 * @desc    Restock variant (+ quantity)
 * @route   POST /api/inventory/:productId/variants/:variantId/restock
 * @access  Private (Vendor / Seller / Admin)
 */
export const restockVariant = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const { quantity, reason } = req.body;

    const restockQty = parseInt(quantity, 10);
    if (!restockQty || restockQty <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive integer.' });
    }

    const [product, variant] = await Promise.all([
      Product.findById(productId),
      ProductVariant.findOne({ _id: variantId, product: productId })
    ]);

    if (!product || !variant) {
      return res.status(404).json({ success: false, message: 'Product or variant not found.' });
    }

    const prevStock = variant.stock || 0;
    const newStock = prevStock + restockQty;

    variant.stock = newStock;
    await variant.save();

    const log = await InventoryLog.create({
      product: product._id,
      variant: variant._id,
      store: product.store,
      changeType: 'restock',
      quantityChanged: restockQty,
      previousStock: prevStock,
      newStock,
      reason: reason || `Vendor restocked variant (${variant.title})`,
      performedBy: req.user._id
    });

    return res.status(200).json({
      success: true,
      message: `Restocked ${restockQty} units for variant '${variant.title}'. New stock: ${newStock}.`,
      data: {
        variantId: variant._id,
        stock: variant.stock,
        log
      }
    });
  } catch (error) {
    console.error('restockVariant error:', error);
    return res.status(500).json({ success: false, message: 'Failed to restock variant.', error: error.message });
  }
};
