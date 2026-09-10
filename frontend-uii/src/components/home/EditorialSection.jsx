import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';

export const EditorialSection = ({ onExplore }) => {
  return (
    <section id="editorial" className="py-16 md:py-24 bg-[#111111] text-[#F8F7F4] overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left: Tactical Editorial Imagery */}
          <div className="lg:col-span-6 relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] w-full overflow-hidden bg-[#222222] border border-[#2B2B2B] group">
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85"
              alt="M4M Master Tailoring in Naples"
              className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {/* Subtle Pill */}
            <div className="absolute top-4 left-4 bg-[#111111]/90 backdrop-blur border border-white/20 px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-[#F8F7F4]">
              ATELIER REPORT • BIELLA & NAPLES
            </div>
          </div>

          {/* Right: Narrative & Sourcing Manifesto */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[1px] bg-[#8E877F]" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-[#A39E93]">
                EDITORIAL FEATURE • ISSUE 04
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F8F7F4] font-normal tracking-tight mb-6 leading-tight">
              The Discipline of <br />
              <span className="italic font-light text-[#D4CEC5]">Noble Unblended Fibres</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#A39E93] leading-relaxed font-sans mb-6">
              True sartorial luxury is felt before it is seen. We reject synthetic blends and plastic interlinings in favor of 580gsm virgin Mongolian cashmere, water-washed Italian wool gabardine, and full floating horsehair chest canvas.
            </p>

            <blockquote className="border-l border-[#8E877F] pl-4 py-1 my-4 text-sm sm:text-base font-serif italic text-[#F8F7F4]/90">
              “A jacket should drape over the collarbones with architectural authority yet feel as unencumbered as smoke.”
            </blockquote>

            {/* Technical Checklist */}
            <div className="grid grid-cols-2 gap-4 my-6 text-[11px] font-mono text-[#D4CEC5] border-t border-[#2B2B2B] pt-6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4CEC5]" />
                <span>SUPER 150S LORO PIANA WOOL</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4CEC5]" />
                <span>GENUINE BUFFALO HORN BUTTONS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4CEC5]" />
                <span>OKAYAMA SELVEDGE 12OZ TWILL</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4CEC5]" />
                <span>FRENCH BOX CALF LEATHER</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <a
                href="#catalog"
                onClick={onExplore}
                className="inline-flex items-center gap-2 bg-[#F8F7F4] text-[#111111] text-[11px] font-mono uppercase tracking-[0.2em] px-8 py-4 hover:bg-[#D4CEC5] transition-all duration-300 group"
              >
                <span>EXPLORE THE SARTORIAL ARCHIVE</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
