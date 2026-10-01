import React, { useState, useEffect } from "react";
import {
  FaStore,
  FaImage,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSave,
  FaClock,
  FaCloudUploadAlt,
  FaTimes,
  FaShieldAlt,
  FaStar,
  FaExternalLinkAlt,
  FaTruck,
  FaUndo,
  FaSpinner
} from "react-icons/fa";
import vendorApi from "../../services/vendorApi";

// Initial Mock Vendor Store Data
const initialStoreSettings = {
  storeName: "Aura Tech & Lifestyle Atelier",
  tagline: "Curated ergonomic accessories, workspace essentials, and acoustic audio products.",
  slug: "aura-tech-lifestyle",
  email: "support@auratech.com",
  phone: "+1 (555) 019-2834",
  address: "742 Evergreen Terrace, Suite 100, San Francisco, CA 94107",
  website: "https://auratech.example.com",
  description:
    "We design and curate top-tier personal audio equipment and everyday ergonomic workspace accessories. Dedicated to sustainable packaging and lifetime support.",
  bannerUrl:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
  logoUrl:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
  hours: {
    monday: "09:00 AM - 06:00 PM",
    saturday: "10:00 AM - 04:00 PM",
    sunday: "Closed",
  },
  policies: {
    shippingPolicy: "Standard shipping takes 3-5 business days. Free shipping on orders over $50.",
    returnPolicy: "30-day hassle-free return window for un-damaged items in original packaging.",
    warranty: "1-Year limited manufacturer warranty on all electronics.",
  },
  rating: 4.9,
  totalReviews: 18,
};

