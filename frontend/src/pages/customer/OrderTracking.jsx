import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronRight,
  Clock3,
  Headphones,
  MapPin,
  Package,
  RotateCcw,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import orderApi from "../../services/orderApi";

const FALLBACK_ORDERS = [
  {
    _id: "ord_901",
    orderNumber: "ATL-89241",
    createdAt: "2026-09-12T14:30:00Z",
    orderStatus: "shipped",
    totalPrice: 11250,
    carrier: "BlueDart Express",
    estimatedDelivery: "16 Sep 2026",
    shippingAddress: {
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
        _id: "item_101",
        name: "Structured Double-Breasted Wool Blazer",
        image:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
        price: 8500,
        quantity: 1,
        size: "40R",
        color: "Midnight Navy",
      },
    ],
  },
  {
    _id: "ord_902",
    orderNumber: "ATL-77309",
    createdAt: "2026-08-28T09:15:00Z",
    orderStatus: "delivered",
    deliveredAt: "2026-08-31T16:20:00Z",
    totalPrice: 6599,
    carrier: "DHL Express",
    estimatedDelivery: "31 Aug 2026",
    shippingAddress: {
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
        name: "Merino Wool Ribbed Turtleneck Sweater",
        image:
          "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
        price: 6500,
        quantity: 1,
        size: "L",
        color: "Oatmeal Milk",
      },
    ],
  },
];

const TRACKING_STEPS = [
  {
    id: "placed",
    title: "Order Placed",
    description: "Your order has been placed successfully.",
  },
  {
    id: "confirmed",
    title: "Order Confirmed",
    description: "The seller has confirmed your order.",
  },
  {
    id: "packed",
    title: "Packed",
    description: "Your package has been packed.",
  },
  {
    id: "shipped",
    title: "Shipped",
    description: "Your package is on the way.",
  },
  {
    id: "out_for_delivery",
    title: "Out for Delivery",
    description: "Your package is out for delivery.",
  },
  {
    id: "delivered",
    title: "Delivered",
    description: "Your order has been delivered.",
  },
];

const STATUS_INDEX = {
  placed: 0,
  confirmed: 1,
  processing: 2,
  packed: 2,
  shipped: 3,
  out_for_delivery: 4,
  delivered: 5,
};

