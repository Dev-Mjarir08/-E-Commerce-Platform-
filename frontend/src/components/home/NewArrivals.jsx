import { ArrowRight } from 'lucide-react';
import { products } from '../../data/marketplaceData';
import { ProductCard } from '../product/ProductCard';

export const NewArrivals = ({ onQuickView, onShowToast, onViewAll }) => {
  // Filter new arrivals
  const newArrivalProducts = products.filter((p) => p.isNewArrival);

  return (
    <section id="new-arrivals" className="py-16 md:py-24 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 border-b border-m4m-border">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-m4m-border">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-m4m-secondary block mb-2">
            FRESH CURATION
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
            New Arrivals
          </h2>
          <p className="text-xs sm:text-sm text-m4m-secondary font-sans mt-1.5">
            Fresh pieces from our latest collections and newly onboarded ateliermakers.
          </p>
        </div>

        <a
          href="#best-sellers"
          onClick={onViewAll}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#111111] hover:text-m4m-secondary transition-colors mt-4 sm:mt-0 group"
        >
          <span>VIEW ALL PIECES</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Responsive Grid: 4 cols desktop, 3 cols tablet, 2 cols mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {newArrivalProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={onQuickView}
            onShowToast={onShowToast}
          />
        ))}
      </div>
    </section>
  );
};
