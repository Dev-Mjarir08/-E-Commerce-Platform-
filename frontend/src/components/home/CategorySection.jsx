import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '../../data/marketplaceData';

export const CategorySection = ({ onSelectCategory }) => {
  return (
    <section id="category-section" className="py-16 md:py-24 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 border-b border-m4m-border">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-m4m-border">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-m4m-secondary block mb-2">
            DEPARTMENT CURATIONS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
            Shop By Category
          </h2>
        </div>
        <span className="text-xs font-mono uppercase tracking-wider text-m4m-secondary mt-2 sm:mt-0">
          5 DISTINCT ARCHIVES
        </span>
      </div>

      {/* Grid: 5 Categories (large cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id || cat.slug}
            to={`/shop?category=${cat.slug || cat.id}`}
            className="group relative block aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-[#F2EFE9] border border-m4m-border"
          >
            {/* Image with 1.05 zoom on hover */}
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              loading="lazy"
            />

            {/* Dark subtle overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-[#111111]/80 via-[#111111]/25 to-transparent transition-opacity duration-300 group-hover:from-[#111111]/90" />

            {/* Category Title & Arrow */}
            <div className="absolute bottom-0 inset-x-0 p-5 z-10 text-m4m-card flex flex-col justify-end">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4CEC5] mb-1">
                {cat.itemCount}
              </span>
              <h3 className="font-serif text-2xl font-normal tracking-wide text-m4m-card transition-transform duration-300 group-hover:-translate-y-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-m4m-border/80 font-sans line-clamp-1 mb-3">
                {cat.tagline}
              </p>

              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-m4m-card opacity-85 group-hover:opacity-100 transition-opacity">
                <span>VIEW EDIT</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
