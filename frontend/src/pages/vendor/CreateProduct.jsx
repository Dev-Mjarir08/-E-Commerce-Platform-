import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import productApi from "../../services/productApi";
import categoryService from "../../services/categoryService";
import { useModal } from "../../context/ModalContext";
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
  FaFileCode,
  FaLayerGroup,
} from "react-icons/fa";

export default function CreateProduct() {
  const navigate = useNavigate();
  const { alert: modalAlert } = useModal();
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState("single"); // "single" | "bulk"

  // Live Categories State
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  // Bulk Import States
  const [bulkJson, setBulkJson] = useState("");
  const [bulkStatus, setBulkStatus] = useState(null);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const bulkFileRef = useRef(null);

  // Product Basic Info
  const [productData, setProductData] = useState({
    title: "",
    sku: "",
    category: "Outerwear",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    const fetchCats = async () => {
      setLoadingCategories(true);
      try {
        const res = await categoryService.getCategories();
        const list = Array.isArray(res) ? res : (res?.data?.categories || res?.data || res?.categories || []);
        if (Array.isArray(list) && list.length > 0) {
          const distinct = [];
          const seen = new Set();
          list.forEach((c) => {
            const name = c.name?.trim();
            if (name && !seen.has(name.toLowerCase())) {
              seen.add(name.toLowerCase());
              distinct.push(c);
            }
          });
          setCategories(distinct);
          if (distinct.length > 0) {
            setProductData((prev) => ({
              ...prev,
              category: distinct[0].name
            }));
          }
        }
      } catch (err) {
        console.warn("Failed to load catalog categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCats();
  }, []);

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
      modalAlert({
        title: "Validation Error",
        message: "Please provide a product title before publishing.",
        type: "warning"
      });
      return;
    }
    if (!pricing.price || priceNum <= 0) {
      modalAlert({
        title: "Invalid Pricing",
        message: "Please enter a valid selling price greater than 0.",
        type: "warning"
      });
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
      await modalAlert({
        title: "Product Published",
        message: "Your new product listing has been successfully published to the catalog.",
        type: "success"
      });
      navigate("/vendor/products");
    } catch (err) {
      console.error("Product creation error:", err);
      modalAlert({
        title: "Product Creation Failed",
        message: err.message || "Failed to create product.",
        type: "danger"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Bulk Product Submit Handler
  const handleBulkSubmit = async () => {
    if (!bulkJson.trim()) {
      modalAlert({
        title: "Input Required",
        message: "Please enter or paste JSON product data.",
        type: "warning"
      });
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(bulkJson);
    } catch (e) {
      setBulkStatus({ type: "error", text: `Invalid JSON syntax: ${e.message}` });
      return;
    }
    const items = Array.isArray(parsed) ? parsed : (parsed.products || [parsed]);
    if (!Array.isArray(items) || items.length === 0) {
      setBulkStatus({ type: "error", text: "JSON must be an array of products or contain a products array." });
      return;
    }
    setBulkSubmitting(true);
    setBulkStatus(null);
    try {
      const res = await productApi.createBulkProducts(items);
      const createdCount = res?.count || (Array.isArray(res?.data) ? res.data.length : items.length);
      window.dispatchEvent(new CustomEvent("shop:products-updated"));
      await modalAlert({
        title: "Bulk Products Created",
        message: `Successfully created ${createdCount} products in your boutique catalog!`,
        type: "success"
      });
      navigate("/vendor/products");
    } catch (err) {
      console.error("Vendor bulk upload error:", err);
      setBulkStatus({
        type: "error",
        text: err?.response?.data?.message || err?.message || "Failed to bulk import products."
      });
    } finally {
      setBulkSubmitting(false);
    }
  };

  const loadSampleBulkTemplate = () => {
    const catNames = categories.length > 0
      ? categories.map((c) => c.name).filter(Boolean)
      : ["Outerwear", "Tailoring", "Clothing", "Bags", "Footwear", "Watches"];
    const template = [
      {
        title: "Signature Cashmere Overcoat",
        basePrice: 590,
        discountPrice: 520,
        stock: 15,
        category: catNames[0] || "Outerwear",
        brand: "Atelier Couture",
        sku: `VND-OCT-${Date.now().toString().slice(-4)}`,
        description: "Handcrafted double-faced cashmere overcoat tailored with horn buttons.",
        images: [{ url: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80", isPrimary: true }],
        tags: ["luxury", "cashmere", "winter"],
        isActive: true
      },
      {
        title: "Virgin Wool Tailored Trousers",
        basePrice: 280,
        discountPrice: null,
        stock: 25,
        category: catNames[1] || catNames[0] || "Tailoring",
        brand: "Sartorial Works",
        sku: `VND-TRS-${Date.now().toString().slice(-4)}`,
        description: "High-twist gabardine trousers with side adjusters and pressed creases.",
        images: [{ url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80", isPrimary: true }],
        tags: ["wool", "tailored", "office"],
        isActive: true
      }
    ];
    setBulkJson(JSON.stringify(template, null, 2));
    setBulkStatus({
      type: "success",
      text: `Loaded sample products template with active catalog categories.`
    });
  };

  const handleBulkFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        JSON.parse(text);
        setBulkJson(text);
        setBulkStatus({
          type: "success",
          text: `Loaded file "${file.name}". Ready to import.`
        });
      } catch (err) {
        setBulkStatus({
          type: "error",
          text: `Invalid JSON in file "${file.name}": ${err.message}`
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-bold">
                Vendor Boutique
              </span>
              <span className="text-xs text-slate-400">/</span>
              <span className="text-xs font-semibold text-slate-600">Product Studio</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {mode === "single" ? "Create New Product" : "Bulk Add Multiple Products"}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {mode === "single"
                ? "Add single piece details, dynamic categories, pricing, and media options."
                : "Add multiple product catalog entries simultaneously via JSON or template."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Switcher */}
            <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMode("single")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === "single"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Single Product
              </button>
              <button
                type="button"
                onClick={() => setMode("bulk")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === "bulk"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Multiple Products (Bulk)
              </button>
            </div>

            {mode === "single" ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 hover:bg-teal-900 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-teal-900/10 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
              >
                <FaCheckCircle className="text-xs" />
                <span>{submitting ? "Publishing..." : "Publish Product"}</span>
              </button>
            ) : (
              <button
                onClick={handleBulkSubmit}
                disabled={bulkSubmitting || !bulkJson.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-900/10 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
              >
                <FaLayerGroup className="text-xs" />
                <span>{bulkSubmitting ? "Importing..." : "Import All Products"}</span>
              </button>
            )}
          </div>
        </div>

        {/* BULK MODE INTERFACE */}
        {mode === "bulk" && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadSampleBulkTemplate}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Load Sample Template
                </button>
                <button
                  type="button"
                  onClick={() => bulkFileRef.current?.click()}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Upload .json File
                </button>
                <input
                  ref={bulkFileRef}
                  type="file"
                  accept=".json"
                  onChange={handleBulkFileChange}
                  className="hidden"
                />
              </div>

              {bulkJson && (
                <button
                  type="button"
                  onClick={() => {
                    setBulkJson("");
                    setBulkStatus(null);
                  }}
                  className="text-xs text-slate-500 hover:text-rose-600 cursor-pointer"
                >
                  Clear Editor
                </button>
              )}
            </div>

            {bulkStatus && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                  bulkStatus.type === "error"
                    ? "bg-rose-50 text-rose-800 border-rose-200"
                    : "bg-indigo-50 text-indigo-800 border-indigo-200"
                }`}
              >
                <span>{bulkStatus.text}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700">
                  Product Objects Array [ JSON ]
                </label>
                <span className="text-slate-400 font-mono text-[11px]">
                  {bulkJson ? `${bulkJson.length.toLocaleString()} characters` : "Empty"}
                </span>
              </div>
              <textarea
                value={bulkJson}
                onChange={(e) => setBulkJson(e.target.value)}
                rows={16}
                placeholder={`[\n  {\n    "title": "Boutique Silk Shirt",\n    "basePrice": 220,\n    "discountPrice": 180,\n    "stock": 20,\n    "category": "${categories[0]?.name || "Clothing"}",\n    "brand": "Atelier",\n    "images": [{ "url": "https://...", "isPrimary": true }]\n  }\n]`}
                className="w-full font-mono text-xs p-4 bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleBulkSubmit}
                disabled={bulkSubmitting || !bulkJson.trim()}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
              >
                {bulkSubmitting ? "Importing Products..." : "Import Multiple Products Now"}
              </button>
            </div>
          </div>
        )}

        {/* SINGLE PRODUCT FORM */}
        {mode === "single" && (
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !isCustomCategory;
                        setIsCustomCategory(next);
                        if (!next && categories.length > 0) {
                          setProductData({ ...productData, category: categories[0].name });
                        }
                      }}
                      className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold cursor-pointer underline"
                    >
                      {isCustomCategory ? "Choose from catalog" : "+ Add Custom Category"}
                    </button>
                  </div>

                  {isCustomCategory ? (
                    <input
                      type="text"
                      placeholder="e.g. Handmade Silk Scarves"
                      value={productData.category}
                      onChange={(e) =>
                        setProductData({ ...productData, category: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                    />
                  ) : (
                    <select
                      value={productData.category}
                      onChange={(e) =>
                        setProductData({ ...productData, category: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700"
                    >
                      {categories.length > 0 ? (
                        categories.map((c) => (
                          <option key={c._id || c.slug || c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Outerwear">Outerwear</option>
                          <option value="Tailoring">Tailoring</option>
                          <option value="Clothing">Clothing</option>
                          <option value="Knitwear">Knitwear</option>
                          <option value="Trousers">Trousers</option>
                          <option value="Footwear">Footwear</option>
                          <option value="Shoes">Shoes</option>
                          <option value="Bags">Bags</option>
                          <option value="Watches">Watches</option>
                          <option value="Jewelry">Jewelry</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Electronics">Electronics</option>
                        </>
                      )}
                    </select>
                  )}
                  {loadingCategories && (
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Syncing live categories from database...
                    </span>
                  )}
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
        )}

      </div>
    </div>
  );
}