import {
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  MapPin,
  Package,
  Printer,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

// Default clean UI sample order data fallback if no live context or localStorage exists
const DEFAULT_SAMPLE_ORDER = {
  _id: "ord_sample_999",
  orderNumber: "ATL-98420",
  createdAt: new Date().toISOString(),
  orderStatus: "placed",
  paymentStatus: "paid",
  paymentMethod: "card",
  trackingNumber: "TRK-9821-4401-IN",
  carrier: "BlueDart Express",
  estimatedDelivery: "3 - 5 Business Days",
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
  items: [
    {
      _id: "item_sample_1",
      product: "prod_1",
      name: "Structured Double-Breasted Wool Blazer",
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
      sku: "ATL-WBL-001",
      price: 8500,
      quantity: 1,
      size: "40R",
      color: "Midnight Navy",
    },
    {
      _id: "item_sample_2",
      product: "prod_2",
      name: "Silk-Cotton Tapered Trousers",
      image:
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
      sku: "ATL-TR-002",
      price: 4000,
      quantity: 1,
      size: "32",
      color: "Charcoal",
    },
  ],
};

export const OrderSuccess = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [copiedId, setCopiedId] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  const order = useMemo(() => {
    // 1. Try to load from location state passed from Checkout flow
    if (location.state?.order) {
      return location.state.order;
    }

    // 2. Try to load from search params (e.g. ?orderId=... or ?orderNumber=...)
    const paramOrderId =
      searchParams.get("orderId") ||
      searchParams.get("id") ||
      searchParams.get("orderNumber");

    try {
      const stored = localStorage.getItem("atelier_customer_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (paramOrderId) {
            const matched = parsed.find(
              (o) =>
                o._id === paramOrderId ||
                o.orderNumber?.toLowerCase() === paramOrderId.toLowerCase(),
            );
            if (matched) return matched;
          }
          // If no specific parameter matched, pick the latest order from localStorage
          return parsed[0];
        }
      }
    } catch (err) {
      console.warn("Failed to load order from localStorage:", err);
    }

    // 3. Fallback to clean UI sample structure
    return DEFAULT_SAMPLE_ORDER;
  }, [location.state, searchParams]);

  // Copy helpers
  const handleCopyOrderId = () => {
    if (!order?.orderNumber) return;
    navigator.clipboard.writeText(order.orderNumber);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 3000);
  };

  const handleCopyTracking = () => {
    if (!order?.trackingNumber) return;
    navigator.clipboard.writeText(order.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return "Today";
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (!order) return null;

  const orderIdToView = order._id || order.orderNumber || "ord_901";

  return (
    <div className="min-h-screen bg-m4m-bg text-[#111111] py-10 md:py-16 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#111111] selection:text-m4m-bg print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Top Progress / Stepper Header */}
        <div className="border-b border-m4m-border pb-6 print:hidden">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
            <div className="p-2 border border-emerald-300 bg-emerald-50/60 text-emerald-900 flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              <span className="truncate">1. BAG</span>
            </div>
            <div className="p-2 border border-emerald-300 bg-emerald-50/60 text-emerald-900 flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              <span className="truncate">2. CHECKOUT</span>
            </div>
            <div className="p-2 border border-emerald-300 bg-emerald-50/60 text-emerald-900 flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              <span className="truncate">3. PAYMENT</span>
            </div>
            <div className="p-2 border border-[#111111] bg-[#111111] text-m4m-bg flex items-center justify-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>4. CONFIRMED</span>
            </div>
          </div>
        </div>

        {/* 1. SUCCESS STATE HERO HEADER */}
        <div className="bg-m4m-card border border-m4m-border p-8 sm:p-12 text-center relative overflow-hidden shadow-xs">
          {/* Subtle decorative top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600" />

          {/* Prominent Check Icon Badge */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600 stroke-[1.75]" />
            </div>
          </div>

          {/* Headings & Confirmation Message */}
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-700 font-semibold block">
              ACQUISITION CONFIRMED • ATELIER PRIVILEGE
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight uppercase">
              Order Placed Successfully!
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] font-sans leading-relaxed">
              Thank you for your order. We have received your request and our
              atelier team is currently preparing your bespoke items for express
              dispatch.
            </p>
          </div>

          {/* Order Reference Pill */}
          <div className="mt-6 pt-6 border-t border-m4m-border flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <div className="bg-m4m-bg border border-m4m-border px-4 py-2 flex items-center gap-2">
              <span className="text-m4m-accent uppercase tracking-wider text-[10px]">
                Order Ref:
              </span>
              <strong className="text-[#111111] font-semibold">
                {order.orderNumber}
              </strong>
              <button
                type="button"
                onClick={handleCopyOrderId}
                title="Copy Order ID"
                className="ml-1 text-m4m-accent hover:text-[#111111] transition-colors p-0.5"
              >
                {copiedId ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="bg-m4m-bg border border-m4m-border px-4 py-2 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-m4m-accent" />
              <span className="text-m4m-accent uppercase tracking-wider text-[10px]">
                Date:
              </span>
              <span className="text-[#111111]">
                {formatDate(order.createdAt)}
              </span>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 border border-m4m-border hover:border-[#111111] text-[#111111] bg-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors print:hidden"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>

        {/* 2. ORDER INFORMATION & ESTIMATED DELIVERY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Box A: Shipping Details */}
          <div className="bg-m4m-card border border-m4m-border p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-m4m-accent pb-2 border-b border-m4m-border">
              <MapPin className="w-4 h-4 text-[#111111]" />
              <span>Delivery Address</span>
            </div>
            {order.shippingAddress ? (
              <div className="text-xs text-[#444444] font-sans leading-relaxed space-y-1">
                <p className="font-serif text-sm uppercase text-[#111111] font-semibold">
                  {order.shippingAddress.recipientName}
                </p>
                <p className="font-mono text-[11px] text-m4m-accent">
                  {order.shippingAddress.phone}
                </p>
                <p className="pt-0.5">{order.shippingAddress.street}</p>
                {order.shippingAddress.apartment && (
                  <p>{order.shippingAddress.apartment}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="font-mono text-[10px] text-m4m-accent uppercase tracking-wider pt-0.5">
                  {order.shippingAddress.country || "India"}
                </p>
              </div>
            ) : (
              <p className="text-xs font-mono text-m4m-accent">
                Address details unavailable
              </p>
            )}
          </div>

          {/* Box B: Payment & Status */}
          <div className="bg-m4m-card border border-m4m-border p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-m4m-accent pb-2 border-b border-m4m-border">
              <CreditCard className="w-4 h-4 text-[#111111]" />
              <span>Payment Details</span>
            </div>
            <div className="text-xs space-y-2 font-mono">
              <div>
                <span className="text-m4m-accent block text-[10px] uppercase">
                  Method:
                </span>
                <span className="font-semibold text-[#111111] uppercase">
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : order.paymentMethod === "upi"
                      ? "UPI Payment"
                      : "Credit / Debit Card"}
                </span>
              </div>
              <div>
                <span className="text-m4m-accent block text-[10px] uppercase">
                  Payment Status:
                </span>
                <span
                  className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                    order.paymentStatus === "paid"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                      : "bg-amber-50 text-amber-800 border border-amber-300"
                  }`}
                >
                  {order.paymentStatus?.toUpperCase() || "CONFIRMED"}
                </span>
              </div>
              <p className="text-[10px] text-m4m-secondary pt-1">
                A digital confirmation copy has been sent to your account email.
              </p>
            </div>
          </div>

          {/* Box C: Dispatch & Estimated Delivery */}
          <div className="bg-m4m-card border border-m4m-border p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-m4m-accent pb-2 border-b border-m4m-border">
              <Truck className="w-4 h-4 text-[#111111]" />
              <span>Fulfillment & Dispatch</span>
            </div>
            <div className="text-xs space-y-2 font-mono">
              <div>
                <span className="text-m4m-accent block text-[10px] uppercase">
                  Carrier:
                </span>
                <span className="font-semibold text-[#111111]">
                  {order.carrier || "BlueDart Express"}
                </span>
              </div>
              <div>
                <span className="text-m4m-accent block text-[10px] uppercase">
                  Est. Delivery:
                </span>
                <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 inline-block text-[11px]">
                  {order.estimatedDelivery || "3 - 5 Business Days"}
                </span>
              </div>
              {order.trackingNumber && (
                <div className="pt-1 flex items-center justify-between border-t border-m4m-border">
                  <span className="text-[10px] text-m4m-accent">
                    Tracking #:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyTracking}
                    className="text-[10px] text-[#111111] underline hover:text-m4m-accent flex items-center gap-1"
                  >
                    {copiedTracking ? "Copied" : order.trackingNumber}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. ORDER ITEM SUMMARY */}
        <div className="bg-m4m-card border border-m4m-border p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="pb-4 border-b border-m4m-border flex items-center justify-between">
            <h2 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
              Acquisition Summary ({order.items?.length || 0})
            </h2>
            <span className="text-[10px] font-mono text-m4m-accent uppercase tracking-widest">
              MANIFEST
            </span>
          </div>

          {/* Product Items Table List */}
          <div className="divide-y divide-m4m-border">
            {order.items &&
              order.items.map((item, idx) => (
                <div
                  key={item._id || item.product || idx}
                  className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover bg-m4m-bg border border-m4m-border shrink-0"
                    />
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-m4m-accent uppercase tracking-widest block">
                        SKU: {item.sku || `ATL-SKU-${idx + 101}`}
                      </span>
                      <h3 className="font-serif text-sm sm:text-base uppercase text-[#111111] font-semibold">
                        {item.name}
                      </h3>
                      <p className="text-xs text-m4m-secondary font-mono uppercase tracking-wider">
                        Qty:{" "}
                        <span className="text-[#111111] font-semibold">
                          {item.quantity}
                        </span>{" "}
                        • Size:{" "}
                        <span className="text-[#111111]">
                          {item.size || "Standard"}
                        </span>{" "}
                        • Color:{" "}
                        <span className="text-[#111111]">
                          {item.color || "Classic"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto text-left sm:text-right font-mono border-t sm:border-t-0 border-m4m-border pt-2 sm:pt-0">
                    <span className="text-xs text-m4m-accent block sm:hidden text-[10px] uppercase">
                      Subtotal:
                    </span>
                    <span className="text-sm font-semibold text-[#111111]">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-m4m-accent block">
                      (₹{item.price.toLocaleString("en-IN")} each)
                    </span>
                  </div>
                </div>
              ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="pt-4 border-t border-m4m-border space-y-2 text-xs font-mono max-w-sm ml-auto">
            <div className="flex justify-between items-center text-m4m-secondary">
              <span>Items Subtotal</span>
              <span className="text-[#111111]">
                ₹{(order.subtotal || 0).toLocaleString("en-IN")}
              </span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between items-center text-emerald-800">
                <span>Privilege Discount</span>
                <span>-₹{order.discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-m4m-secondary">
              <span>Express Delivery</span>
              <span className="text-[#111111]">
                {order.shippingPrice === 0
                  ? "COMPLIMENTARY"
                  : `₹${order.shippingPrice}`}
              </span>
            </div>

            <div className="flex justify-between items-center text-m4m-secondary">
              <span>GST & Taxes</span>
              <span className="text-[#111111]">INCLUDED</span>
            </div>

            <div className="pt-3 border-t border-m4m-border flex justify-between items-center text-base font-semibold text-[#111111]">
              <span>Final Total</span>
              <span>₹{(order.totalPrice || 0).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* 4. ACTION BUTTONS & NEXT STEPS */}
        <div className="bg-m4m-card border border-m4m-border p-6 sm:p-8 space-y-6 shadow-xs print:hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left space-y-1">
              <h3 className="font-serif text-lg uppercase tracking-wider text-[#111111]">
                What would you like to do next?
              </h3>
              <p className="text-xs text-m4m-secondary">
                You can review real-time dispatch updates in your account orders
                archive.
              </p>
            </div>

            {/* Clear Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                to={`/orders/${orderIdToView}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] text-m4m-bg px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors shadow-xs"
              >
                <Package className="w-4 h-4" />
                <span>View Order Details</span>
              </Link>

              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#111111] text-[#111111] bg-white px-7 py-3.5 text-xs font-mono uppercase tracking-[0.2em] hover:bg-m4m-bg transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-m4m-border flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-m4m-accent">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#111111]" />
              <span>14-Day Complimentary Luxury Returns Protocol</span>
            </div>
            <Link to="/orders" className="underline hover:text-[#111111]">
              View All Orders →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
