import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrency } from '../../redux/slices/cartSlice';

export const AnnouncementBar = () => {
  const dispatch = useDispatch();
  const currentCurrency = useSelector((state) => state.cart.currency) || 'USD';

  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const announcements = [
    'COMPLIMENTARY WORLDWIDE EXPRESS SHIPPING ON ORDERS OVER $250',
    'SPRING / SUMMER 2026 ARCHIVE — NOW LIVE GLOBALLY',
    'PRIVATE BESPOKE ATELIER FITTINGS AVAILABLE IN MILAN & LONDON'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  if (!isVisible) return null;

  return (
    <aside className="bg-[#111111] text-[#F8F7F4] text-[10px] sm:text-[11px] font-mono tracking-[0.16em] uppercase py-2.5 px-4 relative z-40 border-b border-[#222222]">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between">
        {/* Prev Control */}
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length)}
          className="text-[#888888] hover:text-[#FFFFFF] transition-colors p-1"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Center Text with clean fade transition */}
        <div className="text-center flex-grow overflow-hidden px-3">
          <span
            key={currentIndex}
            className="inline-block transition-opacity duration-300 animate-in fade-in"
          >
            {announcements[currentIndex]}
          </span>
        </div>

        {/* Next, Currency & Dismiss */}
        <div className="flex items-center gap-3">
          {/* Currency Switcher */}
          <select
            value={currentCurrency}
            onChange={(e) => dispatch(setCurrency(e.target.value))}
            className="bg-transparent text-[#A39E93] hover:text-[#FFFFFF] text-[10px] font-mono border-none focus:outline-none cursor-pointer hidden sm:inline-block uppercase"
          >
            <option value="USD" className="bg-[#111111] text-[#F8F7F4]">USD ($)</option>
            <option value="EUR" className="bg-[#111111] text-[#F8F7F4]">EUR (€)</option>
            <option value="GBP" className="bg-[#111111] text-[#F8F7F4]">GBP (£)</option>
          </select>

          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % announcements.length)}
            className="text-[#888888] hover:text-[#FFFFFF] transition-colors p-1"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="text-[#888888] hover:text-[#FFFFFF] transition-colors p-1 ml-1"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
