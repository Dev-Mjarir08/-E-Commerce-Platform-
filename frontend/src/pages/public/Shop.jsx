import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Filter,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ShoppingBag,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { AnnouncementBar } from '../../components/layout/AnnouncementBar';
import { CartDrawer } from '../../components/common/CartDrawer';
import { ProductCard } from '../../components/product/ProductCard';
import { useToast } from '../../context/ToastContext';
import { useShopData } from '../../context/ShopDataContext';
import productApi from '../../services/productApi';

const QuickViewModal = lazy(() =>
  import('../../components/common/QuickViewModal').then(m => ({ default: m.QuickViewModal || m.default }))
);

export const Shop = () => {
  const { showToast } = useToast();
  const { products: cachedProducts, categories: contextCategories, loading: initialLoading } = useShopData();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState(cachedProducts.length > 0 ? cachedProducts : []);
  const [loading, setLoading] = useState(cachedProducts.length === 0 && initialLoading);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Sync state if URL query param changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  const categories = useMemo(() => {
    const list = [{ id: 'all', name: 'All Collections' }];
    if (contextCategories && contextCategories.length > 0) {
      contextCategories.forEach((c) => {
        list.push({ id: c.slug || c._id, name: c.name });
      });
    } else {
      list.push(
        { id: 'electronics', name: 'Electronics' },
        { id: 'fashion', name: 'Fashion' },
        { id: 'outerwear', name: 'Outerwear' },
        { id: 'accessories', name: 'Accessories' },
        { id: 'footwear', name: 'Footwear' },
        { id: 'watches', name: 'Watches' }
      );
    }
    return list;
  }, [contextCategories]);

  useEffect(() => {
    let isCancelled = false;

    const loadProducts = async () => {
      if (selectedCategory === 'all' && !searchQuery && cachedProducts.length > 0) {
        if (!isCancelled) {
          setProducts(cachedProducts);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const res = await productApi.getProducts({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery || undefined
        });
        if (!isCancelled) {
          const items = res?.data || res?.products || [];
          setProducts(items);
        }
      } catch (err) {
        console.warn('Error loading products for shop:', err);
        if (!isCancelled) {
          setProducts([]);
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

  // Client-side sorting
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (selectedSort === 'price-low') {
      result.sort((a, b) => (a.price || a.basePrice) - (b.price || b.basePrice));
    } else if (selectedSort === 'price-high') {
      result.sort((a, b) => (b.price || b.basePrice) - (a.price || a.basePrice));
    } else if (selectedSort === 'rating') {
      result.sort((a, b) => (b.rating || b.ratingsAverage || 0) - (a.rating || a.ratingsAverage || 0));
    }

    return result;
  }, [products, selectedSort]);

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-[#F8F7F4]">
      <AnnouncementBar />
      <Navbar />

      {/* Hero Catalog Header */}
      <section className="bg-[#111111] text-[#F8F7F4] py-14 px-4 sm:px-8 lg:px-12 border-b border-[#222222]">
        <div className="max-w-[1920px] mx-auto text-center space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#A39E93] block">
            ATELIER CURATED CATALOGUE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight uppercase">
            The Complete Collection
          </h1>
          <p className="text-xs text-[#D4CEC5] max-w-xl mx-auto font-sans leading-relaxed">
            Explore independent designer ateliers, master tailors, and limited artisanal drops across global fashion houses.
          </p>
        </div>
      </section>

      {/* Filter and Control Bar */}
      <div className="sticky top-[69px] z-20 bg-[#F8F7F4]/95 backdrop-blur-md border-b border-[#E5E3DF] py-3.5 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (cat.id === 'all') {
                    searchParams.delete('category');
                  } else {
                    searchParams.set('category', cat.id);
                  }
                  setSearchParams(searchParams);
                }}
                className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all rounded-none border ${
                  selectedCategory === cat.id
                    ? 'bg-[#111111] text-[#F8F7F4] border-[#111111]'
                    : 'bg-[#FFFFFF] text-[#666666] border-[#E5E3DF] hover:border-[#111111] hover:text-[#111111]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Search Input */}
            <div className="relative flex-1 md:w-60">
              <Search className="w-3.5 h-3.5 text-[#8E877F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="FILTER GARMENTS..."
                className="w-full bg-[#FFFFFF] border border-[#E5E3DF] pl-9 pr-3 py-1.5 text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-[#111111] placeholder:text-[#8E877F]"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider shrink-0">
              <ArrowUpDown size={13} className="text-[#8E877F]" />
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-[#FFFFFF] border border-[#E5E3DF] px-3 py-1.5 text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-[#111111]"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <main className="flex-1 max-w-[1920px] mx-auto w-full px-4 sm:px-8 lg:px-12 py-10">
        {loading ? (
          <div className="py-28 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#666666]">
              Loading Catalog...
            </p>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="py-28 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-[#C0BAB2] mx-auto" />
            <h3 className="font-serif text-2xl uppercase tracking-wider text-[#111111]">
              No Creations Match Your Selection
            </h3>
            <p className="text-xs text-[#666666] max-w-sm mx-auto">
              Try adjusting your category filter or search keywords to view other luxury pieces in our boutique.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 bg-[#111111] text-[#F8F7F4] px-6 py-2.5 text-xs font-mono uppercase tracking-widest hover:bg-[#333333] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8E877F] mb-6">
              Showing {filteredAndSortedProducts.length} Atelier Masterpieces
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
              {filteredAndSortedProducts.map((p) => (
                <ProductCard
                  key={p.id || p._id}
                  product={p}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                  onShowToast={showToast}
                />
              ))}
            </div>
          </div>
        )}
      </main>

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
