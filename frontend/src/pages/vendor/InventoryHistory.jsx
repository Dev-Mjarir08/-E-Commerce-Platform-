import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaDownload,
  FaPlus,
  FaMinus,
  FaUndo,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaTimes,
  FaBoxes,
} from "react-icons/fa";
import {
  History,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  PackageCheck,
  PackageMinus,
  Sliders,
  FileSpreadsheet,
} from "lucide-react";

export default function InventoryHistory() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState("30days");
  const [selectedLog, setSelectedLog] = useState(null);

  // Sample Inventory History Log Data
  const [logs] = useState([
    {
      id: "LOG-9081",
      productName: "Eco-friendly Bamboo Watch",
      sku: "BW-ECO-01",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80",
      changeType: "Restock",
      quantityChange: +50,
      previousStock: 2,
      newStock: 52,
      reason: "Purchase Order #PO-4412 delivered",
      performedBy: "Jane D. (Vendor)",
      date: "Apr 14, 2026",
      time: "10:30 AM",
      referenceId: "PO-4412",
    },
    {
      id: "LOG-9078",
      productName: "Craft Resin Desk Organizer",
      sku: "RD-ORG-09",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80",
      changeType: "Order Fulfillment",
      quantityChange: -1,
      previousStock: 1,
      newStock: 0,
      reason: "Customer Order Delivered",
      performedBy: "System (Auto)",
      date: "Apr 13, 2026",
      time: "04:15 PM",
      referenceId: "ORD-8901",
    },
    {
      id: "LOG-9065",
      productName: "Plant Polisher Spray (250ml)",
      sku: "PPS-250ML",
      image:
        "https://images.unsplash.com/photo-1585336261026-61e778f29221?w=100&auto=format&fit=crop&q=80",
      changeType: "Return",
      quantityChange: +1,
      previousStock: 4,
      newStock: 5,
      reason: "Customer return inspected and restocked",
      performedBy: "Support Team",
      date: "Apr 12, 2026",
      time: "11:45 AM",
      referenceId: "RET-104",
    },
    {
      id: "LOG-9044",
      productName: "Handmade Leather Card Wallet",
      sku: "LW-MIN-02",
      image:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&auto=format&fit=crop&q=80",
      changeType: "Damaged / Loss",
      quantityChange: -2,
      previousStock: 6,
      newStock: 4,
      reason: "Damaged during warehouse transit",
      performedBy: "Warehouse Admin",
      date: "Apr 10, 2026",
      time: "02:20 PM",
      referenceId: "ADJ-0021",
    },
    {
      id: "LOG-9021",
      productName: "Eco-friendly Bamboo Watch",
      sku: "BW-ECO-01",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80",
      changeType: "Manual Audit",
      quantityChange: -3,
      previousStock: 5,
      newStock: 2,
      reason: "Physical inventory recount discrepancy",
      performedBy: "Jane D. (Vendor)",
      date: "Apr 08, 2026",
      time: "09:00 AM",
      referenceId: "AUDIT-2026-Q2",
    },
  ]);

  // Statistics
  const totalRestocked = logs
    .filter((l) => l.quantityChange > 0 && l.changeType === "Restock")
    .reduce((acc, l) => acc + l.quantityChange, 0);

  const totalFulfilled = Math.abs(
    logs
      .filter((l) => l.changeType === "Order Fulfillment")
      .reduce((acc, l) => acc + l.quantityChange, 0)
  );

  const totalAdjustments = logs.filter(
    (l) => l.changeType === "Manual Audit" || l.changeType === "Damaged / Loss"
  ).length;

  // Filter Log Entries
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "restock" && log.changeType === "Restock") ||
      (typeFilter === "fulfillment" && log.changeType === "Order Fulfillment") ||
      (typeFilter === "return" && log.changeType === "Return") ||
      (typeFilter === "adjustment" &&
        (log.changeType === "Manual Audit" || log.changeType === "Damaged / Loss"));

    return matchesSearch && matchesType;
  });

  // Handle Safe Navigation Back
  const handleBack = () => {
   
      navigate(-1);
    }
  

  return (
    <div className="w-full min-h-screen bg-slate-100 text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            className="flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 mb-2 transition-colors cursor-pointer"
            onClick={handleBack}
          >
            <FaArrowLeft size={12} /> Back to Inventory
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Inventory History & Audit Log
            </h1>
            <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <History size={13} /> Real-time Audit
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            type="button"
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <FileSpreadsheet size={14} className="text-emerald-600" /> Export CSV
          </button>
        </div>
      </div>

      {/* ================= STATS SUMMARY ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Units Restocked (30d)
            </p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              +{totalRestocked}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <PackageCheck size={22} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Units Dispatched (30d)
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              -{totalFulfilled}
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <PackageMinus size={22} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Manual Adjustments
            </p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {totalAdjustments} events
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Sliders size={22} />
          </div>
        </div>
      </div>

      {/* ================= CONTROLS & FILTER BAR ================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
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
                placeholder="Search product, SKU, log ID, or reason..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
              />
            </div>

            {/* Change Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Change Types</option>
              <option value="restock">Restock</option>
              <option value="fulfillment">Order Fulfillment</option>
              <option value="return">Return</option>
              <option value="adjustment">Adjustments & Loss</option>
            </select>

            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* ================= HISTORY LOG TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] sm:text-xs bg-slate-50/80">
                <th className="py-3 px-4 font-semibold">Log ID & Date</th>
                <th className="py-3 px-2 font-semibold">Product Details</th>
                <th className="py-3 px-2 font-semibold">Event Type</th>
                <th className="py-3 px-2 font-semibold text-center">Change</th>
                <th className="py-3 px-2 font-semibold text-center">Stock Snapshot</th>
                <th className="py-3 px-2 font-semibold">Performed By</th>
                <th className="py-3 px-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const isPositive = log.quantityChange > 0;
                  let typeBadgeClass = "bg-slate-100 text-slate-700";

                  if (log.changeType === "Restock")
                    typeBadgeClass = "bg-emerald-100 text-emerald-700";
                  else if (log.changeType === "Order Fulfillment")
                    typeBadgeClass = "bg-blue-100 text-blue-700";
                  else if (log.changeType === "Return")
                    typeBadgeClass = "bg-purple-100 text-purple-700";
                  else if (log.changeType === "Damaged / Loss")
                    typeBadgeClass = "bg-rose-100 text-rose-700";
                  else if (log.changeType === "Manual Audit")
                    typeBadgeClass = "bg-amber-100 text-amber-700";

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Log ID & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{log.id}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <FaCalendarAlt size={10} /> {log.date} • {log.time}
                        </div>
                      </td>

                      {/* Product */}
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={log.image}
                            alt={log.productName}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-semibold text-slate-800 truncate max-w-[160px] sm:max-w-[200px]">
                              {log.productName}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-mono">
                              SKU: {log.sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-2">
                        <span
                          className={`px-2.5 py-0.5 text-[10px] sm:text-xs rounded-full font-semibold inline-block ${typeBadgeClass}`}
                        >
                          {log.changeType}
                        </span>
                      </td>

                      {/* Change */}
                      <td className="py-3.5 px-2 text-center">
                        <span
                          className={`font-bold text-xs sm:text-sm px-2 py-0.5 rounded-md ${
                            isPositive
                              ? "text-emerald-700 bg-emerald-50"
                              : "text-rose-700 bg-rose-50"
                          }`}
                        >
                          {isPositive ? `+${log.quantityChange}` : log.quantityChange}
                        </span>
                      </td>

                      {/* Stock Snapshot */}
                      <td className="py-3.5 px-2 text-center">
                        <div className="text-xs text-slate-600 font-medium">
                          <span className="text-slate-400 line-through">
                            {log.previousStock}
                          </span>{" "}
                          →{" "}
                          <span className="font-bold text-slate-900">
                            {log.newStock}
                          </span>
                        </div>
                      </td>

                      {/* Performed By */}
                      <td className="py-3.5 px-2 text-slate-600 font-medium text-xs">
                        {log.performedBy}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                        >
                          View Audit
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-8 text-slate-400 text-sm"
                  >
                    No inventory log records match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= AUDIT DETAIL MODAL ================= */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Audit Detail: {selectedLog.id}
                </h3>
                <p className="text-xs text-slate-400">
                  Recorded on {selectedLog.date} at {selectedLog.time}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs sm:text-sm">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <img
                  src={selectedLog.image}
                  alt={selectedLog.productName}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-900">
                    {selectedLog.productName}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    SKU: {selectedLog.sku}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-400 text-[10px] uppercase font-semibold">
                    Change Type
                  </p>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {selectedLog.changeType}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-400 text-[10px] uppercase font-semibold">
                    Reference ID
                  </p>
                  <p className="font-bold text-emerald-600 font-mono mt-0.5">
                    {selectedLog.referenceId}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <p className="text-slate-400 text-[10px] uppercase font-semibold">
                  Reason / Notes
                </p>
                <p className="text-slate-700 leading-relaxed">
                  {selectedLog.reason}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-lg">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-semibold">
                    Previous Stock → New Stock
                  </p>
                  <p className="font-mono text-base font-bold">
                    {selectedLog.previousStock} units → {selectedLog.newStock} units
                  </p>
                </div>
                <span
                  className={`text-sm font-bold px-2.5 py-1 rounded-md ${
                    selectedLog.quantityChange > 0
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/20 text-rose-400"
                  }`}
                >
                  {selectedLog.quantityChange > 0
                    ? `+${selectedLog.quantityChange}`
                    : selectedLog.quantityChange}
                </span>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}