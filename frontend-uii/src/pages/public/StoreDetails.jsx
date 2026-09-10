import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Shield, Store } from 'lucide-react';
import { storeService } from '../../services/storeService';
import { products } from '../../data/products';
import { ProductCard } from '../../components/home/ProductCard';
import { QuickViewModal } from '../../components/common/QuickViewModal';
import { CartDrawer } from '../../components/common/CartDrawer';
import { Toast } from '../../components/common/Toast';
import { Navbar } from '../../components/home/Navbar';
import { Footer } from '../../components/home/Footer';

const StoreDetails = () => {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  useEffect(() => {
    const fetchStore = async () => {
      const data = await storeService.getStoreBySlug(slug);
      setStore(data);
    };
    fetchStore();
  }, [slug]);

  if (!store) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-center items-center p-6 text-center">
        <Store className="w-12 h-12 text-[#8E877F] mb-4" />
        <h2 className="font-serif text-2xl text-[#111111] mb-2">Atelier Not Found</h2>
        <p className="text-xs text-[#666666] mb-6">The requested boutique or atelier storefront is unavailable.</p>
        <Link
          to="/"
          className="bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-[0.2em] px-6 py-3"
        >
          RETURN TO PLATFORM HOME
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Store Hero Banner */}
        <div className="relative bg-[#111111] text-[#F8F7F4] py-20 px-4 sm:px-6 lg:px-12 border-b border-[#2B2B2B]">
          <div className="max-w-[1920px] mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D4CEC5] hover:text-[#FFFFFF] mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back To Main Platform</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#FFFFFF]/15 text-[#FFFFFF] text-[9px] font-mono uppercase tracking-[0.2em] px-2.5 py-1">
                    {store.badge}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono text-[#D4CEC5]">
                    <MapPin className="w-3.5 h-3.5" />
                    {store.city}
                  </span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#FFFFFF] font-normal mb-3">
                  {store.name}
                </h1>
                <p className="text-sm sm:text-base text-[#D4CEC5] font-sans max-w-2xl">
                  {store.tagline}
                </p>
              </div>

              <div className="bg-[#FFFFFF]/10 backdrop-blur-md p-5 border border-white/10 text-right min-w-[200px]">
                <div className="flex items-center justify-end gap-1 text-sm font-mono text-[#FFFFFF] mb-1">
                  <Star className="w-4 h-4 fill-white text-white" />
                  <span>{store.rating}</span>
                  <span className="text-white/60 text-xs">({store.reviewsCount} reviews)</span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/70 block">
                  {store.itemCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Curated Catalog Grid */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-16">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#E5E3DF]">
            <h2 className="font-serif text-2xl text-[#111111]">
              Atelier Curated Catalog
            </h2>
            <span className="text-xs font-mono uppercase text-[#666666]">
              {products.length} GARMENTS AVAILABLE
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
                onShowToast={addToast}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <CartDrawer />
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onShowToast={addToast}
      />
      <Toast toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  );
};

export default StoreDetails;
