import { Star, CheckCircle } from 'lucide-react';
import { customerReviews } from '../../data/marketplaceData';

export const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-[#FAF9F6] border-b border-[#E5E3DF]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase text-[#666666] block mb-2">
            CLIENT EXPERIENCES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
            What Our Customers Say
          </h2>
        </div>

        {/* 3 Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {customerReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FFFFFF] border border-[#E5E3DF] p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#111111] mb-6">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#111111]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="font-serif text-base sm:text-lg text-[#111111] leading-relaxed mb-6 italic">
                  “{rev.comment}”
                </p>
              </div>

              {/* Author & Item */}
              <div className="pt-6 border-t border-[#E5E3DF]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-sans font-medium text-xs text-[#111111] uppercase tracking-wide">
                    {rev.name}
                  </span>
                  <CheckCircle className="w-3.5 h-3.5 text-[#2e7d32]" />
                </div>
                <p className="text-[10px] font-mono text-[#8E877F] uppercase tracking-wider">
                  {rev.role}
                </p>
                <p className="text-[11px] text-[#666666] font-sans mt-2">
                  Purchased: <span className="italic">{rev.itemBought}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
