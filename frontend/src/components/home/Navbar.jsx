import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, ArrowRight, Store } from 'lucide-react';
import { openCart } from '../../redux/slices/cartSlice';

export const Navbar = ({ onOpenSearch, onOpenWishlist }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistCount = wishlistItems.length;

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Collections', href: '#collections' },
    { label: 'Catalog', href: '#catalog' },
    { label: 'Essentials', href: '#curated-essentials' },
    { label: 'Editorial', href: '#editorial' },
    { label: 'Lookbook', href: '#lookbook' },
    { label: 'Ateliers', href: '#featured-stores' }
  ];

  return (
    <header
      className={`sticky top-0 z-30 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F8F7F4]/95 backdrop-blur-md border-b border-[#E5E3DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] py-3'
          : 'bg-[#F8F7F4] border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        {/* Left: Mobile Hamburger & Desktop Nav Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-[#111111] hover:text-[#666666] p-1.5 transition-colors"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[11px] uppercase tracking-[0.22em] font-medium text-[#111111]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#666666] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#111111] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Center: Iconic Brand Wordmark */}
        <div className="text-center">
          <a href="#" className="inline-block group">
            <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.25em] uppercase text-[#111111] font-normal leading-none">
              M4M
            </h1>
            <span className="block text-[8px] sm:text-[9px] font-mono tracking-[0.35em] text-[#666666] uppercase mt-1 group-hover:text-[#111111] transition-colors">
              FOR MEN • ATELIER
            </span>
          </a>
        </div>

        {/* Right: Actions (Search, Wishlist, Account, Bag) */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="text-[#111111] hover:text-[#666666] p-1.5 transition-colors flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider"
            aria-label="Search garments"
          >
            <Search className="w-4 h-4" />
            <span className="hidden xl:inline text-[11px]">Search</span>
          </button>

          {/* Wishlist Indicator */}
          <button
            type="button"
            onClick={onOpenWishlist}
            className="text-[#111111] hover:text-[#666666] p-1.5 transition-colors relative"
            aria-label="View saved wishlist"
          >
            <Heart className="w-4 h-4" />
            {totalWishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#111111] text-[#F8F7F4] text-[8px] font-mono w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {totalWishlistCount}
              </span>
            )}
          </button>

          {/* Account Profile Link */}
          <Link
            to="/login"
            className="text-[#111111] hover:text-[#666666] p-1.5 transition-colors inline-block"
            aria-label="My Client Profile"
            title="Sign In / Account"
          >
            <User className="w-4 h-4" />
          </Link>

          {/* Bag / Cart Trigger */}
          <button
            type="button"
            onClick={() => dispatch(openCart())}
            className="text-[#111111] hover:text-[#666666] p-1.5 transition-colors flex items-center gap-2 relative"
            aria-label="Open shopping bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-[11px] font-mono font-medium tracking-widest hidden sm:inline uppercase">
              BAG ({totalCartCount})
            </span>
            {totalCartCount > 0 && (
              <span className="sm:hidden absolute -top-1 -right-1 bg-[#111111] text-[#F8F7F4] text-[8px] font-mono w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-[#111111]/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-0 left-0 h-full w-full max-w-xs bg-[#F8F7F4] text-[#111111] p-6 shadow-2xl flex flex-col justify-between transition-transform duration-500 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            <div className="flex justify-between items-center pb-6 border-b border-[#E5E3DF] mb-6">
              <div>
                <h2 className="font-serif text-xl tracking-widest">M4M FOR MEN</h2>
                <span className="text-[9px] font-mono tracking-widest text-[#666666] uppercase">
                  SPRING / SUMMER 2026
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-[#666666] hover:text-[#111111]"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs uppercase font-mono tracking-[0.2em] py-2 border-b border-[#E5E3DF]/50 flex items-center justify-between text-[#111111] hover:text-[#666666]"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#888888]" />
                </a>
              ))}
            </nav>
          </div>

          {/* Mobile Menu Footer */}
          <div className="pt-6 border-t border-[#E5E3DF] space-y-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left text-xs font-mono uppercase tracking-wider py-2 flex items-center gap-2 text-[#111111] hover:text-[#666666]"
            >
              <User className="w-4 h-4" />
              <span>CLIENT ACCOUNT / SIGN IN</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full text-left text-xs font-mono uppercase tracking-wider py-2 flex items-center gap-2 text-[#666666]"
            >
              <Search className="w-4 h-4" />
              <span>SEARCH CATALOG</span>
            </button>
            <div className="text-[10px] font-mono text-[#8E877F] uppercase tracking-wider">
              CLIENT SERVICES • CONCIERGE@M4M.COM
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
