import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Store,
  Plus,
  CheckCircle2,
  ShieldCheck,
  X,
  Clock
} from 'lucide-react';
import {
  addStore,
  updateStore,
  deleteStore,
  toggleStoreStatus,
  toggleStoreVerification
} from '../../redux/slices/storeSlice';

const Stores = () => {
  const dispatch = useDispatch();
  const storeList = useSelector((state) => state.stores.items);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    ownerEmail: '',
    phone: '',
    city: '',
    category: 'Luxury Fashion',
    description: '',
    status: 'active',
    isVerified: true,
    logo: ''
  });

  // Real Dynamic KPI Metrics (strictly computed from real data)
  const totalStores = storeList.length;
  const activeStoresCount = storeList.filter((s) => s.status === 'active').length;
  const pendingStoresCount = storeList.filter((s) => s.status === 'pending').length;
  const verifiedStoresCount = storeList.filter((s) => s.isVerified).length;

  const handleOpenAddModal = () => {
    setEditingStore(null);
    setFormData({
      name: '',
      slug: '',
      ownerEmail: '',
      phone: '',
      city: '',
      category: 'Luxury Fashion',
      description: '',
      status: 'active',
      isVerified: true,
      logo: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      slug: store.slug,
      ownerEmail: store.ownerEmail || '',
      phone: store.phone || '',
      city: store.city || '',
      category: store.category || 'Luxury Fashion',
      description: store.description || '',
      status: store.status || 'active',
      isVerified: store.isVerified ?? true,
      logo: store.logo || ''
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    // Auto-generate slug when creating a new store
    if (!editingStore) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData((prev) => ({ ...prev, name: val, slug: autoSlug }));
    } else {
      setFormData((prev) => ({ ...prev, name: val }));
    }
  };

  const handleDeleteStore = (id, name) => {
    if (window.confirm(`Are you sure you want to remove the boutique "${name}"?`)) {
      dispatch(deleteStore(id));
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      alert('Please provide boutique name and URL slug.');
      return;
    }

    if (editingStore) {
      dispatch(
        updateStore({
          ...editingStore,
          ...formData,
          slug: formData.slug.toLowerCase().trim()
        })
      );
    } else {
      const newStore = {
        id: `STR-${Date.now().toString(36).toUpperCase()}`,
        ...formData,
        slug: formData.slug.toLowerCase().trim(),
        createdAt: new Date().toISOString()
      };
      dispatch(addStore(newStore));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tenant Boutiques</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Multi-Tenant Operations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Register and manage independent tenant storefronts, boutique statuses, and vendor verification.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors shrink-0"
        >
          <Plus size={16} />
          <span>Register Store</span>
        </button>
      </div>

      {/* Dynamic KPI Analytics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Boutiques */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Boutiques</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
              <Store size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{totalStores}</span>
            <span className="text-xs font-medium text-slate-500">
              {totalStores === 1 ? '1 Storefront' : `${totalStores} Storefronts`}
            </span>
          </div>
        </div>

        {/* Active Storefronts */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Boutiques</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{activeStoresCount}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Live Online
            </span>
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pending Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-700">{pendingStoresCount}</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
              Awaiting
            </span>
          </div>
        </div>

        {/* Verified Partners */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Verified Partners</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-700">{verifiedStoresCount}</span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              Trusted
            </span>
          </div>
        </div>
      </div>

      {/* Stores Management Overview Card */}
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mx-auto mb-3">
          <Store size={24} />
        </div>
        <h3 className="text-base font-bold text-slate-900">Tenant Boutique Operations</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
          Store table and search view are currently hidden. You can register and configure multi-tenant boutiques using the "Register Store" action.
        </p>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus size={15} />
          <span>Register Store</span>
        </button>
      </div>

      {/* Add / Edit Store Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingStore ? 'Edit Boutique Details' : 'Register New Tenant Boutique'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure storefront identity, contact credentials, and operational status
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Boutique Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Heritage Atelier"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Store URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. heritage-atelier"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Owner / Manager Email
                  </label>
                  <input
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    placeholder="e.g. manager@boutique.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / Helpline
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Region
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Boutique Category / Niche
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  >
                    <option value="Luxury Fashion">Luxury Fashion</option>
                    <option value="Designer Footwear">Designer Footwear</option>
                    <option value="Fine Jewellery">Fine Jewellery</option>
                    <option value="Handcrafted Leather">Handcrafted Leather</option>
                    <option value="Artisanal Fragrance">Artisanal Fragrance</option>
                    <option value="Bespoke Tailoring">Bespoke Tailoring</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Logo / Avatar Image URL
                </label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description & Brand Editorial
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the boutique story and philosophy..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Storefront Operational Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  >
                    <option value="active">Active (Open to Public)</option>
                    <option value="pending">Pending Approval</option>
                    <option value="suspended">Suspended (Maintenance)</option>
                  </select>
                </div>

                <div className="flex items-center sm:pt-6">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isVerified}
                      onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Verified Boutique Partner</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  {editingStore ? 'Save Changes' : 'Register Storefront'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stores;
