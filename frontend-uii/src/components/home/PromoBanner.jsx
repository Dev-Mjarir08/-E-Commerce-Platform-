import React from 'react';
import { ArrowRight, Tag } from 'lucide-react';

export const PromoBanner = ({ onShopSale }) => {
  return (
    <section className="bg-[#EFECE6] border-y border-[#E5E3DF] py-14 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Subtle Pill */}
        <div className="inline-flex items-center gap-2 bg-[#FFFFFF] border border-[#E5E3DF] px-3.5 py-1.5 mb-5 shadow-xs">
          <Tag className="w-3.5 h-3.5 text-[#111111]" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#111111]">
            LIMITED ATELIER PRIVILEGE
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#111111] font-normal tracking-tight mb-4 leading-tight">
          Up To 30% Off Seasonal Cashmere & Outerwear
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[#666666] font-sans max-w-xl mx-auto mb-6 leading-relaxed">
          Select archive pieces curated for immediate dispatch. Apply bespoke privilege code{' '}
          <strong className="text-[#111111] font-mono font-semibold">VIP20</strong> in your bag.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#catalog"
            onClick={onShopSale}
            className="inline-flex items-center gap-2.5 bg-[#111111] text-[#F8F7F4] text-[11px] font-mono uppercase tracking-[0.2em] px-8 py-3.5 hover:bg-[#2B2B2B] transition-all group"
          >
            <span>DISCOVER PRIVILEGE SELECTION</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
