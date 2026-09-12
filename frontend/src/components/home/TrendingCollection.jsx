import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const TrendingCollection = ({ onShopCollection }) => {
  return (
    <section id="collections" className="py-16 md:py-24 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 border-b border-[#E5E3DF]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* Left: Large Editorial Fashion Image (7 cols) */}
        <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/3] w-full overflow-hidden bg-[#F2EFE9] border border-[#E5E3DF] group">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85"
            alt="The Everyday Collection Editorial"
            className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Floating Pill */}
          <div className="absolute top-4 left-4 bg-[#111111] text-[#F8F7F4] text-[9px] font-mono uppercase tracking-[0.25em] px-3 py-1.5 shadow-md">
            CAMPAIGN 02 / SPRING
          </div>

          {/* Bottom Floating Info */}
          <div className="absolute bottom-6 right-6 bg-[#FFFFFF]/90 backdrop-blur-md p-4 border border-[#E5E3DF] max-w-xs shadow-lg hidden sm:block">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#8E877F] block mb-1">
              CURATION
            </span>
            <p className="font-serif text-sm text-[#111111]">
              Unisex Oversized Silhouettes & Natural Dye Linen
            </p>
          </div>
        </div>

        {/* Right: Asymmetric Editorial Content (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-[#111111]" />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase text-[#666666]">
              TRENDING NOW
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#111111] font-normal leading-[1.1] tracking-tight uppercase mb-6">
            The Everyday <br />
            <span className="italic font-light text-[#666666]">Collection</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#666666] font-sans leading-relaxed mb-6">
            Designed for unhurried movement. A deliberate selection of relaxed overshirts, high-twist gabardine trousers, and breathable organic cottons sourced from artisan mills across India and Japan.
          </p>

          <blockquote className="border-l-2 border-[#111111] pl-4 py-1 text-xs sm:text-sm font-serif italic text-[#444444] mb-8">
            “Essential pieces crafted with the discipline of architectural form — versatile enough for dawn transit to midnight gatherings.”
          </blockquote>

          <div>
            <a
              href="#new-arrivals"
              onClick={onShopCollection}
              className="inline-flex items-center gap-2.5 bg-[#111111] text-[#F8F7F4] text-[11px] font-mono uppercase tracking-[0.22em] px-8 py-4 hover:bg-[#2B2B2B] transition-all duration-300 group"
            >
              <span>SHOP COLLECTION</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
