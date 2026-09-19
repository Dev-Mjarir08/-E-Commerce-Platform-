import React from 'react';

export const PageLoader = () => {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center bg-[#F8F7F4] text-[#111111] px-4 py-16">
      <div className="flex flex-col items-center gap-4">
        <h2 className="font-serif text-2xl tracking-[0.25em] uppercase font-normal animate-pulse">
          ATELIER
        </h2>
        <div className="w-24 h-[1px] bg-[#E5E3DF] overflow-hidden relative">
          <div className="absolute inset-0 bg-[#111111] w-1/2 animate-[shimmer_1.5s_infinite_ease-in-out]" />
        </div>
        <span className="text-[9px] font-mono tracking-[0.35em] text-[#8E877F] uppercase">
          CURATING EXPERIENCE...
        </span>
      </div>
    </div>
  );
};

export default PageLoader;
