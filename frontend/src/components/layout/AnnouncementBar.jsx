import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const messages = [
    'FREE SHIPPING ON ORDERS OVER ₹999',
    'DISCOVER CONTEMPORARY PIECES FROM 20+ INDEPENDENT ATELIERS',
    'USE CODE ATELIER10 FOR 10% OFF YOUR FIRST ORDER'
  ];

  if (!isVisible) return null;

  return (
    <aside className="bg-[#111111] text-[#F8F7F4] text-[10px] sm:text-[11px] font-mono tracking-[0.18em] uppercase py-2.5 px-4 relative z-40 border-b border-[#222222]">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length)}
          className="text-[#888888] hover:text-[#FFFFFF] transition-colors p-0.5"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="text-center flex-grow overflow-hidden px-2">
          <span key={currentIndex} className="inline-block transition-opacity duration-300">
            {messages[currentIndex]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % messages.length)}
            className="text-[#888888] hover:text-[#FFFFFF] transition-colors p-0.5"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="text-[#888888] hover:text-[#FFFFFF] transition-colors p-0.5 ml-1"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
