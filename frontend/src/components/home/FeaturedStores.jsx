import { useShopData } from '../../context/ShopDataContext';
import { StoreCard } from '../store/StoreCard';
import { Store, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const FALLBACK_STORES = [
  {
    _id: 'store-1',
    name: 'Atelier Marais',
    slug: 'atelier-marais',
    location: 'Paris, France',
    ratingAverage: 4.9,
    category: 'Haute Horology & Fine Tailoring',
    description: 'Bespoke tailoring, handcrafted silks, and refined timeless outerwear curated from France.',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    itemCount: '48 Exclusive Pieces',
    isVerified: true
  },
  {
    _id: 'store-2',
    name: 'Aura Minimalist',
    slug: 'aura-minimalist',
    location: 'Copenhagen, Denmark',
    ratingAverage: 4.8,
    category: 'Scandi Modern Essentials',
    description: 'Clean architectural silhouettes, sustainable organic cashmere, and minimalist wardrobe essentials.',
    coverImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=1200',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    itemCount: '32 Curated Styles',
    isVerified: true
  },
  {
    _id: 'store-3',
    name: 'Velvet & Stone',
    slug: 'velvet-and-stone',
    location: 'Milan, Italy',
    ratingAverage: 5.0,
    category: 'Artisanal Italian Leather',
    description: 'Vegetable-tanned leather duffles, Goodyear-welted dress shoes, and handcrafted goods from Tuscany.',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200',
    logo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300',
    itemCount: '64 Premium Pieces',
    isVerified: true
  },
  {
    _id: 'store-4',
    name: 'Solarium Studio',
    slug: 'solarium-studio',
    location: 'Kyoto, Japan',
    ratingAverage: 4.9,
    category: 'Japanese Selvedge & Techwear',
    description: 'Raw denim weaves, indigo-dyed utility kimonos, and weather-resistant modern urban outerwear.',
    coverImage: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200',
    logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    itemCount: '28 Designer Editions',
    isVerified: true
  }
];

export const FeaturedStores = () => {
  const { stores } = useShopData();

  // Combine live MongoDB stores with fallback premier boutiques so showcase is always populated
  const displayStores = stores && stores.length > 0
    ? [...stores, ...FALLBACK_STORES.slice(stores.length)].slice(0, 8)
    : FALLBACK_STORES;

  return (
    <section id="featured-stores" className="py-16 md:py-24 bg-[#FAF9F6] border-b border-[#E5E3DF]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E5E3DF]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Store className="w-4 h-4 text-[#111111]" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-[#8E877F] flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3 h-3 text-amber-500" />
                MULTI-TENANT LUXURY ATELIERS
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
              Discover Our Stores
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] font-sans mt-1.5 max-w-xl">
              Shop bespoke collections from independent verified designers, flagship boutiques, and artisan ateliers.
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8E877F] font-bold">
              {displayStores.length} VERIFIED BOUTIQUES
            </span>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#111111] hover:text-indigo-600 font-bold group"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Stores Grid: 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStores.map((store, index) => (
            <StoreCard key={store._id || store.id || store.slug || index} store={store} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
