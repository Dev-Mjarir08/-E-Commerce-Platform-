import React, { useState, useEffect } from "react";
import {
  FaBox,
  FaImage,
  FaPlus,
  FaTrash,
  FaCloudUploadAlt,
  FaDollarSign,
  FaTags,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaExclamationTriangle,
  FaEye,
} from "react-icons/fa";

// Simulated initial product retrieved from route state/API
const mockExistingProduct = {
  id: "PRD-9021",
  title: "Noise-Canceling Wireless Headphones Pro",
  sku: "HD-NC-PRO-01",
  category: "Electronics",
  description: "High-fidelity active noise-canceling headphones featuring a 30-hour battery life, ergonomic memory foam earcups, and multipoint Bluetooth connectivity.",
  status: "Active",
  pricing: {
    price: "199.99",
    comparePrice: "249.99",
    costPerItem: "85.00",
    stockQuantity: "64",
    trackInventory: true,
  },
  tags: ["Bestseller", "Audio", "Noise-Canceling", "Wireless"],
  images: [
    {
      id: "img-1",
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
      name: "headphones-front.jpg",
    },
    {
      id: "img-2",
      url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&auto=format&fit=crop&q=60",
      name: "headphones-side.jpg",
    },
  ],
  coverIndex: 0,
  variants: [
    { id: 101, name: "Color", value: "Matte Black", price: "199.99", stock: "40" },
    { id: 102, name: "Color", value: "Silver White", price: "209.99", stock: "24" },
  ],
};

import { useParams, useNavigate } from "react-router-dom";
import productApi from "../../services/productApi";

