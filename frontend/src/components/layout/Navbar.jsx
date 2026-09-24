import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X, ArrowRight, LayoutDashboard, Store } from 'lucide-react';
import { openCart } from '../../redux/slices/cartSlice';

export const Navbar = ({ onOpenSearch, onOpenWishlist }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistCount = wishlistItems.length;

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'All Departments', href: '#category-section' },
    { label: 'Electronics', href: '#category-section' },
    { label: 'Fashion', href: '#category-section' },
    { label: 'Footwear', href: '#category-section' },
    { label: 'Watches', href: '#category-section' },
    { label: 'Stores', href: '#featured-stores' },
    { label: 'Deals', href: '#sale' }
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F8F7F4]/95 backdrop-blur-md border-b border-[#E5E3DF] shadow-xs py-3.5'
          : 'bg-[#F8F7F4] border-b border-[#E5E3DF]/50 py-5'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        {/* Left: Platform Logo & Mobile Hamburger */}
        <div className="flex items-center gap-4 sm:gap-8">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-[#111111] hover:text-[#666666] p-1"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="inline-block group">
            <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.2em] uppercase text-[#111111] font-normal leading-none">
              ATELIER
            </h1>
            <span className="block text-[8px] sm:text-[9px] font-mono tracking-[0.35em] text-[#8E877F] uppercase mt-1 group-hover:text-[#111111] transition-colors">
              GLOBAL MULTI-CATEGORY MARKETPLACE
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.22em] font-medium text-[#111111]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`hover:text-[#666666] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#111111] hover:after:w-full after:transition-all after:duration-300 ${
                link.label === 'Sale' ? 'text-[#8E877F] font-semibold' : ''
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Actions (Search, Wishlist ♡, Account, Bag) */}
        <div className="flex items-center gap-3 sm:gap-5 text-[#111111]">
          {/* Search */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-1.5 hover:text-[#666666] transition-colors flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider"
            aria-label="Search garments and stores"
          >
            <Search className="w-4 h-4" />
            <span className="hidden xl:inline text-[11px]">Search</span>
          </button>

          {/* Wishlist ♡ */}
          <Link
            to="/wishlist"
            className="p-1.5 hover:text-[#666666] transition-colors relative"
            aria-label="Wishlist"
            title="Wishlist Archive"
          >
            <Heart className="w-4 h-4" />
            {totalWishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#111111] text-[#F8F7F4] text-[8px] font-mono w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {totalWishlistCount}
              </span>
            )}
          </Link>

          {/* Role-Based Operations Dashboard Button (Admin or Vendor only, never for Customer) */}
          {user && (user.role === 'admin' || user.role === 'vendor' || user.role === 'seller') && (
            <Link
              to={user.role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] text-[#F8F7F4] hover:bg-[#2A2A2A] text-[10px] font-mono uppercase tracking-[0.18em] font-medium border border-[#111111] transition-all shadow-xs"
              title={user.role === 'admin' ? 'Open Admin Control Suite' : 'Open Vendor Atelier Portal'}
            >
              {user.role === 'admin' ? (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Admin Dashboard</span>
                  <span className="sm:hidden">Admin</span>
                </>
              ) : (
                <>
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Vendor Dashboard</span>
                  <span className="sm:hidden">Vendor</span>
                </>
              )}
            </Link>
          )}

          {/* Account */}
          <Link
            to={user ? '/profile' : '/login'}
            className="p-1.5 hover:text-[#666666] transition-colors"
            aria-label="Account"
            title={user ? `Signed in as ${user.name}` : 'Sign In / Account'}
          >
            <User className="w-4 h-4" />
          </Link>

          {/* Bag */}
          <button
            type="button"
            onClick={() => dispatch(openCart())}
            className="p-1.5 hover:text-[#666666] transition-colors flex items-center gap-2 relative"
            aria-label="Bag"
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

      {/* Mobile Navigation Drawer */}
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
            <div className="flex justify-between items-center pb-5 border-b border-[#E5E3DF] mb-6">
              <div>
                <h2 className="font-serif text-xl tracking-widest uppercase">ATELIER</h2>
                <span className="text-[9px] font-mono tracking-widest text-[#8E877F] uppercase">
                  INDEPENDENT FASHION
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-[#666666] hover:text-[#111111]"
                aria-label="Close menu"
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
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E877F]" />
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-[#E5E3DF] space-y-3">
            {/* Role-Based Operations Dashboard Button for Mobile (Admin / Vendor only) */}
            {user && (user.role === 'admin' || user.role === 'vendor' || user.role === 'seller') && (
              <Link
                to={user.role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-left text-xs font-mono uppercase tracking-wider py-2.5 px-3 bg-[#111111] text-[#F8F7F4] flex items-center justify-between transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  {user.role === 'admin' ? (
                    <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Store className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{user.role === 'admin' ? 'Admin Dashboard' : 'Vendor Dashboard'}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#F8F7F4]/70" />
              </Link>
            )}

            <Link
              to={user ? '/profile' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left text-xs font-mono uppercase tracking-wider py-2 flex items-center gap-2 text-[#111111] hover:text-[#666666]"
            >
              <User className="w-4 h-4" />
              <span>{user ? `ACCOUNT (${user.name})` : 'CLIENT ACCOUNT / SIGN IN'}</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenSearch) onOpenSearch();
              }}
              className="w-full text-left text-xs font-mono uppercase tracking-wider py-2 flex items-center gap-2 text-[#666666]"
            >
              <Search className="w-4 h-4" />
              <span>SEARCH ARCHIVE</span>
            </button>
            <div className="text-[10px] font-mono text-[#8E877F] uppercase tracking-wider">
              CLIENT SERVICES • CONCIERGE@ATELIER.COM
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
