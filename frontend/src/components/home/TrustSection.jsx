import { Truck, RotateCcw, ShieldCheck, Store } from 'lucide-react';

export const TrustSection = () => {
  const features = [
    {
      icon: Truck,
      title: 'FREE SHIPPING',
      description: 'On orders over ₹999 across India'
    },
    {
      icon: RotateCcw,
      title: 'EASY RETURNS',
      description: '7-day hassle-free doorstep pickup'
    },
    {
      icon: ShieldCheck,
      title: 'SECURE PAYMENTS',
      description: '100% encrypted & secure checkout'
    },
    {
      icon: Store,
      title: 'CURATED STORES',
      description: 'Verified independent fashion brands'
    }
  ];

  return (
    <section className="bg-[#FFFFFF] border-b border-[#E5E3DF] py-12">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E3DF]">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 px-2 sm:px-6 pt-4 sm:pt-0 first:pt-0"
              >
                <div className="w-11 h-11 rounded-full bg-[#FAF9F6] border border-[#E5E3DF] flex items-center justify-center shrink-0 text-[#111111]">
                  <Icon className="w-5 h-5 stroke-[1.25]" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-[#111111] mb-0.5">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-[#666666] font-sans">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