export default function EditProduct({ onBack }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Product state loaded with existing data
  const [productData, setProductData] = useState(mockExistingProduct);
  const [pricing, setPricing] = useState(mockExistingProduct.pricing);
  const [images, setImages] = useState(mockExistingProduct.images);
  const [coverIndex, setCoverIndex] = useState(mockExistingProduct.coverIndex);
  const [variants, setVariants] = useState(mockExistingProduct.variants);
  const [tags, setTags] = useState(mockExistingProduct.tags);
  const [tagInput, setTagInput] = useState("");

  // Unsaved changes detector
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (id) {
      productApi.getProductById(id).then((res) => {
        const p = res?.data?.product || res?.product || res?.data;
        if (p) {
          setProductData((prev) => ({
            ...prev,
            id: p._id || id,
            title: p.name || prev.title,
            description: p.description || prev.description,
            category: p.category?.name || p.category || prev.category,
            status: p.status === 'active' ? 'Active' : 'Draft',
          }));
          if (p.price) {
            setPricing((prev) => ({ ...prev, price: p.price.toString(), stockQuantity: (p.stock || 0).toString() }));
          }
          if (p.images && p.images.length > 0) {
            setImages(p.images.map((img, idx) => ({ id: `img-${idx}`, url: img.url || img, name: `image-${idx}` })));
          }
        }
      }).catch((err) => console.warn('Product load fallback:', err));
    }
  }, [id]);

  const handleBack = () => {
    if (onBack) onBack();
    else navigate('/vendor/products');
  };

  const markChanged = () => {
    if (!hasUnsavedChanges) setHasUnsavedChanges(true);
  };

  // Image Upload Simulation
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => [...prev, ...newImages]);
    markChanged();
  };

  const removeImage = (id, index) => {
    setImages(images.filter((img) => img.id !== id));
    if (coverIndex === index) {
      setCoverIndex(0);
    } else if (coverIndex > index) {
      setCoverIndex(coverIndex - 1);
    }
    markChanged();
  };

  // Tag Operations
  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        markChanged();
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    markChanged();
  };

  // Variant Operations
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now(),
        name: "Option Name",
        value: "Option Value",
        price: pricing.price || "",
        stock: "10",
      },
    ]);
    markChanged();
  };

  const removeVariant = (id) => {
    setVariants(variants.filter((v) => v.id !== id));
    markChanged();
  };

  const updateVariant = (id, field, val) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: val } : v))
    );
    markChanged();
  };

  // Financial Estimates
  const priceNum = parseFloat(pricing.price) || 0;
  const costNum = parseFloat(pricing.costPerItem) || 0;
  const profit = priceNum - costNum;
  const margin = priceNum > 0 ? ((profit / priceNum) * 100).toFixed(1) : 0;

  // Form Submit
  const handleSave = (e) => {
    e.preventDefault();
    const updatedPayload = {
      ...productData,
      pricing,
      tags,
      images,
      coverImage: images[coverIndex]?.url || null,
      variants,
    };
    console.log("Updated Product Payload:", updatedPayload);
    setHasUnsavedChanges(false);
    alert("Product changes saved successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* TOP BAR & ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition"
              title="Back to Catalog"
            >
              <FaArrowLeft className="text-sm" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Edit Product
                </h1>
                <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  {productData.id}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                Update storefront listings, price points, images, and option stock levels.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 transition"
            >
              <FaEye className="text-xs" /> Preview Listing
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 hover:bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/10 active:scale-95 transition-all cursor-pointer"
            >
              <FaSave className="text-xs" /> Save Changes
            </button>
          </div>
        </div>

        {/* UNSAVED CHANGES WARNING BANNER */}
        {hasUnsavedChanges && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between text-amber-900 text-xs font-semibold animate-fade-in">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="text-amber-600 text-sm" />
              <span>You have unsaved changes on this product page.</span>
            </div>
            <button
              onClick={handleSave}
              className="bg-amber-800 hover:bg-amber-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
            >
              Save Now
            </button>
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MAIN CONTENT COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. BASIC INFORMATION */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FaBox className="text-teal-700" /> Basic Details
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={productData.title}
                  onChange={(e) => {
                    setProductData({ ...productData, title: e.target.value });
                    markChanged();
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={productData.sku}
                    onChange={(e) => {
                      setProductData({ ...productData, sku: e.target.value });
                      markChanged();
                    }}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-mono text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Category *
                  </label>
                  <select
                    value={productData.category}
                    onChange={(e) => {
                      setProductData({ ...productData, category: e.target.value });
                      markChanged();
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Apparel & Fashion">Apparel & Fashion</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                    <option value="Sports & Fitness">Sports & Fitness</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows="4"
                  value={productData.description}
                  onChange={(e) => {
                    setProductData({ ...productData, description: e.target.value });
                    markChanged();
                  }}
                  className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                />
              </div>
            </div>

            {/* 2. MEDIA MANAGEMENT */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FaImage className="text-teal-700" /> Image Gallery
                </h3>
                <span className="text-xs text-slate-400">Click image to set as primary cover</span>
              </div>

              {/* Upload Drag Target */}
              <label className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-teal-50/30 hover:border-teal-400 cursor-pointer transition text-center group">
                <FaCloudUploadAlt className="text-3xl text-slate-400 group-hover:text-teal-700 mb-1.5 transition" />
                <p className="text-xs font-semibold text-slate-700">
                  Upload new media <span className="font-normal text-slate-500">or drop files</span>
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* Existing Image Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      className={`relative group rounded-xl overflow-hidden border ${
                        coverIndex === idx
                          ? "border-2 border-teal-700 ring-2 ring-teal-700/20"
                          : "border-slate-200"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Product ${idx}`}
                        className="w-full h-24 object-cover"
                      />

                      {coverIndex === idx && (
                        <span className="absolute top-1 left-1 bg-teal-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Main Cover
                        </span>
                      )}

                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {coverIndex !== idx && (
                          <button
                            type="button"
                            onClick={() => {
                              setCoverIndex(idx);
                              markChanged();
                            }}
                            className="text-[10px] bg-white text-slate-900 font-bold px-2 py-1 rounded hover:bg-slate-100"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(img.id, idx)}
                          className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. PRICING & INVENTORY */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FaDollarSign className="text-teal-700" /> Pricing & Inventory
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Retail Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={pricing.price}
                    onChange={(e) => {
                      setPricing({ ...pricing, price: e.target.value });
                      markChanged();
                    }}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Compare Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricing.comparePrice}
                    onChange={(e) => {
                      setPricing({ ...pricing, comparePrice: e.target.value });
                      markChanged();
                    }}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Cost per Item ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricing.costPerItem}
                    onChange={(e) => {
                      setPricing({ ...pricing, costPerItem: e.target.value });
                      markChanged();
                    }}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>
              </div>

              {/* Profit Margin Feedback */}
              {priceNum > 0 && costNum > 0 && (
                <div className="p-3 bg-teal-50/80 border border-teal-100 rounded-xl flex items-center justify-between text-xs text-teal-900 font-medium">
                  <span>Calculated Net Profit: <strong>${profit.toFixed(2)}</strong></span>
                  <span className="bg-teal-800 text-white font-bold px-2 py-0.5 rounded-full">
                    {margin}% Margin
                  </span>
                </div>
              )}

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    In Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={pricing.stockQuantity}
                    onChange={(e) => {
                      setPricing({ ...pricing, stockQuantity: e.target.value });
                      markChanged();
                    }}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pricing.trackInventory}
                      onChange={(e) => {
                        setPricing({ ...pricing, trackInventory: e.target.checked });
                        markChanged();
                      }}
                      className="w-4 h-4 rounded text-teal-800 focus:ring-teal-700"
                    />
                    Automatically manage stock tracking
                  </label>
                </div>
              </div>
            </div>

            {/* 4. VARIANTS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Product Variants</h3>
                  <p className="text-xs text-slate-400">Configure different colors, dimensions, or materials.</p>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition"
                >
                  <FaPlus className="text-[10px]" /> Add Option
                </button>
              </div>

              <div className="space-y-3">
                {variants.map((v) => (
                  <div key={v.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => updateVariant(v.id, "name", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={v.value}
                        onChange={(e) => updateVariant(v.id, "value", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => updateVariant(v.id, "stock", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeVariant(v.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SIDEBAR COLUMN */}
          <div className="space-y-6">

            {/* STATUS & VISIBILITY */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Store Status
              </h4>
              <select
                value={productData.status}
                onChange={(e) => {
                  setProductData({ ...productData, status: e.target.value });
                  markChanged();
                }}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-slate-50/50 focus:outline-none focus:border-teal-700"
              >
                <option value="Active">Active (Public)</option>
                <option value="Draft">Draft (Hidden)</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            {/* TAGS */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FaTags className="text-slate-400" /> Search Tags
              </h4>

              <input
                type="text"
                placeholder="Type & hit Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-slate-50/50 focus:outline-none focus:border-teal-700"
              />

              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-slate-400 hover:text-slate-600 ml-0.5"
                    >
                      <FaTimes className="text-[10px]" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* DANGER ZONE / DELETE PRODUCT */}
            <div className="bg-rose-50/60 rounded-2xl p-5 border border-rose-100 space-y-3">
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                Danger Zone
              </h4>
              <p className="text-xs text-rose-600/90 leading-relaxed">
                Permanently delete this product and remove all associated statistics.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this product?")) {
                    alert("Product deleted.");
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm"
              >
                <FaTrash className="text-[10px]" /> Delete Listing
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}