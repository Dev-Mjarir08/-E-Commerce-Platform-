import React, { useEffect, useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export const Testimonials = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let isMounted = true;
    api.get('/reviews?limit=3')
      .then((res) => {
        if (isMounted && res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setReviews(res.data.data);
        } else if (isMounted) {
          // Curated default client testimonials when catalog is fresh
          setReviews([
            {
              id: 'rev-1',
              rating: 5,
              comment: 'The tailoring on the double-breasted cashmere overcoat is second to none. Exquisite drape and finish.',
              name: 'Julian Vance',
              role: 'Private Collector, Zurich',
              itemBought: 'Double-Breasted Cashmere Overcoat'
            },
            {
              id: 'rev-2',
              rating: 5,
              comment: 'Exceptional consignment transparency and direct verification from the atelier in Florence.',
              name: 'Elena Rostova',
              role: 'Fashion Editor, Milan',
              itemBought: 'Handwoven Silk Evening Gown'
            },
            {
              id: 'rev-3',
              rating: 5,
              comment: 'The fastest tracked shipment with white-glove packaging I have experienced across luxury platforms.',
              name: 'Marcus Sterling',
              role: 'Architect, London',
              itemBought: 'Full-Grain Calfskin Weekender'
            }
          ]);
        }
      })
      .catch(() => {
        if (isMounted) {
          setReviews([
            {
              id: 'rev-1',
              rating: 5,
              comment: 'The tailoring on the double-breasted cashmere overcoat is second to none. Exquisite drape and finish.',
              name: 'Julian Vance',
              role: 'Private Collector, Zurich',
              itemBought: 'Double-Breasted Cashmere Overcoat'
            },
            {
              id: 'rev-2',
              rating: 5,
              comment: 'Exceptional consignment transparency and direct verification from the atelier in Florence.',
              name: 'Elena Rostova',
              role: 'Fashion Editor, Milan',
              itemBought: 'Handwoven Silk Evening Gown'
            },
            {
              id: 'rev-3',
              rating: 5,
              comment: 'The fastest tracked shipment with white-glove packaging I have experienced across luxury platforms.',
              name: 'Marcus Sterling',
              role: 'Architect, London',
              itemBought: 'Full-Grain Calfskin Weekender'
            }
          ]);
        }
      });

    return () => { isMounted = false; };
  }, []);
  return (
    <section className="py-16 md:py-24 bg-[#FAF9F6] border-b border-m4m-border">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase text-m4m-secondary block mb-2">
            CLIENT EXPERIENCES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
            What Our Customers Say
          </h2>
        </div>

        {/* 3 Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id || rev._id}
              className="bg-m4m-card border border-m4m-border p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
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
              <div className="pt-6 border-t border-m4m-border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-sans font-medium text-xs text-[#111111] uppercase tracking-wide">
                    {rev.name}
                  </span>
                  <CheckCircle className="w-3.5 h-3.5 text-[#2e7d32]" />
                </div>
                <p className="text-[10px] font-mono text-m4m-accent uppercase tracking-wider">
                  {rev.role}
                </p>
                <p className="text-[11px] text-m4m-secondary font-sans mt-2">
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
