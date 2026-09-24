import { useEffect, useState } from "react";
import { Search, Eye, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../context/ToastContext";
import { fetchAdminOrders } from "../../redux/slices/orderSlice";

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");

  const {
    items: orders,
    loading,
    error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const getBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";

      case "Processing":
        return "bg-blue-50 text-blue-800 border-blue-200";

      case "Shipped":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";

      case "Confirmed":
        return "bg-blue-50 text-blue-800 border-blue-200";

      case "Cancelled":
        return "bg-red-50 text-red-800 border-red-200";

      default:
        return "bg-amber-50 text-amber-800 border-amber-200";
    }
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredOrders = orders.filter((order) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      order.orderNumber?.toLowerCase().includes(query) ||
      order.customer?.toLowerCase().includes(query) ||
      order.email?.toLowerCase().includes(query)
    );
  });

  const handleExport = () => {
    showToast("Order export is not connected yet.", "info");
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
          onClick={handleExport}
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

        {loading && (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading orders...
          </div>
        )}

        {!loading && error && (
          <div className="p-8 text-center">
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
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
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-indigo-600">
                    {order.orderNumber}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">
                      {order.customer}
                    </div>

                    <div className="text-[11px] text-slate-400">
                      {order.email || "—"}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {order.vendor}
                  </td>

                  <td className="py-3.5 px-4 font-black text-slate-900">
                    {formatCurrency(order.total)}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    {formatDate(order.date)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${getBadge(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      title={`View ${order.orderNumber}`}
                      aria-label={`View ${order.orderNumber}`}
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-sm text-slate-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
