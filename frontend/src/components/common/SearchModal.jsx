import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, ArrowRight, Store } from 'lucide-react';
import { stores } from '../../data/marketplaceData';
import { useShopData } from '../../context/ShopDataContext';
import { Link } from 'react-router-dom';

export const SearchModal = ({ isOpen, onClose, onSelectProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);
  const { products: shopProducts } = useShopData();

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const trendingSearches = [
    'Wireless Headphones',
    'Mechanical Keyboard',
    'Water Bottle',
    'Cashmere',
    'Tailored Suit',
    'Oversized T-Shirt',
    'Accessories'
  ];

  const filteredProducts = searchTerm.trim()
    ? (shopProducts || []).filter((p) => {
        const title = p.title || p.name || '';
        const desc = p.description || '';
        const storeName = p.store?.name || p.storeName || '';
        const catName = p.category?.name || p.categoryName || '';
        const term = searchTerm.toLowerCase();
        return (
          title.toLowerCase().includes(term) ||
          desc.toLowerCase().includes(term) ||
          storeName.toLowerCase().includes(term) ||
          catName.toLowerCase().includes(term)
        );
      })
    : [];

  const filteredStores = searchTerm.trim()
    ? stores.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getImgUrl = (p) => {
    const raw = p.images?.[0];
    if (typeof raw === 'string') return raw;
    if (raw?.url) return raw.url;
    return p.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=500&q=80';
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111111]/75 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="fixed inset-0 z-10 flex items-start justify-center pt-16 sm:pt-24 px-4 pb-4">
        <div className="w-full max-w-2xl bg-m4m-card border border-m4m-border p-6 sm:p-8 shadow-2xl relative transition-all">
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-6 right-6 text-m4m-secondary hover:text-[#111111] p-1"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Search Header */}
          <div className="flex items-center gap-3 border-b-2 border-[#111111] pb-3 mb-6 pr-8">
            <SearchIcon className="w-5 h-5 text-[#111111] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search garments, electronics, materials or stores..."
              className="w-full text-base sm:text-lg font-serif text-[#111111] placeholder:text-m4m-secondary/60 bg-transparent focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-xs font-mono uppercase text-m4m-secondary hover:text-[#111111]"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Initial State: Trending searches */}
          {!searchTerm && (
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-m4m-accent mb-3">
                  POPULAR SEARCH TERMS
                </p>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className="text-xs font-sans px-3.5 py-1.5 bg-m4m-bg border border-m4m-border hover:border-[#111111] hover:bg-m4m-card text-[#111111] transition-all tracking-wide"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Stores */}
              <div className="pt-4 border-t border-m4m-border">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-m4m-accent mb-3">
                  FEATURED BRANDS & STORES
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {stores.map((s) => (
                    <Link
                      key={s.id}
                      to={`/store/${s.slug}`}
                      onClick={onClose}
                      className="p-3 border border-m4m-border hover:border-[#111111] transition-all flex items-center gap-2 group"
                    >
                      <Store className="w-4 h-4 text-m4m-accent group-hover:text-[#111111]" />
                      <span className="text-xs font-mono uppercase tracking-wider text-[#111111] truncate">
                        {s.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results State */}
          {searchTerm && (
            <div className="mt-6 border-t border-m4m-border pt-6 max-h-[60vh] overflow-y-auto pr-2 space-y-6">
              {/* Stores matched */}
              {filteredStores.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-m4m-accent block mb-3">
                    MATCHING STORES ({filteredStores.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredStores.map((s) => (
                      <Link
                        key={s.id}
                        to={`/store/${s.slug}`}
                        onClick={onClose}
                        className="p-3 bg-[#FAF9F6] border border-m4m-border hover:border-[#111111] flex items-center justify-between group"
                      >
                        <div>
                          <h5 className="font-serif text-sm text-[#111111] group-hover:underline">
                            {s.name}
                          </h5>
                          <p className="text-[11px] text-m4m-secondary font-sans truncate max-w-xs">
                            {s.tagline}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-m4m-accent group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products matched */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-m4m-accent block mb-3">
                  MATCHING PRODUCTS ({filteredProducts.length})
                </span>

                {filteredProducts.length === 0 && filteredStores.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="font-serif text-lg text-[#111111]">
                      No results found for "{searchTerm}"
                    </p>
                    <p className="text-xs text-m4m-secondary mt-1 font-sans">
                      Try another search or explore our complete catalog.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.map((p) => {
                      const prodId = p._id || p.id || p.slug;
                      const prodName = p.title || p.name || 'Atelier Product';
                      const prodPrice = Number(p.basePrice ?? p.price ?? 0);
                      const prodStore = p.store?.name || p.storeName || 'Atelier Boutique';

                      return (
                        <div
                          key={prodId}
                          onClick={() => {
                            onClose();
                            if (onSelectProduct) onSelectProduct(p);
                          }}
                          className="group flex gap-4 p-3 border border-m4m-border hover:border-[#111111] hover:bg-m4m-bg transition-all cursor-pointer"
                        >
                          <img
                            src={getImgUrl(p)}
                            alt={prodName}
                            className="w-16 h-20 object-cover bg-m4m-stone shrink-0"
                          />
                          <div className="flex-1 flex flex-col justify-center">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-m4m-accent">
                              {prodStore}
                            </span>
                            <h4 className="text-xs font-medium uppercase tracking-wide text-[#111111] group-hover:underline line-clamp-1">
                              {prodName}
                            </h4>
                            <p className="text-xs font-mono font-medium text-[#111111] mt-1">
                              ₹{prodPrice.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <div className="flex items-center text-[#888888] group-hover:text-[#111111] transition-colors pr-2">
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
