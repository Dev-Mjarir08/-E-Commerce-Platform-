import Brand from '../models/Brand.js';
import Product from '../models/Product.js';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

export const getBrands = async (req, res) => {
  try {
    const { status, featured, search } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (featured !== undefined && featured !== 'all') query.featured = featured === 'true';
    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    const brands = await Brand.find(query).sort({ featured: -1, name: 1 });

    // Count products for each brand
    const brandsWithCounts = await Promise.all(
      brands.map(async (b) => {
        const productCount = await Product.countDocuments({
          $or: [
            { brand: b.name },
            { brand: { $regex: new RegExp(`^${b.name}$`, 'i') } }
          ]
        });
        return {
          ...b.toObject(),
          products: productCount
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: brandsWithCounts.length,
      data: brandsWithCounts
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch brands', error: error.message });
  }
};

export const createBrand = async (req, res) => {
  try {
    const { name, category, description, logo, website, status, featured } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Brand name is required.' });
    }

    const slug = slugify(name);
    const existing = await Brand.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Brand with this name already exists.' });
    }

    const brand = new Brand({
      name: name.trim(),
      slug,
      category: category || 'General Luxury',
      description: description || '',
      logo: logo || name.slice(0, 2).toUpperCase(),
      website: website || '',
      status: status || 'active',
      featured: Boolean(featured)
    });

    await brand.save();
    return res.status(201).json({
      success: true,
      message: 'Brand created successfully.',
      data: brand
    });
  } catch (error) {
    console.error('Error creating brand:', error);
    return res.status(500).json({ success: false, message: 'Failed to create brand', error: error.message });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
    const brand = await Brand.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Brand updated successfully.',
      data: brand
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    return res.status(500).json({ success: false, message: 'Failed to update brand', error: error.message });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Brand deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete brand', error: error.message });
  }
};
