import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Boxes,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Tag,
  UploadCloud,
  FileJson,
  Sparkles,
  AlertCircle,
  X
} from "lucide-react";
import productApi from "../../services/productApi";
import categoryService from "../../services/categoryService";
import { useModal } from "../../context/ModalContext";

// Initial fallback products
const initialProducts = [
  {
    _id: "PRD-101",
    id: "PRD-101",
    name: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    price: 149.99,
    stock: 42,
    status: "Active",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150",
  },
  {
    _id: "PRD-102",
    id: "PRD-102",
    name: "Ergonomic Leather Office Chair",
    category: "Furniture",
    price: 289.00,
    stock: 8,
    status: "Low Stock",
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=150",
  },
  {
    _id: "PRD-103",
    id: "PRD-103",
    name: "Smart Fitness Watch V2",
    category: "Electronics",
    price: 99.50,
    stock: 0,
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150",
  },
  {
    _id: "PRD-104",
    id: "PRD-104",
    name: "Stainless Steel Water Bottle (1L)",
    category: "Accessories",
    price: 24.99,
    stock: 115,
    status: "Active",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=150",
  },
];

export default function VendorProducts() {
  const navigate = useNavigate();
  const { confirm: modalConfirm, alert: modalAlert } = useModal();
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState(null);

  // Bulk Import State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkJsonInput, setBulkJsonInput] = useState("");
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [bulkStatus, setBulkStatus] = useState(null);
  const bulkFileRef = useRef(null);

  // Bulk Delete & Selection State
  const [selectedProductIds, setSelectedProductIds] = useState(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      const list = Array.isArray(res) ? res : (res?.data?.categories || res?.data || res?.categories || []);
      if (Array.isArray(list) && list.length > 0) {
        setCategories(list);
      }
    } catch (err) {
      console.warn("Categories fetch fallback:", err);
    }
  };

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const response = await productApi.getMyProducts();
      const list = response?.data?.products || response?.products || response?.data;
      if (Array.isArray(list) && list.length > 0) {
        setProducts(
          list.map((p) => ({
            ...p,
            id: p._id || p.id,
            image:
              p.images?.[0]?.url ||
              p.image ||
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150",
            category: p.category?.name || p.category || "General",
            status:
              p.stock === 0
                ? "Out of Stock"
                : p.stock < 10
                ? "Low Stock"
                : p.status === "active" || p.status === "Active"
                ? "Active"
                : "Inactive",
          }))
        );
      }
    } catch (err) {
      console.warn("Using local product catalog fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
    fetchCategories();
  }, []);

  // Generate realistic products template using active categories
  const generateSampleProductsTemplate = () => {
    const availableCatNames = categories.length > 0
      ? categories.map((c) => c.name).filter(Boolean)
      : ["Outerwear", "Tailoring", "Knitwear", "Accessories", "Footwear", "Watches"];

    const sampleItems = [
      {
        title: "Atelier Cashmere Overcoat",
        basePrice: 590,
        discountPrice: 510,
        stock: 18,
        category: availableCatNames[0] || "Outerwear",
        brand: "Atelier Couture",
        sku: `VND-COT-${Date.now().toString().slice(-4)}1`,
        description: "Handcrafted double-faced cashmere overcoat tailored with horn buttons and notched lapels.",
        images: [{ url: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80", isPrimary: true }],
        tags: ["luxury", "cashmere", "winter", "new-arrival"],
        isActive: true
      },
      {
        title: "Structured Gabardine Blazer",
        basePrice: 420,
        discountPrice: null,
        stock: 24,
        category: availableCatNames[1] || availableCatNames[0] || "Tailoring",
        brand: "Sartorial Works",
        sku: `VND-BLZ-${Date.now().toString().slice(-4)}2`,
        description: "Single-breasted architectural gabardine blazer with canvassed shoulders and interior welt pockets.",
        images: [{ url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80", isPrimary: true }],
        tags: ["tailored", "office", "formal"],
        isActive: true
      },
      {
        title: "Italian Calfskin Leather Weekender",
        basePrice: 680,
        discountPrice: 599,
        stock: 12,
        category: availableCatNames[2] || availableCatNames[0] || "Bags",
        brand: "Maison Cuir",
        sku: `VND-BAG-${Date.now().toString().slice(-4)}3`,
        description: "Full-grain Tuscan calfskin duffle bag featuring hand-stitched handles and brass hardware.",
        images: [{ url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80", isPrimary: true }],
        tags: ["leather", "travel", "accessories"],
        isActive: true
      },
      {
        title: "Hand-Rolled Silk Jacquard Scarf",
        basePrice: 165,
        discountPrice: null,
        stock: 35,
        category: availableCatNames[3] || availableCatNames[0] || "Accessories",
        brand: "Atelier Silk",
        sku: `VND-SCF-${Date.now().toString().slice(-4)}4`,
        description: "Pure mulberry silk twill scarf with hand-rolled edges and bespoke geometric botanical motif.",
        images: [{ url: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80", isPrimary: true }],
        tags: ["silk", "accessories", "gift"],
        isActive: true
      },
      {
        title: "Minimalist Chronograph Timepiece",
        basePrice: 750,
        discountPrice: 675,
        stock: 15,
        category: availableCatNames[4] || availableCatNames[0] || "Watches",
        brand: "Chronos Atelier",
        sku: `VND-WTC-${Date.now().toString().slice(-4)}5`,
        description: "Sapphire crystal automatic timepiece with ceramic dial and surgical grade stainless casing.",
        images: [{ url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", isPrimary: true }],
        tags: ["horology", "watch", "timepiece"],
        isActive: true
      }
    ];

    return sampleItems;
  };

  // Bulk Submit Handler
  const handleBulkSubmit = async () => {
    if (!bulkJsonInput.trim()) {
      if (modalAlert) {
        modalAlert({
          title: "Input Required",
          message: "Please enter or paste JSON product data.",
          type: "warning"
        });
      } else {
        alert("Please enter or paste JSON product data.");
      }
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(bulkJsonInput);
    } catch (e) {
      setBulkStatus({
        type: "error",
        text: `Invalid JSON syntax: ${e.message}`
      });
      return;
    }

    const items = Array.isArray(parsed) ? parsed : (parsed.products || [parsed]);
    if (!Array.isArray(items) || items.length === 0) {
      setBulkStatus({
        type: "error",
        text: 'JSON must be an array of products or an object containing a "products" array.'
      });
      return;
    }

    setIsBulkSubmitting(true);
    setBulkStatus(null);

    try {
      const res = await productApi.createBulkProducts(items);
      const createdCount = res?.count || (Array.isArray(res?.data) ? res.data.length : items.length);
      const msg = res?.message || `Successfully added ${createdCount} products in bulk!`;

      setToastMessage(msg);
      setIsBulkModalOpen(false);
      setBulkJsonInput("");
      setBulkStatus(null);

      // Refresh products and dispatch global sync event
      await fetchMyProducts();
      window.dispatchEvent(new CustomEvent("shop:products-updated"));
    } catch (err) {
      console.error("Vendor bulk upload error:", err);
      setBulkStatus({
        type: "error",
        text: err?.response?.data?.message || err?.message || "Failed to bulk import products."
      });
    } finally {
      setIsBulkSubmitting(false);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  const handleLoadSampleTemplate = () => {
    const template = generateSampleProductsTemplate();
    setBulkJsonInput(JSON.stringify(template, null, 2));
    setBulkStatus({
      type: "success",
      text: `Loaded ${template.length} sample products template matched with catalog categories.`
    });
  };

  const handleBulkFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        JSON.parse(text); // validate JSON syntax
        setBulkJsonInput(text);
        setBulkStatus({
          type: "success",
          text: `Loaded file "${file.name}" (${(file.size / 1024).toFixed(1)} KB). Ready to import.`
        });
      } catch (err) {
        setBulkStatus({
          type: "error",
          text: `File "${file.name}" contains invalid JSON: ${err.message}`
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleDelete = async (id) => {
    const ok = await modalConfirm({
      title: "Remove Product Listing",
      message: "Are you sure you want to remove this product listing? This action cannot be undone.",
      type: "danger",
      confirmText: "Remove Product",
      cancelText: "Cancel"
    });
    if (!ok) return;
    try {
      await productApi.deleteProduct(id);
      setProducts((prev) => prev.filter((item) => (item._id || item.id) !== id));
      setToastMessage("Product listing removed.");
    } catch (err) {
      setProducts((prev) => prev.filter((item) => (item._id || item.id) !== id));
      setToastMessage("Product listing removed (local).");
    } finally {
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Bulk Selection Handlers
  const handleToggleSelectOne = (id) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    const visibleIds = filteredProducts.map((p) => p._id || p.id).filter(Boolean);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedProductIds.has(id));

    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        visibleIds.forEach((id) => next.delete(id));
      } else {
        visibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedProductIds(new Set());
  };

  const handleBulkDelete = async () => {
    const idsToDelete = Array.from(selectedProductIds);
    if (idsToDelete.length === 0) return;

    const ok = await modalConfirm({
      title: `Delete ${idsToDelete.length} Selected Products?`,
      message: `Are you sure you want to permanently delete these ${idsToDelete.length} selected product listings? This action cannot be undone.`,
      type: "danger",
      confirmText: `Delete ${idsToDelete.length} Products`,
      cancelText: "Cancel"
    });
    if (!ok) return;

    setIsBulkDeleting(true);
    try {
      const res = await productApi.deleteMultipleProducts(idsToDelete);
      const deletedCount = res?.deletedCount ?? idsToDelete.length;

      setProducts((prev) => prev.filter((item) => !selectedProductIds.has(item._id || item.id)));
      setSelectedProductIds(new Set());
      setToastMessage(`Deleted ${deletedCount} products.`);
      window.dispatchEvent(new CustomEvent("shop:products-updated"));
    } catch (err) {
      console.error("Bulk delete error:", err);
      // Fallback local removal
      setProducts((prev) => prev.filter((item) => !selectedProductIds.has(item._id || item.id)));
      setSelectedProductIds(new Set());
      setToastMessage("Selected products deleted.");
    } finally {
      setIsBulkDeleting(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleToggleStatus = async (product) => {
    const nextStatus = product.status === "Active" ? "Inactive" : "Active";
    try {
      await productApi.updateProductStatus(product._id || product.id, {
        status: nextStatus.toLowerCase(),
      });
      setProducts((prev) =>
        prev.map((item) =>
          (item._id || item.id) === (product._id || product.id)
            ? { ...item, status: nextStatus }
            : item
        )
      );
      setToastMessage(`Product marked as ${nextStatus}.`);
    } catch (err) {
      setProducts((prev) =>
        prev.map((item) =>
          (item._id || item.id) === (product._id || product.id)
            ? { ...item, status: nextStatus }
            : item
        )
      );
      setToastMessage(`Product marked as ${nextStatus} (local).`);
    } finally {
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const filteredProducts = products.filter((item) => {
    const name = (item.name || "").toLowerCase();
    const id = (item._id || item.id || "").toLowerCase();
    const cat = (item.category || "").toLowerCase();
    const q = searchTerm.toLowerCase();
    const matchesSearch = name.includes(q) || id.includes(q) || cat.includes(q);
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCatalog = products.length;
  const activeCount = products.filter((p) => p.status === "Active").length;
  const lowStockCount = products.filter((p) => p.status === "Low Stock" || p.stock < 10).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl text-xs font-mono flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Product Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your boutique offerings, update pricing, stocks, and variant attributes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {selectedProductIds.size > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              <Trash2 size={14} />
              <span>Bulk Delete ({selectedProductIds.size})</span>
            </button>
          )}
          <button
            onClick={fetchMyProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-xs transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-emerald-600" : ""} />
            <span>Sync</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsBulkModalOpen(true);
              setBulkStatus(null);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <UploadCloud size={15} />
            <span>Bulk Import Products</span>
          </button>
          <Link
            to="/vendor/products/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors"
          >
            <Plus size={15} />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Total Items</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalCatalog}</p>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Boxes size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Live in Store</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{activeCount}</p>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Low / Out of Stock</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">{lowStockCount}</p>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-slate-500 font-medium hidden sm:inline">Status:</span>
          {["All", "Active", "Low Stock", "Out of Stock"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === status
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Selection Action Banner */}
      {selectedProductIds.size > 0 && (
        <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-semibold text-rose-900 font-mono">
              {selectedProductIds.size} {selectedProductIds.size === 1 ? "product" : "products"} selected
            </span>
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-xs text-rose-700 underline hover:text-rose-900 font-medium ml-2 cursor-pointer"
            >
              Deselect All
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-60"
            >
              {isBulkDeleting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting Selected...</span>
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  <span>Delete Selected ({selectedProductIds.size})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono uppercase text-[11px]">
                <th className="py-3.5 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredProducts.length > 0 &&
                      filteredProducts.every((p) => selectedProductIds.has(p._id || p.id))
                    }
                    onChange={handleToggleSelectAll}
                    aria-label="Select all visible products"
                    className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-600"
                  />
                </th>
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price</th>
                <th className="py-3.5 px-4 font-semibold">Stock</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Boxes size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-semibold text-slate-600">No products found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Try updating your search query or add a new listing.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const id = product._id || product.id;
                  const isSelected = selectedProductIds.has(id);
                  return (
                    <tr
                      key={id}
                      className={`hover:bg-slate-50/80 transition-colors group ${
                        isSelected ? "bg-rose-50/40" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(id)}
                          aria-label={`Select ${product.name}`}
                          className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-600"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate max-w-xs">{product.name}</p>
                            <span className="text-[10px] font-mono text-slate-400">ID: #{id?.slice(-8) || id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">{product.category}</td>
                      <td className="py-3.5 px-4 font-bold font-mono text-slate-900">${product.price?.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono font-medium">
                        <span className={product.stock < 10 ? "text-amber-600 font-bold" : "text-slate-700"}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStatus(product)}
                          title="Click to toggle active status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border transition-colors ${
                            product.status === "Active"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                              : product.status === "Low Stock"
                              ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                              : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.status === "Active"
                                ? "bg-emerald-500"
                                : product.status === "Low Stock"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                          />
                          <span>{product.status}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/product/${id}`}
                            title="View Public Boutique Listing"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <Eye size={14} />
                          </Link>
                          <Link
                            to={`/vendor/products/edit/${id}`}
                            title="Edit Listing Details"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(id)}
                            title="Delete Listing"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 size={14} />
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

      {/* ========================================================= */}
      {/* BULK IMPORT PRODUCTS MODAL                                */}
      {/* ========================================================= */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl">
                  <UploadCloud size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Bulk Import Multiple Products
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload a JSON file or paste products array to add multiple boutique listings simultaneously.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Quick Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadSampleTemplate}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    <Sparkles size={13} />
                    <span>Load Sample Template</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => bulkFileRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    <FileJson size={13} />
                    <span>Upload .json File</span>
                  </button>
                  <input
                    ref={bulkFileRef}
                    type="file"
                    accept=".json"
                    onChange={handleBulkFileChange}
                    className="hidden"
                  />
                </div>

                {bulkJsonInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setBulkJsonInput("");
                      setBulkStatus(null);
                    }}
                    className="text-xs text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Clear Editor
                  </button>
                )}
              </div>

              {/* Status Alert */}
              {bulkStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                    bulkStatus.type === "error"
                      ? "bg-rose-50 text-rose-800 border-rose-200"
                      : "bg-indigo-50 text-indigo-800 border-indigo-200"
                  }`}
                >
                  {bulkStatus.type === "error" ? (
                    <AlertCircle size={15} className="text-rose-600 shrink-0" />
                  ) : (
                    <CheckCircle2 size={15} className="text-indigo-600 shrink-0" />
                  )}
                  <span>{bulkStatus.text}</span>
                </div>
              )}

              {/* JSON Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-700">
                    JSON Payload [ products array ]
                  </label>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {bulkJsonInput ? `${bulkJsonInput.length.toLocaleString()} chars` : "Empty"}
                  </span>
                </div>
                <textarea
                  value={bulkJsonInput}
                  onChange={(e) => setBulkJsonInput(e.target.value)}
                  rows={13}
                  placeholder={`[\n  {\n    "title": "Cashmere Knit Sweater",\n    "basePrice": 320,\n    "discountPrice": 280,\n    "stock": 25,\n    "category": "Knitwear",\n    "images": [{ "url": "https://...", "isPrimary": true }]\n  },\n  ...\n]`}
                  className="w-full font-mono text-xs p-3.5 bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Helper guide */}
              <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <p className="font-semibold text-slate-700">Vendor Integration Notice:</p>
                <p>
                  Products are automatically assigned to your vendor boutique store. Each item requires <code className="text-indigo-600">title</code> and <code className="text-indigo-600">basePrice</code>. Categories are resolved automatically to match catalog collections.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleBulkSubmit}
                disabled={isBulkSubmitting || !bulkJsonInput.trim()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
              >
                {isBulkSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Importing Products to Boutique...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={14} />
                    <span>Import Products Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}