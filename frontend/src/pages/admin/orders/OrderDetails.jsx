import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  User,
  Store,
  CreditCard,
  Truck,
} from "lucide-react";

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

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const order = orders.find((item) => item.id === id);

  if (!order) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </button>

        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <h2 className="text-lg font-bold text-slate-900">
            Order not found
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            The order you're looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={15} />
          Back to Orders
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                {order.id}
              </h2>

              <span
                className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${getBadge(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Placed on {order.date}
            </p>
          </div>
        </div>
      </div>

      {/* Order information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <User size={17} className="text-indigo-600" />
            <h3 className="font-bold text-slate-900">Customer</h3>
          </div>

          <p className="text-sm font-semibold text-slate-900">
            {order.customer}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {order.email}
          </p>
        </div>

        {/* Boutique */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Store size={17} className="text-indigo-600" />
            <h3 className="font-bold text-slate-900">Boutique</h3>
          </div>

          <p className="text-sm font-semibold text-slate-900">
            {order.vendor}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Marketplace seller
          </p>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={17} className="text-indigo-600" />
            <h3 className="font-bold text-slate-900">Payment</h3>
          </div>

          <p className="text-sm font-bold text-slate-900">
            {order.total}
          </p>

          <p className="text-xs text-emerald-600 mt-1 font-medium">
            Payment recorded
          </p>
        </div>
      </div>

      {/* Order summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Package size={17} className="text-indigo-600" />
            <h3 className="font-bold text-slate-900">
              Order Summary
            </h3>
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-sm text-slate-500">
              Number of items
            </span>

            <span className="text-sm font-semibold text-slate-900">
              {order.items}
            </span>
          </div>

          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-sm text-slate-500">
              Order status
            </span>

            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getBadge(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          <div className="flex justify-between py-4">
            <span className="text-sm font-bold text-slate-900">
              Total
            </span>

            <span className="text-lg font-black text-slate-900">
              {order.total}
            </span>
          </div>
        </div>
      </div>

      {/* Fulfillment */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Truck size={17} className="text-indigo-600" />
          <h3 className="font-bold text-slate-900">
            Fulfillment
          </h3>
        </div>

        <p className="text-sm text-slate-600">
          Current fulfillment status:
        </p>

        <p className="text-sm font-bold text-slate-900 mt-1">
          {order.status}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;