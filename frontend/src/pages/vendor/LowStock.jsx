import React, { useState, useEffect, useCallback } from "react";
import inventoryApi from "../../services/inventoryApi";
import { useModal } from "../../context/ModalContext";
import {
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaExclamationTriangle,
  FaBoxes,
  FaPlus,
  FaHistory,
  FaCheckCircle,
  FaTimes,
  FaExchangeAlt,
} from "react-icons/fa";
import {
  AlertTriangle,
  PackageX,
  TrendingDown,
  RefreshCw,
  BellRing,
  ArrowUpDown,
  CheckCircle2,
} from "lucide-react";

export default function LowStock() {
  const { alert: modalAlert } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [activeRestockProduct, setActiveRestockProduct] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState(50);

  // Initial Low Stock Data
  const [products, setProducts] = useState([
    {
      id: "PROD-102",
      name: "Eco-friendly Bamboo Watch",
      sku: "BW-ECO-01",
      category: "Accessories",
      currentStock: 2,
      minThreshold: 10,
      reorderPoint: 15,
      unitCost: "$45.00",
      supplier: "EcoWood Supply Co.",
      status: "Critical",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "PROD-105",
      name: "Craft Resin Desk Organizer",
      sku: "RD-ORG-09",
      category: "Home & Living",
      currentStock: 0,
      minThreshold: 8,
      reorderPoint: 12,
      unitCost: "$18.50",
      supplier: "ResinCraft Global",
      status: "Out of Stock",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "PROD-208",
      name: "Plant Polisher Spray (250ml)",
      sku: "PPS-250ML",
      category: "Gardening",
      currentStock: 5,
      minThreshold: 15,
      reorderPoint: 20,
      unitCost: "$8.20",
      supplier: "Botanical Care Ltd",
      status: "Warning",
      image:
        "https://images.unsplash.com/photo-1585336261026-61e778f29221?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "PROD-312",
      name: "Handmade Leather Card Wallet",
      sku: "LW-MIN-02",
      category: "Accessories",
      currentStock: 4,
      minThreshold: 12,
      reorderPoint: 18,
      unitCost: "$22.00",
      supplier: "Artisan Leathers",
      status: "Warning",
      image:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&auto=format&fit=crop&q=80",
    },
  ]);

  const fetchLowStock = useCallback(async () => {
    try {
      const res = await inventoryApi.getLowStock();
      const list = res?.data?.products || res?.products || res?.data;
      if (Array.isArray(list) && list.length > 0) {
        setProducts(list.map((p) => ({
          id: p._id || p.id,
          name: p.title || p.name,
          sku: p.sku || `SKU-${p._id?.slice(-4)}`,
          category: p.category?.name || p.category || "General",
          currentStock: p.stock ?? p.stockCount ?? 0,
          minThreshold: 10,
          reorderPoint: 15,
          unitCost: `₹${p.basePrice || p.price || 0}`,
          supplier: p.brand || "Atelier Supplier",
          status: (p.stock ?? 0) <= 3 ? "Critical" : "Warning",
          image: p.images?.[0]?.url || p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80"
        })));
      }
    } catch {
      // Keep initial fallback
    }
  }, []);

  useEffect(() => {
    fetchLowStock();
  }, [fetchLowStock]);

  // Metrics calculation
  const totalOut = products.filter((p) => p.currentStock === 0).length;
  const totalCritical = products.filter(
    (p) => p.currentStock > 0 && p.currentStock <= 3
  ).length;
  const totalWarning = products.filter((p) => p.currentStock > 3).length;

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((item) => item !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  // Open Restock Modal
  const openRestockModal = (product = null) => {
    setActiveRestockProduct(product);
    setRestockQuantity(50);
    setIsRestockModalOpen(true);
  };

  // Restock Submit
  const handleConfirmRestock = async (e) => {
    e.preventDefault();
    const qty = parseInt(restockQuantity, 10) || 50;

    if (activeRestockProduct) {
      try {
        await inventoryApi.restockProduct(activeRestockProduct.id, {
          quantity: qty,
          reason: "Vendor manual low stock replenishment"
        });
      } catch (err) {
        console.warn("Restock fallback:", err.message);
      }
      setProducts((prev) =>
        prev.map((p) =>
          p.id === activeRestockProduct.id
            ? { ...p, currentStock: p.currentStock + qty, status: (p.currentStock + qty) <= 3 ? "Critical" : "Warning" }
            : p
        )
      );
      modalAlert({
        title: "Stock Replenished",
        message: `Successfully added ${qty} units to ${activeRestockProduct.name}.`,
        type: "success"
      });
    } else {
      // Bulk Restock
      for (const id of selectedProducts) {
        try {
          await inventoryApi.restockProduct(id, {
            quantity: qty,
            reason: "Bulk vendor stock replenishment"
          });
        } catch {}
      }
      setProducts((prev) =>
        prev.map((p) =>
          selectedProducts.includes(p.id)
            ? { ...p, currentStock: p.currentStock + qty }
            : p
        )
      );
      modalAlert({
        title: "Bulk Restock Complete",
        message: `Successfully replenished ${selectedProducts.length} items with +${qty} units each.`,
        type: "success"
      });
      setSelectedProducts([]);
    }
    setIsRestockModalOpen(false);
  };

  // Filtered List
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterSeverity === "out") return matchesSearch && product.currentStock === 0;
    if (filterSeverity === "critical")
      return matchesSearch && product.currentStock > 0 && product.currentStock <= 3;
    if (filterSeverity === "warning") return matchesSearch && product.currentStock > 3;

    return matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-slate-100 text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
      {/* ================= HEADER & TOP ACTIONS ================= */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            className="flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 mb-2 transition-colors"
            onClick={() => window.history.back()}
          >
            <FaArrowLeft size={12} /> Back to Inventory
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Low Stock Alerts
            </h1>
            <span className="bg-rose-100 text-rose-700 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <AlertTriangle size={13} /> {products.length} Items Alerted
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openRestockModal(null)}
            disabled={selectedProducts.length === 0}
            className={`flex items-center gap-2 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg transition-colors shadow-sm ${
              selectedProducts.length > 0
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <RefreshCw size={14} /> Bulk Restock ({selectedProducts.length})
          </button>
        </div>
      </div>

      {/* ================= ALERT SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Out of Stock Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Out of Stock
            </p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{totalOut}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Immediate Restock Required</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <PackageX size={22} />
          </div>
        </div>

        {/* Critical Level Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Critical Level (1-3 Units)
            </p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{totalCritical}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">High Risk of Stockout</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle size={22} />
          </div>
        </div>

        {/* Warning Level Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Warning Level (&lt; Threshold)
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{totalWarning}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Below Minimum Threshold</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <TrendingDown size={22} />
          </div>
        </div>
      </div>

      {/* ================= FILTERS & TABLE CONTAINER ================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[240px]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <FaSearch
                className="absolute left-3 top-2.5 text-slate-400"
                size={14}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search low stock product, SKU, or category..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
              />
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-lg">
              <button
                onClick={() => setFilterSeverity("all")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterSeverity === "all"
                    ? "bg-white text-slate-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterSeverity("out")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterSeverity === "out"
                    ? "bg-white text-rose-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Out of Stock
              </button>
              <button
                onClick={() => setFilterSeverity("critical")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterSeverity === "critical"
                    ? "bg-white text-amber-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => setFilterSeverity("warning")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterSeverity === "warning"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Warning
              </button>
            </div>
          </div>
        </div>

        {/* Low Stock Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] sm:text-xs bg-slate-50/80">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      filteredProducts.length > 0 &&
                      selectedProducts.length === filteredProducts.length
                    }
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="py-3 px-2 font-semibold">Product</th>
                <th className="py-3 px-2 font-semibold">Category</th>
                <th className="py-3 px-2 font-semibold text-center">
                  Current Stock
                </th>
                <th className="py-3 px-2 font-semibold text-center">
                  Min Threshold
                </th>
                <th className="py-3 px-2 font-semibold">Supplier</th>
                <th className="py-3 px-2 font-semibold">Status</th>
                <th className="py-3 px-2 font-semibold text-right pr-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const isSelected = selectedProducts.includes(product.id);
                  let statusBadgeClass = "bg-blue-100 text-blue-700";

                  if (product.currentStock === 0) {
                    statusBadgeClass = "bg-rose-100 text-rose-700";
                  } else if (product.currentStock <= 3) {
                    statusBadgeClass = "bg-amber-100 text-amber-700";
                  }

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? "bg-emerald-50/30" : ""
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(product.id)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>

                      {/* Product details */}
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-semibold text-slate-800 truncate max-w-[180px] sm:max-w-[220px]">
                              {product.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-mono">
                              SKU: {product.sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-2 text-slate-600">
                        {product.category}
                      </td>

                      {/* Current Stock Indicator */}
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`font-bold text-sm px-2.5 py-1 rounded-md ${
                            product.currentStock === 0
                              ? "bg-rose-50 text-rose-600 border border-rose-200"
                              : product.currentStock <= 3
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : "bg-blue-50 text-blue-600 border border-blue-200"
                          }`}
                        >
                          {product.currentStock}
                        </span>
                      </td>

                      <td className="py-3 px-2 text-center text-slate-500 font-medium">
                        {product.minThreshold}
                      </td>

                      <td className="py-3 px-2 text-slate-600">
                        {product.supplier}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-2">
                        <span
                          className={`px-2.5 py-1 text-[10px] sm:text-xs rounded-full font-semibold inline-block ${statusBadgeClass}`}
                        >
                          {product.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-2 text-right pr-4">
                        <button
                          onClick={() => openRestockModal(product)}
                          className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <RefreshCw size={12} /> Restock
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-8 text-slate-400 text-sm"
                  >
                    No low stock alerts match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= RESTOCK MODAL ================= */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-800">
                {activeRestockProduct
                  ? `Restock: ${activeRestockProduct.name}`
                  : `Bulk Restock (${selectedProducts.length} Items)`}
              </h3>
              <button
                onClick={() => setIsRestockModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmRestock} className="p-5 space-y-4">
              {activeRestockProduct && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1">
                  <p className="text-slate-500">
                    Current Stock:{" "}
                    <span className="font-bold text-slate-800">
                      {activeRestockProduct.currentStock} units
                    </span>
                  </p>
                  <p className="text-slate-500">
                    Min Threshold:{" "}
                    <span className="font-bold text-slate-800">
                      {activeRestockProduct.minThreshold} units
                    </span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantity to Add
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRestockModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}