const formatDateTime = (dateValue) => {
  if (!dateValue) return "Not yet recorded";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getOrderDate = (order, stepIndex, activeIndex) => {
  if (order.trackingEvents?.[stepIndex]?.date) {
    return formatDateTime(order.trackingEvents[stepIndex].date);
  }

  if (stepIndex === 0) return formatDateTime(order.createdAt);
  if (stepIndex === activeIndex && order.deliveredAt)
    return formatDateTime(order.deliveredAt);

  return stepIndex < activeIndex ? "Completed" : "Not yet recorded";
};

const getStoredOrders = () => {
  try {
    const stored = localStorage.getItem("atelier_customer_orders");
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(id?.trim()));
  const [error, setError] = useState(() => (!id?.trim() ? "A valid order reference is required to open tracking." : null));

  useEffect(() => {
    if (!id?.trim()) return;
    let isMounted = true;

    orderApi.getTracking(id)
      .then((res) => {
        if (!isMounted) return;
        const liveOrder = res?.data || res?.order || res;
        if (liveOrder && (liveOrder._id || liveOrder.orderNumber)) {
          setOrder(liveOrder);
        } else {
          const orders = [...getStoredOrders(), ...FALLBACK_ORDERS];
          const foundOrder = orders.find(
            (candidate) =>
              candidate._id === id ||
              candidate.orderNumber?.toLowerCase() === id.toLowerCase()
          );
          if (foundOrder) {
            setOrder(foundOrder);
          } else {
            setError(`Order record "${id}" could not be located in your account archive.`);
          }
        }
      })
      .catch(() => {
        if (!isMounted) return;
        const orders = [...getStoredOrders(), ...FALLBACK_ORDERS];
        const foundOrder = orders.find(
          (candidate) =>
            candidate._id === id ||
            candidate.orderNumber?.toLowerCase() === id.toLowerCase()
        );
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError(`Order record "${id}" could not be located in your account archive.`);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const activeIndex = useMemo(
    () => STATUS_INDEX[order?.orderStatus] ?? 0,
    [order],
  );
  const primaryItem = order?.items?.[0];
  const address = order?.shippingAddress;
  const canRequestReturn = order?.orderStatus === "delivered";
  const supportSubject = encodeURIComponent(
    `Order support: ${order?.orderNumber || id}`,
  );

  const renderState = (content) => (
    <div className="min-h-screen bg-m4m-bg text-[#111111] px-4 py-10 font-sans sm:px-6 md:py-16 lg:px-12">
      <div className="mx-auto max-w-5xl">{content}</div>
    </div>
  );

  if (loading) {
    return renderState(
      <div className="space-y-4 border border-m4m-border bg-white p-16 text-center shadow-xs">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#111111] border-t-transparent" />
        <p className="text-xs font-mono uppercase tracking-widest text-m4m-accent">
          Loading order tracking...
        </p>
      </div>,
    );
  }

  if (error || !order) {
    return renderState(
      <div className="space-y-6 border border-m4m-border bg-white p-10 text-center shadow-xs sm:p-16">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="mx-auto max-w-md space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-rose-800">
            Tracking unavailable
          </span>
          <h1 className="font-serif text-2xl uppercase tracking-wider">
            Order Not Found
          </h1>
          <p className="text-xs leading-relaxed text-m4m-secondary">
            {error || "The requested order does not have a tracking record."}
          </p>
        </div>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 bg-[#111111] px-7 py-3 text-xs font-mono uppercase tracking-[0.2em] text-m4m-bg transition-colors hover:bg-[#333333]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Return to Orders
        </Link>
      </div>,
    );
  }

  return (
    <div className="min-h-screen bg-m4m-bg px-4 py-10 font-sans text-[#111111] sm:px-6 md:py-16 lg:px-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-5 border-b border-m4m-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 block text-[10px] font-mono uppercase tracking-[0.3em] text-m4m-accent">
              Client portal / delivery progress
            </span>
            <h1 className="font-serif text-3xl uppercase tracking-tight sm:text-4xl">
              Track Order
            </h1>
            <p className="mt-2 text-xs font-mono text-m4m-secondary">
              Order ID:{" "}
              <span className="font-semibold text-[#111111]">
                {order.orderNumber || order._id}
              </span>
            </p>
          </div>
          <Link
            to={`/orders/${order._id || id}`}
            className="inline-flex items-center gap-2 self-start border border-m4m-border px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors hover:border-[#111111] hover:bg-[#111111] hover:text-m4m-bg sm:self-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Order Details
          </Link>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="border border-m4m-border bg-white p-5 shadow-xs sm:p-7">
            <div className="mb-6 flex items-center justify-between border-b border-m4m-border pb-4">
              <h2 className="font-serif text-xl uppercase tracking-wider">
                Order Summary
              </h2>
              <Package className="h-5 w-5 text-m4m-accent" />
            </div>
            {primaryItem ? (
              <div className="flex gap-4 border-b border-m4m-border pb-6">
                <img
                  src={primaryItem.image}
                  alt={primaryItem.name || "Ordered product"}
                  className="h-28 w-24 shrink-0 border border-m4m-border bg-m4m-bg object-cover sm:h-32 sm:w-28"
                />
                <div className="min-w-0 space-y-2">
                  <h3 className="font-serif text-lg uppercase leading-snug">
                    {primaryItem.name || "Product information unavailable"}
                  </h3>
                  <p className="text-xs font-mono text-m4m-secondary">
                    Quantity: {primaryItem.quantity || 1}
                  </p>
                  {primaryItem.size || primaryItem.color ? (
                    <p className="text-xs font-mono text-m4m-secondary">
                      {[primaryItem.size, primaryItem.color]
                        .filter(Boolean)
                        .join(" / ")}
                    </p>
                  ) : null}
                  <p className="pt-1 text-sm font-semibold font-mono">
                    {formatCurrency(order.totalPrice)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="border-b border-m4m-border pb-6 text-xs text-m4m-secondary">
                Product information is unavailable for this order.
              </p>
            )}
            <div className="grid gap-5 pt-6 sm:grid-cols-2">
              <div>
                <span className="mb-1 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-m4m-accent">
                  <MapPin className="h-3.5 w-3.5" /> Delivery address
                </span>
                <p className="text-xs leading-relaxed text-[#444444]">
                  {address?.recipientName || "Address unavailable"}
                  <br />
                  {address?.street || ""}
                  {address?.street && <br />}
                  {[address?.city, address?.state, address?.postalCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <div>
                <span className="mb-1 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-m4m-accent">
                  <Clock3 className="h-3.5 w-3.5" /> Expected delivery
                </span>
                <p className="text-xs leading-relaxed text-[#444444]">
                  {order.estimatedDelivery || "Date to be confirmed"}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-m4m-border bg-white p-5 shadow-xs sm:p-7">
            <div className="mb-6 flex items-center justify-between border-b border-m4m-border pb-4">
              <h2 className="font-serif text-xl uppercase tracking-wider">
                Delivery Information
              </h2>
              <Truck className="h-5 w-5 text-m4m-accent" />
            </div>
            <dl className="space-y-4 text-xs font-mono">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-m4m-accent">Expected delivery</dt>
                <dd className="text-right font-semibold">
                  {order.estimatedDelivery || "To be confirmed"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-m4m-accent">Shipping method</dt>
                <dd className="text-right font-semibold">
                  {order.carrier || "Standard delivery"}
                </dd>
              </div>
              {order.trackingNumber && (
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-m4m-accent">Tracking number</dt>
                  <dd className="text-right font-semibold">
                    {order.trackingNumber}
                  </dd>
                </div>
              )}
            </dl>
            <div className="mt-6 border-t border-m4m-border pt-5 text-xs leading-relaxed text-m4m-secondary">
              {address?.street
                ? `${address.street}, ${address.city || ""}, ${address.state || ""} ${address.postalCode || ""}`
                : "Delivery address unavailable."}
            </div>
          </div>
        </section>

        <section className="border border-m4m-border bg-white p-5 shadow-xs sm:p-8">
          <div className="mb-8 flex items-center justify-between border-b border-m4m-border pb-4">
            <div>
              <span className="mb-1 block text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent">
                Shipment progress
              </span>
              <h2 className="font-serif text-xl uppercase tracking-wider">
                Tracking Timeline
              </h2>
            </div>
            <span className="text-xs font-mono uppercase text-m4m-secondary">
              {TRACKING_STEPS[activeIndex].title}
            </span>
          </div>
          <div className="space-y-0">
            {TRACKING_STEPS.map((step, index) => {
              const isComplete = index < activeIndex;
              const isCurrent = index === activeIndex;
              return (
                <div
                  key={step.id}
                  className="relative flex gap-4 pb-7 last:pb-0 sm:gap-6"
                >
                  {index < TRACKING_STEPS.length - 1 && (
                    <span
                      className={`absolute left-3.75 top-8 h-full w-px ${index < activeIndex ? "bg-emerald-500" : "bg-m4m-border"}`}
                    />
                  )}
                  <span
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${isComplete ? "border-emerald-600 bg-emerald-600 text-white" : isCurrent ? "border-[#111111] bg-[#111111] text-white" : "border-[#D4CEC5] bg-m4m-bg text-m4m-accent"}`}
                  >
                    {isComplete ? (
                      <Check className="h-4 w-4" />
                    ) : isCurrent ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-[#D4CEC5]" />
                    )}
                  </span>
                  <div
                    className={`min-w-0 flex-1 border-b border-m4m-border pb-5 last:border-0 ${isCurrent ? "text-[#111111]" : ""}`}
                  >
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:gap-4">
                      <h3
                        className={`font-serif text-lg uppercase ${isCurrent ? "font-semibold" : ""}`}
                      >
                        {step.title}
                      </h3>
                      <time className="text-[10px] font-mono uppercase tracking-wider text-m4m-accent">
                        {getOrderDate(order, index, activeIndex)}
                      </time>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-m4m-secondary">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            to={`/orders/${order._id || id}`}
            className="inline-flex items-center justify-center gap-2 bg-[#111111] px-5 py-3 text-xs font-mono uppercase tracking-wider text-m4m-bg transition-colors hover:bg-[#333333]"
          >
            <span>View Order Details</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href={`mailto:support@atelier.example?subject=${supportSubject}`}
            className="inline-flex items-center justify-center gap-2 border border-[#111111] px-5 py-3 text-xs font-mono uppercase tracking-wider transition-colors hover:bg-[#111111] hover:text-m4m-bg"
          >
            <Headphones className="h-3.5 w-3.5" /> Contact Support
          </a>
          {canRequestReturn && (
            <a
              href={`mailto:support@atelier.example?subject=${encodeURIComponent(`Return or refund request: ${order.orderNumber || id}`)}`}
              className="inline-flex items-center justify-center gap-2 border border-m4m-border px-5 py-3 text-xs font-mono uppercase tracking-wider text-m4m-secondary transition-colors hover:border-[#111111] hover:text-[#111111]"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Return / Refund
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
