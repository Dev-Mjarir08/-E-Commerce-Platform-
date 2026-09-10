import { products } from '../data/products';

/**
 * Product Service
 * Ready for GET /api/products integration
 */
export const productService = {
  // GET /api/products
  async getProducts({ category = 'all', sort = 'featured', search = '' } = {}) {
    let result = [...products];

    if (category && category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q)
      );
    }

    if (sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return Promise.resolve(result);
  },

  // GET /api/products/featured
  async getFeaturedProducts() {
    const featured = products.filter(p => p.isFeatured || p.isBestSeller);
    return Promise.resolve(featured);
  },

  // GET /api/products/:id
  async getProductById(id) {
    const product = products.find(p => p.id === id);
    return Promise.resolve(product || null);
  }
};
