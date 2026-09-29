import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  FaArrowLeft,
} from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();

  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "Jane Doe",
    email: "jane@example.com",
    phone: "+91 98765 43210",
    storeName: "Acme Goods",
    category: "Handmade Products",
    taxId: "",
    website: "",
    address: "",
    city: "Bhatkal",
    state: "Karnataka",
    postalCode: "",
    currentPassword: "",
    newPassword: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setCover(URL.createObjectURL(file));
    }
  };

  const handleBack = () => {
    navigate("/pages/vendor/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={handleBack}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              <FaArrowLeft />
            </button>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Profile
              </h1>

              <p className="text-sm text-slate-500">
                Manage your vendor profile
              </p>
            </div>

          </div>

        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">

        {isSaved && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-700">
            <FaCheckCircle />
            <span>Changes updated successfully!</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Cover */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">

            <div
              className="h-40 bg-slate-200 relative"
              style={{
                backgroundImage: cover
                  ? `url(${cover})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >

              {!cover && (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  Cover Image
                </div>
              )}

              <label className="absolute right-4 bottom-4 cursor-pointer">

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverChange}
                />

                <span className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow text-sm font-medium">
                  <FaCamera />
                  Change Cover
                </span>

              </label>

            </div>

            {/* Profile */}
            <div className="px-6 pb-6">

              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">

                <div className="relative">

                  <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 overflow-hidden">

                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <FaUser className="text-3xl" />
                      </div>
                    )}

                  </div>

                  <label className="absolute bottom-0 right-0 cursor-pointer">

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />

                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-600 text-white border-2 border-white">
                      <FaCamera className="text-xs" />
                    </span>

                  </label>

                </div>

                <div className="pb-1">

                  <h2 className="text-xl font-bold text-slate-900">
                    {formData.fullName}
                  </h2>

                  <p className="text-sm text-slate-500">
                    Vendor
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* Personal Information */}
          <section className="bg-white rounded-xl border border-slate-200 p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <FaUser />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Personal Information
                </h2>

                <p className="text-sm text-slate-500">
                  Update your personal details
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>

                <div className="relative">

                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                  />

                </div>

              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone
                </label>

                <div className="relative">

                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                  />

                </div>

              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Website
                </label>

                <div className="relative">

                  <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                  />

                </div>

              </div>

            </div>

          </section>

          {/* Store Information */}
          <section className="bg-white rounded-xl border border-slate-200 p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <FaStore />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Store Information
                </h2>

                <p className="text-sm text-slate-500">
                  Manage your store details
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Store Name
                </label>

                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tax ID
                </label>

                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                />
              </div>

            </div>

          </section>

          {/* Address */}
          <section className="bg-white rounded-xl border border-slate-200 p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <FaMapMarkerAlt />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Address
                </h2>

                <p className="text-sm text-slate-500">
                  Store address information
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="md:col-span-2">

                <label className="block text-sm font-medium mb-2">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Postal Code
                </label>

                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                />

              </div>

            </div>

          </section>

          {/* Password */}
          <section className="bg-white rounded-xl border border-slate-200 p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <FaLock />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Password
                </h2>

                <p className="text-sm text-slate-500">
                  Change your account password
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-medium mb-2">
                  Current Password
                </label>

                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-teal-500"
                />

              </div>

            </div>

          </section>

          {/* Save */}
          <div className="flex justify-end">

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
            >
              <FaSave />
              Save Changes
            </button>

          </div>

        </form>

      </main>

    </div>
  );
};

export default Profile;