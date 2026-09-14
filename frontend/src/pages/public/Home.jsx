import { useState, useEffect } from 'react';
import Lenis from 'lenis';

// Layout Components
import { AnnouncementBar } from '../../components/layout/AnnouncementBar';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

// Homepage Section Components
import { Hero } from '../../components/home/Hero';
import { CategorySection } from '../../components/home/CategorySection';
import { NewArrivals } from '../../components/home/NewArrivals';
import { FeaturedStores } from '../../components/home/FeaturedStores';
import { TrendingCollection } from '../../components/home/TrendingCollection';
import { BestSellers } from '../../components/home/BestSellers';
import { EditorialBanner } from '../../components/home/EditorialBanner';
import { PromoSection } from '../../components/home/PromoSection';
import { TrustSection } from '../../components/home/TrustSection';
import { Testimonials } from '../../components/home/Testimonials';
import { Newsletter } from '../../components/home/Newsletter';

// Global Overlays & Modals
import { CartDrawer } from '../../components/common/CartDrawer';
import { SearchModal } from '../../components/common/SearchModal';
import { QuickViewModal } from '../../components/common/QuickViewModal';
import { Toast } from '../../components/common/Toast';

const Home = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Initialize Lenis smooth scrolling with prefers-reduced-motion check
  useEffect(() => {
    let animationFrameId;
    let lenis;

    try {
      if (typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        lenis = new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 0.9
        });

        function raf(time) {
          if (lenis) {
            lenis.raf(time);
            animationFrameId = requestAnimationFrame(raf);
          }
        }

        animationFrameId = requestAnimationFrame(raf);
      }
    } catch (err) {
      console.warn('Lenis smooth scroll fallback:', err);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (lenis) lenis.destroy();
    };
  }, []);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenProduct = (product) => {
    setQuickViewProduct(product);
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-[#F8F7F4]">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Sticky Navbar */}
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWishlist={() => {
          scrollToSection('best-sellers');
          addToast('Saved wishlist items highlight active.', 'info');
        }}
      />

      <main className="flex-1">
        {/* 3. Hero Section (with GSAP timeline) */}
        <Hero
          onShopNewArrivals={() => scrollToSection('new-arrivals')}
          onExploreStores={() => scrollToSection('featured-stores')}
        />

        {/* 4. Shop By Category */}
        <CategorySection onSelectCategory={() => scrollToSection('new-arrivals')} />

        {/* 5. New Arrivals */}
        <NewArrivals
          onQuickView={handleOpenProduct}
          onShowToast={addToast}
          onViewAll={() => scrollToSection('best-sellers')}
        />

        {/* 6. Discover Our Stores (Multi-Tenant SaaS Highlight) */}
        <FeaturedStores />

        {/* 7. Trending Collection (Asymmetric Editorial) */}
        <TrendingCollection
          onShopCollection={() => scrollToSection('new-arrivals')}
        />

        {/* 8. Best Sellers */}
        <BestSellers
          onQuickView={handleOpenProduct}
          onShowToast={addToast}
        />

        {/* 9. Editorial Campaign Banner */}
        <EditorialBanner
          onShopEdit={() => scrollToSection('new-arrivals')}
        />

        {/* 10. Sale / Promotion Section */}
        <PromoSection
          onShopSale={() => scrollToSection('new-arrivals')}
        />

        {/* 11. Customer Trust Section (Why Shop With Us) */}
        <TrustSection />

        {/* 12. Customer Reviews (Testimonials) */}
        <Testimonials />

        {/* 13. Newsletter Section */}
        <Newsletter onShowToast={addToast} />
      </main>

      {/* 14. Large Premium Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={handleOpenProduct}
      />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onShowToast={addToast}
      />

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default Home;
