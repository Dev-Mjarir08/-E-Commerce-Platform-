import React, { useState } from "react";
import {
  FaBoxes,
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaPlus,
  FaMinus,
  FaEdit,
  FaHistory,
  FaCheckCircle,
  FaTimes,
  FaSync,
} from "react-icons/fa";

// Sample Initial Inventory Data
const initialInventory = [
  {
    id: "SKU-8821",
    name: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    inStock: 42,
    reserved: 5,
    reorderLevel: 15,
    unitCost: 85.00,
    status: "In Stock",
    lastRestocked: "2026-03-10",
  },
  {
    id: "SKU-9940",
    name: "Ergonomic Leather Office Chair",
    category: "Furniture",
    inStock: 6,
    reserved: 2,
    reorderLevel: 10,
    unitCost: 140.00,
    status: "Low Stock",
    lastRestocked: "2026-02-18",
  },
  {
    id: "SKU-3102",
    name: "Smart Fitness Watch V2",
    category: "Electronics",
    inStock: 0,
    reserved: 0,
    reorderLevel: 20,
    unitCost: 45.50,
    status: "Out of Stock",
    lastRestocked: "2026-01-25",
  },
  {
    id: "SKU-4419",
    name: "Stainless Steel Water Bottle (1L)",
    category: "Accessories",
    inStock: 115,
    reserved: 12,
    reorderLevel: 30,
    unitCost: 8.20,
    status: "In Stock",
    lastRestocked: "2026-03-14",
  },
];

export default function VendorInventory() {
  const [items, setItems] = useState(initialInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [restockAmount, setRestockAmount] = useState("");

  // Filter Logic
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate status badge based on quantity vs reorder level
  const getStatus = (qty, reorder) => {
    if (qty === 0) return "Out of Stock";
    if (qty <= reorder) return "Low Stock";
    return "In Stock";
  };

  // Fast inline stock tweak (+1 or -1)
  const adjustStock = (id, delta) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.inStock + delta);
          return {
            ...item,
            inStock: newQty,
            status: getStatus(newQty, item.reorderLevel),
          };
        }
        return item;
      })
    );
  };

  // Submit Restock Batch Update via Modal
  const handleRestockSubmit = (e) => {
    e.preventDefault();
    const amount = parseInt(restockAmount, 10);
    if (isNaN(amount) || amount <= 0) return;

    const today = new Date().toISOString().split("T")[0];

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === selectedItem.id) {
          const newQty = item.inStock + amount;
          return {
            ...item,
            inStock: newQty,
            status: getStatus(newQty, item.reorderLevel),
            lastRestocked: today,
          };
        }
        return item;
      })
    );

    setSelectedItem(null);
    setRestockAmount("");
  };

  const lowStockCount = items.filter((i) => i.status === "Low Stock").length;
  const outOfStockCount = items.filter((i) => i.status === "Out of Stock").length;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Inventory & Warehouse Management
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Track real-time stock units, reorder levels, and restock logs.
            </p>
          </div>
        </div>

        {/* METRICS & WARNING BANNER */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total SKUs
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {items.length}
              </h3>
            </div>
            <div className="p-3 bg-teal-50 text-teal-800 rounded-xl">
              <FaBoxes className="text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Low Stock Alert
              </p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">
                {lowStockCount}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <FaExclamationTriangle className="text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Out of Stock
              </p>
              <h3 className="text-2xl font-bold text-rose-600 mt-1">
                {outOfStockCount}
              </h3>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <FaTimes className="text-xl" />
            </div>
          </div>
        </div>

        {/* LOW STOCK ALERT BANNER */}
        {(lowStockCount > 0 || outOfStockCount > 0) && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-center justify-between text-amber-900 text-sm">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-amber-600 text-lg flex-shrink-0" />
              <span>
                <strong>Attention Required:</strong> You have {lowStockCount} items low on stock and {outOfStockCount} out-of-stock SKUs that require restocked inventory.
              </span>
            </div>
          </div>
        )}

        {/* SEARCH & FILTERS */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by SKU or item name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <FaFilter /> Availability:
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 transition"
            >
              <option value="All">All Items</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* INVENTORY TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Item Details</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">In Stock</th>
                  <th className="py-3.5 px-5">Reserved</th>
                  <th className="py-3.5 px-5">Reorder Point</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Last Restocked</th>
                  <th className="py-3.5 px-5 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <span className="text-xs text-slate-400 font-mono">{item.id}</span>
                      </td>
                      <td className="py-4 px-5 font-medium text-slate-600">
                        {item.category}
                      </td>
                      
                      {/* IN-STOCK & QUICK ADJUST BUTTONS */}
                      <td className="py-4 px-5 font-bold">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => adjustStock(item.id, -1)}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
                            title="Decrease by 1"
                          >
                            <FaMinus className="text-[10px]" />
                          </button>
                          <span className="w-8 text-center text-slate-900 font-semibold">{item.inStock}</span>
                          <button
                            onClick={() => adjustStock(item.id, 1)}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
                            title="Increase by 1"
                          >
                            <FaPlus className="text-[10px]" />
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-slate-500 font-medium">
                        {item.reserved} units
                      </td>

                      <td className="py-4 px-5 font-medium text-slate-500">
                        {item.reorderLevel} units
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            item.status === "In Stock"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : item.status === "Low Stock"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === "In Stock"
                                ? "bg-emerald-500"
                                : item.status === "Low Stock"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                          />
                          {item.status}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-xs text-slate-500 font-mono">
                        {item.lastRestocked}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition"
                        >
                          <FaSync className="text-[10px]" /> Restock Batch
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-10 text-center text-slate-400">
                      No inventory records match your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RESTOCK MODAL */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Restock Inventory</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedItem.name}</p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleRestockSubmit} className="space-y-4">
                <div className="bg-slate-50 p-3.5 rounded-xl text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Current Inventory:</span>
                    <strong className="text-slate-900">{selectedItem.inStock} units</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Reorder Threshold:</span>
                    <strong className="text-slate-900">{selectedItem.reorderLevel} units</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Quantity to Add
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={restockAmount}
                    onChange={(e) => setRestockAmount(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-sm font-semibold text-white shadow-md transition"
                  >
                    Confirm Restock
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}