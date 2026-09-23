import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/common/CartDrawer';
import { SearchModal } from '../components/common/SearchModal';
import { Toast } from '../components/common/Toast';

export const CustomerLayout = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

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

  return (
    <div className="min-h-screen bg-m4m-bg text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-m4m-bg">
      {/* Navigation Header */}
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWishlist={() => addToast('Wishlist accessible via profile menu.', 'info')}
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
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default CustomerLayout;
