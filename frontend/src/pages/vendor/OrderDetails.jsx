import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle2,
  MapPin,
  ArrowLeft,
  Calendar,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  MessageSquare,
  Copy,
  Check,
  Menu,
  X,
} from "lucide-react";

import VendorSidebar from "./VendorSlideBar";

export default function OrderDetails({ orderId, onBack }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 0));

        setOrder({
          id: orderId || "ORD-89234-X2",
          date: "September 18, 2026",
          status: "In Transit",
          estimatedDelivery: "Sep 21, 2026",
          trackingNumber: "TRK-9918234712",
          carrier: "FedEx Express",

          items: [
            {
              id: 1,
              name: "Wireless Noise-Canceling Headphones",
              variant: "Matte Black",
              price: 199.99,
              quantity: 1,
              image:
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200",
            },
            {
              id: 2,
              name: "Ergonomic Desktop Stand",
              variant: "Aluminum",
              price: 49.5,
              quantity: 2,
              image:
                "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=200",
            },
          ],

          shippingAddress: {
            name: "Alex Johnson",
            street: "123 Tech Lane, Suite 400",
            city: "San Francisco",
            state: "CA",
            zip: "94107",
            country: "United States",
          },

          paymentMethod: {
            type: "Visa",
            last4: "4242",
          },

          summary: {
            subtotal: 298.99,
            shipping: 15.0,
            tax: 24.66,
            total: 338.65,
          },
        });
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const copyTracking = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const steps = ["Placed", "Processing", "In Transit", "Delivered"];

  const getCurrentStepIndex = (status) => {
    return steps.indexOf(status);
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-800">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>

        <p className="mt-3 text-sm font-medium text-slate-500">
          Fetching order details...
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // ORDER NOT FOUND
  // --------------------------------------------------

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Package className="h-6 w-6" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            Order Not Found
          </h3>

          <p className="mt-1 mb-6 text-sm text-slate-500">
            We couldn't locate details for this order ID.
          </p>

          {onBack && (
            <button
              onClick={onBack}
              className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentStep = getCurrentStepIndex(order.status);

  return (
    <div className="relative flex min-h-screen bg-slate-50/50 text-slate-800">

      {/* ==================================================
          MOBILE OVERLAY
      ================================================== */}

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ==================================================
          MOBILE SIDEBAR
      ================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Sidebar Header */}
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
          <span className="text-sm font-semibold text-slate-900">
            Vendor Menu
          </span>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Sidebar Content */}
        <div className="h-[calc(100vh-56px)] overflow-y-auto">
          <VendorSidebar />
        </div>
      </aside>

      {/* ==================================================
          DESKTOP SIDEBAR
      ================================================== */}

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white md:block">
        <div className="h-full ">
          <VendorSidebar />
        </div>
      </aside>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

        {/* ==================================================
            TOP NAVIGATION
        ================================================== */}

        <div className="mb-6 flex items-center justify-between gap-3">

          {/* Left Side */}
          <div className="flex items-center gap-2">

            {/* MOBILE MENU BUTTON */}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 md:hidden"
              aria-label="Open vendor menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* BACK BUTTON */}

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4 sm:mr-2" />

                <span className="hidden sm:inline">
                  Back to Orders
                </span>
              </button>
            )}
          </div>

          {/* Right Side */}

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="hidden items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 sm:inline-flex"
            >
              <MessageSquare className="mr-1.5 h-3.5 w-3.5 text-slate-500" />

              Need Help?
            </button>
          </div>
        </div>

        {/* ==================================================
            ORDER HEADER
        ================================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">

          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center">

            {/* Order Information */}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Order #{order.id}
                </h1>

                <span className="inline-flex items-center rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>

                  {order.status}
                </span>
              </div>

              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar className="h-4 w-4 text-slate-400" />

                Placed on {order.date}
              </p>
            </div>

            {/* Tracking */}

            {order.trackingNumber && (
              <div className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3.5 sm:min-w-[260px]">

                <div className="min-w-0">
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    {order.carrier}
                  </span>

                  <span className="block truncate font-mono text-sm font-semibold text-slate-800">
                    {order.trackingNumber}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={copyTracking}
                  className="shrink-0 rounded-lg p-2 text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                  title="Copy tracking number"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ==================================================
              SHIPMENT PROGRESS
          ================================================== */}

          <div className="pt-6">

            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Shipment Progress
              </span>

              <span className="w-fit rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                Est. Delivery: {order.estimatedDelivery}
              </span>
            </div>

            <div className="relative mx-auto flex w-full max-w-3xl items-center justify-between px-2 sm:px-4">

              {/* Background Line */}

              <div className="absolute left-5 right-5 top-[18px] z-0 h-1 bg-slate-100 sm:left-7 sm:right-7"></div>

              {/* Progress Line */}

              <div
                className="absolute left-5 top-[18px] z-0 h-1 bg-emerald-500 transition-all duration-500 sm:left-7"
                style={{
                  width: `${(currentStep / (steps.length - 1)) * 85}%`,
                }}
              ></div>

              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div
                    key={step}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                        isCompleted
                          ? "bg-emerald-600 text-white ring-4 ring-emerald-50"
                          : "border-2 border-slate-200 bg-white text-slate-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        idx + 1
                      )}
                    </div>

                    <span
                      className={`mt-2 text-[10px] font-medium sm:text-xs ${
                        isCurrent
                          ? "font-semibold text-emerald-600"
                          : isCompleted
                          ? "text-slate-800"
                          : "text-slate-400"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==================================================
            CONTENT GRID
        ================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ==================================================
              MAIN ITEMS COLUMN
          ================================================== */}

          <div className="space-y-6 lg:col-span-2">

            {/* ITEMS ORDERED */}

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">

              <h2 className="mb-4 flex flex-col gap-1 text-base font-semibold text-slate-900 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Items Ordered (
                  {order.items.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                  )}
                  )
                </span>

                <span className="text-xs font-normal text-slate-500">
                  Includes taxes & discounts
                </span>
              </h2>

              <div className="divide-y divide-slate-100">

                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >

                    {/* Product */}

                    <div className="flex min-w-0 items-center gap-4">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 shrink-0 rounded-xl border border-slate-100 bg-slate-50 object-cover"
                      />

                      <div className="min-w-0">

                        <h3 className="text-sm font-semibold text-slate-900 transition-colors hover:text-emerald-600">
                          {item.name}
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {item.variant}
                        </p>

                        <p className="mt-2 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Price */}

                    <div className="flex items-center justify-between border-t border-slate-50 pt-2 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">

                      <div>
                        <p className="text-base font-bold text-slate-900">
                          $
                          {(
                            item.price * item.quantity
                          ).toFixed(2)}
                        </p>

                        <p className="text-xs text-slate-400">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>

                      <button
                        type="button"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700"
                      >
                        <RotateCcw className="h-3 w-3" />

                        Buy again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ==================================================
                GUARANTEES
            ================================================== */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* Delivery */}

              <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">

                <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                  <Truck className="h-5 w-5" />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-emerald-900">
                    Standard Delivery
                  </h4>

                  <p className="mt-0.5 text-xs text-emerald-700/80">
                    Carrier: {order.carrier}
                  </p>

                  <p className="mt-2 text-xs font-medium text-emerald-800">
                    Est: {order.estimatedDelivery}
                  </p>
                </div>
              </div>

              {/* Protection */}

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-slate-100/60 p-4">

                <div className="rounded-xl bg-white p-2 text-slate-600 shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Buyer Protection
                  </h4>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Full refund if items are damaged or lost during delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              SUMMARY SIDEBAR
          ================================================== */}

          <div className="space-y-6">

            {/* PAYMENT SUMMARY */}

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">

              <h2 className="mb-4 text-base font-semibold text-slate-900">
                Payment Summary
              </h2>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>

                  <span className="font-medium text-slate-900">
                    ${order.summary.subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>

                  <span className="font-medium text-slate-900">
                    ${order.summary.shipping.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax</span>

                  <span className="font-medium text-slate-900">
                    ${order.summary.tax.toFixed(2)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">

                  <span className="font-bold text-slate-900">
                    Total Paid
                  </span>

                  <span className="text-xl font-extrabold text-emerald-600">
                    ${order.summary.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Method */}

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-6 w-8 items-center justify-center rounded border border-slate-200 bg-slate-100 text-[10px] font-bold text-slate-700">
                    {order.paymentMethod.type.toUpperCase()}
                  </div>

                  <span className="text-xs font-medium text-slate-600">
                    Ending in •••• {order.paymentMethod.last4}
                  </span>
                </div>

                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  PAID
                </span>
              </div>
            </div>

            {/* ==================================================
                SHIPPING ADDRESS
            ================================================== */}

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">

              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
                <MapPin className="h-4 w-4 text-emerald-600" />

                Shipping Address
              </h2>

              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-sm leading-relaxed text-slate-600">

                <p className="font-semibold text-slate-900">
                  {order.shippingAddress.name}
                </p>

                <p className="mt-1">
                  {order.shippingAddress.street}
                </p>

                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zip}
                </p>

                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* INVOICE */}

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50"
            >
              <ExternalLink className="h-4 w-4 text-slate-400" />

              Download Invoice (PDF)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 