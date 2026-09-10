import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { products } from '../../data/products';

export const CuratedEssentials = ({ onQuickView, onShowToast }) => {
  const scrollContainerRef = useRef(null);

  // Filter bestsellers and featured pieces
  const essentialPieces = products.filter(p => p.isBestSeller || p.isFeatured);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <section id="curated-essentials" className="py-16 md:py-24 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 overflow-hidden">
      {/* Header with Navigation Chevrons */}
      <div className="flex items-end justify-between mb-8 border-b border-[#E5E3DF] pb-4">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-[#666666] block mb-2">
            PERPETUAL WARDROBE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
            Curated Essentials & Icons
          </h2>
        </div>

        {/* Prev / Next Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scrollLeft}
            className="w-10 h-10 border border-[#E5E3DF] bg-[#FFFFFF] flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-[#FFFFFF] transition-all"
            aria-label="Previous garments"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            className="w-10 h-10 border border-[#E5E3DF] bg-[#FFFFFF] flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-[#FFFFFF] transition-all"
            aria-label="Next garments"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {essentialPieces.map((product) => (
          <div
            key={product.id}
            className="w-[280px] sm:w-[320px] lg:w-[360px] shrink-0"
            style={{ scrollSnapAlign: 'start' }}
          >
            <ProductCard
              product={product}
              onQuickView={onQuickView}
              onShowToast={onShowToast}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
