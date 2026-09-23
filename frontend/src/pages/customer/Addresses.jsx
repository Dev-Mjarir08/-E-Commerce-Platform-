import {
  AlertCircle,
  Briefcase,
  Check,
  CheckCircle2,
  Edit3,
  Globe,
  Heart,
  Home,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Default initial mock addresses matching backend/models/Address.js schema
const INITIAL_DEFAULT_ADDRESSES = [
  {
    _id: "addr_101",
    recipientName: "Jarir Multani",
    phone: "+91 45678 91230",
    street: "Gujrat",
    apartment: "Suite 4B",
    city: "Mumbai",
    state: "Gujrat",
    postalCode: "400001",
    country: "India",
    addressType: "home",
    isDefaultShipping: true,
    isDefaultBilling: true,
  },
  {
    _id: "addr_102",
    recipientName: "Ayaan Ali (Atelier Studio)",
    phone: "+91- 13245 67890",
    street: "Hafiz Babanagar Bandlaguda",
    city: "Hyderabad",
    state: "Telangana",
    postalCode: "400051",
    country: "India",
    addressType: "work",
    isDefaultShipping: false,
    isDefaultBilling: false,
  },
];

export const Addresses = () => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id || user?._id || "guest_client";
  const storageKey = `atelier_addresses_${userId}`;

  // Addresses state initialized from localStorage or initial mock data
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse saved addresses from localStorage:", e);
    }
    return INITIAL_DEFAULT_ADDRESSES;
  });

  // Modal & feedback state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // null when adding new
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Form State matching Address model schema
  const [formData, setFormData] = useState({
    recipientName: "",
    phone: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    addressType: "home",
    isDefaultShipping: false,
    isDefaultBilling: false,
  });

  // Persist address list to localStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(addresses));
    } catch (e) {
      console.warn("Failed to save addresses to localStorage:", e);
    }
  }, [addresses, storageKey]);

  // Toast feedback trigger helper
  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Open modal for Adding a new address
  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setFormErrors({});
    setFormData({
      recipientName: user?.name || "",
      phone: user?.phone || "",
      street: "",
      apartment: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      addressType: "home",
      isDefaultShipping: addresses.length === 0,
      isDefaultBilling: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  // Open modal for Editing an existing address
  const handleOpenEditModal = (addr) => {
    setEditingAddress(addr);
    setFormErrors({});
    setFormData({
      recipientName: addr.recipientName || "",
      phone: addr.phone || "",
      street: addr.street || "",
      apartment: addr.apartment || "",
      city: addr.city || "",
      state: addr.state || "",
      postalCode: addr.postalCode || "",
      country: addr.country || "India",
      addressType: addr.addressType || "home",
      isDefaultShipping: Boolean(addr.isDefaultShipping),
      isDefaultBilling: Boolean(addr.isDefaultBilling),
    });
    setIsModalOpen(true);
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validate address form
  const validateForm = () => {
    const errors = {};
    if (!formData.recipientName.trim())
      errors.recipientName = "Recipient name is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.street.trim()) errors.street = "Street address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State/Province is required";
    if (!formData.postalCode.trim())
      errors.postalCode = "Postal code is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Add/Edit Address Form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingAddress) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((item) => {
          if (item._id === editingAddress._id) {
            return {
              ...item,
              ...formData,
            };
          }
          // If setting as default, unset on others
          return {
            ...item,
            isDefaultShipping: formData.isDefaultShipping
              ? false
              : item.isDefaultShipping,
            isDefaultBilling: formData.isDefaultBilling
              ? false
              : item.isDefaultBilling,
          };
        }),
      );
      showToast("success", "Address details updated successfully.");
    } else {
      // Create new address
      const newAddress = {
        _id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        ...formData,
      };

      setAddresses((prev) => {
        let updated = [...prev];
        if (formData.isDefaultShipping) {
          updated = updated.map((a) => ({ ...a, isDefaultShipping: false }));
        }
        if (formData.isDefaultBilling) {
          updated = updated.map((a) => ({ ...a, isDefaultBilling: false }));
        }
        return [newAddress, ...updated];
      });
      showToast("success", "New address added to your address book.");
    }

    setIsModalOpen(false);
  };

  // Delete address
  const confirmDeleteAddress = () => {
    if (!addressToDelete) return;
    const deletedId = addressToDelete._id;
    setAddresses((prev) => {
      const remaining = prev.filter((a) => a._id !== deletedId);
      // If deleted address was default, set first remaining as default
      if (remaining.length > 0) {
        if (
          addressToDelete.isDefaultShipping &&
          !remaining.some((a) => a.isDefaultShipping)
        ) {
          remaining[0].isDefaultShipping = true;
        }
        if (
          addressToDelete.isDefaultBilling &&
          !remaining.some((a) => a.isDefaultBilling)
        ) {
          remaining[0].isDefaultBilling = true;
        }
      }
      return remaining;
    });
    showToast("info", "Address removed from your address book.");
    setAddressToDelete(null);
  };

  // Set Default Shipping Address
  const handleSetDefaultShipping = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefaultShipping: a._id === id,
      })),
    );
    showToast("success", "Default shipping location updated.");
  };

  // Set Default Billing Address
  const handleSetDefaultBilling = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefaultBilling: a._id === id,
      })),
    );
    showToast("success", "Default billing location updated.");
  };

  // Address Type Icon Helper
  const renderTypeBadge = (type) => {
    if (type === "work") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-mono uppercase tracking-wider">
          <Briefcase className="w-3 h-3 text-amber-700" />
          <span>WORK</span>
        </span>
      );
    }
    if (type === "other") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-900 text-[10px] font-mono uppercase tracking-wider">
          <Globe className="w-3 h-3 text-purple-700" />
          <span>OTHER</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-900 text-[10px] font-mono uppercase tracking-wider">
        <Home className="w-3 h-3 text-blue-700" />
        <span>HOME</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-m4m-bg text-[#111111] py-10 md:py-16 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Page Header / Breadcrumb */}
        <div className="mb-10 pb-6 border-b border-m4m-border flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-m4m-accent block mb-2">
              CLIENT PORTAL • DELIVERY & BILLING LOCATIONS
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight uppercase flex items-center gap-3">
              <span>Saved Address Book</span>
              <span className="text-sm font-mono bg-[#111111] text-m4m-bg px-3 py-1 rounded-none">
                {addresses.length}{" "}
                {addresses.length === 1 ? "LOCATION" : "LOCATIONS"}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 bg-[#111111] text-m4m-bg px-5 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-[#333333] transition-all rounded-none shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>
        </div>

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div
            className={`mb-8 p-4 border flex items-center justify-between text-xs font-mono uppercase tracking-wider transition-all ${
              toastMessage.type === "success"
                ? "bg-emerald-50/80 border-emerald-300 text-emerald-900"
                : toastMessage.type === "error"
                  ? "bg-rose-50/80 border-rose-300 text-rose-900"
                  : "bg-amber-50/80 border-amber-300 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-3">
              {toastMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-xs text-m4m-accent hover:text-[#111111]"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Saved Addresses List (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {addresses.length === 0 ? (
              /* Empty Address State */
              <div className="bg-m4m-card border border-m4m-border p-8 sm:p-12 text-center space-y-6 shadow-xs">
                <div className="w-20 h-20 mx-auto rounded-full bg-m4m-bg border border-m4m-border flex items-center justify-center text-m4m-accent">
                  <MapPin className="w-10 h-10 stroke-[1.25] text-m4m-accent" />
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-m4m-accent">
                    NO SAVED LOCATIONS
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-[#111111]">
                    Your Address Book is Empty
                  </h2>
                  <p className="text-xs text-m4m-secondary font-sans leading-relaxed">
                    Save delivery locations and billing details for express
                    checkout, order fulfillment tracking, and regional concierge
                    delivery options.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-2 bg-[#111111] text-m4m-bg px-7 py-3 text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Your First Address</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Address Cards List */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`bg-m4m-card border p-6 flex flex-col justify-between space-y-5 shadow-xs relative transition-all ${
                      addr.isDefaultShipping || addr.isDefaultBilling
                        ? "border-[#111111] ring-1 ring-[#111111]"
                        : "border-m4m-border hover:border-m4m-accent"
                    }`}
                  >
                    {/* Header Badges & Type */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        {renderTypeBadge(addr.addressType)}

                        <div className="flex items-center gap-1.5 flex-wrap">
                          {addr.isDefaultShipping && (
                            <span className="px-2 py-0.5 bg-[#111111] text-m4m-bg text-[9px] font-mono uppercase tracking-widest flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>DEFAULT SHIPPING</span>
                            </span>
                          )}
                          {addr.isDefaultBilling && (
                            <span className="px-2 py-0.5 bg-m4m-accent text-m4m-bg text-[9px] font-mono uppercase tracking-widest flex items-center gap-1">
                              <span>DEFAULT BILLING</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Recipient Details */}
                      <div>
                        <h3 className="font-serif text-lg uppercase text-[#111111] font-medium tracking-tight">
                          {addr.recipientName}
                        </h3>
                        <p className="text-xs font-mono text-m4m-accent mt-0.5">
                          {addr.phone}
                        </p>
                      </div>

                      {/* Address Lines */}
                      <div className="text-xs text-[#444444] font-sans leading-relaxed space-y-0.5 pt-2 border-t border-m4m-border">
                        <p className="font-medium text-[#111111]">
                          {addr.street}
                        </p>
                        {addr.apartment && <p>{addr.apartment}</p>}
                        <p>
                          {addr.city}, {addr.state} {addr.postalCode}
                        </p>
                        <p className="font-mono text-[11px] text-m4m-accent uppercase tracking-wider pt-1">
                          {addr.country}
                        </p>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="pt-4 border-t border-m4m-border space-y-3">
                      {/* Set Default Buttons */}
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                        {!addr.isDefaultShipping && (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultShipping(addr._id)}
                            className="px-2.5 py-1 border border-m4m-border text-m4m-secondary hover:text-[#111111] hover:border-[#111111] transition-colors uppercase tracking-wider"
                          >
                            Set Default Shipping
                          </button>
                        )}
                        {!addr.isDefaultBilling && (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultBilling(addr._id)}
                            className="px-2.5 py-1 border border-m4m-border text-m4m-secondary hover:text-[#111111] hover:border-[#111111] transition-colors uppercase tracking-wider"
                          >
                            Set Default Billing
                          </button>
                        )}
                      </div>

                      {/* Edit & Delete Action Buttons */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(addr)}
                          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#111111] hover:underline"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAddressToDelete(addr)}
                          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-rose-700 hover:text-rose-900 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Navigation Menu (Matches Profile, Cart & Wishlist pages) */}
            <div className="bg-m4m-card border border-m4m-border p-6 space-y-3 shadow-xs">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent mb-4">
                CLIENT ACCOUNT NAVIGATION
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 p-3 hover:bg-m4m-bg border border-m4m-border text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] transition-colors"
                >
                  <User className="w-4 h-4 text-m4m-accent" />
                  <span>Profile</span>
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center gap-2.5 p-3 hover:bg-m4m-bg border border-m4m-border text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] transition-colors"
                >
                  <Package className="w-4 h-4 text-m4m-accent" />
                  <span>Orders</span>
                </Link>

                <Link
                  to="/wishlist"
                  className="flex items-center gap-2.5 p-3 hover:bg-m4m-bg border border-m4m-border text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] transition-colors"
                >
                  <Heart className="w-4 h-4 text-m4m-accent" />
                  <span>Wishlist</span>
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center gap-2.5 p-3 hover:bg-m4m-bg border border-m4m-border text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-m4m-accent" />
                  <span>Active Bag</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Address Book Guidelines & Information (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Overview Summary Box */}
            <div className="bg-m4m-card border border-m4m-border p-6 space-y-6 shadow-xs sticky top-8">
              <div className="pb-4 border-b border-m4m-border flex items-center justify-between">
                <h3 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                  Delivery Summary
                </h3>
                <span className="text-[10px] font-mono text-m4m-accent uppercase tracking-widest">
                  PORTAL CONFIG
                </span>
              </div>

              {/* Statistics */}
              <div className="space-y-4 text-xs font-mono">
                <div className="flex justify-between items-center pb-3 border-b border-m4m-border/50">
                  <span className="text-m4m-secondary">Total Locations</span>
                  <span className="font-semibold text-[#111111]">
                    {addresses.length}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-m4m-border/50">
                  <span className="text-m4m-secondary">Default Shipping</span>
                  <span className="font-semibold text-[#111111] truncate max-w-[150px]">
                    {addresses.find((a) => a.isDefaultShipping)
                      ?.recipientName || "Not Set"}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-m4m-border/50">
                  <span className="text-m4m-secondary">Default Billing</span>
                  <span className="font-semibold text-[#111111] truncate max-w-[150px]">
                    {addresses.find((a) => a.isDefaultBilling)?.recipientName ||
                      "Not Set"}
                  </span>
                </div>
              </div>

              {/* Quick Action Button */}
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="w-full bg-[#111111] text-m4m-bg py-3.5 text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#333333] transition-all flex items-center justify-center gap-2 group"
              >
                <Plus className="w-4 h-4" />
                <span>ADD NEW ADDRESS</span>
              </button>

              {/* Delivery Protocol Information */}
              <div className="pt-4 border-t border-m4m-border space-y-3 text-[11px] font-mono text-m4m-secondary">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#111111] shrink-0" />
                  <span>Encrypted Identity & Address Vault</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#111111] shrink-0" />
                  <span>Global Express & Concierge Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-m4m-card border border-m4m-border max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-m4m-accent hover:text-[#111111] p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-4 border-b border-m4m-border">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent block mb-1">
                {editingAddress
                  ? "EDIT ADDRESS LOCATION"
                  : "NEW DELIVERY LOCATION"}
              </span>
              <h2 className="font-serif text-2xl uppercase tracking-wider text-[#111111]">
                {editingAddress ? "Update Saved Address" : "Add New Address"}
              </h2>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Recipient Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#111111] block">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    placeholder="e.g. Ayaan Ali"
                    className={`w-full bg-m4m-bg border px-3 py-2.5 text-xs font-sans text-[#111111] focus:outline-none focus:border-[#111111] ${
                      formErrors.recipientName
                        ? "border-rose-500"
                        : "border-m4m-border"
                    }`}
                  />
                  {formErrors.recipientName && (
                    <span className="text-[10px] font-mono text-rose-600 block">
                      {formErrors.recipientName}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#111111] block">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 98765 43210"
                    className={`w-full bg-m4m-bg border px-3 py-2.5 text-xs font-sans text-[#111111] focus:outline-none focus:border-[#111111] ${
                      formErrors.phone ? "border-rose-500" : "border-m4m-border"
                    }`}
                  />
                  {formErrors.phone && (
                    <span className="text-[10px] font-mono text-rose-600 block">
                      {formErrors.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Address Type Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#111111] block">
                  Address Tag / Label
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "home", label: "HOME", icon: Home },
                    { id: "work", label: "WORK", icon: Briefcase },
                    { id: "other", label: "OTHER", icon: Globe },
                  ].map((typeItem) => {
                    const IconComp = typeItem.icon;
                    const isSelected = formData.addressType === typeItem.id;
                    return (
                      <button
                        type="button"
                        key={typeItem.id}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            addressType: typeItem.id,
                          }))
                        }
                        className={`flex items-center justify-center gap-2 py-2.5 border text-xs font-mono uppercase tracking-wider transition-all ${
                          isSelected
                            ? "bg-[#111111] border-[#111111] text-m4m-bg"
                            : "bg-m4m-bg border-m4m-border text-m4m-secondary hover:border-[#111111]"
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                        <span>{typeItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Street Address & Apartment */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#111111] block">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="House number, street name, locality"
                  className={`w-full bg-m4m-bg border px-3 py-2.5 text-xs font-sans text-[#111111] focus:outline-none focus:border-[#111111] ${
                    formErrors.street ? "border-rose-500" : "border-m4m-border"
                  }`}
                />
                {formErrors.street && (
                  <span className="text-[10px] font-mono text-rose-600 block">
                    {formErrors.street}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#111111] block">
                  Apartment, Suite, Unit (Optional)
                </label>
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  placeholder="Apt 4B, Floor 3, Building B"
                  className="w-full bg-m4m-bg border border-m4m-border px-3 py-2.5 text-xs font-sans text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              {/* City, State & Postal Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#111111] block">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Mumbai"
                    className={`w-full bg-m4m-bg border px-3 py-2.5 text-xs font-sans text-[#111111] focus:outline-none focus:border-[#111111] ${
                      formErrors.city ? "border-rose-500" : "border-m4m-border"
                    }`}
                  />
                  {formErrors.city && (
                    <span className="text-[10px] font-mono text-rose-600 block">
                      {formErrors.city}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#111111] block">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Maharashtra"
                    className={`w-full bg-m4m-bg border px-3 py-2.5 text-xs font-sans text-[#111111] focus:outline-none focus:border-[#111111] ${
                      formErrors.state ? "border-rose-500" : "border-m4m-border"
                    }`}
                  />
                  {formErrors.state && (
                    <span className="text-[10px] font-mono text-rose-600 block">
                      {formErrors.state}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#111111] block">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="400001"
                    className={`w-full bg-m4m-bg border px-3 py-2.5 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111] ${
                      formErrors.postalCode
                        ? "border-rose-500"
                        : "border-m4m-border"
                    }`}
                  />
                  {formErrors.postalCode && (
                    <span className="text-[10px] font-mono text-rose-600 block">
                      {formErrors.postalCode}
                    </span>
                  )}
                </div>
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#111111] block">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-m4m-bg border border-m4m-border px-3 py-2.5 text-xs font-sans text-[#111111] focus:outline-none focus:border-[#111111]"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United Arab Emirates">
                    United Arab Emirates
                  </option>
                  <option value="Canada">Canada</option>
                  <option value="France">France</option>
                  <option value="Italy">Italy</option>
                </select>
              </div>

              {/* Default Flags Checkboxes */}
              <div className="pt-2 border-t border-m4m-border space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isDefaultShipping"
                    checked={formData.isDefaultShipping}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded-none accent-[#111111]"
                  />
                  <span className="text-xs font-mono text-[#111111] uppercase tracking-wider">
                    Set as default shipping address
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isDefaultBilling"
                    checked={formData.isDefaultBilling}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded-none accent-[#111111]"
                  />
                  <span className="text-xs font-mono text-[#111111] uppercase tracking-wider">
                    Set as default billing address
                  </span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-m4m-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-m4m-border text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#111111] text-m4m-bg text-xs font-mono uppercase tracking-wider hover:bg-[#333333] transition-colors flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingAddress ? "Save Changes" : "Add Address"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {addressToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/60 backdrop-blur-xs">
          <div className="bg-m4m-card border border-m4m-border max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg uppercase tracking-wider text-[#111111]">
                Confirm Address Removal
              </h3>
            </div>

            <p className="text-xs text-m4m-secondary font-sans leading-relaxed">
              Are you sure you want to remove the address for{" "}
              <strong className="text-[#111111]">
                {addressToDelete.recipientName}
              </strong>{" "}
              ({addressToDelete.street}, {addressToDelete.city}) from your saved
              address book?
            </p>

            <div className="pt-3 border-t border-m4m-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAddressToDelete(null)}
                className="px-4 py-2 border border-m4m-border text-xs font-mono uppercase text-m4m-secondary hover:text-[#111111]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAddress}
                className="px-5 py-2 bg-rose-700 text-white text-xs font-mono uppercase tracking-wider hover:bg-rose-800 transition-colors"
              >
                Remove Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;
