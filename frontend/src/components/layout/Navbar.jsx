import {
  ArrowRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { openCart } from "../../redux/slices/cartSlice";

export const Navbar = ({ onOpenSearch, onOpenWishlist }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const totalCartCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  const totalWishlistCount = wishlistItems.length;

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "New Arrivals", href: "#new-arrivals" },
    { label: "Men", href: "#category-men" },
    { label: "Women", href: "#category-women" },
    { label: "Collections", href: "#collections" },
    { label: "Stores", href: "#featured-stores" },
    { label: "Sale", href: "#sale" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-m4m-bg/95 backdrop-blur-md border-b border-m4m-border shadow-xs py-3.5"
          : "bg-m4m-bg border-b border-m4m-border/50 py-5"
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        {/* Left: Platform Logo & Mobile Hamburger */}
        <div className="flex items-center gap-4 sm:gap-8">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-[#111111] hover:text-m4m-secondary p-1"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="inline-block group">
            <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.2em] uppercase text-[#111111] font-normal leading-none">
              ATELIER
            </h1>
            <span className="block text-[8px] sm:text-[9px] font-mono tracking-[0.35em] text-m4m-accent uppercase mt-1 group-hover:text-[#111111] transition-colors">
              INDEPENDENT FASHION SAAS
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.22em] font-medium text-[#111111]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`hover:text-m4m-secondary transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#111111] hover:after:w-full after:transition-all after:duration-300 ${
                link.label === "Sale" ? "text-m4m-accent font-semibold" : ""
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
            className="p-1.5 hover:text-m4m-secondary transition-colors flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider"
            aria-label="Search garments and stores"
          >
            <Search className="w-4 h-4" />
            <span className="hidden xl:inline text-[11px]">Search</span>
          </button>

          {/* Wishlist ♡ */}
          <button
            type="button"
            onClick={onOpenWishlist}
            className="p-1.5 hover:text-m4m-secondary transition-colors relative"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {totalWishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#111111] text-m4m-bg text-[8px] font-mono w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {totalWishlistCount}
              </span>
            )}
          </button>

          {/* Account */}
          <Link
            to="/login"
            className="p-1.5 hover:text-m4m-secondary transition-colors"
            aria-label="Account"
            title="Sign In / Account"
          >
            <User className="w-4 h-4" />
          </Link>

          {/* Bag */}
          <button
            type="button"
            onClick={() => dispatch(openCart())}
            className="p-1.5 hover:text-m4m-secondary transition-colors flex items-center gap-2 relative"
            aria-label="Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-[11px] font-mono font-medium tracking-widest hidden sm:inline uppercase">
              BAG ({totalCartCount})
            </span>
            {totalCartCount > 0 && (
              <span className="sm:hidden absolute -top-1 -right-1 bg-[#111111] text-m4m-bg text-[8px] font-mono w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-[#111111]/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-0 left-0 h-full w-full max-w-xs bg-m4m-bg text-[#111111] p-6 shadow-2xl flex flex-col justify-between transition-transform duration-500 ease-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex justify-between items-center pb-5 border-b border-m4m-border mb-6">
              <div>
                <h2 className="font-serif text-xl tracking-widest uppercase">
                  ATELIER
                </h2>
                <span className="text-[9px] font-mono tracking-widest text-m4m-accent uppercase">
                  INDEPENDENT FASHION
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-m4m-secondary hover:text-[#111111]"
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
                  className="text-xs uppercase font-mono tracking-[0.2em] py-2 border-b border-m4m-border/50 flex items-center justify-between text-[#111111] hover:text-m4m-secondary"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-m4m-accent" />
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-m4m-border space-y-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left text-xs font-mono uppercase tracking-wider py-2 flex items-center gap-2 text-[#111111] hover:text-m4m-secondary"
            >
              <User className="w-4 h-4" />
              <span>CLIENT ACCOUNT / SIGN IN</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenSearch) onOpenSearch();
              }}
              className="w-full text-left text-xs font-mono uppercase tracking-wider py-2 flex items-center gap-2 text-m4m-secondary"
            >
              <Search className="w-4 h-4" />
              <span>SEARCH ARCHIVE</span>
            </button>
            <div className="text-[10px] font-mono text-m4m-accent uppercase tracking-wider">
              CLIENT SERVICES • CONCIERGE@ATELIER.COM
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
