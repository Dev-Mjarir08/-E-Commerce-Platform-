import { useState, lazy, Suspense } from 'react';
import { useToast } from '../../context/ToastContext';

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

// Lazy loaded modals to keep initial page bundle lean
const SearchModal = lazy(() => import('../../components/common/SearchModal').then(m => ({ default: m.SearchModal || m.default })));
const QuickViewModal = lazy(() => import('../../components/common/QuickViewModal').then(m => ({ default: m.QuickViewModal || m.default })));

const Home = () => {
  const { showToast } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

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
    <div className="min-h-screen bg-m4m-bg text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-m4m-bg">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Sticky Navbar */}
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWishlist={() => {
          scrollToSection('best-sellers');
          showToast('Saved wishlist items highlight active.', 'info');
        }}
      />

      <main className="flex-1">
        {/* 3. Hero Section */}
        <Hero
          onShopNewArrivals={() => scrollToSection('new-arrivals')}
          onExploreStores={() => scrollToSection('featured-stores')}
        />

        {/* 4. Shop By Category */}
        <CategorySection onSelectCategory={() => scrollToSection('new-arrivals')} />

        {/* 5. New Arrivals */}
        <NewArrivals
          onQuickView={handleOpenProduct}
          onShowToast={showToast}
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
          onShowToast={showToast}
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
        <Newsletter onShowToast={showToast} />
      </main>

      {/* 14. Large Premium Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />

      <Suspense fallback={null}>
        {searchOpen && (
          <SearchModal
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
            onSelectProduct={handleOpenProduct}
          />
        )}

        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            isOpen={Boolean(quickViewProduct)}
            onClose={() => setQuickViewProduct(null)}
            onShowToast={showToast}
          />
        )}
      </Suspense>
    </div>
  );
};

export default Home;
