import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { getImageUrl, DEFAULT_COVER_FALLBACK } from '../../utils/imageUrl';

export const StoreCard = ({ store, index }) => {
  const storeNumber = index !== undefined ? `STORE 0${index + 1}` : 'FEATURED STORE';
  const coverUrl = getImageUrl(
    store.coverImage || store.banner?.url || store.banner || store.logo?.url || store.logo,
    DEFAULT_COVER_FALLBACK
  );
  const logoUrl = getImageUrl(store.logo?.url || store.logo, null);
  const rating = Number(store.rating || store.ratingAverage || 4.9).toFixed(1);
  const location = store.location || (store.address?.city ? `${store.address.city}, ${store.address.country || 'Global'}` : 'Paris, France');
  const tagline = store.tagline || store.category || 'Curated Atelier';
  const itemCount = store.itemCount || (store.productCount ? `${store.productCount} Items` : 'Featured Collection');
  const storeSlug = store.slug || store._id || store.id;

  return (
    <div className="group bg-white border border-[#E5E3DF] overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-[#111111]/40 transition-all duration-300">
      {/* Cover Image Frame */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F2EFE9]">
        <img
          src={coverUrl}
          alt={store.name}
          className="w-full h-full object-cover object-center group-hover:scale-[1.05] transition-transform duration-700 ease-out"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_COVER_FALLBACK;
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <span className="bg-[#111111] text-[#F8F7F4] text-[8px] font-mono uppercase tracking-[0.2em] px-2 py-1 shadow-sm font-semibold">
            {storeNumber}
          </span>
          <span className="bg-white/95 backdrop-blur-sm text-[#111111] text-[8px] font-mono uppercase tracking-[0.2em] px-2 py-1 border border-black/10 font-bold flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            VERIFIED
          </span>
        </div>

        {/* Logo overlay on cover bottom right */}
        {logoUrl && (
          <div className="absolute -bottom-3 right-4 w-10 h-10 rounded-full bg-white p-0.5 shadow-md border border-slate-200 z-10 overflow-hidden">
            <img src={logoUrl} alt={store.name} className="w-full h-full rounded-full object-cover" />
          </div>
        )}
      </div>

      {/* Body Details */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8E877F] uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1 truncate max-w-[150px]">
              <MapPin className="w-3 h-3 text-[#111111] shrink-0" />
              <span className="truncate">{location}</span>
            </span>
            <span className="flex items-center text-[#111111] font-mono font-bold shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
              {rating}
            </span>
          </div>

          {/* Store Name */}
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#111111] mb-1 group-hover:underline">
            {store.name}
          </h3>

          <p className="text-[11px] font-mono uppercase tracking-wider text-[#8E877F] mb-3">
            {tagline}
          </p>

          <p className="text-xs text-[#666666] font-sans line-clamp-2 mb-4 leading-relaxed">
            {store.description || 'Exclusive boutique collection crafted with exceptional materials and timeless contemporary design.'}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-4 border-t border-[#E5E3DF] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#111111] uppercase tracking-wider font-semibold">
            {itemCount}
          </span>

          <Link
            to={`/store/${storeSlug}`}
            className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#111111] hover:text-indigo-600 transition-colors font-bold group/link"
          >
            <span>VISIT STORE</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
