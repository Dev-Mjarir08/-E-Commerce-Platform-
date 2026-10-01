import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X, ArrowRight, LayoutDashboard, Store, Package } from 'lucide-react';
import { openCart } from '../../redux/slices/cartSlice';
import { getImageUrl } from '../../utils/imageUrl';

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
    { label: 'Shop All', href: '/shop', isRouter: true },
    { label: 'Categories', href: '/categories', isRouter: true },
    { label: 'Orders', href: '/orders', isRouter: true },
    { label: 'New Arrivals', href: '/shop?filter=new-arrivals', isRouter: true },
    { label: 'Best Sellers', href: '/shop?filter=best-sellers', isRouter: true },
    { label: 'Stores', href: '#featured-stores' },
    { label: 'Sale', href: '/shop?filter=sale', isRouter: true }
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        isScrolled
          ? 'bg-[#F8F7F4]/95 backdrop-blur-md border-b border-[#E5E3DF] shadow-xs'
          : 'bg-[#F8F7F4] border-b border-[#E5E3DF]/70'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Platform Logo & Mobile Hamburger */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-[#111111] hover:text-[#666666] p-1.5 -ml-1.5 rounded-md hover:bg-[#111111]/5 transition-colors"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex flex-col group shrink-0">
            <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.2em] uppercase text-[#111111] font-normal leading-none">
              ATELIER
            </h1>
            <span className="block text-[8px] sm:text-[9px] font-mono tracking-[0.3em] text-[#8E877F] uppercase mt-1 group-hover:text-[#111111] transition-colors">
              CURATED GLOBAL MARKETPLACE
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 text-xs uppercase tracking-[0.18em] font-medium text-[#111111]">
          {navLinks.map((link) =>
            link.isRouter ? (
              <Link
                key={link.label}
                to={link.href}
                className="hover:text-[#666666] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#111111] hover:after:w-full after:transition-all after:duration-300 font-semibold"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#666666] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#111111] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        {/* Right: Actions (Search, Wishlist, Role Dashboard, Profile, Bag) */}
        <div className="flex items-center gap-1.5 sm:gap-3 text-[#111111] shrink-0">
          {/* Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="h-9 px-2.5 sm:px-3 rounded-full hover:bg-[#111111]/5 transition-colors flex items-center gap-2 text-xs font-mono uppercase tracking-wider"
            aria-label="Search garments and stores"
          >
            <Search className="w-4 h-4 text-[#111111]" />
            <span className="hidden xl:inline text-[11px]">Search</span>
          </button>

          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            className="h-9 w-9 rounded-full hover:bg-[#111111]/5 transition-colors flex items-center justify-center relative"
            aria-label="Wishlist"
            title="Wishlist Archive"
          >
            <Heart className="w-4 h-4 text-[#111111]" />
            {totalWishlistCount > 0 && (
              <span className="absolute 1 top-1 right-1 bg-[#111111] text-[#F8F7F4] text-[8px] font-mono w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalWishlistCount}
              </span>
            )}
          </Link>

          {/* Orders Link */}
          <Link
            to="/orders"
            className="h-9 w-9 rounded-full hover:bg-[#111111]/5 transition-colors flex items-center justify-center relative"
            aria-label="My Orders"
            title="My Orders & Consignments"
          >
            <Package className="w-4 h-4 text-[#111111]" />
          </Link>

          {/* Role-Based Operations Dashboard Button (Admin or Vendor only, never for Customer) */}
          {user && (user.role === 'admin' || user.role === 'vendor' || user.role === 'seller') && (
            <Link
              to={user.role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard'}
              className="h-9 inline-flex items-center gap-1.5 px-3 bg-[#111111] text-[#F8F7F4] hover:bg-[#2A2A2A] text-[10px] font-mono uppercase tracking-[0.16em] font-medium border border-[#111111] transition-all shadow-xs"
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

          {/* Account Profile - Precision aligned */}
          <Link
            to={user ? '/profile' : '/login'}
            className="h-9 flex items-center gap-2 p-0.5 sm:px-1.5 rounded-full hover:bg-[#111111]/5 transition-colors group"
            aria-label="Account"
            title={user ? `Signed in as ${user.name}` : 'Sign In / Register'}
          >
            <div className="relative w-8 h-8 rounded-full shrink-0 flex items-center justify-center overflow-hidden border border-[#111111]/20 shadow-2xs group-hover:border-[#111111] transition-colors">
              {user && (user.avatar?.url || (typeof user.avatar === 'string' && user.avatar)) ? (
                <img
                  src={getImageUrl(user.avatar?.url || user.avatar)}
                  alt={user.name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : user ? (
                <div className="w-full h-full bg-[#111111] text-[#F8F7F4] flex items-center justify-center text-xs font-bold font-mono tracking-wider">
                  {(user.name || 'User')
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'U'}
                </div>
              ) : (
                <div className="w-full h-full bg-[#EAE6DF] flex items-center justify-center text-[#111111]">
                  <User className="w-4 h-4 text-[#111111]" />
                </div>
              )}

              {user && (
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white" />
              )}
            </div>

            {user && (
              <span className="hidden xl:inline text-xs font-sans uppercase tracking-wider text-[#111111] font-semibold truncate max-w-[85px]">
                {user.name?.split(' ')?.[0] || 'Account'}
              </span>
            )}
          </Link>

          {/* Bag Button */}
          <button
            type="button"
            onClick={() => dispatch(openCart())}
            className="h-9 px-2.5 sm:px-3 rounded-full hover:bg-[#111111]/5 transition-colors flex items-center gap-2 relative text-xs font-mono uppercase tracking-wider"
            aria-label="Bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#111111]" />
            <span className="text-[11px] font-mono font-medium tracking-widest hidden sm:inline uppercase">
              BAG ({totalCartCount})
            </span>
            {totalCartCount > 0 && (
              <span className="sm:hidden absolute -top-1 -right-1 bg-[#111111] text-[#F8F7F4] text-[8px] font-mono w-4 h-4 rounded-full flex items-center justify-center font-bold">
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
              {navLinks.map((link) =>
                link.isRouter ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs uppercase font-mono tracking-[0.2em] py-2 border-b border-[#E5E3DF]/50 flex items-center justify-between text-[#111111] hover:text-[#666666] font-semibold"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8E877F]" />
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs uppercase font-mono tracking-[0.2em] py-2 border-b border-[#E5E3DF]/50 flex items-center justify-between text-[#111111] hover:text-[#666666]"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8E877F]" />
                  </a>
                )
              )}
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
