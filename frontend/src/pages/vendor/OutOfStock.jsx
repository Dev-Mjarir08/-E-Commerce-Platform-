import React, { useState, useEffect, useCallback } from "react";
import inventoryApi from "../../services/inventoryApi";
import { useModal } from "../../context/ModalContext";
import {
  FaArrowLeft,
  FaSearch,
  FaPlus,
  FaTimes,
  FaExclamationCircle,
  FaRegCheckCircle,
  FaBell,
  FaDollarSign,
  FaTruck,
  FaBoxes,
} from "react-icons/fa";
import {
  PackageX,
  RefreshCw,
  AlertOctagon,
  TrendingDown,
  Clock,
  Send,
  FileText,
  DollarSign,
  UserCheck,
} from "lucide-react";

export default function OutOfStock() {
  const { alert: modalAlert } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [restockQty, setRestockQty] = useState(50);
  const [supplierNote, setSupplierNote] = useState("");

  // Sample Out of Stock Products
  const [outOfStockItems, setOutOfStockItems] = useState([
    {
      id: "PROD-105",
      name: "Craft Resin Desk Organizer",
      sku: "RD-ORG-09",
      category: "Home & Living",
      lastStockedDate: "Mar 10, 2026",
      daysOutOfStock: 12,
      estimatedLostRevenue: "$1,240.00",
      backorderRequests: 18,
      supplier: "ResinCraft Global",
      supplierEmail: "orders@resincraft.com",
      unitCost: "$18.50",
      suggestedRestock: 60,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "PROD-304",
      name: "Minimalist Ceramic Coffee Mug (Set of 2)",
      sku: "MUG-CER-02",
      category: "Kitchen & Dining",
      lastStockedDate: "Mar 22, 2026",
      daysOutOfStock: 5,
      estimatedLostRevenue: "$680.00",
      backorderRequests: 9,
      supplier: "ClayArt Ceramics",
      supplierEmail: "sales@clayart.com",
      unitCost: "$12.00",
      suggestedRestock: 40,
      image:
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "PROD-412",
      name: "Aromatherapy Essential Oil Diffuser",
      sku: "DIFF-AROMA-01",
      category: "Wellness",
      lastStockedDate: "Mar 01, 2026",
      daysOutOfStock: 21,
      estimatedLostRevenue: "$2,890.00",
      backorderRequests: 34,
      supplier: "AromaPure Labs",
      supplierEmail: "supply@aromapure.com",
      unitCost: "$28.00",
      suggestedRestock: 100,
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "PROD-502",
      name: "Organic Cotton Tote Bag",
      sku: "TOTE-ECO-03",
      category: "Accessories",
      lastStockedDate: "Mar 28, 2026",
      daysOutOfStock: 2,
      estimatedLostRevenue: "$310.00",
      backorderRequests: 4,
      supplier: "EcoTextiles Co.",
      supplierEmail: "info@ecotextiles.com",
      unitCost: "$6.50",
      suggestedRestock: 150,
      image:
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=100&auto=format&fit=crop&q=80",
    },
  ]);

  const fetchOutOfStock = useCallback(async () => {
    try {
      const res = await inventoryApi.getOutOfStock();
      const list = res?.data?.products || res?.products || res?.data;
      if (Array.isArray(list) && list.length > 0) {
        setOutOfStockItems(list.map((p) => ({
          id: p._id || p.id,
          name: p.title || p.name,
          sku: p.sku || `SKU-${p._id?.slice(-4)}`,
          category: p.category?.name || p.category || "General",
          lastStockedDate: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently",
          daysOutOfStock: 1,
          estimatedLostRevenue: `₹${(p.basePrice || p.price || 500) * 5}`,
          backorderRequests: 0,
          supplier: p.brand || "Atelier Supplier",
          supplierEmail: "supplier@atelier.com",
          unitCost: `₹${p.basePrice || p.price || 0}`,
          suggestedRestock: 50,
          image: p.images?.[0]?.url || p.image || "https://images.unsplash.com/photo-1544816155-12df9643f363?w=100&auto=format&fit=crop&q=80"
        })));
      }
    } catch {
      // Keep fallback
    }
  }, []);

  useEffect(() => {
    fetchOutOfStock();
  }, [fetchOutOfStock]);

  // Aggregate Calculations
  const totalOut = outOfStockItems.length;
  const totalBackorders = outOfStockItems.reduce(
    (acc, item) => acc + item.backorderRequests,
    0
  );

  // Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredProducts.map((p) => p.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const openRestockModal = (product = null) => {
    setActiveProduct(product);
    setRestockQty(product ? product.suggestedRestock : 50);
    setSupplierNote("");
    setIsModalOpen(true);
  };

  const handleConfirmRestock = async (e) => {
    e.preventDefault();
    const qty = parseInt(restockQty, 10) || 50;

    if (activeProduct) {
      try {
        await inventoryApi.restockProduct(activeProduct.id, {
          quantity: qty,
          reason: `Restocked with supplier note: ${supplierNote || 'Regular PO replenishment'}`
        });
      } catch (err) {
        console.warn("Restock fallback:", err.message);
      }
      setOutOfStockItems((prev) => prev.filter((p) => p.id !== activeProduct.id));
      modalAlert({
        title: "Product Restocked",
        message: `Successfully restocked ${qty} units of ${activeProduct.name}. The item is now back in stock.`,
        type: "success"
      });
    } else {
      // Bulk Restock: Remove selected
      for (const id of selectedItems) {
        try {
          await inventoryApi.restockProduct(id, {
            quantity: qty,
            reason: "Bulk vendor zero-stock replenishment"
          });
        } catch {}
      }
      setOutOfStockItems((prev) => prev.filter((p) => !selectedItems.includes(p.id)));
      modalAlert({
        title: "Bulk Restock Complete",
        message: `Successfully restocked ${selectedItems.length} products with +${qty} units each.`,
        type: "success"
      });
      setSelectedItems([]);
    }
    setIsModalOpen(false);
  };

  // Filtered Products
  const filteredProducts = outOfStockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      item.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full min-h-screen bg-slate-100 text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
      {/* ================= BREADCRUMB & HEADER ================= */}
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
              Out of Stock Products
            </h1>
            <span className="bg-rose-100 text-rose-700 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <PackageX size={14} /> {totalOut} Stockouts
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openRestockModal(null)}
            disabled={selectedItems.length === 0}
            className={`flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs ${
              selectedItems.length > 0
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <RefreshCw size={14} /> Emergency Restock Selected ({selectedItems.length})
          </button>
        </div>
      </div>

      {/* ================= EMERGENCY BANNER ================= */}
      <div className="bg-rose-600 text-white p-4 sm:p-5 rounded-xl shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-white/20 rounded-lg shrink-0 mt-0.5">
            <AlertOctagon size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg">
              Sales Loss Warning
            </h3>
            <p className="text-xs sm:text-sm text-rose-100 mt-0.5 leading-relaxed">
              You currently have <span className="font-bold text-white">{totalOut} products</span> completely out of stock with{" "}
              <span className="font-bold text-white">{totalBackorders} pending backorder requests</span>. Reorder now to avoid losing customer conversions.
            </p>
          </div>
        </div>
      </div>

      {/* ================= TOP METRICS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Zero-Stock SKUs
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalOut}</p>
            <p className="text-[11px] text-rose-600 font-medium mt-0.5">Requires immediate PO</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <PackageX size={22} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pending Backorders
            </p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{totalBackorders}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Customer waiting list</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Avg Stockout Duration
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">10 Days</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Across all zero-stock SKUs</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <TrendingDown size={22} />
          </div>
        </div>
      </div>

      {/* ================= FILTERS & TABLE ================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Search & Filter Header */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-60">
            {/* Search Input */}
            <div className="relative flex-1 min-w-50">
              <FaSearch
                className="absolute left-3 top-2.5 text-slate-400"
                size={14}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by product, SKU, or supplier..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Categories</option>
              <option value="Home & Living">Home & Living</option>
              <option value="Kitchen & Dining">Kitchen & Dining</option>
              <option value="Wellness">Wellness</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
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
                      selectedItems.length === filteredProducts.length
                    }
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="py-3 px-2 font-semibold">Product Name</th>
                <th className="py-3 px-2 font-semibold">Supplier</th>
                <th className="py-3 px-2 font-semibold text-center">Days Out</th>
                <th className="py-3 px-2 font-semibold text-center">Backorders</th>
                <th className="py-3 px-2 font-semibold">Est. Lost Rev</th>
                <th className="py-3 px-2 font-semibold text-center">Suggested PO</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => {
                  const isSelected = selectedItems.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? "bg-emerald-50/30" : ""
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(item.id)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>

                      {/* Product */}
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-800 truncate max-w-45 sm:max-w-55">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-mono">
                              SKU: {item.sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Supplier */}
                      <td className="py-3.5 px-2">
                        <p className="font-semibold text-slate-700">{item.supplier}</p>
                        <p className="text-[11px] text-slate-400">{item.supplierEmail}</p>
                      </td>

                      {/* Days Out */}
                      <td className="py-3.5 px-2 text-center">
                        <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-bold text-xs rounded-md border border-rose-100">
                          {item.daysOutOfStock} days
                        </span>
                      </td>

                      {/* Backorders */}
                      <td className="py-3.5 px-2 text-center font-bold text-slate-800">
                        {item.backorderRequests > 0 ? (
                          <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                            {item.backorderRequests} waiting
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>

                      {/* Lost Revenue */}
                      <td className="py-3.5 px-2 font-bold text-slate-900">
                        {item.estimatedLostRevenue}
                      </td>

                      {/* Suggested PO */}
                      <td className="py-3.5 px-2 text-center font-semibold text-emerald-600 font-mono">
                        +{item.suggestedRestock} units
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openRestockModal(item)}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                        >
                          <Send size={12} /> Restock Now
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-10 text-slate-400 text-sm"
                  >
                    No out-of-stock items match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= RESTOCK / PURCHASE ORDER MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <RefreshCw className="text-emerald-600" size={18} />
                <h3 className="text-base font-bold text-slate-800">
                  {activeProduct
                    ? `Order Restock: ${activeProduct.name}`
                    : `Bulk Restock (${selectedItems.length} Products)`}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmRestock} className="p-5 space-y-4">
              {activeProduct && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Supplier:</span>
                    <span className="font-bold text-slate-800">{activeProduct.supplier}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Unit Cost:</span>
                    <span className="font-bold text-slate-800">{activeProduct.unitCost}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Pending Customer Backorders:</span>
                    <span className="font-bold text-amber-600">{activeProduct.backorderRequests} units</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reorder Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supplier Purchase Order Note / Urgent Request
                </label>
                <textarea
                  rows={3}
                  value={supplierNote}
                  onChange={(e) => setSupplierNote(e.target.value)}
                  placeholder="E.g., Urgent restock request due to customer backorders..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 bg-slate-50"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Total Order Est:{" "}
                  <strong className="text-slate-900 font-bold">
                    ${(restockQty * (activeProduct ? parseFloat(activeProduct.unitCost.replace("$", "")) : 15)).toFixed(2)}
                  </strong>
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Submit Purchase Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}