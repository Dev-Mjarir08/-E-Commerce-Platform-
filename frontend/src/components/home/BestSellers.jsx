import { useState } from 'react';
import { products } from '../../data/marketplaceData';
import { ProductCard } from '../product/ProductCard';

export const BestSellers = ({ onQuickView, onShowToast }) => {
  const [activeTab, setActiveTab] = useState('ALL');

  const tabs = ['ALL', 'MEN', 'WOMEN', 'ACCESSORIES'];

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'ALL') return p.isBestSeller || p.isTrending;
    if (activeTab === 'MEN') return p.category === 'men';
    if (activeTab === 'WOMEN') return p.category === 'women';
    if (activeTab === 'ACCESSORIES') return p.category === 'accessories' || p.category === 'shoes';
    return true;
  });

  return (
    <section id="best-sellers" className="py-16 md:py-24 bg-[#FAF9F6] border-b border-m4m-border">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-m4m-border gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-m4m-secondary block mb-2">
              CLIENT FAVORITES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
              Best Sellers
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`text-[11px] font-mono uppercase tracking-[0.2em] px-4 py-2 border transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#111111] text-m4m-bg border-[#111111]'
                    : 'bg-m4m-card text-m4m-secondary border-m4m-border hover:border-[#111111] hover:text-[#111111]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 4-column responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
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
