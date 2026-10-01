import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Filter,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  ArrowUpDown,
  X,
  Trophy,
  Flame,
  Clock,
  Tag,
  Check
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { AnnouncementBar } from '../../components/layout/AnnouncementBar';
import { CartDrawer } from '../../components/common/CartDrawer';
import { ProductCard } from '../../components/product/ProductCard';
import { useToast } from '../../context/ToastContext';
import { useShopData } from '../../context/ShopDataContext';
import productApi from '../../services/productApi';
import { getCategoryImageUrl, getCategoryFallbackImage } from '../../utils/imageUrl';

const QuickViewModal = lazy(() =>
  import('../../components/common/QuickViewModal').then((m) => ({
    default: m.QuickViewModal || m.default,
  }))
);

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under-500', label: 'Under ₹500', min: 0, max: 500 },
  { id: '500-999', label: '₹500 – ₹999', min: 500, max: 999 },
  { id: '1000-2999', label: '₹1,000 – ₹2,999', min: 1000, max: 2999 },
  { id: '3000-plus', label: '₹3,000 & Above', min: 3000, max: Infinity },
];

const COLLECTION_FILTERS = [
  { id: 'all', label: 'All Collections', icon: ShoppingBag },
  { id: 'featured', label: 'Featured Collections', icon: Sparkles },
  { id: 'new-arrivals', label: 'Recently Added / New', icon: Clock },
  { id: 'best-sellers', label: 'Best Sellers', icon: Trophy },
  { id: 'sale', label: 'On Sale / Archive', icon: Flame },
];

const ITEMS_PER_PAGE = 12;

