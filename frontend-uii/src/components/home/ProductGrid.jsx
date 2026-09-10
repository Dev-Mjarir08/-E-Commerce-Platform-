import React, { useState, useEffect } from 'react';
import { LayoutGrid, Grid3X3, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { productService } from '../../services/productService';

export const ProductGrid = ({ selectedCategory, onSelectCategory, onQuickView, onShowToast }) => {
  const [activeTab, setActiveTab] = useState(selectedCategory || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [productsList, setProductsList] = useState([]);
  const [viewColumns, setViewColumns] = useState(4); // 4 for normal, 2 for large editorial

  useEffect(() => {
    if (selectedCategory) {
      setActiveTab(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await productService.getProducts({
        category: activeTab,
        sort: sortBy
      });
      setProductsList(data);
    };
    fetchProducts();
  }, [activeTab, sortBy]);

  const tabs = [
    { id: 'all', label: 'All Catalog' },
    { id: 'outerwear', label: 'Outerwear' },
    { id: 'tailoring', label: 'Tailoring' },
    { id: 'knitwear', label: 'Knitwear' },
    { id: 'trousers', label: 'Trousers' },
    { id: 'footwear', label: 'Footwear' },
    { id: 'accessories', label: 'Accessories' }
  ];

  return (
    <section id="catalog" className="py-16 md:py-24 bg-[#FAF9F6] border-y border-[#E5E3DF]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-[#E5E3DF] pb-4">
          <div>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-[#666666] block mb-2">
              SS/26 FULL ARCHIVE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
              Essential Garments & Tailoring
            </h2>
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#666666] mt-2 md:mt-0">
            SHOWING {productsList.length} PIECES
          </span>
        </div>

        {/* Filter Controls Bar: Category Tabs on Left, Sort & View Toggle on Right */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10 pb-4 border-b border-[#E5E3DF]">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  if (onSelectCategory) onSelectCategory(tab.id);
                }}
                className={`text-[11px] font-mono uppercase tracking-[0.16em] px-3.5 py-2 border transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#111111] text-[#F8F7F4] border-[#111111]'
                    : 'bg-[#FFFFFF] text-[#666666] border-[#E5E3DF] hover:border-[#111111] hover:text-[#111111]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort & Grid Toggle Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-4">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E877F] hidden sm:inline">
                SORT:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FFFFFF] border border-[#E5E3DF] px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
              >
                <option value="featured">Featured Archive</option>
                <option value="newest">Newest Releases</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Client Rating</option>
              </select>
            </div>

            {/* Grid Density View Switcher (Desktop) */}
            <div className="hidden sm:flex items-center border border-[#E5E3DF] bg-[#FFFFFF]">
              <button
                type="button"
                onClick={() => setViewColumns(2)}
                className={`p-1.5 transition-colors ${
                  viewColumns === 2 ? 'bg-[#111111] text-[#FFFFFF]' : 'text-[#666666] hover:text-[#111111]'
                }`}
                title="2-Column Editorial View"
                aria-label="2-column view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewColumns(4)}
                className={`p-1.5 transition-colors ${
                  viewColumns === 4 ? 'bg-[#111111] text-[#FFFFFF]' : 'text-[#666666] hover:text-[#111111]'
                }`}
                title="4-Column Grid View"
                aria-label="4-column view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Cards Grid: 2 columns on mobile, 3 on tablet, 4 or 2 on desktop */}
        <div
          className={`grid gap-4 sm:gap-6 ${
            viewColumns === 2
              ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-2'
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          }`}
        >
          {productsList.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
