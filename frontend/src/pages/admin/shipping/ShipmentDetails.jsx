import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  Truck,
  MapPin,
  User,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  XCircle,
  CalendarDays,
  Hash,
  Copy,
  ExternalLink,
  Navigation,
  Box,
  ClipboardCheck,
  RefreshCw,
  CreditCard,
  Building2,
} from "lucide-react";
import adminApi from "../../../services/adminApi";
import { useToast } from "../../../context/ToastContext";

const statusConfig = {
  Processing: {
    icon: Clock3,
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  "In Transit": {
    icon: Truck,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  "Out for Delivery": {
    icon: MapPin,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  Delivered: {
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Delayed: {
    icon: AlertTriangle,
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
  Cancelled: {
    icon: XCircle,
    className: "bg-slate-100 text-slate-500 border-slate-200",
  },
};

const getUiStatus = (orderStatus) => {
  const raw = String(orderStatus || "").toLowerCase();
  if (raw === "shipped") return "In Transit";
  if (raw === "delivered") return "Delivered";
  if (raw === "cancelled") return "Cancelled";
  return "Processing"; // placed, confirmed, processing
};

const formatDate = (value, includeTime = false) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
};

const formatCurrency = (val) => {
  return `₹${Number(val || 0).toLocaleString("en-IN")}`;
};

const ShipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch real order details from API
  const fetchOrderDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getOrderById(id);
      const data = response?.data || response;
      if (data && (data._id || data.orderNumber)) {
        setOrder(data);
      } else {
        setError("Order record not found.");
      }
    } catch (err) {
      console.error("Failed to load order details:", err);
      setError(err.message || "Failed to load order details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  // Status update
  const handleUpdateStatus = async (newUiStatus) => {
    let backendStatus = "processing";
    if (newUiStatus === "In Transit" || newUiStatus === "shipped") {
      backendStatus = "shipped";
    } else if (newUiStatus === "Delivered" || newUiStatus === "delivered") {
      backendStatus = "delivered";
    } else if (newUiStatus === "Cancelled" || newUiStatus === "cancelled") {
      backendStatus = "cancelled";
    } else if (newUiStatus === "Processing" || newUiStatus === "processing") {
      backendStatus = "processing";
    }

    setIsUpdating(true);
    try {
      await adminApi.updateOrderStatus(order._id || id, {
        status: backendStatus,
      });
      showToast(`Order status updated to ${newUiStatus}.`, "success");
      await fetchOrderDetails();
    } catch (err) {
      showToast(err.message || "Failed to update order status.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const copyTracking = async () => {
    const tracking = order?.trackingNumber || "Not Assigned";
    try {
      await navigator.clipboard.writeText(tracking);
      showToast("Tracking number copied to clipboard.", "success");
    } catch {
      alert(`Tracking Number: ${tracking}`);
    }
  };

  const openTracking = () => {
    const tracking = order?.trackingNumber;
    if (tracking) {
      alert(`Tracking ${tracking} with Carrier: Not Assigned`);
    } else {
      showToast("No tracking number assigned to this shipment.", "info");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <RefreshCw
            size={36}
            className="mx-auto text-indigo-500 animate-spin mb-3"
          />
          <h2 className="text-base font-bold text-slate-800">
            Loading Shipment Details...
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fetching live order information from database.
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <Package size={42} className="mx-auto text-slate-300 mb-3" />

          <h2 className="text-lg font-bold text-slate-900">
            Shipment Not Found
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {error ||
              "The shipment you are looking for does not exist or may have been removed."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/shipping")}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
          >
            <ArrowLeft size={14} />
            Back to Shipping
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = getUiStatus(order.orderStatus);
  const config = statusConfig[currentStatus] || statusConfig.Processing;
  const StatusIcon = config.icon;

  // Resolved Customer details
  const customerUser = order.user || {};
  const customerName =
    customerUser.name ||
    [customerUser.firstName, customerUser.lastName]
      .filter(Boolean)
      .join(" ") ||
    order.shippingAddress?.recipientName ||
    "Unknown Customer";

  const customerEmail = customerUser.email || "Not Available";
  const customerPhone =
    order.shippingAddress?.phone || customerUser.phone || "Not Available";

  // Resolved Destination
  const shippingAddr = order.shippingAddress || {};
  const destination =
    [shippingAddr.city, shippingAddr.state].filter(Boolean).join(", ") ||
    "Not Specified";

  const fullShippingAddress = [
    shippingAddr.street,
    shippingAddr.apartment,
    shippingAddr.city,
    shippingAddr.state,
    shippingAddr.postalCode,
    shippingAddr.country,
  ]
    .filter(Boolean)
    .join(", ");

  const billingAddr = order.billingAddress || {};
  const fullBillingAddress = [
    billingAddr.street,
    billingAddr.apartment,
    billingAddr.city,
    billingAddr.state,
    billingAddr.postalCode,
    billingAddr.country,
  ]
    .filter(Boolean)
    .join(", ");

  // Total quantity calculation
  const items = Array.isArray(order.items) ? order.items : [];
  const totalItemsCount = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin/shipping")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-3"
            >
              <ArrowLeft size={14} />
              Back to Shipping
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Shipment Details
              </h2>

              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${config.className}`}
              >
                <StatusIcon size={12} />
                {currentStatus}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="font-mono text-xs font-bold text-indigo-600">
                {order.orderNumber}
              </span>

              <span className="text-slate-300">•</span>

              <span className="font-mono text-xs text-slate-500">
                ID: {order._id}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate("/admin/shipping")}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
            >
              <ArrowLeft size={14} />
              Back
            </button>

            <button
              type="button"
              disabled={isUpdating || currentStatus === "In Transit"}
              onClick={() => handleUpdateStatus("In Transit")}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold hover:bg-blue-100 disabled:opacity-50"
            >
              <Truck size={14} />
              In Transit
            </button>

            <button
              type="button"
              disabled={isUpdating || currentStatus === "Delivered"}
              onClick={() => handleUpdateStatus("Delivered")}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 disabled:opacity-50"
            >
              <CheckCircle2 size={14} />
              Delivered
            </button>
          </div>
        </div>
      </div>

      {/* Shipment Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Shipment ID */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Shipment ID
            </span>

            <Hash size={17} className="text-indigo-500" />
          </div>

          <p className="font-mono font-bold text-slate-900 mt-3 truncate">
            {order.orderNumber}
          </p>

          <p className="text-[11px] text-slate-400 mt-1">Shipment reference</p>
        </div>

        {/* Carrier */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Carrier
            </span>

            <Truck size={17} className="text-blue-500" />
          </div>

          <p className="font-bold text-slate-900 mt-3">Not Assigned</p>

          <p className="text-[11px] text-slate-400 mt-1">Shipping partner</p>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Items
            </span>

            <Box size={17} className="text-amber-500" />
          </div>

          <p className="font-bold text-slate-900 mt-3">
            {totalItemsCount} item{totalItemsCount !== 1 ? "s" : ""}
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            Total items in shipment
          </p>
        </div>

        {/* ETA */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              ETA
            </span>

            <CalendarDays size={17} className="text-emerald-500" />
          </div>

          <p className="font-bold text-slate-900 mt-3">Not Available</p>

          <p className="text-[11px] text-slate-400 mt-1">Expected delivery</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Tracking Information */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Tracking Information
                  </h3>

                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Shipment carrier and tracking details.
                  </p>
                </div>

                <Truck size={18} className="text-indigo-500" />
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Carrier
                  </label>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Truck size={17} className="text-blue-600" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Not Assigned
                      </p>

                      <p className="text-[10px] text-slate-400">
                        Delivery partner
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Tracking Number
                  </label>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {order.trackingNumber || "Not Assigned"}
                      </span>
                    </div>

                    <button
                      type="button"
                      title="Copy tracking number"
                      onClick={copyTracking}
                      className="p-2.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                    >
                      <Copy size={15} />
                    </button>

                    <button
                      type="button"
                      title="Tracking information"
                      onClick={openTracking}
                      className="p-2.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                    >
                      <ExternalLink size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Route */}
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
                      <Package size={16} className="text-indigo-600" />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        Origin
                      </p>

                      <p className="text-xs font-bold text-slate-800">
                        Central Fulfillment Hub
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={18}
                    className="hidden md:block text-slate-300"
                  />

                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                      <MapPin size={16} className="text-emerald-600" />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        Destination
                      </p>

                      <p className="text-xs font-bold text-slate-800">
                        {destination}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                Delivery Information
              </h3>

              <p className="text-[11px] text-slate-400 mt-0.5">
                Customer destination and delivery address.
              </p>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                  <MapPin size={17} className="text-rose-600" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Shipping Address
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1 leading-6">
                    {fullShippingAddress || "No shipping address provided"}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Recipient: {shippingAddr.recipientName || customerName} •
                    Phone: {shippingAddr.phone || customerPhone}
                  </p>
                </div>
              </div>

              {fullBillingAddress && fullBillingAddress !== fullShippingAddress && (
                <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    <Building2 size={17} className="text-slate-500" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      Billing Address
                    </p>

                    <p className="text-xs font-semibold text-slate-700 mt-1 leading-5">
                      {fullBillingAddress}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items / Shipment Contents */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Shipment Package Contents
                </h3>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  Items verified and packed in this order.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-indigo-600">
                {items.length} product{items.length !== 1 ? "s" : ""} (
                {totalItemsCount} units)
              </span>
            </div>

            <div className="p-5">
              {items.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  No items listed for this order.
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {items.map((item, index) => {
                    const itemImage =
                      item.image ||
                      item.product?.images?.[0]?.url ||
                      (typeof item.product?.images?.[0] === "string"
                        ? item.product.images[0]
                        : null);

                    const storeName =
                      item.store?.name ||
                      item.product?.store?.name ||
                      "Verified Seller";

                    return (
                      <div
                        key={item._id || index}
                        className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                            {itemImage ? (
                              <img
                                src={itemImage}
                                alt={item.name || "Item"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package size={20} className="text-slate-400" />
                            )}
                          </div>

                          <div>
                            <p className="text-xs font-bold text-slate-800 line-clamp-1">
                              {item.name ||
                                item.product?.title ||
                                "Unnamed Product"}
                            </p>

                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-medium">
                                {storeName}
                              </span>

                              {item.sku && (
                                <span className="text-[10px] font-mono text-slate-400">
                                  SKU: {item.sku}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-slate-900">
                            {formatCurrency(item.price)} × {item.quantity}
                          </p>

                          <p className="text-[11px] font-mono text-indigo-600 mt-0.5">
                            {formatCurrency(item.subtotal || item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Financial summary breakdown */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Shipping Fee</span>
                  <span>{formatCurrency(order.shippingPrice)}</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Tax</span>
                  <span>{formatCurrency(order.taxPrice)}</span>
                </div>

                {Number(order.discountAmount) > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-sm">
                  <span>Total Amount</span>
                  <span className="text-indigo-600">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipment Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Navigation size={17} className="text-indigo-500" />

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Shipment Timeline
                  </h3>

                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Latest recorded shipment lifecycle activity.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="relative">
                <div className="absolute left-[15px] top-3 bottom-3 w-px bg-slate-200" />

                {/* Step 1: Placed */}
                <div className="relative flex gap-4 pb-6">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center z-10">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Order Placed & Registered
                    </p>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Customer order submitted via{" "}
                      {String(order.paymentMethod || "COD").toUpperCase()}.
                    </p>

                    <p className="text-[10px] font-mono text-slate-400 mt-1">
                      {formatDate(order.createdAt, true)}
                    </p>
                  </div>
                </div>

                {/* Step 2: Processing */}
                <div className="relative flex gap-4 pb-6">
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 ${
                      ["processing", "shipped", "delivered"].includes(
                        String(order.orderStatus).toLowerCase(),
                      )
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    <Clock3 size={15} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Fulfillment Processing
                    </p>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Items packaged and queued for courier pickup.
                    </p>
                  </div>
                </div>

                {/* Step 3: Shipped / In Transit */}
                <div className="relative flex gap-4 pb-6">
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 ${
                      ["shipped", "delivered"].includes(
                        String(order.orderStatus).toLowerCase(),
                      )
                        ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    <Truck size={15} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Dispatch & In Transit
                    </p>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Package dispatched from warehouse hub.
                    </p>
                  </div>
                </div>

                {/* Step 4: Delivered or Cancelled */}
                {String(order.orderStatus).toLowerCase() === "cancelled" ? (
                  <div className="relative flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center z-10">
                      <XCircle size={15} className="text-rose-600" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-rose-700">
                        Order Cancelled
                      </p>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {order.cancellationReason || "Cancelled by client/admin."}
                      </p>

                      {order.cancelledAt && (
                        <p className="text-[10px] font-mono text-slate-400 mt-1">
                          {formatDate(order.cancelledAt, true)}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="relative flex gap-4">
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 ${
                        String(order.orderStatus).toLowerCase() === "delivered"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                          : "bg-slate-50 border-slate-200 text-slate-400"
                      }`}
                    >
                      <ClipboardCheck size={15} />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {String(order.orderStatus).toLowerCase() === "delivered"
                          ? "Delivered Successfully"
                          : "Delivery Handover"}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {order.deliveredAt
                          ? `Delivered on ${formatDate(order.deliveredAt, true)}`
                          : "Estimated delivery arrival at destination."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <User size={17} className="text-indigo-500" />

                <div>
                  <h3 className="text-sm font-bold text-slate-900">Customer</h3>

                  <p className="text-[11px] text-slate-400">
                    Recipient information
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                {customerName
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-3">
                {customerName}
              </h4>

              <p className="text-xs text-slate-500 mt-1 truncate">
                {customerEmail}
              </p>

              <p className="text-xs text-slate-500 mt-1">{customerPhone}</p>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                Order Information
              </h3>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Order ID
                </p>

                <p className="font-mono text-sm font-bold text-indigo-600 mt-1">
                  #{order.orderNumber}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Items
                </p>

                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {totalItemsCount} item{totalItemsCount !== 1 ? "s" : ""}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Payment Method
                </p>

                <div className="flex items-center gap-1.5 mt-1">
                  <CreditCard size={14} className="text-slate-400" />
                  <span className="text-xs font-semibold text-slate-700 uppercase">
                    {order.paymentMethod || "cod"}
                  </span>
                  <span
                    className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.paymentStatus === "paid"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : order.paymentStatus === "refunded"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {order.paymentStatus || "pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Update Status Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                Update Status
              </h3>

              <p className="text-[11px] text-slate-400 mt-0.5">
                Change MongoDB shipment status.
              </p>
            </div>

            <div className="p-4 space-y-2">
              {["Processing", "In Transit", "Delivered", "Cancelled"].map(
                (status) => {
                  const StatusOptionIcon =
                    statusConfig[status]?.icon || Package;
                  const active = currentStatus === status;

                  return (
                    <button
                      key={status}
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(status)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-colors disabled:opacity-50 ${
                        active
                          ? statusConfig[status]?.className ||
                            "bg-slate-100 text-slate-700 border-slate-300"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <StatusOptionIcon size={15} />

                      <span className="text-xs font-semibold">{status}</span>

                      {active && (
                        <CheckCircle2 size={14} className="ml-auto" />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* Shipment Dates Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900">Shipment Dates</h3>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <CalendarDays size={16} className="text-slate-400 mt-0.5" />

                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Created / Placed
                  </p>

                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {formatDate(order.createdAt, true)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock3 size={16} className="text-slate-400 mt-0.5" />

                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Last Updated
                  </p>

                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {formatDate(order.updatedAt, true)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-slate-400 mt-0.5" />

                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Delivered Date
                  </p>

                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {order.deliveredAt
                      ? formatDate(order.deliveredAt, true)
                      : "Pending Delivery"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-800">
              Shipment {order.orderNumber}
            </p>

            <p className="text-[11px] text-slate-400 mt-0.5">
              Current status: {currentStatus}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentStatus !== "Cancelled" && (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleUpdateStatus("Cancelled")}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-rose-200 text-rose-600 bg-rose-50 rounded-lg text-xs font-semibold hover:bg-rose-100 disabled:opacity-50"
              >
                <XCircle size={14} />
                Cancel Shipment
              </button>
            )}

            {currentStatus !== "Delivered" && (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleUpdateStatus("Delivered")}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50"
              >
                <CheckCircle2 size={14} />
                Mark Delivered
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate("/admin/shipping")}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
            >
              <ArrowLeft size={14} />
              Back to Shipping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;