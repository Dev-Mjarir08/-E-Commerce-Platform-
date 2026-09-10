import React from 'react';
import { ArrowRight } from 'lucide-react';
import { categories } from '../../data/categories';

export const CollectionGrid = ({ onSelectCategory }) => {
  return (
    <section id="collections" className="py-16 md:py-24 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 border-b border-[#E5E3DF] pb-4">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-[#666666] block mb-2">
            CURATED ANTHOLOGY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
            Shop By Collection
          </h2>
        </div>
        <p className="text-xs text-[#666666] font-sans mt-2 md:mt-0 max-w-sm">
          Disciplined silhouettes organized across outer layers, Neapolitan tailoring, and combed knitwear.
        </p>
      </div>

      {/* Grid: 3 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href="#catalog"
            onClick={(e) => {
              if (onSelectCategory) {
                onSelectCategory(cat.id);
              }
            }}
            className="group relative block overflow-hidden bg-[#EFECE6] border border-[#E5E3DF] aspect-[3/4] sm:aspect-[4/5] cursor-pointer"
          >
            {/* Background Image with subtle zoom */}
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />

            {/* Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/30 to-transparent transition-opacity duration-500 group-hover:from-[#111111]/90" />

            {/* Top Badge */}
            {cat.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] bg-[#111111]/80 backdrop-blur text-[#F8F7F4] px-2.5 py-1 border border-white/10">
                  {cat.badge}
                </span>
              </div>
            )}

            {/* Bottom Content Card */}
            <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col justify-end text-[#F8F7F4] transition-all duration-300">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4CEC5] mb-1">
                {cat.itemCount}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide mb-1 text-[#FFFFFF]">
                {cat.name}
              </h3>
              <p className="text-xs text-[#E5E3DF]/80 font-sans line-clamp-1 mb-4">
                {cat.tagline}
              </p>

              <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#FFFFFF] group-hover:text-[#D4CEC5] transition-colors">
                <span>EXPLORE COLLECTION</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
