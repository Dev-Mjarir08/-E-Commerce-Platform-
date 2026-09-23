import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Heart,
  MapPin,
  Package,
  Printer,
  RotateCcw,
  ShieldCheck,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { addToCart } from "../../redux/slices/cartSlice";

// Sample fallback orders database matching backend Order & OrderItem schemas
const FALLBACK_CUSTOMER_ORDERS = [
  {
    _id: "ord_901",
    orderNumber: "ATL-89241",
    createdAt: "2026-09-12T14:30:00Z",
    orderStatus: "shipped",
    paymentStatus: "paid",
    paymentMethod: "stripe",
    trackingNumber: "TRK-9821-4401-IN",
    carrier: "BlueDart Express",
    estimatedDelivery: "16 Sep 2026",
    subtotal: 12500,
    taxPrice: 0,
    shippingPrice: 0,
    discountAmount: 1250,
    totalPrice: 11250,
    shippingAddress: {
      recipientName: "Jarir Multani",
      phone: "+91 45678 91230",
      street: "Gujrat",
      apartment: "Suite 4B",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
      addressType: "home",
    },
    billingAddress: {
      recipientName: "Jarir Multani",
      phone: "+91 45678 91230",
      street: "Gujrat",
      apartment: "Suite 4B",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
    },
    items: [
      {
        _id: "item_101",
        product: "prod_1",
        name: "Structured Double-Breasted Wool Blazer",
        image:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
        sku: "ATL-WBL-001",
        price: 8500,
        quantity: 1,
        size: "40R",
        color: "Midnight Navy",
        status: "shipped",
      },
      {
        _id: "item_102",
        product: "prod_2",
        name: "Silk-Cotton Tapered Trousers",
        image:
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
        sku: "ATL-TR-002",
        price: 4000,
        quantity: 1,
        size: "32",
        color: "Charcoal",
        status: "shipped",
      },
    ],
  },
  {
    _id: "ord_902",
    orderNumber: "ATL-77309",
    createdAt: "2026-08-28T09:15:00Z",
    orderStatus: "delivered",
    paymentStatus: "paid",
    paymentMethod: "cod",
    trackingNumber: "TRK-7710-3392-IN",
    carrier: "DHL Express",
    deliveredAt: "2026-08-31T16:20:00Z",
    subtotal: 6500,
    taxPrice: 0,
    shippingPrice: 99,
    discountAmount: 0,
    totalPrice: 6599,
    shippingAddress: {
      recipientName: "Ayaan Ali (Atelier Studio)",
      phone: "+91 13245 67890",
      street: "Hafiz Babanagar Bandlaguda",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "400051",
      country: "India",
      addressType: "work",
    },
    billingAddress: {
      recipientName: "Ayaan Ali (Atelier Studio)",
      phone: "+91 13245 67890",
      street: "Hafiz Babanagar Bandlaguda",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "400051",
      country: "India",
    },
    items: [
      {
        _id: "item_103",
        product: "prod_3",
        name: "Merino Wool Ribbed Turtleneck Sweater",
        image:
          "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
        sku: "ATL-SWT-003",
        price: 6500,
        quantity: 1,
        size: "L",
        color: "Oatmeal Milk",
        status: "delivered",
      },
    ],
  },
  {
    _id: "ord_903",
    orderNumber: "ATL-61204",
    createdAt: "2026-08-10T11:45:00Z",
    orderStatus: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "stripe",
    cancelledAt: "2026-08-10T14:00:00Z",
    cancellationReason: "Requested by client prior to dispatch",
    subtotal: 18000,
    taxPrice: 0,
    shippingPrice: 0,
    discountAmount: 1800,
    totalPrice: 16200,
    shippingAddress: {
      recipientName: "Jarir Multani",
      phone: "+91 45678 91230",
      street: "Gujrat",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
      addressType: "home",
    },
    billingAddress: {
      recipientName: "Jarir Multani",
      phone: "+91 45678 91230",
      street: "Gujrat",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
    },
    items: [
      {
        _id: "item_104",
        product: "prod_4",
        name: "Italian Calfskin Derby Shoes",
        image:
          "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
        sku: "ATL-SH-004",
        price: 18000,
        quantity: 1,
        size: "42 EU",
        color: "Espresso Brown",
        status: "cancelled",
      },
    ],
  },
];

