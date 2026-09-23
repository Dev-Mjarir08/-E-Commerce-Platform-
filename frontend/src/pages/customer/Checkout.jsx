import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Edit3,
  Lock,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/slices/cartSlice";

// Sample initial default saved addresses if local storage is unpopulated
const DEFAULT_SAVED_ADDRESSES = [
  {
    _id: "addr_101",
    recipientName: "Jarir Multani",
    phone: "+91 45678 91230",
    street: "Gujrat",
    apartment: "Suite 4B",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India",
    addressType: "home",
    isDefaultShipping: true,
    isDefaultBilling: true,
  },
  {
    _id: "addr_102",
    recipientName: "Ayaan Ali (Atelier Studio)",
    phone: "+91 13245 67890",
    street: "Hafiz Babanagar Bandlaguda",
    apartment: "Floor 3",
    city: "Hyderabad",
    state: "Telangana",
    postalCode: "400051",
    country: "India",
    addressType: "work",
    isDefaultShipping: false,
    isDefaultBilling: false,
  },
];

export const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { items, discountPercent } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const userId = user?.id || user?._id || "guest_client";
  const addressStorageKey = `atelier_addresses_${userId}`;

  // Saved addresses state
  const [savedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem(addressStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse saved addresses:", e);
    }
    return DEFAULT_SAVED_ADDRESSES;
  });

  // Selected shipping address
  const [selectedAddress, setSelectedAddress] = useState(() => {
    const defaultAddr =
      savedAddresses.find((a) => a.isDefaultShipping) || savedAddresses[0];
    return defaultAddr || null;
  });

  // Modals & UI States
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // 'upi' | 'card' | 'cod'
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form states for Card payment UI
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  // Form states for UPI ID UI
  const [upiId, setUpiId] = useState("");

  // Toast feedback helper
  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Price calculations
  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items],
  );
  const discountAmount = useMemo(
    () => (subtotal * discountPercent) / 100,
    [subtotal, discountPercent],
  );
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = items.length > 0 && !isFreeShipping ? 99 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Handle Card input change
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Place Order
  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      showToast(
        "error",
        "Please select or add a delivery address before placing order.",
      );
      return;
    }

    if (items.length === 0) {
      showToast("error", "Your shopping bag is empty.");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardDetails.cardNumber.trim() || !cardDetails.cardName.trim()) {
        showToast("error", "Please fill in card details.");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        showToast("error", "Please enter your UPI ID.");
        return;
      }
    }

    setIsPlacingOrder(true);

    // Simulate order placement processing
    setTimeout(() => {
      const newOrderNum = `ATL-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrderId = `ord_${Date.now()}`;

      const newOrder = {
        _id: newOrderId,
        orderNumber: newOrderNum,
        createdAt: new Date().toISOString(),
        orderStatus: "placed",
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        paymentMethod: paymentMethod,
        trackingNumber: `TRK-${Math.floor(1000 + Math.random() * 9000)}-IN`,
        carrier: "BlueDart Express",
        estimatedDelivery: "3-5 Business Days",
        subtotal: subtotal,
        taxPrice: 0,
        shippingPrice: shippingFee,
        discountAmount: discountAmount,
        totalPrice: grandTotal,
        shippingAddress: {
          recipientName: selectedAddress.recipientName,
          phone: selectedAddress.phone,
          street: selectedAddress.street,
          apartment: selectedAddress.apartment || "",
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country || "India",
          addressType: selectedAddress.addressType || "home",
        },
        billingAddress: {
          recipientName: selectedAddress.recipientName,
          phone: selectedAddress.phone,
          street: selectedAddress.street,
          apartment: selectedAddress.apartment || "",
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country || "India",
        },
        items: items.map((item, idx) => ({
          _id: `item_${Date.now()}_${idx}`,
          product: item.id || item._id || `prod_${idx}`,
          name: item.name,
          image: item.image,
          sku: `ATL-SKU-${idx + 100}`,
          price: item.price,
          quantity: item.quantity,
          size: item.size || "Standard",
          color: item.color || "Classic",
          status: "placed",
        })),
      };

      // Save to localStorage order history
      try {
        const stored = localStorage.getItem("atelier_customer_orders");
        let orderList = [];
        if (stored) {
          orderList = JSON.parse(stored);
        }
        orderList = [newOrder, ...orderList];
        localStorage.setItem(
          "atelier_customer_orders",
          JSON.stringify(orderList),
        );
      } catch (err) {
        console.warn("Failed to save order to localStorage:", err);
      }

      // Clear Redux Cart
      dispatch(clearCart());
      setIsPlacingOrder(false);

      // Navigate to order details confirmation view
      navigate(`/orders/${newOrderId}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-m4m-bg text-[#111111] py-10 md:py-16 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Checkout Header & Progress Stepper */}
        <div className="mb-10 pb-6 border-b border-m4m-border space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-m4m-accent block mb-1">
                SECURE ACQUISITION PROTOCOL
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight uppercase flex items-center gap-3">
                <span>Checkout & Order Verification</span>
              </h1>
            </div>

            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-m4m-secondary hover:text-[#111111] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Shopping Bag</span>
            </Link>
          </div>

          {/* Stepper Progress Bar */}
          <div className="pt-2">
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className="p-2 border border-emerald-300 bg-emerald-50/60 text-emerald-900 flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span className="truncate">1. BAG</span>
              </div>
              <div className="p-2 border border-[#111111] bg-[#111111] text-m4m-bg flex items-center justify-center gap-1.5 font-semibold">
                <span>2. CHECKOUT</span>
              </div>
              <div className="p-2 border border-m4m-border bg-m4m-bg text-m4m-accent flex items-center justify-center gap-1.5">
                <span>3. PAYMENT</span>
              </div>
              <div className="p-2 border border-m4m-border bg-m4m-bg text-m4m-accent flex items-center justify-center gap-1.5">
                <span>4. CONFIRM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div
            className={`mb-8 p-4 border flex items-center justify-between text-xs font-mono uppercase tracking-wider transition-all ${
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

        {/* Empty Cart Notice */}
        {items.length === 0 ? (
          <div className="bg-m4m-card border border-m4m-border p-12 text-center space-y-6 shadow-xs">
            <div className="w-20 h-20 mx-auto rounded-full bg-m4m-bg border border-m4m-border flex items-center justify-center text-m4m-accent">
              <ShoppingBag className="w-10 h-10 stroke-[1.25] text-m4m-accent" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-m4m-accent">
                EMPTY SHOPPING BAG
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-[#111111]">
                Your Bag is Empty
              </h2>
              <p className="text-xs text-m4m-secondary font-sans leading-relaxed">
                Add luxury acquisitions to your shopping bag before proceeding
                to checkout.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-[#111111] text-m4m-bg px-7 py-3 text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Main 2-Column Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Address Selection & Payment Method (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Section 1: Shipping Address Selection */}
              <div className="bg-m4m-card border border-m4m-border p-6 space-y-5 shadow-xs">
                <div className="pb-4 border-b border-m4m-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#111111] text-m4m-bg text-xs font-mono flex items-center justify-center font-bold">
                      1
                    </span>
                    <h2 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                      Shipping Address
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#111111] underline hover:text-m4m-accent transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Change Address</span>
                  </button>
                </div>

                {selectedAddress ? (
                  <div className="p-4 bg-m4m-bg border border-m4m-border space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-base uppercase text-[#111111] font-semibold">
                        {selectedAddress.recipientName}
                      </span>
                      <span className="px-2 py-0.5 bg-[#111111] text-m4m-bg text-[9px] font-mono uppercase tracking-wider">
                        {(selectedAddress.addressType || "home").toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-m4m-accent">
                      {selectedAddress.phone}
                    </p>

                    <div className="text-xs text-[#444444] font-sans leading-relaxed pt-1">
                      <p>{selectedAddress.street}</p>
                      {selectedAddress.apartment && (
                        <p>{selectedAddress.apartment}</p>
                      )}
                      <p>
                        {selectedAddress.city}, {selectedAddress.state}{" "}
                        {selectedAddress.postalCode}
                      </p>
                      <p className="font-mono text-[11px] text-m4m-accent uppercase tracking-wider pt-0.5">
                        {selectedAddress.country || "India"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border border-dashed border-m4m-border text-center space-y-3">
                    <p className="text-xs text-m4m-accent font-mono">
                      No delivery address selected.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(true)}
                      className="px-4 py-2 bg-[#111111] text-m4m-bg text-xs font-mono uppercase tracking-wider"
                    >
                      Select Delivery Address
                    </button>
                  </div>
                )}
              </div>

              {/* Section 2: Payment Method Options */}
              <div className="bg-m4m-card border border-m4m-border p-6 space-y-6 shadow-xs">
                <div className="pb-4 border-b border-m4m-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#111111] text-m4m-bg text-xs font-mono flex items-center justify-center font-bold">
                      2
                    </span>
                    <h2 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                      Select Payment Method
                    </h2>
                  </div>
                  <Lock className="w-4 h-4 text-m4m-accent" />
                </div>

                <div className="space-y-3">
                  {/* Option 1: Credit / Debit Card */}
                  <label
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 border block cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "bg-m4m-bg border-[#111111] ring-1 ring-[#111111]"
                        : "border-m4m-border hover:border-m4m-accent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="w-4 h-4 accent-[#111111]"
                        />
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#111111]" />
                          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#111111]">
                            Credit / Debit Card
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-m4m-accent">
                        VISA / MC / AMEX
                      </span>
                    </div>

                    {paymentMethod === "card" && (
                      <div
                        className="mt-4 pt-4 border-t border-m4m-border space-y-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-[#111111] block">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={handleCardInputChange}
                            placeholder="4532 •••• •••• 8921"
                            className="w-full bg-m4m-card border border-m4m-border px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-[#111111] block">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              name="cardName"
                              value={cardDetails.cardName}
                              onChange={handleCardInputChange}
                              placeholder="Name on card"
                              className="w-full bg-m4m-card border border-m4m-border px-3 py-2 text-xs font-sans text-[#111111] focus:outline-none focus:border-[#111111]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono uppercase tracking-wider text-[#111111] block">
                                Expiry
                              </label>
                              <input
                                type="text"
                                name="expiry"
                                value={cardDetails.expiry}
                                onChange={handleCardInputChange}
                                placeholder="MM/YY"
                                className="w-full bg-m4m-card border border-m4m-border px-2.5 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono uppercase tracking-wider text-[#111111] block">
                                CVV
                              </label>
                              <input
                                type="password"
                                name="cvv"
                                value={cardDetails.cvv}
                                onChange={handleCardInputChange}
                                placeholder="•••"
                                maxLength={4}
                                className="w-full bg-m4m-card border border-m4m-border px-2.5 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Option 2: UPI / QR Code */}
                  <label
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-4 border block cursor-pointer transition-all ${
                      paymentMethod === "upi"
                        ? "bg-m4m-bg border-[#111111] ring-1 ring-[#111111]"
                        : "border-m4m-border hover:border-m4m-accent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "upi"}
                          onChange={() => setPaymentMethod("upi")}
                          className="w-4 h-4 accent-[#111111]"
                        />
                        <div className="flex items-center gap-2">
                          <QrCode className="w-4 h-4 text-[#111111]" />
                          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#111111]">
                            UPI Instant Payment (GPay / PhonePe / Paytm)
                          </span>
                        </div>
                      </div>
                    </div>

                    {paymentMethod === "upi" && (
                      <div
                        className="mt-4 pt-4 border-t border-m4m-border space-y-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <label className="text-[10px] font-mono uppercase tracking-wider text-[#111111] block">
                          Enter VPA / UPI ID
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@okaxis or 9876543210@paytm"
                          className="w-full bg-m4m-card border border-m4m-border px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                        />
                      </div>
                    )}
                  </label>

                  {/* Option 3: Cash on Delivery (COD) */}
                  <label
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 border block cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "bg-m4m-bg border-[#111111] ring-1 ring-[#111111]"
                        : "border-m4m-border hover:border-m4m-accent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="w-4 h-4 accent-[#111111]"
                        />
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-[#111111]" />
                          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#111111]">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                      </div>
                    </div>

                    {paymentMethod === "cod" && (
                      <p className="mt-3 text-[11px] font-mono text-m4m-secondary pt-2 border-t border-m4m-border">
                        Pay in cash upon physical delivery. Delivery agent
                        verification will be conducted.
                      </p>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Price Calculation (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-m4m-card border border-m4m-border p-6 space-y-6 shadow-xs sticky top-8">
                <div className="pb-4 border-b border-m4m-border flex items-center justify-between">
                  <h3 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                    Acquisition Manifest
                  </h3>
                  <span className="text-xs font-mono bg-[#111111] text-m4m-bg px-2.5 py-0.5">
                    {items.length} {items.length === 1 ? "ITEM" : "ITEMS"}
                  </span>
                </div>

                {/* Items Mini List */}
                <div className="max-h-60 overflow-y-auto divide-y divide-m4m-border pr-1">
                  {items.map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      className="py-3 flex items-center gap-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-16 object-cover bg-m4m-bg border border-m4m-border shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-xs uppercase text-[#111111] truncate">
                          {item.name}
                        </h4>
                        <p className="text-[10px] font-mono text-m4m-accent">
                          Qty: {item.quantity} • {item.size} / {item.color}
                        </p>
                        <span className="text-xs font-mono font-semibold text-[#111111] block mt-0.5">
                          ₹
                          {(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Details Breakdown */}
                <div className="pt-4 border-t border-m4m-border space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center text-m4m-secondary">
                    <span>Items Subtotal</span>
                    <span className="text-[#111111]">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-800">
                      <span>Privilege Discount ({discountPercent}%)</span>
                      <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-m4m-secondary">
                    <span>Express Delivery</span>
                    <span className="text-[#111111]">
                      {shippingFee === 0 ? "COMPLIMENTARY" : `₹${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-m4m-secondary">
                    <span>GST & Import Taxes</span>
                    <span className="text-[#111111]">INCLUDED</span>
                  </div>

                  <div className="pt-3 border-t border-m4m-border flex justify-between items-center text-base font-semibold text-[#111111]">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Place Order CTA Button */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || items.length === 0}
                  className="w-full bg-[#111111] text-m4m-bg py-4 text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#333333] transition-all flex items-center justify-center gap-2 group shadow-xs disabled:bg-gray-400"
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        PLACE ORDER (₹{grandTotal.toLocaleString("en-IN")})
                      </span>
                    </>
                  )}
                </button>

                {/* Security Info */}
                <div className="pt-2 text-[10px] font-mono text-m4m-accent flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#111111]" />
                  <span>256-Bit SSL Encrypted Concierge Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address Selection Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/60 backdrop-blur-xs">
          <div className="bg-m4m-card border border-m4m-border max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute top-4 right-4 text-m4m-accent hover:text-[#111111] p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3 border-b border-m4m-border">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-m4m-accent block">
                ADDRESS BOOK
              </span>
              <h3 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                Select Delivery Location
              </h3>
            </div>

            <div className="space-y-3">
              {savedAddresses.map((addr) => {
                const isSelected = selectedAddress?._id === addr._id;
                return (
                  <div
                    key={addr._id}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setIsAddressModalOpen(false);
                      showToast(
                        "info",
                        `Delivery address set to ${addr.recipientName}.`,
                      );
                    }}
                    className={`p-4 border cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#111111] bg-m4m-bg ring-1 ring-[#111111]"
                        : "border-m4m-border hover:border-m4m-accent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif text-sm uppercase text-[#111111] font-semibold">
                        {addr.recipientName}
                      </span>
                      {isSelected && (
                        <span className="px-2 py-0.5 bg-[#111111] text-m4m-bg text-[9px] font-mono uppercase">
                          SELECTED
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-m4m-accent">
                      {addr.phone}
                    </p>
                    <p className="text-xs text-[#444444] font-sans mt-1">
                      {addr.street}, {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-m4m-border flex justify-between items-center">
              <Link
                to="/addresses"
                className="text-xs font-mono text-[#111111] underline hover:text-m4m-accent"
              >
                + Manage Address Book
              </Link>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="px-4 py-2 border border-m4m-border text-xs font-mono uppercase text-m4m-secondary"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
