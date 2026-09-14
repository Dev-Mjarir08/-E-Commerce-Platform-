import { stores } from '../../data/marketplaceData';
import { StoreCard } from '../store/StoreCard';
import { Store, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturedStores = () => {
  return (
    <section id="featured-stores" className="py-16 md:py-24 bg-[#FAF9F6] border-b border-[#E5E3DF]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E5E3DF]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Store className="w-3.5 h-3.5 text-[#111111]" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-[#666666]">
                MULTI-TENANT BRAND COLLECTIVE
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
              Discover Our Stores
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] font-sans mt-1.5">
              Shop unique collections from independent brands and dedicated designer storefronts.
            </p>
          </div>

          <span className="text-xs font-mono uppercase tracking-wider text-[#666666] mt-4 sm:mt-0">
            {stores.length} VERIFIED ATELIERS
          </span>
        </div>

        {/* Stores Grid: 4 columns on desktop, 2 on tablet, 1 or 2 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stores.map((store, index) => (
            <StoreCard key={store.id} store={store} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
