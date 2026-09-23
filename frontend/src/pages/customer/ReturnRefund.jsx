import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ImagePlus,
  MapPin,
  Package,
  RotateCcw,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const FALLBACK_ORDERS = [
  {
    _id: "ord_901",
    orderNumber: "ATL-89241",
    createdAt: "2026-09-12T14:30:00Z",
    orderStatus: "shipped",
    paymentStatus: "paid",
    paymentMethod: "stripe",
    shippingAddress: {
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
        name: "Structured Double-Breasted Wool Blazer",
        image:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
        price: 8500,
        quantity: 1,
        size: "40R",
        color: "Midnight Navy",
      },
      {
        _id: "item_102",
        name: "Silk-Cotton Tapered Trousers",
        image:
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
        price: 4000,
        quantity: 1,
        size: "32",
        color: "Charcoal",
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
  {
    _id: "ord_903",
    orderNumber: "ATL-61204",
    createdAt: "2026-08-10T11:45:00Z",
    orderStatus: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "stripe",
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
        _id: "item_104",
        name: "Italian Calfskin Derby Shoes",
        image:
          "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
        price: 18000,
        quantity: 1,
        size: "42 EU",
        color: "Espresso Brown",
      },
    ],
  },
];

const REQUEST_TYPES = [
  {
    value: "return",
    label: "Return",
    description: "Send the item back for review.",
  },
  {
    value: "replacement",
    label: "Replacement",
    description: "Receive a replacement item.",
  },
  {
    value: "refund",
    label: "Refund",
    description: "Request a refund to your payment method.",
  },
];