export const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Helper toast notifier
  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Find and load order details by ID or orderNumber
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let allOrders = FALLBACK_CUSTOMER_ORDERS;
        const stored = localStorage.getItem("atelier_customer_orders");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            allOrders = [...parsed, ...FALLBACK_CUSTOMER_ORDERS];
          }
        }

        const found = allOrders.find(
          (o) =>
            o._id === id || o.orderNumber?.toLowerCase() === id?.toLowerCase(),
        );

        if (found) {
          setOrder(found);
        } else {
          setError(
            `Order record "${id}" could not be located in your account archive.`,
          );
        }
        setLoading(false);
      } catch (err) {
        console.warn("Failed to load order details:", err);
        setError("An error occurred while loading order details.");
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  // Format date string helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Copy tracking number to clipboard
  const handleCopyTracking = () => {
    if (!order?.trackingNumber) return;
    navigator.clipboard.writeText(order.trackingNumber);
    setCopiedTracking(true);
    showToast(
      "success",
      `Tracking number ${order.trackingNumber} copied to clipboard.`,
    );
    setTimeout(() => setCopiedTracking(false), 3000);
  };

  // Reorder item handler
  const handleReorder = (item) => {
    dispatch(
      addToCart({
        product: {
          id: item.product || item._id,
          _id: item.product || item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          inStock: true,
        },
        size: item.size || "Standard",
        color: item.color || "Classic",
        quantity: 1,
      }),
    );
    showToast("success", `Added "${item.name}" to active shopping bag.`);
  };

  // Print invoice helper
  const handlePrintReceipt = () => {
    window.print();
  };

  // Order Timeline Step Status Helper
  const getTimelineSteps = (status) => {
    const isCancelled = status === "cancelled";
    const steps = [
      { id: "placed", label: "Order Placed" },
      { id: "confirmed", label: "Confirmed" },
      { id: "processing", label: "Processing" },
      { id: "shipped", label: "Dispatched" },
      { id: "delivered", label: "Delivered" },
    ];

    const currentIdx = steps.findIndex((s) => s.id === status);
    const activeIndex = currentIdx !== -1 ? currentIdx : 2; // fallback processing

    return { steps, activeIndex, isCancelled };
  };

  return (
    <div className="min-h-screen bg-m4m-bg text-[#111111] py-10 md:py-16 px-4 sm:px-6 lg:px-12 font-sans print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Top Bar */}
        <div className="mb-8 flex items-center justify-between border-b border-m4m-border pb-4 print:hidden">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders Archive</span>
          </Link>

          {order && (
            <button
              onClick={handlePrintReceipt}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-m4m-border hover:border-[#111111] text-xs font-mono uppercase tracking-wider text-[#111111] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          )}
        </div>

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div
            className={`mb-8 p-4 border flex items-center justify-between text-xs font-mono uppercase tracking-wider transition-all print:hidden ${
              toastMessage.type === "success"
                ? "bg-emerald-50/80 border-emerald-300 text-emerald-900"
                : toastMessage.type === "error"
                  ? "bg-rose-50/80 border-rose-300 text-rose-900"
                  : "bg-amber-50/80 border-amber-300 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-3">
              {toastMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-xs text-m4m-accent hover:text-[#111111]"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-m4m-card border border-m4m-border p-16 text-center space-y-4 shadow-xs">
            <div className="w-8 h-8 mx-auto border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono uppercase tracking-widest text-m4m-accent">
              Loading Order Details...
            </p>
          </div>
        ) : error || !order ? (
          /* Invalid Order State */
          <div className="bg-m4m-card border border-m4m-border p-10 text-center space-y-6 shadow-xs">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-rose-800">
                RECORD UNRESOLVED
              </span>
              <h2 className="font-serif text-2xl uppercase tracking-wider text-[#111111]">
                Order Not Found
              </h2>
              <p className="text-xs text-m4m-secondary font-sans leading-relaxed">
                {error ||
                  "The requested order reference does not exist or has been archived."}
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/orders"
                className="inline-flex items-center gap-2 bg-[#111111] text-m4m-bg px-7 py-3 text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Orders</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Main Order Details View */
          <div className="space-y-8">
            {/* Header Box */}
            <div className="bg-m4m-card border border-m4m-border p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-m4m-border pb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent">
                      CONFIRMED ACQUISITION
                    </span>
                    <span className="px-2 py-0.5 bg-[#111111] text-m4m-bg text-[9px] font-mono uppercase tracking-widest">
                      {order.paymentMethod?.toUpperCase()}
                    </span>
                  </div>
                  <h1 className="font-serif text-3xl uppercase tracking-tight text-[#111111] flex items-center gap-3">
                    <span>Order #{order.orderNumber}</span>
                  </h1>
                  <p className="text-xs font-mono text-m4m-secondary mt-1">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono text-m4m-accent">
                    Status:
                  </span>
                  {order.orderStatus === "delivered" ? (
                    <span className="px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono uppercase tracking-wider font-semibold">
                      DELIVERED
                    </span>
                  ) : order.orderStatus === "shipped" ? (
                    <span className="px-3 py-1 bg-indigo-50 border border-indigo-300 text-indigo-900 text-xs font-mono uppercase tracking-wider font-semibold">
                      DISPATCHED & IN TRANSIT
                    </span>
                  ) : order.orderStatus === "cancelled" ? (
                    <span className="px-3 py-1 bg-rose-50 border border-rose-300 text-rose-900 text-xs font-mono uppercase tracking-wider font-semibold">
                      CANCELLED
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono uppercase tracking-wider font-semibold">
                      PROCESSING
                    </span>
                  )}
                </div>
              </div>

              {/* Status Timeline Bar */}
              {(() => {
                const { steps, activeIndex, isCancelled } = getTimelineSteps(
                  order.orderStatus,
                );
                if (isCancelled) {
                  return (
                    <div className="p-4 bg-rose-50 border border-rose-200 flex items-center justify-between text-xs font-mono text-rose-900">
                      <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-rose-700" />
                        <div>
                          <strong className="block uppercase">
                            Order Cancelled
                          </strong>
                          <span className="text-[11px] text-rose-700">
                            {order.cancellationReason ||
                              "Cancelled upon request. Payment refunded."}
                          </span>
                        </div>
                      </div>
                      {order.cancelledAt && (
                        <span className="text-[10px] text-rose-800">
                          {formatDate(order.cancelledAt)}
                        </span>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-m4m-accent block">
                      DELIVERY TIMELINE
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
                      {steps.map((step, idx) => {
                        const isDone = idx <= activeIndex;
                        const isCurrent = idx === activeIndex;
                        return (
                          <div
                            key={step.id}
                            className={`p-3 border text-center transition-all ${
                              isCurrent
                                ? "bg-[#111111] border-[#111111] text-m4m-bg"
                                : isDone
                                  ? "bg-emerald-50/70 border-emerald-300 text-emerald-900"
                                  : "bg-m4m-bg border-m4m-border text-m4m-accent"
                            }`}
                          >
                            <span className="text-[9px] font-mono uppercase tracking-wider block opacity-70">
                              STEP 0{idx + 1}
                            </span>
                            <span className="text-xs font-mono uppercase tracking-wider font-medium block mt-0.5">
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Carrier & Tracking details bar */}
              {order.trackingNumber && (
                <div className="p-4 bg-m4m-bg border border-m4m-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-[#111111] shrink-0" />
                    <div>
                      <span className="text-m4m-accent uppercase tracking-wider text-[10px] block">
                        SHIPMENT TRACKING
                      </span>
                      <span className="text-[#111111] font-semibold">
                        {order.carrier || "Express Courier"} •{" "}
                        {order.trackingNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-m4m-border pt-2 sm:pt-0">
                    {order.estimatedDelivery && (
                      <span className="text-[11px] text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-1">
                        Est. Arrival: {order.estimatedDelivery}
                      </span>
                    )}

                    <button
                      onClick={handleCopyTracking}
                      className="px-3 py-1 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-m4m-bg transition-colors text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5"
                    >
                      {copiedTracking ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Tracking</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Grid: Items (Left 8 Cols) & Summary/Address (Right 4 Cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Ordered Items Table List (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-m4m-card border border-m4m-border p-6 space-y-6 shadow-xs">
                  <div className="pb-4 border-b border-m4m-border flex items-center justify-between">
                    <h2 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                      Ordered Products ({order.items.length})
                    </h2>
                    <span className="text-[10px] font-mono text-m4m-accent uppercase tracking-widest">
                      ITEMIZED MANIFEST
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-m4m-border">
                    {order.items.map((item, idx) => (
                      <div
                        key={item._id || idx}
                        className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                      >
                        <div className="flex gap-4 items-start sm:items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-24 sm:w-24 sm:h-28 object-cover bg-m4m-bg border border-m4m-border shrink-0"
                          />
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-m4m-accent uppercase tracking-widest block">
                              SKU: {item.sku || "ATL-IND-01"}
                            </span>
                            <h3 className="font-serif text-base sm:text-lg uppercase text-[#111111] leading-snug">
                              {item.name}
                            </h3>
                            <p className="text-xs text-m4m-secondary font-mono uppercase tracking-wider">
                              Size:{" "}
                              <span className="text-[#111111]">
                                {item.size}
                              </span>{" "}
                              • Color:{" "}
                              <span className="text-[#111111]">
                                {item.color}
                              </span>
                            </p>
                            <p className="text-xs text-m4m-secondary font-mono">
                              Qty:{" "}
                              <span className="text-[#111111] font-semibold">
                                {item.quantity}
                              </span>{" "}
                              × ₹{item.price.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-m4m-border">
                          <span className="font-mono text-base font-semibold text-[#111111]">
                            ₹
                            {(item.price * item.quantity).toLocaleString(
                              "en-IN",
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleReorder(item)}
                            className="px-3.5 py-1.5 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-m4m-bg text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Buy Again</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information / Service Note */}
                <div className="bg-m4m-card border border-m4m-border p-6 space-y-4 shadow-xs">
                  <div className="flex items-center gap-3 text-xs font-mono text-[#111111]">
                    <ShieldCheck className="w-5 h-5 text-[#111111] shrink-0" />
                    <span>
                      Complimentary Concierge Returns & Exchange Guarantee
                    </span>
                  </div>
                  <p className="text-xs text-m4m-secondary leading-relaxed font-sans">
                    All Atelier acquisitions include a 14-day luxury return
                    protocol. For alterations, concierge assistance, or order
                    status inquiries, please reference Order ID{" "}
                    <strong className="text-[#111111]">
                      {order.orderNumber}
                    </strong>
                    .
                  </p>
                </div>
              </div>

              {/* Right Column: Pricing Summary & Delivery Address (4 Cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Price Summary Card */}
                <div className="bg-m4m-card border border-m4m-border p-6 space-y-5 shadow-xs">
                  <div className="pb-3 border-b border-m4m-border flex items-center justify-between">
                    <h3 className="font-serif text-lg uppercase tracking-wider text-[#111111]">
                      Payment Summary
                    </h3>
                    <span className="text-[10px] font-mono text-m4m-accent uppercase tracking-widest">
                      CALCULATION
                    </span>
                  </div>

                  <div className="space-y-3 text-xs font-mono">
                    <div className="flex justify-between items-center text-m4m-secondary">
                      <span>Items Subtotal</span>
                      <span className="text-[#111111]">
                        ₹{(order.subtotal || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {order.discountAmount > 0 && (
                      <div className="flex justify-between items-center text-emerald-800">
                        <span>Promotional Discount</span>
                        <span>
                          -₹{order.discountAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-m4m-secondary">
                      <span>Express Courier Shipping</span>
                      <span className="text-[#111111]">
                        {order.shippingPrice === 0
                          ? "COMPLIMENTARY"
                          : `₹${order.shippingPrice}`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-m4m-secondary">
                      <span>GST & Import Duties</span>
                      <span className="text-[#111111]">
                        {order.taxPrice === 0
                          ? "INCLUDED"
                          : `₹${order.taxPrice}`}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-m4m-border flex justify-between items-center text-sm font-semibold text-[#111111]">
                      <span>Total Amount</span>
                      <span>
                        ₹{(order.totalPrice || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-m4m-border text-[11px] font-mono text-m4m-secondary space-y-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-[#111111]" />
                      <span>
                        Payment Method:{" "}
                        <strong className="text-[#111111]">
                          {order.paymentMethod?.toUpperCase()}
                        </strong>
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-800">
                      Payment Status: {order.paymentStatus?.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Delivery Address Card */}
                <div className="bg-m4m-card border border-m4m-border p-6 space-y-4 shadow-xs">
                  <div className="pb-3 border-b border-m4m-border flex items-center justify-between">
                    <h3 className="font-serif text-lg uppercase tracking-wider text-[#111111]">
                      Delivery Address
                    </h3>
                    <MapPin className="w-4 h-4 text-m4m-accent" />
                  </div>

                  {order.shippingAddress ? (
                    <div className="text-xs text-[#444444] font-sans leading-relaxed space-y-1">
                      <p className="font-medium text-[#111111] font-serif text-base uppercase">
                        {order.shippingAddress.recipientName}
                      </p>
                      <p className="font-mono text-xs text-m4m-accent">
                        {order.shippingAddress.phone}
                      </p>
                      <p className="pt-1">{order.shippingAddress.street}</p>
                      {order.shippingAddress.apartment && (
                        <p>{order.shippingAddress.apartment}</p>
                      )}
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p className="font-mono text-[11px] text-m4m-accent uppercase tracking-wider pt-1">
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-m4m-accent font-mono">
                      No address details available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Client Account Navigation Bar */}
        <div className="mt-12 bg-m4m-card border border-m4m-border p-6 space-y-3 shadow-xs print:hidden">
          <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent mb-4">
            CLIENT ACCOUNT NAVIGATION
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2.5 p-3 hover:bg-m4m-bg border border-m4m-border text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] transition-colors"
            >
              <User className="w-4 h-4 text-m4m-accent" />
              <span>Profile</span>
            </Link>

            <Link
              to="/orders"
              className="flex items-center gap-2.5 p-3 hover:bg-m4m-bg border border-m4m-border text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] transition-colors"
            >
              <Package className="w-4 h-4 text-m4m-accent" />
              <span>Orders Archive</span>
            </Link>

            <Link
              to="/addresses"
              className="flex items-center gap-2.5 p-3 hover:bg-m4m-bg border border-m4m-border text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] transition-colors"
            >
              <MapPin className="w-4 h-4 text-m4m-accent" />
              <span>Addresses</span>
            </Link>

            <Link
              to="/wishlist"
              className="flex items-center gap-2.5 p-3 hover:bg-m4m-bg border border-m4m-border text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] transition-colors"
            >
              <Heart className="w-4 h-4 text-m4m-accent" />
              <span>Wishlist</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
