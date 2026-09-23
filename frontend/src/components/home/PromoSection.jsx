import { ArrowRight, Tag } from 'lucide-react';

export const PromoSection = ({ onShopSale }) => {
  return (
    <section id="sale" className="bg-m4m-stone border-b border-m4m-border py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Monogram / Pill */}
        <div className="inline-flex items-center gap-2 bg-m4m-card border border-m4m-border px-3.5 py-1.5 mb-6 shadow-xs">
          <Tag className="w-3.5 h-3.5 text-[#111111]" />
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#111111]">
            SEASONAL PRIVILEGE
          </span>
        </div>

        {/* Big Heading */}
        <span className="block text-xs font-mono uppercase tracking-[0.3em] text-m4m-accent mb-2">
          MID-SEASON EDIT
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#111111] font-normal tracking-tight uppercase mb-4">
          Up To 40% Off
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-m4m-secondary font-sans max-w-md mx-auto mb-8 leading-relaxed">
          Selected archive styles and seasonal colorways from curated atelier partners. Limited inventory available.
        </p>

        {/* CTA */}
        <div>
          <a
            href="#new-arrivals"
            onClick={onShopSale}
            className="inline-flex items-center gap-2 bg-[#111111] text-m4m-bg text-[11px] font-mono uppercase tracking-[0.2em] px-8 py-4 hover:bg-[#2B2B2B] transition-all group shadow-sm"
          >
            <span>SHOP SALE</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
