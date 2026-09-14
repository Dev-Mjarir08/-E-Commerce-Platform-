import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, ArrowRight, Store } from 'lucide-react';
import { products, stores } from '../../data/marketplaceData';
import { Link } from 'react-router-dom';

export const SearchModal = ({ isOpen, onClose, onSelectProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

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
    'Oversized T-Shirt',
    'Wool Blazer',
    'Cargo Pants',
    'Nova Studio',
    'Cashmere',
    'Belgian Loafers',
    'Urban Threads'
  ];

  const recentSearches = ['Heavyweight Tee', 'Linen Shirt', 'Mono Label'];

  const filteredProducts = searchTerm.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.fabric.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const filteredStores = searchTerm.trim()
    ? stores.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-[#111111]/80 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      <div
        className={`relative z-10 max-w-4xl mx-auto px-4 pt-16 pb-12 transition-transform duration-400 ease-out ${
          isOpen ? 'translate-y-0' : '-translate-y-6'
        }`}
      >
        <div className="bg-[#FFFFFF] p-6 sm:p-10 shadow-2xl border border-[#E5E3DF]">
          {/* Header with Close */}
          <div className="flex items-center justify-between border-b border-[#E5E3DF] pb-4 mb-6">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#666666]">
              UNIFIED MARKETPLACE SEARCH
            </span>
            <button
              onClick={handleClose}
              className="text-[#666666] hover:text-[#111111] p-1 transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E877F]" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, brands or stores..."
              className="w-full bg-[#F8F7F4] border border-[#E5E3DF] py-4 pl-12 pr-12 text-sm sm:text-base font-sans placeholder-[#8E877F] text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Recent & Trending Searches (Default state) */}
          {!searchTerm && (
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E877F] mb-3">
                  RECENT SEARCHES
                </p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className="text-xs font-sans px-3.5 py-1.5 bg-[#FAF9F6] border border-[#E5E3DF] hover:border-[#111111] text-[#111111] transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E877F] mb-3">
                  TRENDING SEARCHES
                </p>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className="text-xs font-sans px-3.5 py-1.5 bg-[#F8F7F4] border border-[#E5E3DF] hover:border-[#111111] hover:bg-[#FFFFFF] text-[#111111] transition-all tracking-wide"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Stores */}
              <div className="pt-4 border-t border-[#E5E3DF]">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E877F] mb-3">
                  FEATURED BRANDS & STORES
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {stores.map((s) => (
                    <Link
                      key={s.id}
                      to={`/store/${s.slug}`}
                      onClick={onClose}
                      className="p-3 border border-[#E5E3DF] hover:border-[#111111] transition-all flex items-center gap-2 group"
                    >
                      <Store className="w-4 h-4 text-[#8E877F] group-hover:text-[#111111]" />
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
            <div className="mt-6 border-t border-[#E5E3DF] pt-6 max-h-[60vh] overflow-y-auto pr-2 space-y-6">
              {/* Stores matched */}
              {filteredStores.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E877F] block mb-3">
                    MATCHING STORES ({filteredStores.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredStores.map((s) => (
                      <Link
                        key={s.id}
                        to={`/store/${s.slug}`}
                        onClick={onClose}
                        className="p-3 bg-[#FAF9F6] border border-[#E5E3DF] hover:border-[#111111] flex items-center justify-between group"
                      >
                        <div>
                          <h5 className="font-serif text-sm text-[#111111] group-hover:underline">
                            {s.name}
                          </h5>
                          <p className="text-[11px] text-[#666666] font-sans truncate max-w-xs">
                            {s.tagline}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#8E877F] group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products matched */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E877F] block mb-3">
                  MATCHING PRODUCTS ({filteredProducts.length})
                </span>

                {filteredProducts.length === 0 && filteredStores.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="font-serif text-lg text-[#111111]">
                      No results found for "{searchTerm}"
                    </p>
                    <p className="text-xs text-[#666666] mt-1 font-sans">
                      Try another search or explore our latest collections.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onClose();
                          if (onSelectProduct) onSelectProduct(p);
                        }}
                        className="group flex gap-4 p-3 border border-[#E5E3DF] hover:border-[#111111] hover:bg-[#F8F7F4] transition-all cursor-pointer"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-16 h-20 object-cover bg-[#EFECE6] shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-center">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E877F]">
                            {p.storeName}
                          </span>
                          <h4 className="text-xs font-medium uppercase tracking-wide text-[#111111] group-hover:underline line-clamp-1">
                            {p.name}
                          </h4>
                          <p className="text-xs font-mono font-medium text-[#111111] mt-1">
                            ₹{p.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="flex items-center text-[#888888] group-hover:text-[#111111] transition-colors pr-2">
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
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
