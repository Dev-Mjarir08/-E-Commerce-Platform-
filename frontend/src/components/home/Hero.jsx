import React, { useEffect, useRef } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import gsap from 'gsap';

export const Hero = ({ onShopNewArrivals, onExploreStores }) => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        if (imageRef.current) {
          tl.fromTo(
            imageRef.current,
            { scale: 1.06, opacity: 0.95 },
            { scale: 1, opacity: 1, duration: 1.8 }
          );
        }

        tl.fromTo(
          '.hero-tag',
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=1.2'
        )
          .fromTo(
            '.hero-heading',
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 },
            '-=0.5'
          )
          .fromTo(
            '.hero-desc',
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            '-=0.4'
          )
          .fromTo(
            '.hero-buttons',
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            '-=0.3'
          );
      }, heroRef);

      return () => ctx.revert();
    } catch (e) {
      console.warn('GSAP animation fallback:', e);
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#111111] text-[#FFFFFF]"
    >
      {/* Background Photography with subtle scale */}
      <div className="absolute inset-0 z-0">
        <img
          ref={imageRef}
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
          alt="Contemporary Fashion Editorial"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Soft dark vignette gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/45 to-[#111111]/30" />
      </div>

      {/* Overlay Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center"
      >
        {/* Subtitle / Season */}
        <div className="hero-tag inline-flex items-center gap-3 mb-5 sm:mb-6">
          <span className="w-6 h-[1px] bg-[#FFFFFF]/70" />
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.35em] uppercase text-[#D4CEC5]">
            NEW SEASON • SS/26 MARKETPLACE
          </span>
          <span className="w-6 h-[1px] bg-[#FFFFFF]/70" />
        </div>

        {/* Big Editorial Headline */}
        <h1 className="hero-heading font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.05] tracking-tight uppercase mb-6 sm:mb-8 max-w-4xl text-[#FFFFFF]">
          DEFINE YOUR <br />
          <span className="italic font-light text-[#E5E3DF]">EVERYDAY.</span>
        </h1>

        {/* Short description */}
        <p className="hero-desc text-sm sm:text-base md:text-lg text-[#D4CEC5] font-sans font-light max-w-xl mb-10 leading-relaxed">
          Explore contemporary fashion from independent brands and curated stores.
        </p>

        {/* Action Buttons */}
        <div className="hero-buttons flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="#new-arrivals"
            onClick={onShopNewArrivals}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFFFFF] text-[#111111] text-[11px] font-mono uppercase tracking-[0.22em] px-8 py-4 hover:bg-[#D4CEC5] transition-all duration-300 shadow-md group"
          >
            <span>SHOP NEW ARRIVALS</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#featured-stores"
            onClick={onExploreStores}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent text-[#FFFFFF] border border-[#FFFFFF]/60 text-[11px] font-mono uppercase tracking-[0.22em] px-8 py-4 hover:bg-[#FFFFFF] hover:text-[#111111] transition-all duration-300 backdrop-blur-xs"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>EXPLORE STORES</span>
          </a>
        </div>
      </div>

      {/* Bottom Subtle Indicator */}
      <div className="absolute bottom-6 inset-x-0 flex justify-between items-center max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 text-[9px] font-mono uppercase tracking-[0.25em] text-[#A39E93]">
        <span className="hidden sm:inline">20+ INDEPENDENT ATELIERS</span>
        <span>FREE SHIPPING OVER ₹999</span>
        <span className="hidden sm:inline">SS/26 CURATION</span>
      </div>
    </section>
  );
};
