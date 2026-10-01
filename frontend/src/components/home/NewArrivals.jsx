import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import productApi from '../../services/productApi';
import { useShopData } from '../../context/ShopDataContext';
import { ProductCard } from '../product/ProductCard';

export const NewArrivals = ({ onQuickView, onShowToast }) => {
  const { products: contextProducts } = useShopData();
  const [apiProducts, setApiProducts] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  const newArrivalProducts = useMemo(() => {
    if (Array.isArray(apiProducts) && apiProducts.length > 0) return apiProducts.slice(0, 8);
    if (Array.isArray(contextProducts) && contextProducts.length > 0) return contextProducts.slice(0, 8);
    return [];
  }, [apiProducts, contextProducts]);

  const loading = isFetching && newArrivalProducts.length === 0;

  useEffect(() => {
    let isCancelled = false;

    const fetchNewArrivals = async () => {
      try {
        const res = await productApi.getProducts({ limit: 8, sort: '-createdAt' });
        const list = res?.data || res?.products;
        if (!isCancelled && Array.isArray(list) && list.length > 0) {
          setApiProducts(list);
        }
      } catch (err) {
        console.warn('API error fetching new arrivals, using context:', err);
      } finally {
        if (!isCancelled) {
          setIsFetching(false);
        }
      }
    };

    fetchNewArrivals();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <section id="new-arrivals" className="py-16 md:py-24 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 border-b border-m4m-border">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-m4m-border">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-m4m-secondary flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3 h-3 text-[#111111]" />
            FRESH VERIFIED CURATION
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
            New Arrivals
          </h2>
          <p className="text-xs sm:text-sm text-m4m-secondary font-sans mt-1.5">
            Real authentic pieces from our verified atelier merchants and brand partners.
          </p>
        </div>

        <Link
          to="/shop?filter=new-arrivals"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#111111] hover:text-m4m-secondary transition-colors mt-4 sm:mt-0 group"
        >
          <span>VIEW ALL NEW ARRIVALS</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-[#EFECE6] aspect-[3/4] border border-[#E5E3DF]" />
          ))}
        </div>
      ) : newArrivalProducts.length === 0 ? (
        <div className="py-12 text-center text-xs font-mono text-[#8E877F] uppercase tracking-wider">
          No new arrivals cataloged at this moment.
        </div>
      ) : (
        /* Responsive Grid: 4 cols desktop, 3 cols tablet, 2 cols mobile */
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivalProducts.map((product) => (
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
              to="/shop?filter=new-arrivals"
              className="inline-flex items-center gap-3 bg-[#111111] text-[#F8F7F4] hover:bg-[#333333] px-8 py-3.5 text-xs font-mono uppercase tracking-[0.2em] transition-all shadow-sm group"
            >
              <span>EXPLORE ALL NEW ARRIVALS</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default NewArrivals;