const REASONS = [
  "Damaged product",
  "Wrong product received",
  "Product not as described",
  "Size/fit issue",
  "Missing item",
  "Quality issue",
  "Other",
];

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const getStoredOrders = () => {
  try {
    const parsed = JSON.parse(
      localStorage.getItem("atelier_customer_orders") || "[]",
    );
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getPaymentLabel = (method) => {
  if (!method) return "Original payment method";
  if (method === "cod") return "Cash on delivery";
  if (method === "stripe") return "Card / Stripe";
  return method.toUpperCase();
};

export const ReturnRefund = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [requestType, setRequestType] = useState("");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [photos, setPhotos] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!id?.trim()) {
        setLoadError(
          "A valid order reference is required to request a return.",
        );
        setLoading(false);
        return;
      }

      const foundOrder = [...getStoredOrders(), ...FALLBACK_ORDERS].find(
        (candidate) =>
          candidate._id === id ||
          candidate.orderNumber?.toLowerCase() === id.toLowerCase(),
      );

      if (!foundOrder) {
        setLoadError(
          `Order record "${id}" could not be located in your account archive.`,
        );
      } else {
        setOrder(foundOrder);
        setSelectedItemId(foundOrder.items?.[0]?._id || "");
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  useEffect(
    () => () => photos.forEach((photo) => URL.revokeObjectURL(photo.preview)),
    [photos],
  );

  const selectedItem = useMemo(
    () => order?.items?.find((item) => item._id === selectedItemId),
    [order, selectedItemId],
  );
  const isBlocked =
    ["cancelled", "returned", "refunded"].includes(order?.orderStatus) ||
    ["refunded", "returned"].includes(order?.paymentStatus) ||
    order?.returnStatus === "returned";

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith("image/"),
    );
    setPhotos((current) => [
      ...current,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
    event.target.value = "";
  };

  const removePhoto = (preview) => {
    setPhotos((current) => {
      const photo = current.find((item) => item.preview === preview);
      if (photo) URL.revokeObjectURL(photo.preview);
      return current.filter((item) => item.preview !== preview);
    });
  };

  const validate = () => {
    const errors = {};
    if (!selectedItemId)
      errors.product = "Select the product you want us to review.";
    if (!requestType) errors.requestType = "Select a request type.";
    if (!reason) errors.reason = "Select a reason for your request.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitError("");
    if (!validate() || isBlocked) return;

    setIsSubmitting(true);
    window.setTimeout(() => {
      try {
        // Submission stays local until the returns API is available.
        setSubmitted(true);
      } catch {
        setSubmitError("We could not submit your request. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }, 500);
  };

  const renderState = (content) => (
    <div className="min-h-screen bg-m4m-bg px-4 py-10 font-sans text-[#111111] sm:px-6 md:py-16 lg:px-12">
      <div className="mx-auto max-w-5xl">{content}</div>
    </div>
  );

  if (loading) {
    return renderState(
      <div className="space-y-4 border border-m4m-border bg-white p-16 text-center shadow-xs">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#111111] border-t-transparent" />
        <p className="text-xs font-mono uppercase tracking-widest text-m4m-accent">
          Loading return details...
        </p>
      </div>,
    );
  }

  if (loadError || !order) {
    return renderState(
      <div className="space-y-6 border border-m4m-border bg-white p-10 text-center shadow-xs sm:p-16">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="mx-auto max-w-md space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-rose-800">
            Request unavailable
          </span>
          <h1 className="font-serif text-2xl uppercase tracking-wider">
            Order Not Found
          </h1>
          <p className="text-xs leading-relaxed text-m4m-secondary">
            {loadError || "The requested order has no return record."}
          </p>
        </div>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 bg-[#111111] px-7 py-3 text-xs font-mono uppercase tracking-[0.2em] text-m4m-bg hover:bg-[#333333]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Return to Orders
        </Link>
      </div>,
    );
  }

  if (submitted) {
    return renderState(
      <div className="space-y-8 border border-m4m-border bg-white p-8 shadow-xs sm:p-14">
        <div className="mx-auto max-w-xl space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-800">
            Request received
          </span>
          <h1 className="font-serif text-3xl uppercase tracking-tight sm:text-4xl">
            Return Request Submitted
          </h1>
          <p className="text-sm leading-relaxed text-m4m-secondary">
            Your request is saved for frontend review. A request ID will be
            assigned when the returns service is connected.
          </p>
        </div>
        <div className="mx-auto grid max-w-xl gap-3 border-y border-m4m-border py-5 text-xs font-mono sm:grid-cols-3">
          <p>
            <span className="block text-[10px] uppercase tracking-wider text-m4m-accent">
              Order
            </span>
            {order.orderNumber || order._id}
          </p>
          <p>
            <span className="block text-[10px] uppercase tracking-wider text-m4m-accent">
              Request type
            </span>
            {requestType}
          </p>
          <p>
            <span className="block text-[10px] uppercase tracking-wider text-m4m-accent">
              Product
            </span>
            {selectedItem?.name || "Selected item"}
          </p>
        </div>
        <div className="mx-auto max-w-xl space-y-3 text-center text-sm text-m4m-secondary">
          <p className="font-medium text-[#111111]">Next steps</p>
          <p>
            Our team will review the request and contact you using the order
            details on file.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to={`/orders/${order._id || id}`}
            className="inline-flex items-center justify-center gap-2 bg-[#111111] px-6 py-3 text-xs font-mono uppercase tracking-wider text-m4m-bg hover:bg-[#333333]"
          >
            View Order
          </Link>
          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 border border-m4m-border px-6 py-3 text-xs font-mono uppercase tracking-wider hover:border-[#111111]"
          >
            Back to Orders
          </Link>
        </div>
      </div>,
    );
  }

  return (
    <div className="min-h-screen bg-m4m-bg px-4 py-10 font-sans text-[#111111] sm:px-6 md:py-16 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-5 border-b border-m4m-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 block text-[10px] font-mono uppercase tracking-[0.3em] text-m4m-accent">
              Client portal / aftercare
            </span>
            <h1 className="font-serif text-3xl uppercase tracking-tight sm:text-4xl">
              Return &amp; Refund
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
            className="inline-flex items-center gap-2 self-start border border-m4m-border px-4 py-2 text-xs font-mono uppercase tracking-wider hover:border-[#111111] hover:bg-[#111111] hover:text-m4m-bg sm:self-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Order Details
          </Link>
        </header>

        {isBlocked && (
          <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              This order is marked as {order.orderStatus || order.paymentStatus}
              . Return or refund requests are unavailable until eligibility is
              confirmed by the returns service.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <section className="border border-m4m-border bg-white p-6 shadow-xs sm:p-8">
              <div className="mb-5 flex items-center justify-between border-b border-m4m-border pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent">
                    Order information
                  </span>
                  <h2 className="mt-1 font-serif text-xl uppercase tracking-wider">
                    Select product
                  </h2>
                </div>
                <Package className="h-5 w-5 text-m4m-accent" />
              </div>
              <div className="space-y-3">
                {(order.items || []).length > 0 ? (
                  order.items.map((item, index) => {
                    const itemId = item._id || `item-${index}`;
                    const selected = selectedItemId === itemId;
                    return (
                      <label
                        key={itemId}
                        className={`flex cursor-pointer gap-4 border p-3 transition-colors ${selected ? "border-[#111111] bg-m4m-bg" : "border-m4m-border hover:border-m4m-accent"}`}
                      >
                        <input
                          type="radio"
                          name="product"
                          value={itemId}
                          checked={selected}
                          onChange={() => {
                            setSelectedItemId(itemId);
                            setFieldErrors((current) => ({
                              ...current,
                              product: "",
                            }));
                          }}
                          className="mt-2 accent-[#111111]"
                        />
                        <img
                          src={item.image}
                          alt={item.name || "Ordered product"}
                          className="h-24 w-20 shrink-0 object-cover bg-m4m-bg"
                        />
                        <span className="min-w-0 flex-1 text-xs">
                          <strong className="block font-serif text-base uppercase leading-snug">
                            {item.name || "Product information unavailable"}
                          </strong>
                          <span className="mt-1 block text-m4m-secondary">
                            Qty: {item.quantity || 1}{" "}
                            {item.size && `• Size: ${item.size}`}{" "}
                            {item.color && `• ${item.color}`}
                          </span>
                          <span className="mt-3 block font-mono font-semibold">
                            {formatCurrency(item.price)}
                          </span>
                        </span>
                        {selected && <Check className="h-4 w-4 shrink-0" />}
                      </label>
                    );
                  })
                ) : (
                  <p className="border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                    Product information is unavailable for this order.
                  </p>
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-m4m-border pt-4 text-xs font-mono text-m4m-secondary sm:grid-cols-3">
                <p>
                  <span className="block text-[10px] uppercase tracking-wider text-m4m-accent">
                    Order date
                  </span>
                  {formatDate(order.createdAt)}
                </p>
                <p>
                  <span className="block text-[10px] uppercase tracking-wider text-m4m-accent">
                    Order ID
                  </span>
                  {order.orderNumber || order._id}
                </p>
                <p>
                  <span className="block text-[10px] uppercase tracking-wider text-m4m-accent">
                    Status
                  </span>
                  {order.orderStatus || "Unavailable"}
                </p>
              </div>
              {fieldErrors.product && (
                <p className="mt-3 text-xs text-rose-700">
                  {fieldErrors.product}
                </p>
              )}
            </section>

            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="border border-m4m-border bg-white p-6 shadow-xs sm:p-8">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent">
                  Request type
                </span>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {REQUEST_TYPES.map((type) => (
                    <label
                      key={type.value}
                      className={`cursor-pointer border p-4 transition-colors ${requestType === type.value ? "border-[#111111] bg-[#111111] text-m4m-bg" : "border-m4m-border hover:border-m4m-accent"}`}
                    >
                      <input
                        type="radio"
                        name="requestType"
                        value={type.value}
                        checked={requestType === type.value}
                        onChange={() => {
                          setRequestType(type.value);
                          setFieldErrors((current) => ({
                            ...current,
                            requestType: "",
                          }));
                        }}
                        className="sr-only"
                      />
                      <RotateCcw className="mb-3 h-4 w-4" />
                      <strong className="block font-serif text-lg uppercase">
                        {type.label}
                      </strong>
                      <span
                        className={`mt-1 block text-xs leading-relaxed ${requestType === type.value ? "text-[#D7D2CA]" : "text-m4m-secondary"}`}
                      >
                        {type.description}
                      </span>
                    </label>
                  ))}
                </div>
                {fieldErrors.requestType && (
                  <p className="mt-3 text-xs text-rose-700">
                    {fieldErrors.requestType}
                  </p>
                )}
              </section>

              <section className="border border-m4m-border bg-white p-6 shadow-xs sm:p-8">
                <label
                  htmlFor="reason"
                  className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent"
                >
                  Reason for request
                </label>
                <select
                  id="reason"
                  value={reason}
                  onChange={(event) => {
                    setReason(event.target.value);
                    setFieldErrors((current) => ({ ...current, reason: "" }));
                  }}
                  className="mt-3 w-full border border-m4m-border bg-white px-3 py-3 text-sm outline-none focus:border-[#111111]"
                >
                  <option value="">Select a reason</option>
                  {REASONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {fieldErrors.reason && (
                  <p className="mt-2 text-xs text-rose-700">
                    {fieldErrors.reason}
                  </p>
                )}
                <label
                  htmlFor="details"
                  className="mt-6 block text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent"
                >
                  Additional details
                </label>
                <textarea
                  id="details"
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  rows="5"
                  placeholder="Tell us what happened..."
                  className="mt-3 w-full resize-y border border-m4m-border px-3 py-3 text-sm outline-none placeholder:text-[#AAA49D] focus:border-[#111111]"
                />
              </section>

              <section className="border border-m4m-border bg-white p-6 shadow-xs sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent">
                      Evidence
                    </span>
                    <h2 className="mt-1 font-serif text-xl uppercase tracking-wider">
                      Upload photos{" "}
                      <span className="font-sans text-xs normal-case tracking-normal text-m4m-accent">
                        (optional)
                      </span>
                    </h2>
                  </div>
                  <ImagePlus className="h-5 w-5 text-m4m-accent" />
                </div>
                <label
                  htmlFor="photos"
                  className="mt-5 flex cursor-pointer flex-col items-center justify-center border border-dashed border-[#CFC9C0] bg-m4m-bg px-4 py-8 text-center hover:border-[#111111]"
                >
                  <ImagePlus className="h-6 w-6" />
                  <span className="mt-2 text-xs font-mono uppercase tracking-wider">
                    Choose product images
                  </span>
                  <span className="mt-1 text-xs text-m4m-secondary">
                    JPG, PNG or WEBP
                  </span>
                  <input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    className="sr-only"
                  />
                </label>
                {photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {photos.map((photo) => (
                      <div
                        key={photo.preview}
                        className="group relative aspect-square"
                      >
                        <img
                          src={photo.preview}
                          alt="Selected evidence"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.preview)}
                          aria-label="Remove photo"
                          className="absolute right-1 top-1 bg-[#111111] p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {submitError && (
                <p className="border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
                  {submitError}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting || isBlocked}
                className="inline-flex w-full items-center justify-center gap-2 bg-[#111111] px-6 py-4 text-xs font-mono uppercase tracking-[0.2em] text-m4m-bg hover:bg-[#333333] disabled:cursor-not-allowed disabled:bg-[#AAA49D]"
              >
                {isSubmitting
                  ? "Submitting request..."
                  : "Submit Return Request"}
              </button>
            </form>
          </div>

          <aside className="space-y-8 lg:col-span-5">
            {requestType === "refund" && (
              <section className="border border-m4m-border bg-white p-6 shadow-xs sm:p-8">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent">
                  Refund information
                </span>
                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex justify-between border-b border-m4m-border pb-3">
                    <span className="text-m4m-secondary">Refund amount</span>
                    <strong>{formatCurrency(selectedItem?.price)}</strong>
                  </div>
                  <div>
                    <span className="block text-xs text-m4m-secondary">
                      Refund method
                    </span>
                    <strong className="mt-1 block">
                      Original payment method
                    </strong>
                  </div>
                  <div>
                    <span className="block text-xs text-m4m-secondary">
                      Original payment method
                    </span>
                    <strong className="mt-1 block">
                      {getPaymentLabel(order.paymentMethod)}
                    </strong>
                  </div>
                </div>
                <p className="mt-5 text-xs leading-relaxed text-m4m-accent">
                  Final refund eligibility and timing will be confirmed by the
                  returns service.
                </p>
              </section>
            )}
            <section className="border border-m4m-border bg-white p-6 shadow-xs sm:p-8">
              <div className="flex items-center justify-between border-b border-m4m-border pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent">
                    Collection details
                  </span>
                  <h2 className="mt-1 font-serif text-xl uppercase tracking-wider">
                    Return address
                  </h2>
                </div>
                <MapPin className="h-5 w-5 text-m4m-accent" />
              </div>
              {order.shippingAddress ? (
                <div className="space-y-1 pt-5 text-xs leading-relaxed text-[#444444]">
                  <p className="font-serif text-base uppercase text-[#111111]">
                    {order.shippingAddress.recipientName ||
                      "Customer name unavailable"}
                  </p>
                  <p className="font-mono text-xs text-m4m-accent">
                    {order.shippingAddress.phone || "Phone number unavailable"}
                  </p>
                  <p className="pt-2">
                    {order.shippingAddress.street || "Address unavailable"}
                  </p>
                  {order.shippingAddress.apartment && (
                    <p>{order.shippingAddress.apartment}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="pt-1 font-mono text-[11px] uppercase tracking-wider text-m4m-accent">
                    {order.shippingAddress.country || "Country unavailable"}
                  </p>
                </div>
              ) : (
                <p className="pt-5 text-xs text-m4m-accent">
                  Pickup address information is unavailable.
                </p>
              )}
              <p className="mt-5 border-t border-m4m-border pt-4 text-xs leading-relaxed text-m4m-secondary">
                Pickup instructions and address changes will be available when
                the returns service is connected.
              </p>
            </section>
            <section className="border border-m4m-border bg-m4m-stone p-6 text-xs leading-relaxed text-[#55504A] shadow-xs">
              <strong className="font-mono uppercase tracking-wider text-[#111111]">
                Review note
              </strong>
              <p className="mt-2">
                Your request is reviewed against the order record. Submitting
                this form does not create a backend return until that service is
                enabled.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefund;
