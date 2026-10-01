import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building,
  Home,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  X,
  Check
} from 'lucide-react';
import addressApi from '../../services/addressApi';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ModalContext';

export const Addresses = () => {
  const { showToast: triggerToast } = useToast();
  const { confirm } = useConfirm();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const initialForm = {
    recipientName: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    addressType: 'home',
    isDefaultShipping: false,
    isDefaultBilling: false
  };
  const [formData, setFormData] = useState(initialForm);

  const showToast = useCallback((type, text) => {
    triggerToast(text, type);
  }, [triggerToast]);

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await addressApi.getAddresses();
      if (response && response.data) {
        setAddresses(response.data);
      }
    } catch (error) {
      showToast('error', error.message || 'Failed to load addresses.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let active = true;
    addressApi.getAddresses()
      .then((response) => {
        if (active && response && response.data) {
          setAddresses(response.data);
        }
      })
      .catch((error) => {
        if (active) showToast('error', error.message || 'Failed to load addresses.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [showToast]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingId(addr._id);
    setFormData({
      recipientName: addr.recipientName || '',
      phone: addr.phone || '',
      street: addr.street || '',
      apartment: addr.apartment || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'US',
      addressType: addr.addressType || 'home',
      isDefaultShipping: Boolean(addr.isDefaultShipping),
      isDefaultBilling: Boolean(addr.isDefaultBilling)
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await addressApi.updateAddress(editingId, formData);
        showToast('success', 'Address details updated.');
      } else {
        await addressApi.createAddress(formData);
        showToast('success', 'New address saved to your address book.');
      }
      closeModal();
      await fetchAddresses();
    } catch (error) {
      showToast('error', error.message || 'Failed to save address.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Remove Delivery Address',
      message: 'Are you sure you want to remove this delivery address from your profile?',
      confirmText: 'Remove Address',
      cancelText: 'Cancel',
      type: 'danger'
    });
    if (!ok) return;

    try {
      await addressApi.deleteAddress(id);
      showToast('success', 'Address removed successfully.');
      setAddresses((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      showToast('error', error.message || 'Failed to delete address.');
    }
  };

  const handleSetDefault = async (id, type) => {
    try {
      await addressApi.setDefaultAddress(id, type);
      showToast('success', `Default ${type} address updated.`);
      await fetchAddresses();
    } catch (error) {
      showToast('error', error.message || 'Failed to set default.');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'work':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'other':
        return <Building className="w-3.5 h-3.5" />;
      default:
        return <Home className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] py-10 md:py-16 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Navigation & Header */}
        <div className="mb-10 pb-6 border-b border-[#E5E3DF] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                to="/profile"
                className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E877F] hover:text-[#111111] flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Account Archive</span>
              </Link>
              <span className="text-[10px] font-mono text-[#8E877F]">•</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#111111]">
                Address Book
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight uppercase">
              Saved Addresses
            </h1>
            <p className="text-xs text-[#8E877F] font-sans mt-1">
              Manage your personal shipping destinations and billing references for seamless checkout.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#111111] hover:bg-[#222222] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>


        {/* Content Body */}
        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#8E877F] mb-4" />
            <p className="text-xs font-mono uppercase tracking-widest text-[#8E877F]">
              Loading Saved Addresses...
            </p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#F8F7F4] flex items-center justify-center text-[#8E877F] border border-[#E5E3DF]">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#111111] uppercase">No Addresses On Record</h3>
            <p className="text-xs text-[#8E877F] leading-relaxed">
              You have not stored any delivery destinations yet. Add an address now to accelerate your future checkouts.
            </p>
            <button
              onClick={openAddModal}
              className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider hover:bg-[#222222] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Address</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`bg-[#FFFFFF] border p-6 flex flex-col justify-between relative transition-all shadow-xs ${
                  addr.isDefaultShipping
                    ? 'border-[#111111] ring-1 ring-[#111111]'
                    : 'border-[#E5E3DF] hover:border-[#8E877F]'
                }`}
              >
                <div>
                  {/* Card Header & Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E5E3DF]">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#111111]">
                      {getTypeIcon(addr.addressType)}
                      <span className="font-semibold">{addr.addressType || 'Home'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {addr.isDefaultShipping && (
                        <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#111111] text-[#F8F7F4]">
                          Default Shipping
                        </span>
                      )}
                      {addr.isDefaultBilling && (
                        <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#F8F7F4] border border-[#111111] text-[#111111]">
                          Default Billing
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recipient Details */}
                  <div className="space-y-1.5 mb-5">
                    <h4 className="font-serif text-lg font-medium text-[#111111]">
                      {addr.recipientName}
                    </h4>
                    <p className="text-xs text-[#666666] font-mono">{addr.phone}</p>
                    <p className="text-xs text-[#444444] font-sans leading-relaxed pt-1">
                      {addr.street}
                      {addr.apartment ? `, ${addr.apartment}` : ''}
                      <br />
                      {addr.city}, {addr.state} {addr.postalCode}
                      <br />
                      {addr.country}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-[#E5E3DF] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono uppercase">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(addr)}
                        className="inline-flex items-center gap-1 text-[#666666] hover:text-[#111111] transition-colors py-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <span className="text-[#E5E3DF]">|</span>
                      <button
                        onClick={() => handleDelete(addr._id)}
                        className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 transition-colors py-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    {!addr.isDefaultShipping && (
                      <button
                        onClick={() => handleSetDefault(addr._id, 'shipping')}
                        className="text-[10px] text-[#8E877F] hover:text-[#111111] underline tracking-wider"
                      >
                        Make Default
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#111111] w-full max-w-xl p-6 sm:p-8 my-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E3DF]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E877F] block">
                  DELIVERY SPECIFICATIONS
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#111111] uppercase">
                  {editingId ? 'Edit Address Record' : 'Create New Destination'}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 hover:bg-[#F8F7F4] text-[#8E877F] hover:text-[#111111] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Lord Alexander Wright"
                    className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-sans rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                    Phone Contact *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-mono rounded-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 742 Evergreen Terrace"
                  className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-sans rounded-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                    Suite / Apt / Unit
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="e.g. Penthouse B"
                    className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-sans rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="New York"
                    className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-sans rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    placeholder="NY"
                    className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-sans rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                    Postal / ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    placeholder="10001"
                    className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-mono rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    placeholder="United States"
                    className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-sans rounded-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                  Address Classification
                </label>
                <div className="flex items-center gap-3 pt-1">
                  {['home', 'work', 'other'].map((type) => (
                    <label
                      key={type}
                      className={`flex-1 py-2 px-3 border cursor-pointer text-center text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        formData.addressType === type
                          ? 'border-[#111111] bg-[#111111] text-[#F8F7F4]'
                          : 'border-[#E5E3DF] hover:border-[#8E877F] text-[#444444]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="addressType"
                        value={type}
                        checked={formData.addressType === type}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      {getTypeIcon(type)}
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 space-y-2 border-t border-[#E5E3DF]">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[#444444]">
                  <input
                    type="checkbox"
                    name="isDefaultShipping"
                    checked={formData.isDefaultShipping}
                    onChange={handleInputChange}
                    className="accent-[#111111] w-4 h-4"
                  />
                  <span>Set as primary default shipping destination</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[#444444]">
                  <input
                    type="checkbox"
                    name="isDefaultBilling"
                    checked={formData.isDefaultBilling}
                    onChange={handleInputChange}
                    className="accent-[#111111] w-4 h-4"
                  />
                  <span>Set as primary default billing address</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 border border-[#E5E3DF] hover:border-[#111111] text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#111111] hover:bg-[#222222] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingId ? 'Save Modifications' : 'Confirm & Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;
