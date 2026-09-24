import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  FaSpinner,
  FaExclamationCircle,
  FaStar,
} from "react-icons/fa";
import { fetchVendorDashboard, updateVendorProfile } from "../../redux/slices/vendorSlice";
import vendorApi from "../../services/vendorApi";

export default function Profile() {
  const dispatch = useDispatch();
  const { user: vendorUser, store: vendorStore, loading: reduxLoading } = useSelector(
    (state) => state.vendor
  );
  const { user: authUser } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    storeName: "",
    storeDescription: "",
    category: "",
    taxId: "",
    website: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Sync state with registered Vendor & Store data
  const populateFromData = (user, store) => {
    const activeUser = user || authUser || {};
    const activeStore = store || {};

    setFormData((prev) => ({
      ...prev,
      fullName: activeUser.name || "",
      email: activeUser.email || "",
      phone: activeUser.phone || activeStore.phone || "",
      storeName: activeStore.name || "",
      storeDescription: activeStore.description || "",
      category: activeStore.category || "Lifestyle & Ergonomics",
      taxId: activeStore.settings?.taxId || "",
      website: activeStore.website || "",
      address: activeStore.address?.street || "",
      city: activeStore.address?.city || "",
      state: activeStore.address?.state || "",
      postalCode: activeStore.address?.postalCode || "",
      country: activeStore.address?.country || "United States",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));

    if (activeUser.avatar) {
      setAvatarPreview(
        typeof activeUser.avatar === "object" ? activeUser.avatar.url : activeUser.avatar
      );
    }
    if (activeStore.banner) {
      setBannerPreview(
        typeof activeStore.banner === "object" ? activeStore.banner.url : activeStore.banner
      );
    }
  };

  // Fetch real registered store & vendor profile from backend
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const response = await vendorApi.getProfile();
        const profileData = response?.data || response;
        if (profileData) {
          populateFromData(profileData.user, profileData.store);
          dispatch(fetchVendorDashboard());
        }
      } catch (error) {
        console.warn("Using redux fallback vendor state:", error);
        populateFromData(vendorUser, vendorStore);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [dispatch]);

  // Keep in sync if redux store updates
  useEffect(() => {
    if (vendorUser || vendorStore) {
      populateFromData(vendorUser, vendorStore);
    }
  }, [vendorUser, vendorStore]);

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage({ type: "", text: "" }), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Avatar Upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show temporary preview
    setAvatarPreview(URL.createObjectURL(file));

    // Upload to server
    const data = new FormData();
    data.append("avatar", file);

    setIsUploadingAvatar(true);
    try {
      await vendorApi.uploadAvatar(data);
      dispatch(fetchVendorDashboard());
      showToast("success", "Profile avatar updated successfully!");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to upload avatar image.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handle Cover Banner Upload
  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBannerPreview(URL.createObjectURL(file));

    const data = new FormData();
    data.append("banner", file);

    try {
      await vendorApi.updateProfile({
        banner: { url: URL.createObjectURL(file) }
      });
      showToast("success", "Cover banner updated!");
    } catch {
      // Local preview fallback
    }
  };

  // Submit Profile & Store Settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        storeName: formData.storeName.trim(),
        storeDescription: formData.storeDescription.trim(),
        storePhone: formData.phone.trim(),
        category: formData.category.trim(),
        website: formData.website.trim(),
        taxId: formData.taxId.trim(),
        street: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
      };

      await dispatch(updateVendorProfile(payload)).unwrap();
      dispatch(fetchVendorDashboard());
      showToast("success", "Vendor profile and store details saved successfully!");
    } catch (error) {
      showToast("error", typeof error === "string" ? error : "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // Change Password Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword) {
      showToast("error", "Please provide current and new password.");
      return;
    }

    if (formData.newPassword.length < 6) {
      showToast("error", "New password must be at least 6 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showToast("error", "New password and confirmation do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await vendorApi.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      showToast("success", "Account password updated successfully!");
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to update password. Verify current password."
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading && !formData.fullName) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-8 text-neutral-800">
        <FaSpinner className="w-8 h-8 animate-spin text-neutral-900 mb-3" />
        <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
          Loading Registered Store Profile...
        </p>
      </div>
    );
  }

  const activeStoreName = formData.storeName || vendorStore?.name || "Registered Atelier Store";
  const activeRating = vendorStore?.ratingAverage || 5.0;
  const isVerifiedStore = vendorStore?.isVerified ?? true;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111] py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#111111] selection:text-[#FAF9F6]">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* TOP BANNER & PROFILE CARD */}
        <div className="bg-white rounded-2xl border border-[#E5E3DF] shadow-sm overflow-hidden">
          {/* Cover Photo */}
          <div className="relative h-44 sm:h-56 bg-neutral-900 overflow-hidden">
            {bannerPreview ? (
              <img src={bannerPreview} alt="Cover" className="w-full h-full object-cover opacity-90" />
            ) : (
              <div className="w-full h-full bg-linear-to-r from-neutral-950 via-neutral-900 to-neutral-800 flex items-center justify-center">
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400">
                  {activeStoreName} • BRAND ATELIER
                </span>
              </div>
            )}
            <label
              htmlFor="cover-input"
              className="absolute top-4 right-4 bg-neutral-900/70 hover:bg-neutral-900 backdrop-blur-md text-white text-xs font-mono uppercase tracking-wider px-3.5 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-2 border border-white/20 shadow-sm"
            >
              <FaCamera className="text-xs" /> Edit Cover
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
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-4xl font-semibold overflow-hidden border-4 border-white shadow-xl ring-1 ring-neutral-200">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-serif uppercase text-3xl font-light">
                      {formData.fullName?.charAt(0) || "V"}
                    </span>
                  )}
                </div>
                <label
                  htmlFor="avatar-input"
                  className="absolute bottom-1 right-1 bg-neutral-900 hover:bg-neutral-800 text-white p-2.5 rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105 border-2 border-white"
                  title="Upload Photo"
                >
                  {isUploadingAvatar ? (
                    <FaSpinner className="text-xs animate-spin" />
                  ) : (
                    <FaCamera className="text-xs" />
                  )}
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isUploadingAvatar}
                  />
                </label>
              </div>

              {/* Title Info */}
              <div className="text-center sm:text-left space-y-1 mb-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl font-serif font-normal text-neutral-900 uppercase tracking-tight relative top-4">
                    {activeStoreName}
                  </h1>
                  {isVerifiedStore && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 relative top-4">
                      <FaCheckCircle className="text-emerald-600 text-[10px]" /> Verified Merchant
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full border border-amber-200 relative top-4">
                    <FaStar className="text-amber-500 text-[10px]" /> {activeRating} Rating
                  </span>
                </div>
                <p className="text-xs font-mono text-neutral-500 relative top-4">
                  {formData.fullName || "Partner Merchant"} •{" "}
                  <span className="text-neutral-400">{formData.email}</span>
                </p>
              </div>
            </div>

            {/* Notification Toast */}
            {toastMessage.text && (
              <div
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider shadow-sm transition-all ${
                  toastMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {toastMessage.type === "success" ? (
                  <FaCheckCircle className="text-emerald-600 shrink-0" />
                ) : (
                  <FaExclamationCircle className="text-red-600 shrink-0" />
                )}
                <span>{toastMessage.text}</span>
              </div>
            )}
          </div>

          {/* TABS NAVIGATION */}
          <div className="flex border-t border-[#E5E3DF] px-6 gap-8 overflow-x-auto bg-[#FAF9F6]/50">
            {[
              { id: "general", label: "General & Contact", icon: FaUser },
              { id: "business", label: "Registered Store & Address", icon: FaStore },
              { id: "security", label: "Security & Credentials", icon: FaLock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3.5 text-xs font-mono uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "border-[#111111] text-[#111111] font-bold"
                      : "border-transparent text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <Icon className={isActive ? "text-[#111111]" : "text-neutral-400"} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: GENERAL & CONTACT */}
        {activeTab === "general" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E3DF] shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-serif uppercase tracking-tight text-neutral-900 font-semibold">
                  Personal & Operational Identity
                </h3>
                <p className="text-xs text-neutral-500 font-sans mt-0.5">
                  Your registered vendor partner contact details fetched directly from database.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#E5E3DF] pl-10 pr-4 py-3 text-xs font-sans text-neutral-900 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                      required
                    />
                    <FaUser className="absolute left-3.5 top-3.5 text-neutral-400 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">
                    Registered Email (Read-Only)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="w-full rounded-xl border border-[#E5E3DF] pl-10 pr-4 py-3 text-xs font-sans text-neutral-500 bg-neutral-100 cursor-not-allowed"
                    />
                    <FaEnvelope className="absolute left-3.5 top-3.5 text-neutral-400 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl border border-[#E5E3DF] pl-10 pr-4 py-3 text-xs font-sans text-neutral-900 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                    />
                    <FaPhone className="absolute left-3.5 top-3.5 text-neutral-400 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">
                    Official Website
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourstore.com"
                      className="w-full rounded-xl border border-[#E5E3DF] pl-10 pr-4 py-3 text-xs font-sans text-neutral-900 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                    />
                    <FaGlobe className="absolute left-3.5 top-3.5 text-neutral-400 text-xs" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 px-7 py-3 text-xs font-mono uppercase tracking-widest text-white shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-60"
              >
                {isSaving ? <FaSpinner className="animate-spin text-xs" /> : <FaSave className="text-xs" />}
                <span>Save General Profile</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: STORE & ADDRESS */}
        {activeTab === "business" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E3DF] shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-serif uppercase tracking-tight text-neutral-900 font-semibold">
                  Registered Store Information
                </h3>
                <p className="text-xs text-neutral-500 font-sans mt-0.5">
                  Public storefront credentials, commercial category, and operating address.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">
                    Storefront Trade Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#E5E3DF] pl-10 pr-4 py-3 text-xs font-sans text-neutral-900 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                      required
                    />
                    <FaBuilding className="absolute left-3.5 top-3.5 text-neutral-400 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">
                    Primary Product Category
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g. Ergonomics, Audio, Fashion"
                      className="w-full rounded-xl border border-[#E5E3DF] pl-10 pr-4 py-3 text-xs font-sans text-neutral-900 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                    />
                    <FaTag className="absolute left-3.5 top-3.5 text-neutral-400 text-xs" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">
                    Store Bio & Narrative
                  </label>
                  <textarea
                    name="storeDescription"
                    rows={3}
                    value={formData.storeDescription}
                    onChange={handleChange}
                    placeholder="Describe your atelier's design ethos, craftsmanship, and products..."
                    className="w-full rounded-xl border border-[#E5E3DF] p-3.5 text-xs font-sans text-neutral-900 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">
                    Tax ID / Business Registration (GSTIN / EIN)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      placeholder="e.g. GSTIN29ABCDE1234F / EIN-12345678"
                      className="w-full rounded-xl border border-[#E5E3DF] pl-10 pr-4 py-3 text-xs font-sans text-neutral-900 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                    />
                    <FaReceipt className="absolute left-3.5 top-3.5 text-neutral-400 text-xs" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">
                    Registered Street Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. 742 Evergreen Terrace, Suite 100"
                      className="w-full rounded-xl border border-[#E5E3DF] pl-10 pr-4 py-3 text-xs font-sans text-neutral-900 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                    />
                    <FaMapMarkerAlt className="absolute left-3.5 top-3.5 text-neutral-400 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full rounded-xl border border-[#E5E3DF] px-4 py-3 text-xs font-sans text-neutral-900 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">
                    State & Postal Code
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State / Province"
                      className="w-1/2 rounded-xl border border-[#E5E3DF] px-4 py-3 text-xs font-sans text-neutral-900 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="Postal Code"
                      className="w-1/2 rounded-xl border border-[#E5E3DF] px-4 py-3 text-xs font-sans text-neutral-900 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 px-7 py-3 text-xs font-mono uppercase tracking-widest text-white shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-60"
              >
                {isSaving ? <FaSpinner className="animate-spin text-xs" /> : <FaSave className="text-xs" />}
                <span>Save Storefront Details</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: SECURITY */}
        {activeTab === "security" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E3DF] shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-serif uppercase tracking-tight text-neutral-900 font-semibold">
                  Account Password & Authentication
                </h3>
                <p className="text-xs text-neutral-500 font-sans mt-0.5">
                  Update your account access password and secure your vendor dashboard session.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">
                    Current Password *
                  </label>
                  <div className="relative max-w-md">
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-[#E5E3DF] pl-10 pr-4 py-3 text-xs font-sans text-neutral-900 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                      required
                    />
                    <FaLock className="absolute left-3.5 top-3.5 text-neutral-400 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-[#E5E3DF] pl-10 pr-4 py-3 text-xs font-sans text-neutral-900 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                      required
                    />
                    <FaShieldAlt className="absolute left-3.5 top-3.5 text-neutral-400 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-[#E5E3DF] pl-10 pr-4 py-3 text-xs font-sans text-neutral-900 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
                      required
                    />
                    <FaShieldAlt className="absolute left-3.5 top-3.5 text-neutral-400 text-xs" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 px-7 py-3 text-xs font-mono uppercase tracking-widest text-white shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-60"
              >
                {isChangingPassword ? <FaSpinner className="animate-spin text-xs" /> : <FaLock className="text-xs" />}
                <span>Update Account Password</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}