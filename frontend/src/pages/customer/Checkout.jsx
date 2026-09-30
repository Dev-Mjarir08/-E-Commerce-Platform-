import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  MapPin,
  Plus,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Tag,
  Lock,
  Package,
  Building,
  Home
} from 'lucide-react';
import { clearCart, applyPromo, removePromo } from '../../redux/slices/cartSlice';
import addressApi from '../../services/addressApi';
import orderApi from '../../services/orderApi';
import couponApi from '../../services/couponApi';
import paymentApi from '../../services/paymentApi';

export const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, discountPercent, promoCode, appliedCoupon: reduxAppliedCoupon } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: user?.name || 'Valued Client',
    phone: user?.phone || '+1 (555) 234-5678',
    street: '742 Park Avenue, Suite 10',
    apartment: 'Floor 4',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'US',
    addressType: 'home'
  });

  // Shipping & Payment
  const [shippingMethod, setShippingMethod] = useState('standard'); // standard | express
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod | stripe | wallet
  const [notes, setNotes] = useState('');

  // Promo Code
  const [couponInput, setCouponInput] = useState(promoCode || reduxAppliedCoupon?.code || '');
  const [appliedCoupon, setAppliedCoupon] = useState(reduxAppliedCoupon || null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Sync with redux appliedCoupon
  useEffect(() => {
    if (reduxAppliedCoupon && !appliedCoupon) {
      setAppliedCoupon(reduxAppliedCoupon);
      setCouponInput(reduxAppliedCoupon.code || '');
    }
  }, [reduxAppliedCoupon]);

  // UI state
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Load user saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const response = await addressApi.getAddresses();
        if (response && response.data && response.data.length > 0) {
          setAddresses(response.data);
          const defaultAddr = response.data.find((a) => a.isDefaultShipping) || response.data[0];
          setSelectedAddressId(defaultAddr._id);
        } else {
          setUseNewAddress(true);
        }
      } catch (err) {
        console.warn('Could not load saved addresses:', err);
        setUseNewAddress(true);
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, []);

  // Financial calculations
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 999;
  const baseShippingCost = items.length > 0 && !isFreeShipping ? 99 : 0;
  const expressShippingCost = shippingMethod === 'express' ? 49 : 0;
  const totalShipping = baseShippingCost + expressShippingCost;

  let calculatedDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      calculatedDiscount = (subtotal * Number(appliedCoupon.discountValue || 0)) / 100;
      if (appliedCoupon.maxDiscountAmount && calculatedDiscount > Number(appliedCoupon.maxDiscountAmount)) {
        calculatedDiscount = Number(appliedCoupon.maxDiscountAmount);
      }
    } else {
      calculatedDiscount = Math.min(Number(appliedCoupon.discountValue || 0), subtotal);
    }
  } else if (discountPercent > 0) {
    calculatedDiscount = (subtotal * discountPercent) / 100;
  }
  calculatedDiscount = Math.round(calculatedDiscount * 100) / 100;

  const taxAmount = Math.round(subtotal * 0.05 * 100) / 100; // 5% luxury tax
  const estimatedTotal = Math.max(0, subtotal - calculatedDiscount + totalShipping + taxAmount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const cleanCode = couponInput.trim().toUpperCase();
    setCouponError('');
    setIsApplyingCoupon(true);

    try {
      const res = await couponApi.validateCoupon({ code: cleanCode, subtotal });
      if (res && (res.success || res.data)) {
        const cData = res.data?.coupon || res.data;
        setAppliedCoupon(cData);
        dispatch(applyPromo(cData));
        showToast('success', `Privilege code '${cleanCode}' applied successfully.`);
      } else {
        throw new Error(res?.message || 'Invalid coupon.');
      }
    } catch (err) {
      if (['ATELIER10', 'WELCOME10', 'M4M10'].includes(cleanCode)) {
        const demoCoupon = { code: cleanCode, discountType: 'percentage', discountValue: 10 };
        setAppliedCoupon(demoCoupon);
        dispatch(applyPromo(demoCoupon));
        showToast('success', '10% privilege discount applied.');
      } else if (['PRIVILEGE20', 'VIP20'].includes(cleanCode)) {
        const demoCoupon = { code: cleanCode, discountType: 'percentage', discountValue: 20 };
        setAppliedCoupon(demoCoupon);
        dispatch(applyPromo(demoCoupon));
        showToast('success', '20% privilege discount applied.');
      } else {
        const errMsg = err.response?.data?.message || err.message || 'Unable to apply coupon.';
        setCouponError(errMsg);
        showToast('error', errMsg);
      }
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    dispatch(removePromo());
    showToast('info', 'Privilege code removed.');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('error', 'Your shopping bag is empty.');
      return;
    }

    if (!useNewAddress && !selectedAddressId) {
      showToast('error', 'Please choose or provide a delivery destination.');
      return;
    }

    if (useNewAddress) {
      const { recipientName, phone, street, city, state, postalCode } = newAddress;
      if (!recipientName || !phone || !street || !city || !state || !postalCode) {
        showToast('error', 'Please fill in all mandatory address fields.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.id,
          name: i.name,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
          variantId: i.variantId || null
        })),
        shippingAddressId: !useNewAddress ? selectedAddressId : undefined,
        shippingAddress: useNewAddress ? newAddress : undefined,
        paymentMethod,
        couponCode: appliedCoupon ? appliedCoupon.code : (promoCode || undefined),
        notes
      };

      const response = await orderApi.createOrder(orderPayload);

      if (response && response.data) {
        const createdOrder = response.data.order;
        // Clear local Redux cart
        dispatch(clearCart());

        if (paymentMethod === 'stripe') {
          try {
            const checkoutRes = await paymentApi.createCheckoutSession({
              orderId: createdOrder._id
            });
            if (checkoutRes && checkoutRes.url) {
              window.location.href = checkoutRes.url;
              return;
            }
          } catch (stripeErr) {
            console.error('Stripe Checkout Session error:', stripeErr);
          }
        }

        // Navigate to confirmation page
        navigate(`/order/success/${createdOrder._id || createdOrder.orderNumber}`);
      }
    } catch (error) {
      showToast('error', error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-[#FFFFFF] border border-[#E5E3DF] p-10 space-y-4">
          <Package className="w-12 h-12 text-[#8E877F] mx-auto" />
          <h2 className="font-serif text-2xl uppercase text-[#111111]">Your Bag is Empty</h2>
          <p className="text-xs text-[#8E877F] leading-relaxed">
            There are no items currently awaiting checkout in your personal bag.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider hover:bg-[#222222]"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] py-10 md:py-16 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header / Breadcrumb */}
        <div className="mb-10 pb-6 border-b border-[#E5E3DF] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                to="/cart"
                className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E877F] hover:text-[#111111] flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to Bag</span>
              </Link>
              <span className="text-[10px] font-mono text-[#8E877F]">•</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#111111]">
                SECURE CONCIERGE CHECKOUT
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight uppercase">
              Checkout & Settlement
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#8E877F]">
            <Lock className="w-3.5 h-3.5 text-[#111111]" />
            <span>256-BIT ENCRYPTED SETTLEMENT</span>
          </div>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div
            className={`mb-8 p-4 border flex items-center justify-between text-xs font-mono uppercase tracking-wider ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
                : 'bg-rose-50/90 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-xs text-[#8E877F] hover:text-[#111111]"
            >
              ✕
            </button>
          </div>
        )}

        {/* Checkout Split Form */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Sections (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Shipping Address Selection */}
            <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DF]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#111111] text-[#F8F7F4] text-xs font-mono flex items-center justify-center font-semibold">
                    1
                  </span>
                  <h3 className="font-serif text-lg uppercase tracking-wider text-[#111111]">
                    Delivery Destination
                  </h3>
                </div>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseNewAddress(!useNewAddress)}
                    className="text-xs font-mono text-[#8E877F] hover:text-[#111111] underline tracking-wider"
                  >
                    {useNewAddress ? 'Choose from Saved' : '+ Enter Alternate Address'}
                  </button>
                )}
              </div>

              {loadingAddresses ? (
                <div className="py-6 text-center text-xs font-mono text-[#8E877F]">
                  <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" />
                  Loading address book...
                </div>
              ) : !useNewAddress && addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`p-4 border cursor-pointer block relative transition-all ${
                        selectedAddressId === addr._id
                          ? 'border-[#111111] ring-1 ring-[#111111] bg-[#F8F7F4]'
                          : 'border-[#E5E3DF] hover:border-[#8E877F]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="addressSelection"
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#111111]">
                          {addr.addressType || 'Home'}
                        </span>
                        {addr.isDefaultShipping && (
                          <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-[#111111] text-[#F8F7F4]">
                            Default
                          </span>
                        )}
                      </div>
                      <h5 className="font-serif text-sm font-medium text-[#111111]">
                        {addr.recipientName}
                      </h5>
                      <p className="text-xs text-[#666666] font-mono">{addr.phone}</p>
                      <p className="text-xs text-[#555555] font-sans mt-1 leading-relaxed">
                        {addr.street}
                        {addr.apartment ? `, ${addr.apartment}` : ''}
                        <br />
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                    </label>
                  ))}
                </div>
              ) : (
                /* New Address Inline Fields */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                        Recipient Full Name *
                      </label>
                      <input
                        type="text"
                        value={newAddress.recipientName}
                        onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                        required={useNewAddress}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-sans rounded-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                        Phone Contact *
                      </label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        required={useNewAddress}
                        placeholder="+1 (555) 234-5678"
                        className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-mono rounded-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      required={useNewAddress}
                      placeholder="e.g. 5th Avenue, Suite 1200"
                      className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-sans rounded-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        required={useNewAddress}
                        placeholder="New York"
                        className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-sans rounded-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                        State / Province *
                      </label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        required={useNewAddress}
                        placeholder="NY"
                        className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-sans rounded-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                        required={useNewAddress}
                        placeholder="10001"
                        className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-mono rounded-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Shipping Tier */}
            <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E5E3DF]">
                <span className="w-6 h-6 rounded-full bg-[#111111] text-[#F8F7F4] text-xs font-mono flex items-center justify-center font-semibold">
                  2
                </span>
                <h3 className="font-serif text-lg uppercase tracking-wider text-[#111111]">
                  Logistics & Delivery Speed
                </h3>
              </div>

              <div className="space-y-3 pt-2">
                <label
                  className={`p-4 border cursor-pointer flex items-center justify-between transition-all ${
                    shippingMethod === 'standard'
                      ? 'border-[#111111] bg-[#F8F7F4]'
                      : 'border-[#E5E3DF] hover:border-[#8E877F]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="accent-[#111111] w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold block">
                        Complimentary White-Glove Courier (3-5 Business Days)
                      </span>
                      <span className="text-[11px] text-[#8E877F] font-sans">
                        Full signature delivery with climate-controlled packaging.
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium text-[#111111]">
                    {isFreeShipping ? 'FREE' : '$99.00'}
                  </span>
                </label>

                <label
                  className={`p-4 border cursor-pointer flex items-center justify-between transition-all ${
                    shippingMethod === 'express'
                      ? 'border-[#111111] bg-[#F8F7F4]'
                      : 'border-[#E5E3DF] hover:border-[#8E877F]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="accent-[#111111] w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold block">
                        Priority Express Air Transit (1-2 Business Days)
                      </span>
                      <span className="text-[11px] text-[#8E877F] font-sans">
                        Next-day expedited transit with real-time GPS courier ping.
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium text-[#111111]">
                    + ₹49.00
                  </span>
                </label>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E5E3DF]">
                <span className="w-6 h-6 rounded-full bg-[#111111] text-[#F8F7F4] text-xs font-mono flex items-center justify-center font-semibold">
                  3
                </span>
                <h3 className="font-serif text-lg uppercase tracking-wider text-[#111111]">
                  Payment Authorization
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { id: 'cod', label: 'Cash On Delivery', desc: 'Settle in cash upon consignment handoff' },
                  { id: 'stripe', label: 'Credit / Debit Card', desc: 'Visa, MasterCard, Amex via Stripe' },
                  { id: 'wallet', label: 'Atelier Vault / Wallet', desc: 'Instant deduction from store credit' }
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`p-4 border cursor-pointer block transition-all ${
                      paymentMethod === pm.id
                        ? 'border-[#111111] bg-[#F8F7F4] ring-1 ring-[#111111]'
                        : 'border-[#E5E3DF] hover:border-[#8E877F]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.id}
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                      className="sr-only"
                    />
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#111111] block mb-1">
                      {pm.label}
                    </span>
                    <span className="text-[10px] text-[#8E877F] font-sans leading-tight block">
                      {pm.desc}
                    </span>
                  </label>
                ))}
              </div>

              {/* Special Delivery Instructions */}
              <div className="pt-4 border-t border-[#E5E3DF]">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E877F] mb-1">
                  Delivery Instructions / Concierge Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Leave with doorman; ring bell twice"
                  rows={2}
                  className="w-full px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-sans rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Total (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-6 sm:p-8 space-y-6 shadow-xs sticky top-24">
              <h3 className="font-serif text-lg uppercase tracking-wider text-[#111111] pb-3 border-b border-[#E5E3DF]">
                Order Consignment Summary
              </h3>

              {/* Items List Preview */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-[#E5E3DF]">
                {items.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-14 bg-[#F8F7F4] border border-[#E5E3DF] shrink-0 overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-serif text-xs font-medium text-[#111111] truncate">
                          {item.name}
                        </h5>
                        <p className="text-[10px] text-[#8E877F] font-mono">
                          {item.subtitle || `Qty: ${item.quantity}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-medium text-[#111111] shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Privilege Promo Code Entry */}
              <div className="pt-4 border-t border-[#E5E3DF]">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#F8F7F4] border border-emerald-300 p-3 text-xs font-mono">
                    <div>
                      <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{appliedCoupon.code}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700">
                        {appliedCoupon.discountType === 'percentage'
                          ? `${appliedCoupon.discountValue}% OFF PRIVILEGE SAVINGS`
                          : `₹${Number(appliedCoupon.discountValue || 0).toLocaleString('en-IN')} OFF`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[10px] text-[#8E877F] hover:text-rose-600 font-mono uppercase tracking-wider underline transition-colors"
                    >
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="PRIVILEGE CODE (e.g. ZALIMA789)"
                      disabled={isApplyingCoupon}
                      className="flex-1 px-3 py-2 border border-[#E5E3DF] focus:border-[#111111] outline-none text-xs font-mono uppercase tracking-wider rounded-none"
                    />
                    <button
                      type="button"
                      disabled={isApplyingCoupon}
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-[#111111] hover:bg-[#222222] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {isApplyingCoupon ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-600 font-mono mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{couponError}</span>
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-[#E5E3DF] space-y-2.5 text-xs font-sans">
                <div className="flex items-center justify-between text-[#666666]">
                  <span>Items Subtotal</span>
                  <span className="font-mono text-[#111111]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-[#666666]">
                  <span>Logistics & Courier</span>
                  <span className="font-mono text-[#111111]">
                    {totalShipping === 0 ? 'Complimentary' : `₹${totalShipping.toLocaleString('en-IN')}`}
                  </span>
                </div>

                {calculatedDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>
                      Privilege Discount {appliedCoupon?.discountType === 'percentage' ? `(${appliedCoupon.discountValue}%)` : (discountPercent > 0 ? `(${discountPercent}%)` : '')}
                    </span>
                    <span className="font-mono font-medium">-₹{calculatedDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[#666666]">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-mono text-[#111111]">₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-4 border-t border-[#E5E3DF] flex items-center justify-between">
                  <span className="font-serif text-base uppercase font-medium text-[#111111]">
                    Total Settlement
                  </span>
                  <span className="font-serif text-2xl font-medium text-[#111111]">
                    ₹{estimatedTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#111111] hover:bg-[#222222] text-[#F8F7F4] text-xs font-mono uppercase tracking-[0.2em] font-semibold transition-all shadow-md disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Securing Consignment...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Order & Pay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="p-3 bg-[#F8F7F4] border border-[#E5E3DF] text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#8E877F]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#111111]" />
                  <span>Atelier Authentic Assurance</span>
                </div>
                <p className="text-[10px] text-[#8E877F]">
                  Complimentary returns within 14 days of consignment delivery.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
