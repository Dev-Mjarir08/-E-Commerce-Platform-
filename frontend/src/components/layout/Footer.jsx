import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-[#F8F7F4] pt-16 md:pt-20 pb-12 border-t border-[#222222]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-14 border-b border-[#222222]">
          {/* Platform Logo & Tagline (2 cols) */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <h2 className="font-serif text-3xl tracking-[0.2em] uppercase mb-2">
              ATELIER
            </h2>
            <p className="font-serif text-lg text-[#D4CEC5] font-light italic mb-4">
              Independent fashion. One destination.
            </p>
            <p className="text-xs text-[#8E877F] font-sans leading-relaxed max-w-sm mb-6">
              A unified contemporary fashion marketplace connecting discerning customers with independent clothing brands, bespoke tailoring houses, and artisan makers worldwide.
            </p>
            {/* Social Icons SVG */}
            <div className="flex items-center gap-5 text-[#8E877F]">
              <a href="#instagram" className="hover:text-[#FFFFFF] transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#facebook" className="hover:text-[#FFFFFF] transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
              <a href="#x" className="hover:text-[#FFFFFF] transition-colors" aria-label="X Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#pinterest" className="hover:text-[#FFFFFF] transition-colors" aria-label="Pinterest">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.057.241-.188.291-.437.175-1.644-.766-2.67-3.169-2.67-5.106 0-4.161 3.023-7.983 8.723-7.983 4.58 0 8.141 3.264 8.141 7.627 0 4.551-2.869 8.214-6.85 8.214-1.338 0-2.596-.696-3.027-1.516l-.824 3.143c-.298 1.144-1.107 2.578-1.649 3.454 1.237.382 2.553.589 3.916.589 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4CEC5] mb-4">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8E877F] font-sans">
              <li><a href="#new-arrivals" className="hover:text-[#FFFFFF] transition-colors">New Arrivals</a></li>
              <li><a href="#category-section" className="hover:text-[#FFFFFF] transition-colors">Men</a></li>
              <li><a href="#category-section" className="hover:text-[#FFFFFF] transition-colors">Women</a></li>
              <li><a href="#collections" className="hover:text-[#FFFFFF] transition-colors">Collections</a></li>
              <li><a href="#sale" className="hover:text-[#FFFFFF] transition-colors">Sale</a></li>
            </ul>
          </div>

          {/* Stores Column */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4CEC5] mb-4">
              STORES
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8E877F] font-sans">
              <li><a href="#featured-stores" className="hover:text-[#FFFFFF] transition-colors">All Stores</a></li>
              <li><a href="#featured-stores" className="hover:text-[#FFFFFF] transition-colors">Featured Stores</a></li>
              <li><Link to="/store/nova-studio" className="hover:text-[#FFFFFF] transition-colors">Nova Studio</Link></li>
              <li><Link to="/store/urban-threads" className="hover:text-[#FFFFFF] transition-colors">Urban Threads</Link></li>
              <li><Link to="/store/mono-label" className="hover:text-[#FFFFFF] transition-colors">Mono Label</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4CEC5] mb-4">
              HELP
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8E877F] font-sans">
              <li><a href="#contact" className="hover:text-[#FFFFFF] transition-colors">Contact</a></li>
              <li><a href="#shipping" className="hover:text-[#FFFFFF] transition-colors">Shipping</a></li>
              <li><a href="#returns" className="hover:text-[#FFFFFF] transition-colors">Returns</a></li>
              <li><a href="#faq" className="hover:text-[#FFFFFF] transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4CEC5] mb-4">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8E877F] font-sans">
              <li><a href="#about" className="hover:text-[#FFFFFF] transition-colors">About</a></li>
              <li><a href="#privacy" className="hover:text-[#FFFFFF] transition-colors">Privacy</a></li>
              <li><a href="#terms" className="hover:text-[#FFFFFF] transition-colors">Terms</a></li>
              <li><a href="#vendor-portal" className="hover:text-[#FFFFFF] transition-colors">Vendor Portal</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#666666]">
          <p>© 2026 ATELIER PLATFORM. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-[#FFFFFF] transition-colors uppercase">PRIVACY</a>
            <a href="#terms" className="hover:text-[#FFFFFF] transition-colors uppercase">TERMS</a>
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
