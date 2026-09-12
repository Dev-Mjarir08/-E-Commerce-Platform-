import React from 'react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

export const HeroSection = ({ onShopNow, onViewLookbook }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden border-b border-[#E5E3DF] bg-[#F8F7F4]"
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 w-full py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Typography & CTAs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 z-10">
            {/* Seasonal Tag */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <span className="w-6 h-[1px] bg-[#111111]" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase text-[#666666]">
                COLLECTION SS/26 • M4M ATELIER
              </span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-[#111111] font-normal leading-[1.08] tracking-tight mb-6">
              The Monochrome <br />
              <span className="italic font-light">Silhouette</span>
            </h1>

            {/* Narrative Body */}
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed max-w-md mb-8 font-sans font-normal">
              Sculpted Italian tailoring, noble Mongolian cashmere, and architectural minimalism.
              Garments drafted with single-needle precision to transcend transient seasons.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <a
                href="#catalog"
                onClick={onShopNow}
                className="inline-flex items-center justify-center gap-2 bg-[#111111] text-[#F8F7F4] text-[11px] font-mono uppercase tracking-[0.22em] px-8 py-4 hover:bg-[#2B2B2B] transition-all duration-300 group"
              >
                <span>EXPLORE CATALOG</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#lookbook"
                onClick={onViewLookbook}
                className="inline-flex items-center justify-center gap-2 bg-transparent text-[#111111] border border-[#111111] text-[11px] font-mono uppercase tracking-[0.22em] px-8 py-4 hover:bg-[#111111] hover:text-[#F8F7F4] transition-all duration-300"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>VIEW LOOKBOOK</span>
              </a>
            </div>

            {/* Craft Specs Counter */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E5E3DF] text-left">
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#8E877F]">FABRIC</span>
                <span className="block font-serif text-sm sm:text-base text-[#111111] font-medium mt-0.5">580gsm Cashmere</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#8E877F]">PROVENANCE</span>
                <span className="block font-serif text-sm sm:text-base text-[#111111] font-medium mt-0.5">Biella & Naples</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#8E877F]">CONSTRUCTION</span>
                <span className="block font-serif text-sm sm:text-base text-[#111111] font-medium mt-0.5">Full Floating Canvas</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Hero Photography (7 cols) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/3] xl:aspect-[16/11] w-full overflow-hidden bg-[#EFECE6] border border-[#E5E3DF] group">
              <img
                src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=85"
                alt="M4M Luxury Menswear SS26 Collection"
                className="w-full h-full object-cover object-center scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                loading="eager"
              />

              {/* Floating Editorial Badge Overlay */}
              <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-[#FFFFFF]/90 backdrop-blur-md border border-[#E5E3DF] p-4 sm:p-5 max-w-xs shadow-lg transition-transform duration-300">
                <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-[#8E877F] block mb-1">
                  FEATURED PIECE
                </span>
                <p className="font-serif text-sm text-[#111111] font-normal leading-snug">
                  Double-Breasted Cashmere Greatcoat in Onyx Black
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E3DF]/60">
                  <span className="text-xs font-mono font-medium text-[#111111]">$980</span>
                  <a
                    href="#catalog"
                    className="text-[10px] font-mono uppercase tracking-wider text-[#111111] hover:underline flex items-center gap-1"
                  >
                    <span>View Piece</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Top Right Seasonal Pill */}
              <div className="absolute top-4 right-4 bg-[#111111] text-[#F8F7F4] text-[9px] font-mono uppercase tracking-[0.2em] px-3 py-1.5 shadow-md">
                EDITION NO. 01 / SS-26
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
