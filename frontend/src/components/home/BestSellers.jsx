import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import productApi from '../../services/productApi';
import { useShopData } from '../../context/ShopDataContext';
import { ProductCard } from '../product/ProductCard';

export const BestSellers = ({ onQuickView, onShowToast }) => {
  const { products: contextProducts } = useShopData();
  const [bestSellerProducts, setBestSellerProducts] = useState(() => (
    Array.isArray(contextProducts) && contextProducts.length > 0 ? contextProducts : []
  ));
  const [loading, setLoading] = useState(() => (
    !Array.isArray(contextProducts) || contextProducts.length === 0
  ));
  const [activeTab, setActiveTab] = useState('ALL');

  const tabs = ['ALL', 'ELECTRONICS', 'CLOTHING', 'ACCESSORIES', 'FOOTWEAR'];

  useEffect(() => {
    if (Array.isArray(contextProducts) && contextProducts.length > 0) {
      setBestSellerProducts(contextProducts);
      setLoading(false);
    }
  }, [contextProducts]);

  useEffect(() => {
    let isCancelled = false;

    const fetchBestSellers = async () => {
      try {
        const res = await productApi.getProducts({ limit: 16 });
        const list = res?.data || res?.products;
        if (!isCancelled && Array.isArray(list) && list.length > 0) {
          setBestSellerProducts(list);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('API error fetching best sellers, using context:', err);
      }

      if (!isCancelled) {
        if (contextProducts && contextProducts.length > 0) {
          setBestSellerProducts(contextProducts);
        }
        setLoading(false);
      }
    };

    fetchBestSellers();

    return () => {
      isCancelled = true;
    };
  }, [contextProducts]);

  const filteredProducts = useMemo(() => {
    if (activeTab === 'ALL') return bestSellerProducts.slice(0, 8);

    const target = activeTab.toLowerCase();
    const matched = bestSellerProducts.filter((p) => {
      const catName = (typeof p.category === 'object' ? p.category?.name : p.category) || '';
      const catSlug = (typeof p.category === 'object' ? p.category?.slug : p.category) || '';
      const combined = `${catName} ${catSlug} ${p.title || p.name || ''}`.toLowerCase();
      return combined.includes(target);
    });

    return (matched.length > 0 ? matched : bestSellerProducts).slice(0, 8);
  }, [bestSellerProducts, activeTab]);

  return (
    <section id="best-sellers" className="py-16 md:py-24 bg-[#FAF9F6] border-b border-m4m-border">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-m4m-border gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-m4m-secondary flex items-center gap-1.5 mb-2">
              <Trophy className="w-3 h-3 text-[#111111]" />
              VERIFIED CLIENT FAVORITES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
              Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-m4m-secondary font-sans mt-1">
              Top requested consignments across all platform boutiques.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`text-[11px] font-mono uppercase tracking-[0.2em] px-4 py-2 border transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-[#111111] text-m4m-bg border-[#111111]'
                      : 'bg-m4m-card text-m4m-secondary border-m4m-border hover:border-[#111111] hover:text-[#111111]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <Link
              to="/shop?filter=best-sellers"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[#111111] hover:text-m4m-secondary transition-colors shrink-0 group"
            >
              <span>VIEW ALL BEST SELLERS</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-[#EFECE6] aspect-[3/4] border border-[#E5E3DF]" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-[#8E877F] uppercase tracking-wider">
            No products matching this department yet.
          </div>
        ) : (
          /* 4-column responsive grid */
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onQuickView={onQuickView}
                  onShowToast={onShowToast}
                />
              ))}
            </div>

            {/* Load More / Explore Dedicated Page Button */}
            <div className="mt-12 text-center">
              <Link
                to="/shop?filter=best-sellers"
                className="inline-flex items-center gap-3 bg-[#111111] text-[#F8F7F4] hover:bg-[#333333] px-8 py-3.5 text-xs font-mono uppercase tracking-[0.2em] transition-all shadow-sm group"
              >
                <span>EXPLORE ALL BEST SELLERS</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BestSellers;
