import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  UserCheck,
  UserX
} from "lucide-react";
import {
  fetchCustomerDetails,
  updateCustomerStatus,
  clearSelectedCustomer
} from "../../../redux/slices/customerSlice";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedCustomer: customer,
    detailLoading: loading,
    detailError: error,
    actionLoading
  } = useSelector((state) => state.customers);

  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerDetails(id));
    }
    return () => {
      dispatch(clearSelectedCustomer());
    };
  }, [id, dispatch]);

  const handleToggleStatus = () => {
    if (!customer) return;
    const newStatus = customer.status === "active" ? "suspended" : "active";
    dispatch(updateCustomerStatus({ id: customer.id || customer._id, status: newStatus }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/admin/customers")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={15} />
          Back to Customers
        </button>

        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading customer portfolio from MongoDB...</p>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/admin/customers")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Customers
        </button>

        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">
            {error || "Customer Not Found"}
          </h2>
          <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
            The customer dossier could not be located or may have been removed from the platform database.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/customers")}
            className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            Return to Customer Directory
          </button>
        </div>
      </div>
    );
  }

  const getTierBadge = (tier) => {
    switch (tier) {
      case "VIP Member":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Privilege Club":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "shipped":
      case "processing":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={() => navigate("/admin/customers")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Customer Database
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={customer.avatar || "https://placehold.co/150"}
              alt={customer.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 bg-slate-100 shadow-xs"
            />

            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">
                  {customer.name}
                </h2>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    customer.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {customer.status}
                </span>

                {customer.isVerified && (
                  <span className="flex items-center gap-1 text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 font-medium">
                    <ShieldCheck size={12} />
                    Verified
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-1 font-mono">
                Account ID: {customer.id || customer._id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={actionLoading}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                customer.status === "active"
                  ? "border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100"
                  : "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
              }`}
            >
              {customer.status === "active" ? (
                <>
                  <UserX size={14} />
                  <span>Suspend Account</span>
                </>
              ) : (
                <>
                  <UserCheck size={14} />
                  <span>Reactivate Account</span>
                </>
              )}
            </button>

            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${getTierBadge(
                customer.tier
              )}`}
            >
              {customer.tier}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Orders
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {customer.ordersCount || (customer.orders ? customer.orders.length : 0)}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Lifetime Spend
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
              {customer.totalSpend}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Member Since
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {customer.joined}
            </div>
          </div>
        </div>
      </div>

      {/* Account Info & Addresses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Details */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
            <User size={17} className="text-indigo-600" />
            <h3 className="font-bold text-slate-900">Personal & Contact Dossier</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Email Address</p>
                <p className="text-xs font-semibold text-slate-900 mt-0.5">{customer.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={16} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Contact Phone</p>
                <p className="text-xs font-semibold text-slate-900 mt-0.5">{customer.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Registration Date</p>
                <p className="text-xs font-semibold text-slate-900 mt-0.5">{customer.joined}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Account Role</p>
                <p className="text-xs font-semibold uppercase text-indigo-700 tracking-wider mt-0.5">
                  {customer.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Registered Shipping Addresses */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
            <MapPin size={17} className="text-indigo-600" />
            <h3 className="font-bold text-slate-900">Registered Addresses</h3>
          </div>

          {!customer.addresses || customer.addresses.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No saved addresses on file for this client.
            </div>
          ) : (
            <div className="space-y-3">
              {customer.addresses.map((addr, idx) => (
                <div
                  key={addr._id || idx}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{addr.recipientName || customer.name}</span>
                    {addr.isDefault && (
                      <span className="text-[9px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-semibold uppercase">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">
                    {addr.street}
                    {addr.apartment ? `, ${addr.apartment}` : ""}
                  </p>
                  <p className="text-slate-500">
                    {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                  </p>
                  {addr.phone && <p className="text-slate-400 text-[11px]">Phone: {addr.phone}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Real Orders History */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={17} className="text-indigo-600" />
            <h3 className="font-bold text-slate-900">Order History Archive</h3>
          </div>
          <span className="text-xs text-slate-400">
            {customer.orders ? customer.orders.length : 0} Orders Recorded
          </span>
        </div>

        {!customer.orders || customer.orders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No order transactions found for this customer.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4 text-right">View Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customer.orders.map((ord) => (
                  <tr key={ord.id || ord._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{ord.date}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getOrderStatusBadge(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 uppercase font-mono text-[11px]">
                      {ord.paymentMethod} •{" "}
                      <span className={ord.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700 font-mono">
                      {ord.total}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/orders/${ord.id || ord._id}`}
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 font-semibold p-1.5 rounded hover:bg-indigo-50 transition-colors"
                      >
                        <span>Inspect</span>
                        <ExternalLink size={13} />
                      </Link>
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

export default CustomerDetails;