import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import productApi from "../../services/productApi";
import {
  FaBox,
  FaImage,
  FaPlus,
  FaTrash,
  FaCloudUploadAlt,
  FaDollarSign,
  FaTags,
  FaCheckCircle,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";

export default function CreateProduct() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Product Basic Info
  const [productData, setProductData] = useState({
    title: "",
    sku: "",
    category: "Electronics",
    description: "",
    status: "Active",
  });

  // Pricing & Stock
  const [pricing, setPricing] = useState({
    price: "",
    comparePrice: "",
    costPerItem: "",
    stockQuantity: "",
    trackInventory: true,
  });

  // Media state
  const [images, setImages] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);

  // Variant management
  const [variants, setVariants] = useState([
    { id: 1, name: "Size / Color", value: "Standard / Default", price: "", stock: "" },
  ]);

  // Tag System
  const [tags, setTags] = useState(["Bestseller", "New Arrival"]);
  const [tagInput, setTagInput] = useState("");

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  // Remove image
  const removeImage = (id, index) => {
    setImages(images.filter((img) => img.id !== id));
    if (coverIndex === index) {
      setCoverIndex(0);
    } else if (coverIndex > index) {
      setCoverIndex(coverIndex - 1);
    }
  };

  // Tag Operations
  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Variant Operations
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now(),
        name: "Size / Color",
        value: "",
        price: pricing.price || "",
        stock: pricing.stockQuantity || "",
      },
    ]);
  };

  const removeVariant = (id) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const updateVariant = (id, field, val) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: val } : v))
    );
  };

  // Calculate Profit Margin
  const priceNum = parseFloat(pricing.price) || 0;
  const costNum = parseFloat(pricing.costPerItem) || 0;
  const profit = priceNum - costNum;
  const margin = priceNum > 0 ? ((profit / priceNum) * 100).toFixed(1) : 0;

  // Form Submit
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!productData.title.trim()) {
      alert("Please provide a product title.");
      return;
    }
    if (!pricing.price || priceNum <= 0) {
      alert("Please enter a valid selling price.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", productData.title.trim());
      formData.append("name", productData.title.trim());
      formData.append("description", productData.description.trim() || "Exclusive curated collection piece.");
      formData.append("category", productData.category || "Outerwear");
      formData.append("basePrice", priceNum);
      formData.append("price", priceNum);
      if (pricing.comparePrice) {
        formData.append("discountPrice", parseFloat(pricing.comparePrice) || 0);
      }
      formData.append("stock", parseInt(pricing.stockQuantity) || 15);
      formData.append("sku", productData.sku.trim() || `SKU-${Date.now().toString().slice(-6)}`);
      formData.append("status", productData.status.toLowerCase());
      formData.append("isActive", productData.status.toLowerCase() === "active");
      formData.append("isFeatured", true);
      formData.append("tags", JSON.stringify(tags));

      let hasFiles = false;
      images.forEach((img) => {
        if (img.file) {
          formData.append("images", img.file);
          hasFiles = true;
        }
      });

      if (!hasFiles) {
        formData.append(
          "images",
          JSON.stringify([
            {
              url: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
              isPrimary: true,
            },
          ])
        );
      }

      await productApi.createProduct(formData);
      window.dispatchEvent(new CustomEvent("shop:products-updated"));
      navigate("/vendor/products");
    } catch (err) {
      console.error("Product creation error:", err);
      alert(err.message || "Failed to create product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Create New Product
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Add details, pricing, inventory options, and media for your marketplace listing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Save Draft
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 hover:bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/10 active:scale-95 transition-all cursor-pointer"
            >
              <FaCheckCircle className="text-xs" /> Publish Product
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* MAIN CONTENT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. BASIC INFORMATION */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FaBox className="text-teal-700" /> Basic Information
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ergonomic Bluetooth Wireless Keyboard"
                  value={productData.title}
                  onChange={(e) =>
                    setProductData({ ...productData, title: e.target.value })
                  }
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
                    placeholder="e.g. PRD-KEY-001"
                    value={productData.sku}
                    onChange={(e) =>
                      setProductData({ ...productData, sku: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-mono text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Category *
                  </label>
                  <select
                    value={productData.category}
                    onChange={(e) =>
                      setProductData({ ...productData, category: e.target.value })
                    }
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
                  placeholder="Provide details on features, materials, usage instructions..."
                  value={productData.description}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                />
              </div>
            </div>

            {/* 2. MEDIA UPLOADER */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FaImage className="text-teal-700" /> Product Images
                </h3>
                <span className="text-xs text-slate-400">First image is cover by default</span>
              </div>

              {/* Upload Drag Target */}
              <label className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-teal-50/30 hover:border-teal-400 cursor-pointer transition text-center group">
                <FaCloudUploadAlt className="text-3xl text-slate-400 group-hover:text-teal-700 mb-2 transition" />
                <p className="text-sm font-semibold text-slate-700">
                  Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, or WEBP up to 10MB each</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* Image Previews */}
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
                        alt={`Upload ${idx}`}
                        className="w-full h-24 object-cover"
                      />
                      
                      {/* Cover Badge */}
                      {coverIndex === idx && (
                        <span className="absolute top-1 left-1 bg-teal-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Cover
                        </span>
                      )}

                      {/* Action Overlay */}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {coverIndex !== idx && (
                          <button
                            type="button"
                            onClick={() => setCoverIndex(idx)}
                            className="text-[10px] bg-white/90 text-slate-900 font-bold px-2 py-1 rounded hover:bg-white"
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
                    placeholder="99.99"
                    value={pricing.price}
                    onChange={(e) =>
                      setPricing({ ...pricing, price: e.target.value })
                    }
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
                    placeholder="129.99"
                    value={pricing.comparePrice}
                    onChange={(e) =>
                      setPricing({ ...pricing, comparePrice: e.target.value })
                    }
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
                    placeholder="45.00"
                    value={pricing.costPerItem}
                    onChange={(e) =>
                      setPricing({ ...pricing, costPerItem: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>
              </div>

              {/* Live Profit Margin Estimate */}
              {priceNum > 0 && costNum > 0 && (
                <div className="p-3 bg-teal-50/80 border border-teal-100 rounded-xl flex items-center justify-between text-xs text-teal-900 font-medium">
                  <span>Estimated Profit per Sale: <strong>${profit.toFixed(2)}</strong></span>
                  <span className="bg-teal-800 text-white font-bold px-2 py-0.5 rounded-full">
                    {margin}% Margin
                  </span>
                </div>
              )}

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    value={pricing.stockQuantity}
                    onChange={(e) =>
                      setPricing({ ...pricing, stockQuantity: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pricing.trackInventory}
                      onChange={(e) =>
                        setPricing({
                          ...pricing,
                          trackInventory: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-teal-800 focus:ring-teal-700"
                    />
                    Track stock level automatically
                  </label>
                </div>
              </div>
            </div>

            {/* 4. VARIANTS MANAGEMENT */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Variants</h3>
                  <p className="text-xs text-slate-400">Add options like size, color, or material.</p>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition"
                >
                  <FaPlus className="text-[10px]" /> Add Variant
                </button>
              </div>

              <div className="space-y-3">
                {variants.map((v) => (
                  <div key={v.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder="Option Name (e.g. Size)"
                        value={v.name}
                        onChange={(e) => updateVariant(v.id, "name", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder="Option Value (e.g. XL)"
                        value={v.value}
                        onChange={(e) => updateVariant(v.id, "value", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="number"
                        placeholder="Stock"
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
            
            {/* PRODUCT STATUS */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Product Status
              </h4>
              <select
                value={productData.status}
                onChange={(e) =>
                  setProductData({ ...productData, status: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-slate-50/50 focus:outline-none focus:border-teal-700"
              >
                <option value="Active">Active (Visible)</option>
                <option value="Draft">Draft (Hidden)</option>
                <option value="Archived">Archived</option>
              </select>
              <div className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed pt-1">
                <FaInfoCircle className="mt-0.5 text-slate-400 shrink-0" />
                Active products are instantly published to your marketplace storefront.
              </div>
            </div>

            {/* TAGS & KEYWORDS */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FaTags className="text-slate-400" /> Tags & Keywords
              </h4>

              <input
                type="text"
                placeholder="Type tag & press Enter..."
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

          </div>

        </form>

      </div>
    </div>
  );
}