import React from 'react';
import { Feather, Shield, Compass } from 'lucide-react';

export const BrandStory = () => {
  return (
    <section className="py-16 md:py-24 bg-[#FFFFFF] border-b border-[#E5E3DF]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Monogram / Tag */}
        <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#666666] font-mono block mb-4">
          ATELIER PHILOSOPHY • THE M4M MANIFESTO
        </span>

        {/* Core Statement */}
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#111111] font-normal leading-tight md:leading-[1.2] max-w-4xl mx-auto mb-6">
          “Tailoring without rigidity. Structure defined purely by the natural weight of noble fibres.”
        </h2>

        {/* Narrative */}
        <p className="text-xs sm:text-sm text-[#666666] font-sans leading-relaxed max-w-2xl mx-auto mb-14">
          Rooted in the sartorial heritage of Northern Italy and the disciplined minimalism of contemporary architecture,
          M4M designs wardrobe foundations crafted with single-origin raw materials, horn buttons, and unhurried craftsmanship.
        </p>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-[#E5E3DF] pt-12">
          <div className="p-4 bg-[#FAF9F6] border border-[#E5E3DF]">
            <span className="font-mono text-[10px] text-[#8E877F] uppercase tracking-widest block mb-2">01 / FIBRES</span>
            <h3 className="font-serif text-lg text-[#111111] mb-2">Noble Monomaterials</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Strictly virgin Mongolian cashmere, Super 150s wool from Biella, and organic shuttle-woven cotton. Zero synthetic fillers.
            </p>
          </div>

          <div className="p-4 bg-[#FAF9F6] border border-[#E5E3DF]">
            <span className="font-mono text-[10px] text-[#8E877F] uppercase tracking-widest block mb-2">02 / SARTORIAL</span>
            <h3 className="font-serif text-lg text-[#111111] mb-2">Full Floating Canvas</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Every jacket features hand-sewn natural horsehair canvas that molds organically to the wearer’s anatomy over decades of wear.
            </p>
          </div>

          <div className="p-4 bg-[#FAF9F6] border border-[#E5E3DF]">
            <span className="font-mono text-[10px] text-[#8E877F] uppercase tracking-widest block mb-2">03 / FORM</span>
            <h3 className="font-serif text-lg text-[#111111] mb-2">Architectural Drape</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Generous high-rise trousers, dropped shoulder seams, and relaxed greatcoats engineered for timeless presence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