export const Shop = () => {
  const { showToast } = useToast();
  const { products: cachedProducts, categories: contextCategories, loading: initialLoading } = useShopData();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state derived directly to eliminate cascading renders
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedFilter = searchParams.get('filter') || 'all';
  const selectedSort = searchParams.get('sort') || 'featured';
  const selectedPrice = searchParams.get('price') || 'all';
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState(cachedProducts.length > 0 ? cachedProducts : []);
  const [loading, setLoading] = useState(cachedProducts.length === 0 && initialLoading);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Update query params helper
  const updateQueryParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    setSearchParams(nextParams);
    setVisibleCount(ITEMS_PER_PAGE); // Reset pagination on filter change
  };

  const setSelectedCategory = (val) => updateQueryParam('category', typeof val === 'function' ? val(selectedCategory) : val);
  const setSelectedFilter = (val) => updateQueryParam('filter', typeof val === 'function' ? val(selectedFilter) : val);
  const setSelectedSort = (val) => updateQueryParam('sort', typeof val === 'function' ? val(selectedSort) : val);
  const setSelectedPrice = (val) => updateQueryParam('price', typeof val === 'function' ? val(selectedPrice) : val);
  const setSearchQuery = (val) => updateQueryParam('search', typeof val === 'function' ? val(searchQuery) : val);

  // Build categories list with fallbacks
  const categories = useMemo(() => {
    const list = [{ id: 'all', name: 'All Departments', slug: 'all', itemCount: 'All' }];
    if (contextCategories && contextCategories.length > 0) {
      contextCategories.forEach((c) => {
        list.push({
          ...c,
          id: c.slug || c._id,
          name: c.name,
          slug: c.slug || c._id,
        });
      });
    } else {
      list.push(
        { id: 'mens-fashion', name: "Men's Luxury Fashion", slug: 'mens-fashion' },
        { id: 'womens-fashion', name: "Women's Couture", slug: 'womens-fashion' },
        { id: 'footwear-sneakers', name: 'Footwear & Loafers', slug: 'footwear-sneakers' },
        { id: 'accessories-jewelry', name: 'Watches & Horology', slug: 'accessories-jewelry' },
        { id: 'electronics-gadgets', name: 'Electronics & Audio', slug: 'electronics-gadgets' }
      );
    }
    return list;
  }, [contextCategories]);

  // Load products from API
  useEffect(() => {
    let isCancelled = false;

    const loadProducts = async () => {
      setLoading(true);
      try {
        const queryCategory = selectedCategory !== 'all' ? selectedCategory : undefined;
        const res = await productApi.getProducts({
          category: queryCategory,
          search: searchQuery || undefined,
          limit: 150,
        });

        if (!isCancelled) {
          const items = res?.data || res?.products || [];
          if (items.length > 0 || queryCategory || searchQuery) {
            setProducts(items);
          } else if (cachedProducts && cachedProducts.length > 0) {
            setProducts(cachedProducts);
          }
        }
      } catch (err) {
        console.warn('Error loading products for shop:', err);
        if (!isCancelled && cachedProducts && cachedProducts.length > 0) {
          setProducts(cachedProducts);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, searchQuery, cachedProducts]);

  // Count products per category
  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const catKey = (typeof p.category === 'object'
        ? (p.category?.slug || p.category?.name || p.category?._id)
        : p.category) || 'other';
      const normalized = String(catKey).toLowerCase();
      counts[normalized] = (counts[normalized] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Multi-faceted filtering and sorting
  let filteredProducts = [...products];

  // 1. Category Filter
  if (selectedCategory !== 'all') {
    const targetCat = selectedCategory.toLowerCase();
    filteredProducts = filteredProducts.filter((p) => {
      const catName = (typeof p.category === 'object' ? p.category?.name : p.category) || '';
      const catSlug = (typeof p.category === 'object' ? p.category?.slug : p.category) || '';
      const catId = (typeof p.category === 'object' ? p.category?._id : '') || '';
      const combined = `${catName} ${catSlug} ${catId}`.toLowerCase();
      return combined.includes(targetCat) || targetCat.includes(catSlug.toLowerCase());
    });
  }

  // 2. Collection Filter (featured, new-arrivals, best-sellers, sale)
  if (selectedFilter === 'featured') {
    filteredProducts = filteredProducts.filter((p) => p.isFeatured || p.rating >= 4.5 || (p.reviewsCount && p.reviewsCount > 5));
  } else if (selectedFilter === 'new-arrivals' || selectedFilter === 'recently-added') {
    // Show newest items or items marked new
    filteredProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } else if (selectedFilter === 'best-sellers') {
    filteredProducts = filteredProducts.filter(
      (p) => (p.soldCount && p.soldCount > 0) || (p.rating && p.rating >= 4.0) || p.isBestSeller
    );
  } else if (selectedFilter === 'sale') {
    filteredProducts = filteredProducts.filter(
      (p) => Boolean(p.discountPrice) || (p.originalPrice && p.originalPrice > (p.price || p.basePrice))
    );
  }

  // 3. Price Filter
  if (selectedPrice !== 'all') {
    const activeRange = PRICE_RANGES.find((r) => r.id === selectedPrice);
    if (activeRange) {
      filteredProducts = filteredProducts.filter((p) => {
        const price = Number(p.price ?? p.basePrice ?? p.discountPrice ?? 0);
        return price >= activeRange.min && price <= activeRange.max;
      });
    }
  }

  // 4. Search Filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredProducts = filteredProducts.filter((p) => {
      const title = (p.title || p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const brand = (p.brand || p.store?.name || p.storeName || '').toLowerCase();
      return title.includes(q) || desc.includes(q) || brand.includes(q);
    });
  }

  // 5. Client Sorting
  if (selectedSort === 'price-low') {
    filteredProducts.sort((a, b) => (a.price || a.basePrice || 0) - (b.price || b.basePrice || 0));
  } else if (selectedSort === 'price-high') {
    filteredProducts.sort((a, b) => (b.price || b.basePrice || 0) - (a.price || a.basePrice || 0));
  } else if (selectedSort === 'rating') {
    filteredProducts.sort((a, b) => (b.rating || b.ratingsAverage || 0) - (a.rating || a.ratingsAverage || 0));
  } else if (selectedSort === 'newest') {
    filteredProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  // Paginated visible slice
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredProducts.length));
  };

  const handleClearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedFilter('all');
    setSelectedPrice('all');
    setSearchQuery('');
    setSelectedSort('featured');
    setSearchParams(new URLSearchParams());
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const isAnyFilterActive =
    selectedCategory !== 'all' ||
    selectedFilter !== 'all' ||
    selectedPrice !== 'all' ||
    Boolean(searchQuery.trim());

  // Active Category & Filter Meta Information
  const currentCategoryObj = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
  const currentCategoryName = currentCategoryObj ? currentCategoryObj.name : 'All Collections';

  let heroTitle = 'The Complete Collection';
  let heroSubtitle = 'Explore independent designer ateliers, master tailors, and limited artisanal drops across global fashion houses.';

  if (selectedFilter === 'new-arrivals') {
    heroTitle = 'Recently Added / New Arrivals';
    heroSubtitle = 'Fresh verified arrivals and current season creations cataloged directly from master ateliers.';
  } else if (selectedFilter === 'featured') {
    heroTitle = 'Featured Designer Collections';
    heroSubtitle = 'Signature designer creations, standout editorial pieces, and verified brand favorites.';
  } else if (selectedFilter === 'best-sellers') {
    heroTitle = 'Best Sellers & Client Favorites';
    heroSubtitle = 'Most requested pieces and top-rated sartorial consignments across all platform boutiques.';
  } else if (selectedFilter === 'sale') {
    heroTitle = 'Special Archive & Seasonal Sale';
    heroSubtitle = 'Limited release archive drops and curated seasonal reductions from luxury designers.';
  } else if (selectedCategory !== 'all') {
    heroTitle = currentCategoryName;
    heroSubtitle = `Explore handcrafted ${currentCategoryName.toLowerCase()} and curated garments from premier ateliers.`;
  }

  // Sidebar Aside Component Content
  const renderSidebarContent = () => (
    <div className="space-y-6">
      {/* Sidebar Header with Reset */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E3DF]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#111111]" />
          <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#111111]">
            FILTERS & ASIDE
          </span>
        </div>
        {isAnyFilterActive && (
          <button
            type="button"
            onClick={handleClearAllFilters}
            className="text-[11px] font-sans uppercase tracking-wider text-rose-600 hover:text-rose-700 underline font-semibold transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* 1. Collection Views Filter */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-[#8E877F] pb-2 border-b border-[#EAE7E2] mb-2.5">
          Collections & Drops
        </div>
        <div className="space-y-1">
          {COLLECTION_FILTERS.map((col) => {
            const Icon = col.icon;
            const isSelected = selectedFilter === col.id;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => {
                  setSelectedFilter(col.id);
                  updateQueryParam('filter', col.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-sans tracking-wide transition-all text-left rounded-sm ${
                  isSelected
                    ? 'bg-[#111111] text-[#F8F7F4] font-semibold shadow-xs'
                    : 'text-[#333333] hover:bg-[#F2EFE9] hover:text-[#111111]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F8F7F4]' : 'text-[#8E877F]'}`} />
                  <span className="capitalize text-xs">{col.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#F8F7F4]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Category-wise Aside Navigation */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-[#EAE7E2] mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-[#8E877F]">
            Departments
          </span>
          <span className="text-[10px] font-mono text-[#8E877F] font-semibold">
            {categories.length - 1} Total
          </span>
        </div>

        <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
            const catImg = getCategoryImageUrl(cat);
            const count = cat.id === 'all'
              ? products.length
              : (categoryCounts[cat.slug?.toLowerCase()] || categoryCounts[cat.name?.toLowerCase()] || '');

            return (
              <button
                key={cat.id || cat.slug}
                type="button"
                onClick={() => {
                  const val = cat.id === 'all' ? 'all' : (cat.slug || cat.id);
                  setSelectedCategory(val);
                  updateQueryParam('category', val);
                }}
                className={`w-full flex items-center justify-between p-2 text-xs font-sans tracking-wide transition-all text-left border rounded-sm ${
                  isSelected
                    ? 'bg-[#111111] text-[#F8F7F4] border-[#111111] font-semibold shadow-xs'
                    : 'bg-[#FFFFFF] text-[#333333] border-[#E5E3DF] hover:border-[#111111] hover:text-[#111111]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {cat.id !== 'all' && (
                    <img
                      src={catImg}
                      alt={cat.name}
                      className="w-7 h-7 rounded-xs object-cover shrink-0 border border-[#E5E3DF]"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = getCategoryFallbackImage(cat.name);
                      }}
                    />
                  )}
                  <span className="truncate text-xs">{cat.name}</span>
                </div>
                {count ? (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 font-medium ${
                      isSelected ? 'bg-[#333333] text-[#F8F7F4]' : 'bg-[#F2EFE9] text-[#666666]'
                    }`}
                  >
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Price Bracket Filter */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-[#8E877F] pb-2 border-b border-[#EAE7E2] mb-2.5">
          Price Range
        </div>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const isSelected = selectedPrice === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => {
                  setSelectedPrice(range.id);
                  updateQueryParam('price', range.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-sans tracking-wide transition-all text-left rounded-sm ${
                  isSelected
                    ? 'bg-[#111111] text-[#F8F7F4] font-semibold shadow-xs'
                    : 'text-[#333333] hover:bg-[#F2EFE9] hover:text-[#111111]'
                }`}
              >
                <span className="text-xs">{range.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#F8F7F4]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust & Guarantee Pill */}
      <div className="bg-[#FAF9F6] p-3.5 border border-[#E5E3DF] space-y-1.5 rounded-sm">
        <span className="text-[9px] font-mono uppercase tracking-widest text-[#8E877F] font-bold block">
          OMNIKART ASSURANCE
        </span>
        <p className="text-[11px] font-sans text-[#666666] leading-relaxed">
          100% verified merchant credentials, authenticity guarantees, and worldwide insured transit.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-[#F8F7F4]">
      <AnnouncementBar />
      <Navbar />

      {/* Hero Catalog Header with Dynamic Context */}
      <section className="bg-[#111111] text-[#F8F7F4] py-14 px-4 sm:px-8 lg:px-12 border-b border-[#222222]">
        <div className="max-w-[1920px] mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-4 h-[1px] bg-[#A39E93]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#A39E93]">
              {selectedFilter !== 'all' ? selectedFilter.toUpperCase() : 'OMNIKART CURATED CATALOGUE'}
            </span>
            <span className="w-4 h-[1px] bg-[#A39E93]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight uppercase">
            {heroTitle}
          </h1>
          <p className="text-xs text-[#D4CEC5] max-w-xl mx-auto font-sans leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Sticky Filter & Search Control Bar */}
      <div className="sticky top-[72px] sm:top-[80px] z-20 bg-[#F8F7F4]/95 backdrop-blur-md border-b border-[#E5E3DF] py-3 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Mobile Aside Toggle & Results Indicator */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 bg-[#111111] text-[#F8F7F4] px-4 py-2 text-xs font-mono uppercase tracking-wider"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters & Categories</span>
              {isAnyFilterActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>

            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#8E877F]">
              {loading ? 'Refreshing Catalog...' : `${filteredProducts.length} Verified Products`}
            </span>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-[#8E877F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  updateQueryParam('search', e.target.value);
                }}
                placeholder="SEARCH CREATIONS..."
                className="w-full bg-[#FFFFFF] border border-[#E5E3DF] pl-9 pr-8 py-2 text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-[#111111] placeholder:text-[#8E877F]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    updateQueryParam('search', '');
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E877F] hover:text-[#111111]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider shrink-0">
              <ArrowUpDown size={13} className="text-[#8E877F]" />
              <select
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  updateQueryParam('sort', e.target.value);
                }}
                className="bg-[#FFFFFF] border border-[#E5E3DF] px-3 py-2 text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-[#111111]"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {isAnyFilterActive && (
          <div className="max-w-[1920px] mx-auto mt-2 pt-2 border-t border-[#EAE7E2] flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E877F]">
              Active Filters:
            </span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#111111] text-[#F8F7F4] text-[10px] font-mono uppercase tracking-wider">
                <span>Cat: {currentCategoryName}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    updateQueryParam('category', 'all');
                  }}
                  className="hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#111111] text-[#F8F7F4] text-[10px] font-mono uppercase tracking-wider">
                <span>Collection: {COLLECTION_FILTERS.find((c) => c.id === selectedFilter)?.label}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFilter('all');
                    updateQueryParam('filter', 'all');
                  }}
                  className="hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedPrice !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#111111] text-[#F8F7F4] text-[10px] font-mono uppercase tracking-wider">
                <span>Price: {PRICE_RANGES.find((p) => p.id === selectedPrice)?.label}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPrice('all');
                    updateQueryParam('price', 'all');
                  }}
                  className="hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#111111] text-[#F8F7F4] text-[10px] font-mono uppercase tracking-wider">
                <span>Query: "{searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    updateQueryParam('search', '');
                  }}
                  className="hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleClearAllFilters}
              className="text-[10px] font-mono uppercase tracking-wider text-red-600 hover:text-red-800 underline ml-2"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Main Two-Column Layout: Left Aside Bar + Right Product Catalog */}
      <div className="flex-1 max-w-[1920px] mx-auto w-full px-4 sm:px-8 lg:px-12 py-10 flex gap-8 xl:gap-12 items-start">
        {/* Desktop Aside Bar */}
        <aside className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-[135px] sm:top-[145px] max-h-[calc(100vh-160px)] overflow-y-auto bg-[#FFFFFF] border border-[#E5E3DF] p-5 shadow-xs">
          {renderSidebarContent()}
        </aside>

        {/* Mobile Aside Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileFilterOpen(false)}
            />
            {/* Drawer */}
            <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-[#FFFFFF] h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E3DF] mb-6">
                  <span className="font-serif text-lg uppercase tracking-wide">
                    Filters & Categories
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 hover:bg-[#F2EFE9] text-[#111111]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {renderSidebarContent()}
              </div>

              <div className="pt-6 border-t border-[#E5E3DF] mt-8">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-[#111111] text-[#F8F7F4] py-3 text-xs font-mono uppercase tracking-widest font-semibold"
                >
                  View {filteredProducts.length} Results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Catalog Grid & Load More */}
        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="py-28 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#666666]">
                Loading Catalog...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-28 text-center space-y-4 bg-[#FFFFFF] border border-[#E5E3DF] p-8">
              <ShoppingBag className="w-12 h-12 text-[#C0BAB2] mx-auto" />
              <h3 className="font-serif text-2xl uppercase tracking-wider text-[#111111]">
                No Creations Match Your Selection
              </h3>
              <p className="text-xs text-[#666666] max-w-sm mx-auto leading-relaxed">
                Try resetting your category or collection filters to explore other luxury pieces in our boutique.
              </p>
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="mt-2 bg-[#111111] text-[#F8F7F4] px-6 py-2.5 text-xs font-mono uppercase tracking-widest hover:bg-[#333333] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div>
              {/* Product Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
                {visibleProducts.map((p) => (
                  <ProductCard
                    key={p.id || p._id}
                    product={p}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                    onShowToast={showToast}
                  />
                ))}
              </div>

              {/* Load More Pagination Section */}
              <div className="mt-14 pt-8 border-t border-[#E5E3DF] text-center space-y-4">
                <div className="max-w-xs mx-auto">
                  <div className="flex justify-between text-[11px] font-mono uppercase text-[#8E877F] mb-1.5">
                    <span>Showing {visibleProducts.length} of {filteredProducts.length} Creations</span>
                    <span>{Math.round((visibleProducts.length / filteredProducts.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#E5E3DF] overflow-hidden">
                    <div
                      className="h-full bg-[#111111] transition-all duration-300"
                      style={{
                        width: `${(visibleProducts.length / filteredProducts.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {hasMore ? (
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="inline-flex items-center gap-2 bg-[#111111] text-[#F8F7F4] hover:bg-[#333333] px-10 py-3.5 text-xs font-mono uppercase tracking-[0.25em] transition-all shadow-sm group"
                  >
                    <span>LOAD MORE CREATIONS</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8E877F]">
                    All {filteredProducts.length} Products Displayed
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
      <CartDrawer />

      {/* Quick View Modal */}
      <Suspense fallback={null}>
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            isOpen={Boolean(quickViewProduct)}
            onClose={() => setQuickViewProduct(null)}
            onShowToast={showToast}
          />
        )}
      </Suspense>
    </div>
  );
};

export default Shop;
