import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/common/CartDrawer';
import { SearchModal } from '../components/common/SearchModal';
import { useToast } from '../context/ToastContext';

export const CustomerLayout = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { info } = useToast();

  return (
    <div className="min-h-screen bg-m4m-bg text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-m4m-bg">
      {/* Navigation Header */}
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWishlist={() => info('Wishlist accessible via profile menu.')}
      />

      {/* Main Dynamic View */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Overlays & Modals */}
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default CustomerLayout;
