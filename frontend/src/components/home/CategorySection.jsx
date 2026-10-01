import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShopData } from '../../context/ShopDataContext';
import { getCategoryImageUrl, getCategoryFallbackImage } from '../../utils/imageUrl';

const FALLBACK_CATEGORIES = [
  {
    _id: 'cat-1',
    name: "Men's Luxury Fashion",
    slug: 'mens-fashion',
    itemCount: '124 Styles',
    tagline: 'Tailored Sartorial Suiting',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'cat-2',
    name: "Women's Couture",
    slug: 'womens-fashion',
    itemCount: '198 Styles',
    tagline: 'Timeless Contemporary Silhouettes',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'cat-3',
    name: 'Footwear & Loafers',
    slug: 'footwear-sneakers',
    itemCount: '86 Styles',
    tagline: 'Handcrafted Italian Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'cat-4',
    name: 'Watches & Horology',
    slug: 'accessories-jewelry',
    itemCount: '62 Styles',
    tagline: 'Automatic & Chronograph Editions',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'cat-5',
    name: 'Electronics & Audio',
    slug: 'electronics-gadgets',
    itemCount: '45 Styles',
    tagline: 'Acoustic Sound & Smart Tech',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
  }
];

export const CategorySection = () => {
  const { categories } = useShopData();

  // Combined list to ensure richness and guaranteed display
  const allCategories = categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  return (
    <section id="category-section" className="py-16 md:py-24 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 border-b border-[#E5E3DF]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E5E3DF]">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-[#8E877F] block mb-2 font-semibold">
            DEPARTMENT CURATIONS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
            Shop By Category
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] font-sans mt-1.5">
            Explore handcrafted collections and tailored curations across global ateliers.
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <span className="text-xs font-mono uppercase tracking-wider text-[#8E877F] font-bold">
            {allCategories.length} DEPARTMENTS
          </span>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#111111] hover:text-indigo-600 font-bold group"
          >
            <span>View All Categories</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Clean Full-Width Visual Grid (No Aside Bar on Homepage) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        {allCategories.slice(0, 5).map((cat, idx) => {
          const catSlug = cat.slug || cat._id || cat.id;
          const imageUrl = getCategoryImageUrl(cat);

          return (
            <Link
              key={cat._id || cat.id || cat.slug || idx}
              to={`/shop?category=${catSlug}`}
              className="group relative block aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-[#F2EFE9] border border-[#E5E3DF] hover:border-[#111111] hover:shadow-xl transition-all duration-300"
            >
              {/* Image with zoom on hover and bulletproof error fallback */}
              <img
                src={imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = getCategoryFallbackImage(cat.name);
                }}
              />

              {/* Dark subtle vignette gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/35 to-transparent transition-opacity duration-300 group-hover:from-[#111111]/95" />

              {/* Category Title & Arrow */}
              <div className="absolute bottom-0 inset-x-0 p-5 z-10 text-white flex flex-col justify-end">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4CEC5] mb-1 font-semibold">
                  {cat.itemCount || 'CURATED COLLECTION'}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-wide text-white transition-transform duration-300 group-hover:-translate-y-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#E5E3DF]/80 font-sans line-clamp-1 mb-3">
                  {cat.tagline || 'Timeless pieces and tailored essentials'}
                </p>

                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-white opacity-90 group-hover:opacity-100 transition-opacity font-bold">
                  <span>SHOP DEPARTMENT</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
