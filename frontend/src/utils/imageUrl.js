/**
 * Image URL Helper Utility
 * 
 * Resolves image paths from the backend (like '/uploads/avatars/file.jpg')
 * into fully-formed URLs so they always display properly in the browser.
 * 
 * - Handles relative uploaded assets (/uploads/...)
 * - Supports objects with .url property (e.g. { url: "...", public_id: "..." })
 * - Preserves already complete URLs (http://, https://, blob:, data:)
 * - Provides graceful fallback placeholder when an image is missing
 */

const DEFAULT_AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
const DEFAULT_COVER_FALLBACK = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200';
const DEFAULT_PRODUCT_FALLBACK = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800';
const DEFAULT_CATEGORY_FALLBACK = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800';

/**
 * Returns a curated luxury fallback image based on category name or keywords
 */
export const getCategoryFallbackImage = (nameOrSlug = '') => {
  const s = String(nameOrSlug).toLowerCase().trim();
  if (s.includes('men') && !s.includes('women')) {
    return 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80';
  }
  if (s.includes('women') || s.includes('dress') || s.includes('skirt') || s.includes('blouse')) {
    return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80';
  }
  if (s.includes('shoe') || s.includes('footwear') || s.includes('sneaker') || s.includes('boot') || s.includes('loaf')) {
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';
  }
  if (s.includes('watch') || s.includes('horolog') || s.includes('jewel') || s.includes('gem') || s.includes('accessori')) {
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
  }
  if (s.includes('elect') || s.includes('tech') || s.includes('gadget') || s.includes('audio') || s.includes('phone') || s.includes('headphone')) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
  }
  if (s.includes('bag') || s.includes('leather') || s.includes('wallet') || s.includes('luggage') || s.includes('handbag')) {
    return 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80';
  }
  if (s.includes('home') || s.includes('decor') || s.includes('living') || s.includes('furniture')) {
    return 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80';
  }
  return DEFAULT_CATEGORY_FALLBACK;
};

/**
 * Resolves category image with reliable fallback
 */
export const getCategoryImageUrl = (category) => {
  if (!category) return DEFAULT_CATEGORY_FALLBACK;
  const raw = typeof category === 'string'
    ? category
    : category?.image?.url || category?.image || category?.imageUrl;

  const fallback = getCategoryFallbackImage(category?.name || category?.slug || '');
  return getImageUrl(raw, fallback);
};

/**
 * Returns a valid, accessible URL string for any given image source.
 * 
 * @param {string|object} source - The image source (string URL or object with .url)
 * @param {string} fallback - Fallback URL if source is missing or empty
 * @returns {string} - Clean image URL ready for <img src="..." />
 */
export const getImageUrl = (source, fallback = DEFAULT_PRODUCT_FALLBACK) => {
  // If no source is provided, return fallback
  if (!source) {
    return fallback;
  }

  // If source is an object (e.g., { url: '/uploads/...' }), extract the url property
  let url = typeof source === 'object' ? source.url : source;

  if (!url || typeof url !== 'string' || !url.trim()) {
    return fallback;
  }

  url = url.trim();

  // If already absolute HTTP, HTTPS, base64 data, or temporary blob URL
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  // If relative path from backend uploads directory
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    // Prefer VITE_BACKEND_URL or default local port 8081
    const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081';
    return `${backendBase}${cleanPath}`;
  }

  return url;
};

export { DEFAULT_AVATAR_FALLBACK, DEFAULT_COVER_FALLBACK, DEFAULT_PRODUCT_FALLBACK, DEFAULT_CATEGORY_FALLBACK };
export default getImageUrl;