export default function VendorStore() {
  const [store, setStore] = useState(initialStoreSettings);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch real registered store from backend
  useEffect(() => {
    const fetchRegisteredStore = async () => {
      try {
        const response = await vendorApi.getProfile();
        const data = response?.data || response;
        if (data?.store) {
          const s = data.store;
          setStore((prev) => ({
            ...prev,
            storeName: s.name || prev.storeName,
            tagline: s.description ? s.description.slice(0, 70) + "..." : prev.tagline,
            slug: s.slug || prev.slug,
            email: s.email || prev.email,
            phone: s.phone || prev.phone,
            address: s.address?.street
              ? `${s.address.street}, ${s.address.city || ""}, ${s.address.state || ""} ${s.address.postalCode || ""}`
              : prev.address,
            website: s.website || prev.website,
            description: s.description || prev.description,
            bannerUrl: s.banner?.url || prev.bannerUrl,
            logoUrl: s.logo?.url || prev.logoUrl,
            rating: s.ratingAverage || prev.rating,
            totalReviews: s.ratingCount || prev.totalReviews,
          }));
        }
      } catch (err) {
        console.warn("Could not fetch remote store, using defaults:", err);
      }
    };
    fetchRegisteredStore();
  }, []);

  // Handle Input Changes
  const handleChange = (field, value) => {
    setStore((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setStore((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  // Image Upload
  const handleImageUpload = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setStore((prev) => ({ ...prev, [field]: imageUrl }));
    }
  };

  // Save Settings to Backend API
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await vendorApi.updateProfile({
        storeName: store.storeName,
        storeDescription: store.description,
        storeEmail: store.email,
        storePhone: store.phone,
        website: store.website,
        logo: { url: store.logoUrl },
        banner: { url: store.bannerUrl }
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* TOP BAR / HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Storefront Customization
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage public store branding, contact info, operating schedules, and policies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://marketplace.com/store/${store.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm"
            >
              <FaExternalLinkAlt className="text-xs text-slate-400" /> View Live Store
            </a>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 hover:bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/10 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
            >
              <FaSave className="text-xs" /> {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>

        {/* SAVE CONFIRMATION NOTIFICATION */}
        {isSaved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between animate-fade-in">
            <span>Store settings and storefront branding have been updated successfully!</span>
            <button onClick={() => setIsSaved(false)} className="text-emerald-600 hover:text-emerald-900">
              <FaTimes />
            </button>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">

          {/* STORE BANNER & LOGO PREVIEW HEADER */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Banner Area */}
            <div className="relative h-48 sm:h-64 bg-slate-100 overflow-hidden group">
              <img
                src={store.bannerUrl}
                alt="Store Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-white/90 hover:bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 transition">
                  <FaCloudUploadAlt className="text-sm" /> Change Cover Banner
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("bannerUrl", e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Profile Info Row */}
            <div className="p-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4 -mt-12 sm:-mt-16">
                <div className="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-slate-200 shrink-0">
                  <img
                    src={store.logoUrl}
                    alt="Store Logo"
                    className="w-full h-full object-cover"
                  />
                  <label className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <FaCloudUploadAlt className="text-white text-lg" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload("logoUrl", e)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="mb-1">
                  <h2 className="text-xl font-bold text-slate-900">{store.storeName}</h2>
                  <p className="text-xs text-slate-500 font-medium">{store.tagline}</p>
                </div>
              </div>

              {/* Rating Pill */}
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-bold text-amber-900">
                <FaStar className="text-amber-500" />
                <span>{store.rating} Rating</span>
                <span className="text-amber-600 font-normal">({store.totalReviews} reviews)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT COLUMN: GENERAL INFO & CONTACT */}
            <div className="lg:col-span-2 space-y-6">

              {/* General Store Details */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FaStore className="text-teal-700" /> Store Profile & Bio
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Store Name
                  </label>
                  <input
                    type="text"
                    required
                    value={store.storeName}
                    onChange={(e) => handleChange("storeName", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={store.tagline}
                    onChange={(e) => handleChange("tagline", e.target.value)}
                    placeholder="Short summary displayed under your store name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Store Bio / Description
                  </label>
                  <textarea
                    rows="4"
                    value={store.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FaEnvelope className="text-teal-700" /> Public Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Support Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={store.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                      />
                      <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Business Phone
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={store.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                      />
                      <FaPhone className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Physical / Return Address
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={store.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                      />
                      <FaMapMarkerAlt className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      External Website
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={store.website}
                        onChange={(e) => handleChange("website", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                      />
                      <FaGlobe className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendor Policies */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FaShieldAlt className="text-teal-700" /> Store Terms & Terms
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <FaTruck className="text-slate-400" /> Shipping Policy
                  </label>
                  <textarea
                    rows="2"
                    value={store.policies.shippingPolicy}
                    onChange={(e) =>
                      handleNestedChange("policies", "shippingPolicy", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <FaUndo className="text-slate-400" /> Refund & Return Policy
                  </label>
                  <textarea
                    rows="2"
                    value={store.policies.returnPolicy}
                    onChange={(e) =>
                      handleNestedChange("policies", "returnPolicy", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: OPERATING HOURS & URL SLUG */}
            <div className="space-y-6">

              {/* Store Permalink */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Store Slug / URL
                </h4>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50">
                  <span className="bg-slate-100 text-slate-500 px-3 py-2 text-xs flex items-center border-r border-slate-200 font-mono">
                    /store/
                  </span>
                  <input
                    type="text"
                    value={store.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    className="w-full bg-transparent px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Support Operating Hours */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FaClock className="text-slate-400" /> Customer Support Schedule
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Monday - Friday
                    </label>
                    <input
                      type="text"
                      value={store.hours.monday}
                      onChange={(e) =>
                        handleNestedChange("hours", "monday", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Saturday
                    </label>
                    <input
                      type="text"
                      value={store.hours.saturday}
                      onChange={(e) =>
                        handleNestedChange("hours", "saturday", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Sunday
                    </label>
                    <input
                      type="text"
                      value={store.hours.sunday}
                      onChange={(e) =>
                        handleNestedChange("hours", "sunday", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
}