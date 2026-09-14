import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Star } from 'lucide-react';

export const StoreCard = ({ store, index }) => {
  const storeNumber = index !== undefined ? `STORE 0${index + 1}` : 'FEATURED STORE';

  return (
    <div className="group bg-[#FFFFFF] border border-[#E5E3DF] overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300">
      {/* Cover Image Frame */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F2EFE9]">
        <img
          src={store.coverImage}
          alt={store.name}
          className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <span className="bg-[#111111] text-[#F8F7F4] text-[8px] font-mono uppercase tracking-[0.2em] px-2 py-1 shadow-sm">
            {storeNumber}
          </span>
          {store.badge && (
            <span className="bg-[#FFFFFF]/90 backdrop-blur text-[#111111] text-[8px] font-mono uppercase tracking-[0.2em] px-2 py-1 border border-black/10">
              {store.badge}
            </span>
          )}
        </div>
      </div>

      {/* Body Details */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8E877F] uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#666666]" />
              {store.location}
            </span>
            <span className="flex items-center text-[#111111] font-mono">
              <Star className="w-3 h-3 fill-[#111111] text-[#111111] mr-1" />
              {store.rating}
            </span>
          </div>

          {/* Store Name */}
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#111111] mb-1 group-hover:underline">
            {store.name}
          </h3>

          <p className="text-[11px] font-mono uppercase tracking-wider text-[#8E877F] mb-3">
            {store.tagline}
          </p>

          <p className="text-xs text-[#666666] font-sans line-clamp-2 mb-4 leading-relaxed">
            {store.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-4 border-t border-[#E5E3DF] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#111111] uppercase tracking-wider font-medium">
            {store.itemCount}
          </span>

          <Link
            to={`/store/${store.slug}`}
            className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#111111] hover:text-[#666666] transition-colors group/link"
          >
            <span>EXPLORE</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
