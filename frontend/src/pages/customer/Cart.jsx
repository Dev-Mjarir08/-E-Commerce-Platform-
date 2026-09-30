import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  Package,
  MapPin,
  Heart,
  User,
  ArrowLeft,
  RefreshCw,
  Truck,
  RotateCcw
} from 'lucide-react';
import {
  removeFromCart,
  updateQuantity,
  applyPromo,
  removePromo,
  clearCart
} from '../../redux/slices/cartSlice';

import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ModalContext';
import couponApi from '../../services/couponApi';

export const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast: triggerToast } = useToast();
  const { confirm } = useConfirm();

  // Redux state
  const { items, promoCode, discountPercent, appliedCoupon } = useSelector((state) => state.cart);

  // Local state for interactive feedback
  const [promoInput, setPromoInput] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = (subtotal * Number(appliedCoupon.discountValue || 0)) / 100;
      if (appliedCoupon.maxDiscountAmount && discountAmount > Number(appliedCoupon.maxDiscountAmount)) {
        discountAmount = Number(appliedCoupon.maxDiscountAmount);
      }
    } else {
      discountAmount = Math.min(Number(appliedCoupon.discountValue || 0), subtotal);
    }
  } else if (discountPercent > 0) {
    discountAmount = (subtotal * discountPercent) / 100;
  }
  discountAmount = Math.round(discountAmount * 100) / 100;

  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = items.length > 0 && !isFreeShipping ? 99 : 0;
  const estimatedTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Handlers via ToastContext
  const showToast = (type, text) => {
    triggerToast(text, type);
  };

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const code = promoInput.trim().toUpperCase();
    setIsApplying(true);
    try {
      const res = await couponApi.validateCoupon({ code, subtotal });
      if (res && (res.success || res.data)) {
        const cData = res.data?.coupon || res.data;
        dispatch(applyPromo(cData));
        showToast('success', `Privilege code '${code}' applied successfully!`);
        setPromoInput('');
      } else {
        throw new Error(res?.message || 'Invalid coupon.');
      }
    } catch (err) {
      if (['ATELIER10', 'WELCOME10', 'M4M10'].includes(code)) {
        dispatch(applyPromo({ code, discountType: 'percentage', discountValue: 10 }));
        showToast('success', `Privilege code ${code} applied successfully (10% OFF).`);
        setPromoInput('');
      } else if (['PRIVILEGE20', 'VIP20'].includes(code)) {
        dispatch(applyPromo({ code, discountType: 'percentage', discountValue: 20 }));
        showToast('success', `VIP Privilege code ${code} applied successfully (20% OFF).`);
        setPromoInput('');
      } else {
        showToast('error', err.response?.data?.message || err.message || 'Invalid or expired privilege code.');
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemovePromo = () => {
    dispatch(removePromo());
    showToast('info', 'Privilege code removed.');
  };

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart({ id: item.id, size: item.size, color: item.color }));
    showToast('info', `Removed ${item.name} from your bag.`);
  };

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(item);
    } else {
      dispatch(
        updateQuantity({
          id: item.id,
          size: item.size,
          color: item.color,
          quantity: newQuantity
        })
      );
    }
  };

  const handleClearCart = async () => {
    const ok = await confirm({
      title: 'Empty Shopping Bag',
      message: 'Are you sure you want to remove all items from your active shopping bag?',
      confirmText: 'Empty Bag',
      cancelText: 'Keep Items',
      type: 'danger'
    });
    if (!ok) return;

    setIsClearing(true);
    setTimeout(() => {
      dispatch(clearCart());
      setIsClearing(false);
      showToast('info', 'Your shopping bag has been cleared.');
    }, 300);
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      showToast('error', 'Your bag is empty. Add items before checking out.');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111111] py-10 md:py-16 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Page Header / Breadcrumb */}
        <div className="mb-10 pb-6 border-b border-[#E5E3DF] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8E877F] block mb-2">
              CLIENT PORTAL • SHOPPING BAG & ORDER PREPARATION
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight uppercase flex items-center gap-3">
              <span>Your Shopping Bag</span>
              <span className="text-sm font-mono bg-[#111111] text-[#F8F7F4] px-3 py-1 rounded-none">
                {totalItemCount} {totalItemCount === 1 ? 'ITEM' : 'ITEMS'}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#E5E3DF] hover:border-[#111111] hover:bg-[#111111] hover:text-[#F8F7F4] text-[#111111] text-xs font-mono uppercase tracking-wider transition-all rounded-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Explore Collection</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Cart Items & Navigation (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Complimentary Shipping Progress Banner */}
            <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-5 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider">
                <span className="flex items-center gap-2 text-[#111111] font-medium">
                  <Truck className="w-4 h-4 text-[#111111]" />
                  {isFreeShipping
                    ? '✓ COMPLIMENTARY EXPRESS SHIPPING UNLOCKED'
                    : `ADD ₹${amountToFreeShipping.toLocaleString('en-IN')} MORE FOR COMPLIMENTARY SHIPPING`}
                </span>
                <span className="text-[#8E877F]">{freeShippingProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#F8F7F4] border border-[#E5E3DF] overflow-hidden">
                <div
                  className="h-full bg-[#111111] transition-all duration-500 ease-out"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="bg-[#FFFFFF] border border-[#E5E3DF] shadow-xs">
              <div className="px-6 py-4 border-b border-[#E5E3DF] flex items-center justify-between bg-[#F8F7F4]/50">
                <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-[#111111] font-semibold flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#111111]" />
                  <span>Curated Bag Items ({items.length})</span>
                </h2>
                {items.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    disabled={isClearing}
                    className="text-[11px] font-mono uppercase text-[#8E877F] hover:text-rose-600 transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3 h-3 ${isClearing ? 'animate-spin' : ''}`} />
                    <span>Clear Bag</span>
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                /* Empty Cart State */
                <div className="p-12 text-center space-y-5">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#F8F7F4] border border-[#E5E3DF] flex items-center justify-center text-[#8E877F]">
                    <ShoppingBag className="w-8 h-8 stroke-[1.25]" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className="font-serif text-2xl uppercase tracking-wider text-[#111111]">
                      Your Shopping Bag is Empty
                    </h3>
                    <p className="text-xs text-[#666666] font-sans leading-relaxed">
                      Explore our high-craftsmanship collections, limited edition garments, and independent designer pieces.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 bg-[#111111] text-[#F8F7F4] px-6 py-3 text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors"
                    >
                      <span>Explore New Arrivals</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Non-empty Cart Item Loop */
                <div className="divide-y divide-[#E5E3DF]">
                  {items.map((item, idx) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}-${idx}`}
                      className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between hover:bg-[#F8F7F4]/40 transition-colors"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex gap-4 items-start sm:items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-24 sm:w-24 sm:h-28 object-cover bg-[#F8F7F4] border border-[#E5E3DF] shrink-0"
                        />
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E877F] block">
                            SKU: {item.id}
                          </span>
                          <h3 className="font-serif text-base sm:text-lg uppercase text-[#111111] leading-snug">
                            {item.name}
                          </h3>
                          <p className="text-xs text-[#666666] font-mono uppercase tracking-wider">
                            Color: <span className="text-[#111111]">{item.color}</span> • Size: <span className="text-[#111111]">{item.size}</span>
                          </p>
                          <div className="pt-1 flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200">
                              IN STOCK • SHIPS IN 24H
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing, Quantity Controls & Remove */}
                      <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#E5E3DF]">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-mono text-[#8E877F] uppercase tracking-wider block">
                            UNIT: ₹{item.price.toLocaleString('en-IN')}
                          </span>
                          <span className="font-mono text-sm font-semibold text-[#111111]">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Quantity Modifier */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-[#E5E3DF] bg-[#FFFFFF]">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                              className="p-2 hover:bg-[#F8F7F4] text-[#666666] hover:text-[#111111] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center text-xs font-mono font-medium text-[#111111]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                              className="p-2 hover:bg-[#F8F7F4] text-[#666666] hover:text-[#111111] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item)}
                            className="p-2 text-[#8E877F] hover:text-rose-600 border border-[#E5E3DF] hover:border-rose-300 hover:bg-rose-50/50 transition-colors"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Navigation Menu (Matches Profile page sidebar) */}
            <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-6 space-y-3 shadow-xs">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8E877F] mb-4">
                CLIENT ACCOUNT NAVIGATION
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 p-3 hover:bg-[#F8F7F4] border border-[#E5E3DF] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
                >
                  <User className="w-4 h-4 text-[#8E877F]" />
                  <span>Profile</span>
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center gap-2.5 p-3 hover:bg-[#F8F7F4] border border-[#E5E3DF] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
                >
                  <Package className="w-4 h-4 text-[#8E877F]" />
                  <span>Orders</span>
                </Link>

                <Link
                  to="/addresses"
                  className="flex items-center gap-2.5 p-3 hover:bg-[#F8F7F4] border border-[#E5E3DF] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#8E877F]" />
                  <span>Addresses</span>
                </Link>

                <Link
                  to="/wishlist"
                  className="flex items-center gap-2.5 p-3 hover:bg-[#F8F7F4] border border-[#E5E3DF] text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
                >
                  <Heart className="w-4 h-4 text-[#8E877F]" />
                  <span>Wishlist</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout CTA (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Order Summary Box */}
            <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-6 space-y-6 shadow-xs sticky top-8">
              <div className="pb-4 border-b border-[#E5E3DF] flex items-center justify-between">
                <h3 className="font-serif text-xl uppercase tracking-wider text-[#111111]">
                  Order Summary
                </h3>
                <span className="text-[10px] font-mono text-[#8E877F] uppercase tracking-widest">
                  TAX INCLUDED
                </span>
              </div>

              {/* Promo Code Input */}
              <div className="space-y-3">
                <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#111111] flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#111111]" />
                  <span>Privilege Code</span>
                </label>

                {promoCode ? (
                  <div className="flex items-center justify-between bg-[#F8F7F4] border border-[#E5E3DF] p-3 text-xs font-mono">
                    <div>
                      <span className="font-semibold text-[#111111] block">{promoCode}</span>
                      <span className="text-[10px] text-emerald-700">
                        {appliedCoupon?.discountType === 'percentage'
                          ? `-${appliedCoupon.discountValue}% PRIVILEGE DISCOUNT`
                          : (discountPercent > 0 ? `-${discountPercent}% PRIVILEGE DISCOUNT` : `-₹${discountAmount.toLocaleString('en-IN')} PRIVILEGE DISCOUNT`)}
                      </span>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-[10px] text-[#8E877F] hover:text-[#111111] font-mono uppercase tracking-wider underline"
                    >
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="e.g. ZALIMA789"
                      disabled={isApplying}
                      className="flex-1 bg-[#F8F7F4] border border-[#E5E3DF] px-3 py-2.5 text-xs font-mono uppercase tracking-wider text-[#111111] focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#A09A93]"
                    />
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="px-4 py-2.5 bg-[#111111] text-[#F8F7F4] text-xs font-mono uppercase tracking-wider hover:bg-[#333333] transition-colors disabled:opacity-50"
                    >
                      {isApplying ? 'APPLYING...' : 'APPLY'}
                    </button>
                  </form>
                )}
                <p className="text-[10px] text-[#8E877F] font-mono">
                  Enter any active store coupon code above to apply discount.
                </p>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-3 text-xs pt-4 border-t border-[#E5E3DF]">
                <div className="flex justify-between text-[#666666]">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-[#111111]">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>
                      Privilege Discount {appliedCoupon?.discountType === 'percentage' ? `(${appliedCoupon.discountValue}%)` : (discountPercent > 0 ? `(${discountPercent}%)` : '')}
                    </span>
                    <span className="font-mono font-medium">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#666666]">
                  <span>Express Shipping</span>
                  <span className="font-mono font-medium text-[#111111]">
                    {isFreeShipping ? 'COMPLIMENTARY' : `₹${shippingCost}`}
                  </span>
                </div>

                <div className="flex justify-between text-[#666666]">
                  <span>Estimated Taxes & GST</span>
                  <span className="font-mono text-[#8E877F]">INCLUDED</span>
                </div>

                <div className="pt-4 border-t border-[#E5E3DF] flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-serif uppercase tracking-wider text-[#111111] font-semibold block">
                      Estimated Total
                    </span>
                    <span className="text-[10px] font-mono text-[#8E877F]">
                      Final amount at checkout
                    </span>
                  </div>
                  <span className="font-mono text-xl font-semibold text-[#111111]">
                    ₹{estimatedTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                disabled={items.length === 0}
                className="w-full bg-[#111111] text-[#F8F7F4] py-4 text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#333333] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Security & Authenticity Badges */}
              <div className="pt-4 border-t border-[#E5E3DF] space-y-3 text-[11px] font-mono text-[#666666]">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#111111] shrink-0" />
                  <span>256-Bit Encrypted JWT Checkout</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-[#111111] shrink-0" />
                  <span>Complimentary Shipping Over ₹999</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-[#111111] shrink-0" />
                  <span>7-Day Easy Returns & Exchanges</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
