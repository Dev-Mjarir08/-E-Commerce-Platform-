import React from 'react';
import { ArrowUp, Globe } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-[#F8F7F4] pt-16 md:pt-20 pb-12 border-t border-[#222222]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-[#222222]">
          
          {/* Col 1: Brand Wordmark & Philosophy */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <h2 className="font-serif text-3xl tracking-[0.2em] uppercase mb-2">
              M4M FOR MEN
            </h2>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#8E877F] block mb-4">
              CONTEMPORARY LUXURY TAILORING
            </span>
            <p className="text-xs text-[#8E877F] font-sans leading-relaxed max-w-sm mb-6">
              Founded on the belief that men’s clothing should be defined by noble mono-materials, relaxed architectural drapery, and honest Italian craft.
            </p>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#D4CEC5] space-y-1">
              <p>ATELIER: VIA DEI CONDOTTI 42, ROMA</p>
              <p>CONCIERGE: SERVICE@M4M-MEN.COM</p>
            </div>
          </div>

          {/* Col 2: Shop Department */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4CEC5] mb-4">
              SHOP ARCHIVE
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8E877F] font-sans">
              <li><a href="#catalog" className="hover:text-[#FFFFFF] transition-colors">Outerwear & Greatcoats</a></li>
              <li><a href="#catalog" className="hover:text-[#FFFFFF] transition-colors">Naples Wool Suiting</a></li>
              <li><a href="#catalog" className="hover:text-[#FFFFFF] transition-colors">Mongolian Cashmere</a></li>
              <li><a href="#catalog" className="hover:text-[#FFFFFF] transition-colors">High-Rise Gabardine Trousers</a></li>
              <li><a href="#catalog" className="hover:text-[#FFFFFF] transition-colors">Hand-Welted Belgian Loafers</a></li>
              <li><a href="#catalog" className="hover:text-[#FFFFFF] transition-colors">Bridle Leather Travel Goods</a></li>
            </ul>
          </div>

          {/* Col 3: Client Services */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4CEC5] mb-4">
              CLIENT SERVICES
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8E877F] font-sans">
              <li><a href="#services" className="hover:text-[#FFFFFF] transition-colors">Bespoke Made-to-Measure</a></li>
              <li><a href="#services" className="hover:text-[#FFFFFF] transition-colors">Complimentary Express Shipping</a></li>
              <li><a href="#services" className="hover:text-[#FFFFFF] transition-colors">Worldwide Customs & Duties</a></li>
              <li><a href="#services" className="hover:text-[#FFFFFF] transition-colors">30-Day Hassle-Free Returns</a></li>
              <li><a href="#services" className="hover:text-[#FFFFFF] transition-colors">Garment Care & Cashmere Storage</a></li>
              <li><a href="#services" className="hover:text-[#FFFFFF] transition-colors">Book Private Atelier Appointment</a></li>
            </ul>
          </div>

          {/* Col 4: Platform & Ateliers */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4CEC5] mb-4">
              PLATFORM & ATELIERS
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8E877F] font-sans">
              <li><a href="#featured-stores" className="hover:text-[#FFFFFF] transition-colors">Urban Fashion Atelier (Milan)</a></li>
              <li><a href="#featured-stores" className="hover:text-[#FFFFFF] transition-colors">Nova Wear Studio (Florence)</a></li>
              <li><a href="#featured-stores" className="hover:text-[#FFFFFF] transition-colors">Mono Studio (Tokyo)</a></li>
              <li><a href="#featured-stores" className="hover:text-[#FFFFFF] transition-colors">Heritage Leatherworks (UK)</a></li>
              <li><a href="#about" className="hover:text-[#FFFFFF] transition-colors">Vendor SaaS Portal</a></li>
              <li><a href="#editorial" className="hover:text-[#FFFFFF] transition-colors">Editorial Journal</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal & Back to Top */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#666666]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#8E877F]">
              <Globe className="w-3.5 h-3.5" />
              <span>GLOBAL EDITION • USD ($)</span>
            </span>
            <span>© 2026 M4M FOR MEN PLATFORM. ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-[#FFFFFF] transition-colors uppercase">PRIVACY POLICY</a>
            <a href="#terms" className="hover:text-[#FFFFFF] transition-colors uppercase">TERMS OF SALE</a>
            <button
              onClick={scrollToTop}
              className="hover:text-[#FFFFFF] transition-colors flex items-center gap-1 uppercase"
            >
              <span>TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
