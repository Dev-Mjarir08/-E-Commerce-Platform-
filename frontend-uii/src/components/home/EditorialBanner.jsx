import React from 'react';
import { ArrowRight } from 'lucide-react';

export const EditorialBanner = ({ onShopEdit }) => {
  return (
    <section className="relative min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#111111] text-[#FFFFFF]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=2000&q=85"
          alt="The New Standard Editorial Campaign"
          className="w-full h-full object-cover object-center scale-100 hover:scale-[1.03] transition-transform duration-1000 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/50 to-[#111111]/40" />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.35em] text-[#D4CEC5] mb-4">
          EDITORIAL CAMPAIGN • EDITION 03
        </span>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-tight tracking-tight uppercase mb-6 text-[#FFFFFF]">
          The New Standard
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-[#D4CEC5] font-sans font-light max-w-lg mb-10 leading-relaxed">
          Modern essentials designed for everyday movement. Thoughtfully sourced, precision tailored, and delivered directly from independent studios.
        </p>

        <a
          href="#new-arrivals"
          onClick={onShopEdit}
          className="inline-flex items-center gap-2.5 bg-[#FFFFFF] text-[#111111] text-[11px] font-mono uppercase tracking-[0.22em] px-8 py-4 hover:bg-[#D4CEC5] transition-all duration-300 shadow-md group"
        >
          <span>SHOP THE EDIT</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </section>
  );
};
