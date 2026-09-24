import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, ExternalLink } from 'lucide-react';
import { closeCart, removeFromCart, updateQuantity, applyPromo, removePromo } from '../../redux/slices/cartSlice';

export const CartDrawer = ({ onOpenCheckout }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isOpen, promoCode, discountPercent } = useSelector((state) => state.cart);
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState('');

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Free shipping threshold (₹999 as requested in prompt)
  const freeShippingThreshold = 999;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const clean = promoInput.trim().toUpperCase();
    if (clean === 'ATELIER10' || clean === 'WELCOME10' || clean === 'VIP20') {
      dispatch(applyPromo(clean));
      setPromoMsg(`Privilege code ${clean} applied.`);
    } else {
      setPromoMsg('Invalid or expired code.');
    }
    setPromoInput('');
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#111111]/60 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(closeCart())}
      />

      {/* Drawer Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-[#F8F7F4] text-[#111111] shadow-2xl flex flex-col transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E3DF] flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#111111]" />
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] font-semibold text-[#111111]">
              YOUR BAG ({items.reduce((sum, i) => sum + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="p-1.5 text-[#666666] hover:text-[#111111] transition-colors"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator (₹999) */}
        <div className="px-6 py-3.5 bg-[#EFECE6] border-b border-[#E5E3DF]">
          <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider mb-1.5 text-[#666666]">
            <span>
              {amountToFreeShipping === 0
                ? '✓ COMPLIMENTARY EXPRESS SHIPPING UNLOCKED'
                : `ADD ₹${amountToFreeShipping.toLocaleString('en-IN')} FOR FREE SHIPPING`}
            </span>
            <span className="font-semibold text-[#111111]">{freeShippingProgress}%</span>
          </div>
          <div className="h-1 w-full bg-[#D4CEC5] overflow-hidden">
            <div
              className="h-full bg-[#111111] transition-all duration-500 ease-out"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#E5E3DF]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <ShoppingBag className="w-12 h-12 text-[#8E877F] stroke-[1] mb-4" />
              <p className="font-serif text-xl text-[#111111] mb-2">Your Bag is Empty</p>
              <p className="text-xs text-[#666666] max-w-xs mb-6 font-sans">
                Discover contemporary pieces from our independent brand collective.
              </p>
              <button
                onClick={() => dispatch(closeCart())}
                className="bg-[#111111] text-[#F8F7F4] text-[11px] font-mono uppercase tracking-[0.2em] px-6 py-3 hover:bg-[#2B2B2B] transition-colors"
              >
                DISCOVER NEW ARRIVALS
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.id}-${item.size}-${item.color}-${idx}`} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 object-cover bg-[#E5E3DF] shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-xs uppercase tracking-wider font-medium text-[#111111] leading-tight">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size, color: item.color }))}
                        className="text-[#888888] hover:text-[#111111] transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#666666] mt-1 font-mono uppercase tracking-wider">
                      {item.color} • {item.size}
                    </p>
                    <p className="text-xs font-medium text-[#111111] mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#E5E3DF] bg-[#FFFFFF]">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              size: item.size,
                              color: item.color,
                              quantity: item.quantity - 1
                            })
                          )
                        }
                        className="p-1.5 hover:bg-[#F8F7F4] text-[#666666] transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-medium text-[#111111]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              size: item.size,
                              color: item.color,
                              quantity: item.quantity + 1
                            })
                          )
                        }
                        className="p-1.5 hover:bg-[#F8F7F4] text-[#666666] transition-colors"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-mono font-semibold text-[#111111]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#E5E3DF] bg-[#FFFFFF] space-y-4">
            <div>
              {promoCode ? (
                <div className="flex items-center justify-between bg-[#EFECE6] px-3 py-2 text-xs font-mono">
                  <span className="text-[#111111] font-semibold">
                    {promoCode} (-{discountPercent}%)
                  </span>
                  <button
                    onClick={() => dispatch(removePromo())}
                    className="text-[#666666] hover:text-[#111111] text-[10px] uppercase underline"
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
                    placeholder="PROMO CODE (e.g. ATELIER10)"
                    className="flex-1 text-[11px] font-mono uppercase tracking-wider px-3 py-2 border border-[#E5E3DF] focus:outline-none focus:border-[#111111] bg-[#F8F7F4]"
                  />
                  <button
                    type="submit"
                    className="text-[10px] font-mono uppercase tracking-[0.15em] bg-[#111111] text-[#F8F7F4] px-4 py-2 hover:bg-[#2B2B2B] transition-colors"
                  >
                    APPLY
                  </button>
                </form>
              )}
              {promoMsg && <p className="text-[10px] text-[#666666] mt-1">{promoMsg}</p>}
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#666666]">
                <span>SUBTOTAL</span>
                <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-[#2e7d32]">
                  <span>PRIVILEGE SAVINGS ({discountPercent}%)</span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#666666]">
                <span>SHIPPING</span>
                <span className="font-mono">{subtotal >= freeShippingThreshold ? 'FREE' : '₹99'}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#111111] pt-2 border-t border-[#E5E3DF]">
                <span>ESTIMATED TOTAL</span>
                <span className="font-mono">
                  ₹{(finalTotal + (subtotal >= freeShippingThreshold ? 0 : 99)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  dispatch(closeCart());
                  if (onOpenCheckout) onOpenCheckout();
                  else navigate('/checkout');
                }}
                className="w-full bg-[#111111] text-[#F8F7F4] py-3.5 text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#2B2B2B] transition-all flex items-center justify-center gap-2 group shadow-sm"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  dispatch(closeCart());
                  navigate('/cart');
                }}
                className="w-full bg-[#FFFFFF] border border-[#111111] text-[#111111] py-2.5 text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#F2EFE9] transition-all flex items-center justify-center gap-1.5"
              >
                <span>VIEW FULL BAG PAGE</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#666666] uppercase font-mono tracking-wider pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#111111]" />
              <span>Free Shipping Over ₹999 • 7-Day Easy Returns</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
