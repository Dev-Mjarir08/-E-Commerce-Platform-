import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, Eye, Plus } from 'lucide-react';
import { lookbookSets } from '../../data/lookbook';
import { products } from '../../data/products';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';

export const LookbookSection = ({ onQuickView, onShowToast }) => {
  const dispatch = useDispatch();
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState(null);

  const currentLook = lookbookSets[activeLookIndex];

  const handleHotspotAdd = (e, hs) => {
    e.stopPropagation();
    const product = products.find(p => p.id === hs.productId);
    if (product) {
      dispatch(
        addToCart({
          product,
          size: product.sizes ? product.sizes[0] : 'Standard',
          color: hs.color,
          quantity: 1
        })
      );
      if (onShowToast) onShowToast(`Added ${hs.title} to bag.`);
    }
  };

  const handleHotspotQuickView = (e, hs) => {
    e.stopPropagation();
    const product = products.find(p => p.id === hs.productId);
    if (product && onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <section id="lookbook" className="py-16 md:py-24 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 border-b border-[#E5E3DF]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E5E3DF]">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-[#666666] block mb-2">
            INTERACTIVE LOOKBOOK • SS-26
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
            Shop The Architectural Look
          </h2>
        </div>

        {/* Look Selector Tabs */}
        <div className="flex items-center gap-2 mt-4 md:mt-0 overflow-x-auto no-scrollbar">
          {lookbookSets.map((look, idx) => (
            <button
              key={look.id}
              type="button"
              onClick={() => {
                setActiveLookIndex(idx);
                setActiveHotspotId(null);
              }}
              className={`text-[11px] font-mono uppercase tracking-[0.18em] px-4 py-2 border transition-all duration-200 whitespace-nowrap ${
                activeLookIndex === idx
                  ? 'bg-[#111111] text-[#F8F7F4] border-[#111111]'
                  : 'bg-[#FFFFFF] text-[#666666] border-[#E5E3DF] hover:border-[#111111]'
              }`}
            >
              {look.season}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Interactive Photography with Hotspots (7 cols) */}
        <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/3] xl:aspect-[16/11] w-full overflow-hidden bg-[#EFECE6] border border-[#E5E3DF]">
          <img
            src={currentLook.image}
            alt={currentLook.title}
            className="w-full h-full object-cover object-center transition-all duration-700"
          />

          {/* Hotspots */}
          {currentLook.hotspots.map((hs) => {
            const isActive = activeHotspotId === hs.id;
            return (
              <div
                key={hs.id}
                style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                className={`hotspot-point ${isActive ? 'active' : ''}`}
                onClick={() => setActiveHotspotId(isActive ? null : hs.id)}
              >
                {/* Radar pulse */}
                <div className="hotspot-pulse" />

                {/* Dot */}
                <div className="hotspot-dot">
                  <Plus className="w-3.5 h-3.5" />
                </div>

                {/* Floating Preview Card */}
                <div className="hotspot-card text-left">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#8E877F] block">
                    {hs.label}
                  </span>
                  <p className="font-serif text-xs font-medium text-[#111111] mt-0.5 line-clamp-1">
                    {hs.title}
                  </p>
                  <p className="text-xs font-mono font-semibold text-[#111111] mt-1">
                    {hs.price}
                  </p>

                  <div className="flex gap-1.5 mt-2.5 pt-2 border-t border-[#E5E3DF]">
                    <button
                      type="button"
                      onClick={(e) => handleHotspotAdd(e, hs)}
                      className="flex-1 bg-[#111111] text-[#F8F7F4] text-[9px] font-mono uppercase tracking-wider py-1.5 px-2 hover:bg-[#2B2B2B] transition-colors flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="w-2.5 h-2.5" />
                      <span>BAG</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleHotspotQuickView(e, hs)}
                      className="border border-[#111111] text-[#111111] p-1.5 hover:bg-[#111111] hover:text-[#FFFFFF] transition-colors"
                      title="Inspect piece"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Look Breakdown & Garment List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#8E877F] block mb-2">
            {currentLook.season}
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal leading-tight mb-2">
            {currentLook.title}
          </h3>
          <p className="text-xs text-[#666666] font-mono uppercase tracking-wider mb-4">
            {currentLook.subtitle}
          </p>
          <blockquote className="border-l-2 border-[#111111] pl-4 py-1 text-xs sm:text-sm font-serif italic text-[#666666] mb-8">
            {currentLook.quote}
          </blockquote>

          {/* Garments in this look */}
          <div className="space-y-3 border-t border-[#E5E3DF] pt-6">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E877F] block mb-2">
              COORDINATES IN THIS LOOK
            </span>
            {currentLook.hotspots.map((hs) => (
              <div
                key={hs.id}
                className="flex items-center justify-between p-3 bg-[#FFFFFF] border border-[#E5E3DF] hover:border-[#111111] transition-all cursor-pointer group"
                onClick={() => {
                  const p = products.find(prod => prod.id === hs.productId);
                  if (p && onQuickView) onQuickView(p);
                }}
              >
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#8E877F] block">
                    {hs.label} • {hs.color}
                  </span>
                  <h4 className="font-serif text-sm text-[#111111] group-hover:underline">
                    {hs.title}
                  </h4>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="text-xs font-mono font-medium text-[#111111]">{hs.price}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#888888] group-hover:text-[#111111] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
