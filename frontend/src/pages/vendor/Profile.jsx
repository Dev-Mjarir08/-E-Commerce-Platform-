import React, { useState } from "react";
import {
  FaUser,
  FaStore,
  FaCamera,
  FaSave,
  FaCheckCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaReceipt,
  FaLock,
  FaShieldAlt,
  FaTag,
  FaGlobe,
} from "react-icons/fa";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    fullName: "Mohammed Rouhan",
    email: "rouhan@example.com",
    phone: "+91 98765 43210",
    storeName: "Rouhan Traders",
    category: "Electronics & Wearables",
    taxId: "GSTIN29ABCDE1234F",
    website: "https://rouhantraders.com",
    address: "123 Commercial Street",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560001",
    currentPassword: "",
    newPassword: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) setCover(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* TOP BANNER & PROFILE CARD */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Cover Photo */}
          <div className="relative h-44 sm:h-56 bg-linear-to-r from-teal-800 via-teal-700 to-slate-900 overflow-hidden">
            {cover && (
              <img src={cover} alt="Cover" className="w-full h-full object-cover" />
            )}
            <label
              htmlFor="cover-input"
              className="absolute top-4 right-4 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium px-3.5 py-2 rounded-xl cursor-pointer transition-all flex items-center gap-2 border border-white/20 shadow-sm"
            >
              <FaCamera /> Edit Cover
              <input
                id="cover-input"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Profile Header Details */}
          <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 sm:-mt-20">
              {/* Avatar Upload */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-teal-900 text-white flex items-center justify-center text-4xl font-semibold overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-100">
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser />
                  )}
                </div>
                <label
                  htmlFor="avatar-input"
                  className="absolute bottom-1 right-1 bg-teal-700 hover:bg-teal-800 text-white p-2.5 rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105 border-2 border-white"
                  title="Upload Photo"
                >
                  <FaCamera className="text-xs" />
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Title Info */}
              <div className="text-center sm:text-left space-y-1 mb-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl font-bold text-zinc-700 tracking-tight relative top-4">
                    {formData.storeName || "Vendor Name"}
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-teal-200/60 relative top-4">
                    <FaCheckCircle className="text-teal-600 text-[10px] relative " /> Verified Merchant
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 relative top-4">
                  {formData.fullName} • <span className="text-slate-400">{formData.email}</span>
                </p>
              </div>
            </div>

            {/* Save Toast Notification */}
            {isSaved && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm animate-pulse">
                <FaCheckCircle className="text-emerald-600" /> Changes updated!
              </div>
            )}
          </div>

          {/* TABS NAVIGATION */}
          <div className="flex border-t border-slate-100 px-6 gap-6 overflow-x-auto">
            {[
              { id: "general", label: "General & Contact", icon: FaUser },
              { id: "business", label: "Store & Address", icon: FaStore },
              { id: "security", label: "Security", icon: FaLock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? "border-teal-700 text-teal-800 font-semibold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className={isActive ? "text-teal-700" : "text-slate-400"} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* FORM CONTAINER */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* TAB 1: GENERAL & CONTACT */}
          {activeTab === "general" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500">Manage your identity and direct contact information.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
                      required
                    />
                    <FaUser className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
                      required
                    />
                    <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
                      required
                    />
                    <FaPhone className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    Website URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourstore.com"
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
                    />
                    <FaGlobe className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STORE & ADDRESS */}
          {activeTab === "business" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Store & Billing Address</h3>
                <p className="text-xs text-slate-500">Configure public business details and physical address.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    Store Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
                      required
                    />
                    <FaBuilding className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    Category
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
                    />
                    <FaTag className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    GSTIN / Tax Registration
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
                    />
                    <FaReceipt className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    Street Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
                    />
                    <FaMapMarkerAlt className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    State & Postal Code
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-1/2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="PIN Code"
                      className="w-1/2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY */}
          {activeTab === "security" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Security Credentials</h3>
                <p className="text-xs text-slate-500">Update your account access password and authentication security.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
                    />
                    <FaLock className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
                    />
                    <FaShieldAlt className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM SUBMIT ACTION */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-800 hover:bg-teal-900 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 active:scale-95 transition-all cursor-pointer"
            >
              <FaSave /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}