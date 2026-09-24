import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  User,
  Store,
  CreditCard,
  Truck,
  MapPin,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderById,
  clearSelectedOrder,
} from "../../../redux/slices/orderSlice";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedOrder: order,
    detailsLoading,
    detailsError,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }

    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [dispatch, id]);

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

  if (detailsLoading) {
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
          <p className="text-sm text-slate-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (detailsError || !order) {
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
          <h2 className="text-lg font-bold text-slate-900">Order not found</h2>

          <p className="text-sm text-slate-500 mt-2">
            {detailsError || "The order you're looking for does not exist."}
          </p>
        </div>
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];

  const customerName =
    order.user?.name ||
    [order.user?.firstName, order.user?.lastName].filter(Boolean).join(" ") ||
    order.customer ||
    order.shippingAddress?.recipientName ||
    "Customer";

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
                {order.orderNumber}
              </h2>

              <span
                className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${getBadge(
                  order.status,
                )}`}
              >
                {order.status}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Customer / Boutique / Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <User size={17} className="text-indigo-600" />

            <h3 className="font-bold text-slate-900">Customer</h3>
          </div>

          <p className="text-sm font-semibold text-slate-900">{customerName}</p>

          <p className="text-xs text-slate-500 mt-1">{order.email || "—"}</p>
        </div>

        {/* Boutique */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Store size={17} className="text-indigo-600" />

            <h3 className="font-bold text-slate-900">Boutique</h3>
          </div>

          <p className="text-sm font-semibold text-slate-900">
            {order.vendor || "Marketplace"}
          </p>

          <p className="text-xs text-slate-500 mt-1">Marketplace seller</p>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={17} className="text-indigo-600" />

            <h3 className="font-bold text-slate-900">Payment</h3>
          </div>

          <p className="text-sm font-bold text-slate-900">
            {formatCurrency(order.total)}
          </p>

          <p
            className={`text-xs mt-1 font-medium ${
              order.paymentStatus === "paid"
                ? "text-emerald-600"
                : order.paymentStatus === "refunded"
                  ? "text-orange-600"
                  : "text-amber-600"
            }`}
          >
            {order.paymentStatus
              ? order.paymentStatus.charAt(0).toUpperCase() +
                order.paymentStatus.slice(1)
              : "Pending"}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Method: {order.paymentMethod || "—"}
          </p>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={17} className="text-indigo-600" />

            <h3 className="font-bold text-slate-900">Shipping Address</h3>
          </div>

          <p className="text-sm font-semibold text-slate-900">
            {order.shippingAddress.recipientName}
          </p>

          <p className="text-sm text-slate-600 mt-1">
            {order.shippingAddress.street}
            {order.shippingAddress.apartment
              ? `, ${order.shippingAddress.apartment}`
              : ""}
          </p>

          <p className="text-sm text-slate-600">
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.postalCode}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Phone: {order.shippingAddress.phone}
          </p>
        </div>
      )}

      {/* Order items */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Package size={17} className="text-indigo-600" />

            <h3 className="font-bold text-slate-900">Order Items</h3>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="p-5 text-sm text-slate-500">
              No items found for this order.
            </div>
          ) : (
            items.map((item) => (
              <div key={item._id} className="p-5 flex items-center gap-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Package size={20} className="text-slate-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {item.name}
                  </p>

                  {item.sku && (
                    <p className="text-xs text-slate-400 mt-1">
                      SKU: {item.sku}
                    </p>
                  )}

                  <p className="text-xs text-slate-500 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    {formatCurrency(item.subtotal)}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Package size={17} className="text-indigo-600" />

            <h3 className="font-bold text-slate-900">Order Summary</h3>
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-sm text-slate-500">Number of items</span>

            <span className="text-sm font-semibold text-slate-900">
              {items.reduce(
                (total, item) => total + Number(item.quantity || 0),
                0,
              )}
            </span>
          </div>

          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-sm text-slate-500">Subtotal</span>

            <span className="text-sm font-semibold text-slate-900">
              {formatCurrency(order.subtotal)}
            </span>
          </div>

          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-sm text-slate-500">Discount</span>

            <span className="text-sm font-semibold text-slate-900">
              - {formatCurrency(order.discountAmount)}
            </span>
          </div>

          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-sm text-slate-500">Shipping</span>

            <span className="text-sm font-semibold text-slate-900">
              {formatCurrency(order.shippingPrice)}
            </span>
          </div>

          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-sm text-slate-500">Tax</span>

            <span className="text-sm font-semibold text-slate-900">
              {formatCurrency(order.taxPrice)}
            </span>
          </div>

          <div className="flex justify-between py-4">
            <span className="text-sm font-bold text-slate-900">Total</span>

            <span className="text-lg font-black text-slate-900">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Fulfillment */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Truck size={17} className="text-indigo-600" />

          <h3 className="font-bold text-slate-900">Fulfillment</h3>
        </div>

        <p className="text-sm text-slate-600">Current fulfillment status:</p>

        <p className="text-sm font-bold text-slate-900 mt-1">{order.status}</p>

        {order.trackingNumber && (
          <p className="text-xs text-slate-500 mt-2">
            Tracking: {order.trackingNumber}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
