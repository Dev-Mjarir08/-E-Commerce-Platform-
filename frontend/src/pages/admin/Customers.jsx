import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Search,
  Users,
  ShoppingBag,
  CreditCard,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  UserX,
  CheckCircle,
  Filter
} from "lucide-react";
import {
  fetchCustomers,
  updateCustomerStatus,
  deleteCustomer,
  clearCustomerError
} from "../../redux/slices/customerSlice";

const Customers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    customers,
    summary,
    pagination,
    loading,
    error,
    actionLoading
  } = useSelector((state) => state.customers);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Fetch customers with current filters
  const loadCustomers = () => {
    dispatch(
      fetchCustomers({
        search: searchTerm.trim() || undefined,
        tier: selectedTier !== "all" ? selectedTier : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        page: pagination.page || 1,
        limit: 50
      })
    );
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadCustomers();
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedTier, selectedStatus, dispatch]);

  const handleToggleStatus = (e, customer) => {
    e.stopPropagation();
    const newStatus = customer.status === "active" ? "suspended" : "active";
    dispatch(updateCustomerStatus({ id: customer.id || customer._id, status: newStatus }));
  };

  const getTierBadgeColor = (tier) => {
    switch (tier) {
      case "VIP Member":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Privilege Club":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "suspended":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "banned":
      case "inactive":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Live MongoDB Stats */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Customer Database</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time clientele management, live order statistics, and concierge tiering
          </p>
        </div>

        <button
          type="button"
          onClick={loadCustomers}
          disabled={loading}
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Total Clients
            </div>
            <div className="text-lg font-bold text-slate-900">
              {summary.totalCustomers || 0}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Platform Orders
            </div>
            <div className="text-lg font-bold text-slate-900">
              {summary.totalOrders || 0}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Cumulative Spend
            </div>
            <div className="text-lg font-bold text-slate-900">
              {summary.totalSpend || "₹0"}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, email, or phone..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Tier:</span>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Tiers</option>
              <option value="VIP Member">VIP Member</option>
              <option value="Privilege Club">Privilege Club</option>
              <option value="Standard">Standard</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => dispatch(clearCustomerError())}
            className="text-rose-600 hover:text-rose-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Customer Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Fetching registered customers from database...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Customers Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm || selectedTier !== "all" || selectedStatus !== "all"
                ? "No customer matches your search criteria. Try clearing the filters."
                : "No registered customers in the database yet. New accounts registered via the boutique will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Client Name & Email</th>
                  <th className="py-3 px-4">Client Tier</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Orders</th>
                  <th className="py-3 px-4">Lifetime Spend</th>
                  <th className="py-3 px-4">Member Since</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr
                    key={c.id || c._id}
                    onClick={() => navigate(`/admin/customers/${c.id || c._id}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.avatar || "https://placehold.co/150"}
                          alt={c.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-slate-100 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{c.name}</div>
                          <div className="text-[11px] text-slate-400">{c.email}</div>
                          {c.phone && c.phone !== "N/A" && (
                            <div className="text-[10px] text-slate-400">{c.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getTierBadgeColor(
                          c.tier
                        )}`}
                      >
                        {c.tier}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadgeColor(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {c.orders} {c.orders === 1 ? "Order" : "Orders"}
                    </td>

                    <td className="py-3.5 px-4 font-black text-emerald-700 font-mono">
                      {c.totalSpend}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">{c.joined}</td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleToggleStatus(e, c)}
                          disabled={actionLoading}
                          title={c.status === "active" ? "Suspend Client" : "Activate Client"}
                          className={`p-1.5 rounded-lg transition-colors ${
                            c.status === "active"
                              ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                              : "text-amber-600 hover:text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {c.status === "active" ? <UserX size={15} /> : <CheckCircle size={15} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(`/admin/customers/${c.id || c._id}`)}
                          title={`View ${c.name} Dossier`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
