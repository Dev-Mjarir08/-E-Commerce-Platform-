import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Plus,
  Search,
  ExternalLink,
  MapPin,
  Star,
  ShieldCheck,
  Edit2,
  Trash2,
  X,
  RotateCcw
} from 'lucide-react';
import { useConfirm } from '../../context/ModalContext';
import adminApi from '../../services/adminApi';

const Vendors = () => {
  const { confirm, alert: modalAlert } = useConfirm();
  const [vendorList, setVendorList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    ownerEmail: '',
    city: '',
    category: '',
    tagline: '',
    status: 'active',
    rating: 4.9,
    logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85'
  });

  // Fetch live vendor directory from MongoDB
  const fetchLiveVendors = async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getAllVendors();
      const list = response?.data || response;
      if (Array.isArray(list)) {
        setVendorList(list);
      }
    } catch (err) {
      console.warn('Notice loading live vendors:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveVendors();
  }, []);

  // Filtered vendors
  const filteredVendors = useMemo(() => {
    return vendorList.filter((v) => {
      const name = v.storeName || v.name || '';
      const slug = v.slug || '';
      const city = v.city || '';
      const email = v.email || v.ownerEmail || '';

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase());

      const status = v.storeStatus || v.status || 'active';
      const matchesTab = activeTab === 'all' || status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [vendorList, searchQuery, activeTab]);

  const activeCount = vendorList.filter((v) => (v.storeStatus || v.status) === 'active').length;
  const pendingCount = vendorList.filter((v) => (v.storeStatus || v.status) === 'pending').length;
  const suspendedCount = vendorList.filter((v) => (v.storeStatus || v.status) === 'suspended').length;

  const handleOpenAddModal = () => {
    setEditingVendor(null);
    setFormData({
      name: '',
      slug: '',
      ownerEmail: '',
      city: 'Mumbai, IN',
      category: 'Contemporary Luxury Tailoring',
      tagline: 'Hand-burnished craftsmanship & timeless silhouettes',
      status: 'active',
      rating: 5.0,
      logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.storeName || vendor.name,
      slug: vendor.slug,
      ownerEmail: vendor.email || vendor.ownerEmail || '',
      city: vendor.city || '',
      category: vendor.category || '',
      tagline: vendor.tagline || '',
      status: vendor.storeStatus || vendor.status || 'active',
      rating: vendor.rating || 4.9,
      logo: vendor.logo || '',
      image: vendor.image || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteVendor = async (id) => {
    const ok = await confirm({
      title: 'Deactivate Vendor Tenant',
      message: 'Are you sure you want to deactivate and suspend this live vendor in MongoDB?',
      confirmText: 'Deactivate Vendor',
      cancelText: 'Cancel',
      type: 'danger'
    });
    if (ok) {
      try {
        await adminApi.deleteVendor(id);
      } catch (err) {
        console.warn('Notice deactivating vendor:', err.message);
      }
      setVendorList((prev) => prev.filter((v) => (v._id || v.id) !== id));
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await adminApi.updateVendorStatus(id, { status: newStatus });
    } catch (err) {
      console.warn('Notice updating status:', err.message);
    }
    setVendorList((prev) =>
      prev.map((v) => ((v._id || v.id) === id ? { ...v, status: newStatus, storeStatus: newStatus } : v))
    );
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      modalAlert({
        title: 'Missing Fields',
        message: 'Please provide store name and URL slug before saving.',
        type: 'warning'
      });
      return;
    }

    if (editingVendor) {
      setVendorList((prev) =>
        prev.map((v) =>
          v.id === editingVendor.id
            ? {
              ...v,
              name: formData.name,
              slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
              ownerEmail: formData.ownerEmail,
              city: formData.city,
              category: formData.category,
              tagline: formData.tagline,
              status: formData.status
            }
            : v
        )
      );
    } else {
      const newVendor = {
        id: `store-${Date.now().toString().slice(-4)}`,
        name: formData.name,
        slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
        ownerEmail: formData.ownerEmail,
        city: formData.city,
        category: formData.category,
        tagline: formData.tagline,
        status: formData.status,
        rating: 5.0,
        reviewsCount: 1,
        badge: 'NEW ATELIER',
        salesVolume: '₹0',
        productsCount: 0,
        logo: formData.logo,
        image: formData.image
      };
      setVendorList([newVendor, ...vendorList]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Vendor & Tenant Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage multi-tenant boutique storefronts, verification badges, seller credentials, and approvals.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus size={16} />
          <span>Onboard New Vendor</span>
        </button>
      </div>

      {/* KPI Counters (Direct Solid Colors) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Boutiques</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{vendorList.length}</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Multi-Tenant
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active & Verified</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{activeCount}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Live Stores
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pending Review</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-700">{pendingCount}</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
              Requires Action
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Suspended</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-600">{suspendedCount}</span>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Offboarded
            </span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-full md:w-auto">
          {[
            { id: 'all', label: 'All Vendors', count: vendorList.length },
            { id: 'active', label: 'Active', count: activeCount },
            { id: 'pending', label: 'Pending', count: pendingCount },
            { id: 'suspended', label: 'Suspended', count: suspendedCount }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 ${activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendor, city, owner email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Vendors Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Boutique & Atelier</th>
                <th className="py-3.5 px-4">Location & Specialty</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Total Sales</th>
                <th className="py-3.5 px-4">Approval Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-500">
                    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="font-semibold text-slate-700">Loading live vendors from database...</p>
                  </td>
                </tr>
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <Store size={36} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold">No vendor tenants found.</p>
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => {
                  const id = vendor._id || vendor.id;
                  const currentStatus = vendor.storeStatus || vendor.status || 'active';
                  return (
                    <tr key={id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Store details */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={vendor.logo || vendor.image || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80'}
                            alt={vendor.storeName || vendor.name}
                            className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-slate-900 truncate">
                                {vendor.storeName || vendor.name}
                              </h4>
                              {currentStatus === 'active' && (
                                <ShieldCheck size={14} className="text-emerald-600 shrink-0" title="Verified Atelier" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">{vendor.email || vendor.ownerEmail}</p>
                            {vendor.slug && (
                              <span className="text-[10px] font-mono text-indigo-600 block mt-0.5">
                                /store/{vendor.slug}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Location & Specialty */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-slate-800 font-semibold">
                          <MapPin size={13} className="text-slate-400" />
                          <span>{vendor.city || 'Global Atelier'}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                          {vendor.category || vendor.tagline}
                        </p>
                      </td>

                      {/* Rating & Products */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 font-bold text-slate-900">
                          <Star size={14} className="text-amber-500 fill-amber-500" />
                          <span>{vendor.rating || 5.0}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5 font-mono font-semibold">
                          {vendor.productsCount || 0} Products
                        </span>
                      </td>

                      {/* Sales */}
                      <td className="py-4 px-4">
                        <span className="font-extrabold text-slate-900 block font-mono">
                          {vendor.salesVolume || '₹0'}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold">● Active Storefront</span>
                      </td>

                      {/* Status Dropdown/Badge */}
                      <td className="py-4 px-4">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleToggleStatus(id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer ${
                            currentStatus === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : currentStatus === 'pending'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          <option value="active">Active (Live)</option>
                          <option value="pending">Pending Review</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {vendor.slug && (
                            <Link
                              to={`/store/${vendor.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                              title="View Live Storefront"
                            >
                              <ExternalLink size={15} />
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(vendor)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                            title="Edit Vendor"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVendor(id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Deactivate Vendor"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard / Edit Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingVendor ? 'Edit Vendor Atelier' : 'Onboard New Vendor Boutique'}
                </h3>
                <p className="text-xs text-slate-500">Setup tenant credentials, public slug, and location</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Store / Boutique Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                      })
                    }
                    placeholder="e.g. Sartoria Napoli"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Storefront Slug (/store/:slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="sartoria-napoli"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Owner / Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    placeholder="concierge@atelier.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Country
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Milan, Italy or Mumbai, IN"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Category / Specialty
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Neapolitan Suiting & Heavy Cashmere"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tagline / Brand Bio
                </label>
                <textarea
                  rows="2"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Heritage tailoring atelier founded in 1984..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600"
                  >
                    <option value="active">Active (Verified)</option>
                    <option value="pending">Pending Approval</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Store Logo URL
                  </label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                >
                  {editingVendor ? 'Save Changes' : 'Onboard Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
