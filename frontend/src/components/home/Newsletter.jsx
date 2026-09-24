import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const Newsletter = ({ onShowToast }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    if (onShowToast) {
      onShowToast('Thank you for joining our community newsletter.');
    }
    setEmail('');
  };

  return (
    <section className="py-16 md:py-24 bg-m4m-stone border-b border-m4m-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.3em] text-m4m-secondary block mb-3">
          DISPATCH & PRIVILEGE
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#111111] font-normal tracking-tight uppercase mb-4">
          Stay In The Loop
        </h2>

        <p className="text-xs sm:text-sm text-m4m-secondary font-sans max-w-lg mx-auto mb-8 leading-relaxed">
          Get first access to new collections, exclusive drops and special offers from our collective of independent stores.
        </p>

        {subscribed ? (
          <div className="bg-m4m-card border border-m4m-border p-6 max-w-md mx-auto flex items-center justify-center gap-3 text-xs font-mono uppercase tracking-wider text-[#111111]">
            <CheckCircle2 className="w-4 h-4 text-[#111111]" />
            <span>YOU ARE SUBSCRIBED TO ATELIER DISPATCHES.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER YOUR EMAIL"
              className="flex-1 bg-m4m-card border border-m4m-border px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-[#111111] placeholder-m4m-accent focus:outline-none focus:border-[#111111] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#111111] text-m4m-bg text-xs font-mono uppercase tracking-[0.2em] px-6 py-3.5 hover:bg-[#2B2B2B] transition-colors flex items-center justify-center gap-2"
            >
              <span>JOIN US</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <p className="text-[10px] text-m4m-accent font-mono tracking-wider uppercase mt-4">
          Strictly confidential. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};
