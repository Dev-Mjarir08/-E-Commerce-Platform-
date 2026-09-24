import { useState } from "react";
import { Search, Eye, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

const Orders = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const orders = [
    {
      id: "ORD-9821",
      customer: "Vikram Malhotra",
      email: "vikram.m@luxury.in",
      vendor: "Urban Fashion Atelier",
      items: 2,
      total: "₹84,500",
      status: "Delivered",
      date: "Oct 24, 2026",
    },
    {
      id: "ORD-9820",
      customer: "Aarav Singhania",
      email: "aarav@singhania.co",
      vendor: "Nova Wear Studio",
      items: 1,
      total: "₹42,000",
      status: "Processing",
      date: "Oct 24, 2026",
    },
    {
      id: "ORD-9819",
      customer: "Devanshi Shah",
      email: "devanshi@atelier.org",
      vendor: "Mono Studio",
      items: 3,
      total: "₹26,800",
      status: "Shipped",
      date: "Oct 23, 2026",
    },
    {
      id: "ORD-9818",
      customer: "Rohan Mehra",
      email: "rohan.m@studio.com",
      vendor: "Heritage Leatherworks",
      items: 1,
      total: "₹62,000",
      status: "Pending",
      date: "Oct 23, 2026",
    },
    {
      id: "ORD-9817",
      customer: "Ananya Kapoor",
      email: "ananya@design.in",
      vendor: "Urban Fashion Atelier",
      items: 1,
      total: "₹55,000",
      status: "Delivered",
      date: "Oct 22, 2026",
    },
  ];

  const getBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Processing":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Shipped":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      default:
        return "bg-amber-50 text-amber-800 border-amber-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Marketplace Orders
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track fulfillment and tenant dispatch statuses
          </p>
        </div>
        <button
          type="button"
          onClick={() => showToast("Preparing marketplace orders export CSV archive...", "info")}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Download size={14} />
          <span>Export Orders</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-72">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by customer or ID..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Boutique</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-bold text-indigo-600">
                  {o.id}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900">
                    {o.customer}
                  </div>
                  <div className="text-[11px] text-slate-400">{o.email}</div>
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">
                  {o.vendor}
                </td>
                <td className="py-3.5 px-4 font-black text-slate-900">
                  {o.total}
                </td>
                <td className="py-3.5 px-4 text-slate-500">{o.date}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${getBadge(o.status)}`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/orders/${o.id}`)}
                    title={`View ${o.id}`}
                    aria-label={`View ${o.id}`}
                    className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
