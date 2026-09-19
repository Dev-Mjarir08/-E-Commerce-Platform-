import React, { useState } from "react";
import {
  FaTag,
  FaPlus,
  FaSearch,
  FaFilter,
  FaCopy,
  FaCheck,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaTimes,
  FaPercent,
  FaDollarSign,
  FaCalendarAlt,
} from "react-icons/fa";

// Initial Coupon Data
const initialCoupons = [
  {
    id: "CPN-101",
    code: "SPRING20",
    discountType: "Percentage",
    discountValue: 20,
    minSpend: 50.0,
    usageLimit: 200,
    usedCount: 142,
    expiryDate: "2026-04-30",
    status: "Active",
  },
  {
    id: "CPN-102",
    code: "WELCOME10",
    discountType: "Fixed Amount",
    discountValue: 10,
    minSpend: 30.0,
    usageLimit: 500,
    usedCount: 489,
    expiryDate: "2026-12-31",
    status: "Active",
  },
  {
    id: "CPN-103",
    code: "VIPFLASH50",
    discountType: "Percentage",
    discountValue: 50,
    minSpend: 150.0,
    usageLimit: 50,
    usedCount: 50,
    expiryDate: "2026-02-15",
    status: "Expired",
  },
  {
    id: "CPN-104",
    code: "FREESHIP",
    discountType: "Fixed Amount",
    discountValue: 15,
    minSpend: 40.0,
    usageLimit: 100,
    usedCount: 18,
    expiryDate: "2026-05-15",
    status: "Paused",
  },
];

export default function VendorCoupons() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [copiedCode, setCopiedCode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Coupon Form State
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "Percentage",
    discountValue: "",
    minSpend: "",
    usageLimit: "",
    expiryDate: "",
  });

  // Filter Logic
  const filteredCoupons = coupons.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Copy Code Action
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Toggle Active/Paused Status
  const toggleStatus = (id) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          if (c.status === "Expired") return c;
          return {
            ...c,
            status: c.status === "Active" ? "Paused" : "Active",
          };
        }
        return c;
      })
    );
  };

  // Delete Coupon
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      setCoupons(coupons.filter((c) => c.id !== id));
    }
  };

  // Submit New Coupon
  const handleCreateCoupon = (e) => {
    e.preventDefault();
    const createdCoupon = {
      id: `CPN-${Math.floor(100 + Math.random() * 900)}`,
      code: newCoupon.code.toUpperCase().trim(),
      discountType: newCoupon.discountType,
      discountValue: parseFloat(newCoupon.discountValue) || 0,
      minSpend: parseFloat(newCoupon.minSpend) || 0,
      usageLimit: parseInt(newCoupon.usageLimit, 10) || 100,
      usedCount: 0,
      expiryDate: newCoupon.expiryDate,
      status: "Active",
    };

    setCoupons([createdCoupon, ...coupons]);
    setIsModalOpen(false);
    setNewCoupon({
      code: "",
      discountType: "Percentage",
      discountValue: "",
      minSpend: "",
      usageLimit: "",
      expiryDate: "",
    });
  };

  const activeCount = coupons.filter((c) => c.status === "Active").length;
  const totalRedemptions = coupons.reduce((acc, c) => acc + c.usedCount, 0);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Promotional Coupons
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Create discount codes, set usage caps, and monitor campaign redemptions.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 hover:bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/10 active:scale-95 transition-all cursor-pointer"
          >
            <FaPlus className="text-xs" /> Create New Coupon
          </button>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Coupons
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{coupons.length}</h3>
            </div>
            <div className="p-3 bg-teal-50 text-teal-800 rounded-xl">
              <FaTag className="text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Campaigns
              </p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1">{activeCount}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <FaPercent className="text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Redemptions
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalRedemptions}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <FaDollarSign className="text-xl" />
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by promo code or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-all"
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <FaFilter /> Status:
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-700 transition"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {/* COUPONS TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Promo Code</th>
                  <th className="py-3.5 px-5">Discount</th>
                  <th className="py-3.5 px-5">Min Spend</th>
                  <th className="py-3.5 px-5">Redemptions</th>
                  <th className="py-3.5 px-5">Expiration</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredCoupons.length > 0 ? (
                  filteredCoupons.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/80 tracking-wider">
                            {item.code}
                          </span>
                          <button
                            onClick={() => handleCopy(item.code)}
                            title="Copy Code"
                            className="text-slate-400 hover:text-teal-700 p-1 rounded transition"
                          >
                            {copiedCode === item.code ? (
                              <FaCheck className="text-emerald-600 text-xs" />
                            ) : (
                              <FaCopy className="text-xs" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-5 font-bold text-slate-900">
                        {item.discountType === "Percentage"
                          ? `${item.discountValue}% OFF`
                          : `$${item.discountValue.toFixed(2)} OFF`}
                      </td>

                      <td className="py-4 px-5 font-medium text-slate-600">
                        ${item.minSpend.toFixed(2)}
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">
                            {item.usedCount} / {item.usageLimit}
                          </span>
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-teal-700 h-1.5 rounded-full"
                              style={{
                                width: `${Math.min(100, (item.usedCount / item.usageLimit) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-xs font-mono text-slate-500">
                        {item.expiryDate}
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            item.status === "Active"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : item.status === "Paused"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === "Active"
                                ? "bg-emerald-500"
                                : item.status === "Paused"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                          />
                          {item.status}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleStatus(item.id)}
                            disabled={item.status === "Expired"}
                            title={
                              item.status === "Expired"
                                ? "Cannot toggle expired coupon"
                                : item.status === "Active"
                                ? "Pause Coupon"
                                : "Activate Coupon"
                            }
                            className={`p-2 rounded-lg transition ${
                              item.status === "Expired"
                                ? "text-slate-300 cursor-not-allowed"
                                : item.status === "Active"
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : "text-amber-600 hover:bg-amber-50"
                            }`}
                          >
                            {item.status === "Active" ? (
                              <FaToggleOn className="text-lg" />
                            ) : (
                              <FaToggleOff className="text-lg" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Delete Coupon"
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-slate-400">
                      No matching coupons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CREATE COUPON MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Create New Coupon</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newCoupon.code}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, code: e.target.value })
                    }
                    placeholder="e.g. SUMMER25"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm uppercase font-mono tracking-wider text-slate-800 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Discount Type
                    </label>
                    <select
                      value={newCoupon.discountType}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, discountType: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-700"
                    >
                      <option value="Percentage">Percentage (%)</option>
                      <option value="Fixed Amount">Fixed Amount ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Discount Value
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newCoupon.discountValue}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, discountValue: e.target.value })
                      }
                      placeholder={newCoupon.discountType === "Percentage" ? "20" : "15.00"}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Min. Order Spend ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newCoupon.minSpend}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, minSpend: e.target.value })
                      }
                      placeholder="50.00"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      required
                      value={newCoupon.usageLimit}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, usageLimit: e.target.value })
                      }
                      placeholder="200"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Expiration Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={newCoupon.expiryDate}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, expiryDate: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-700"
                    />
                    <FaCalendarAlt className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-sm font-semibold text-white shadow-md transition"
                  >
                    Publish Coupon
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