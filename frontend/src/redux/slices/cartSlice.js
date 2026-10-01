import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('atelier_cart_items');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('atelier_cart_items', JSON.stringify(items));
  } catch (err) {
    console.warn('Could not save cart to storage:', err);
  }
};

const initialState = {
  items: loadCartFromStorage(),
  isOpen: false,
  currency: 'INR',
  promoCode: null,
  discountPercent: 0,
  appliedCoupon: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, size, color, quantity = 1, openDrawer = true } = action.payload;
      const prodId = product.id || product._id || product.slug;
      const prodName = product.name || product.title || 'Curated Atelier Piece';
      const prodPrice = Number(product.price ?? product.basePrice ?? product.discountPrice ?? 0);
      const selectedSize = size || (product.sizes && product.sizes[0]) || 'Standard';
      const selectedColor =
        (typeof color === 'string' ? color : color?.name) ||
        (product.colors && product.colors[0]?.name) ||
        'Classic';
      const selectedImage =
        (color && color.image) ||
        (product.images && (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url)) ||
        product.image ||
        '';

      const existingIndex = state.items.findIndex(
        (item) => item.id === prodId && item.size === selectedSize && item.color === selectedColor
      );

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({
          id: prodId,
          name: prodName,
          subtitle: `${selectedColor} / ${selectedSize}`,
          price: prodPrice,
          image: selectedImage,
          size: selectedSize,
          color: selectedColor,
          quantity: quantity
        });
      }
      if (openDrawer !== false && action.payload?.openDrawer !== false) {
        state.isOpen = true;
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const { id, size, color } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.size === size && item.color === color)
      );
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, size, color, quantity } = action.payload;
      const item = state.items.find(
        (i) => i.id === id && i.size === size && i.color === color
      );
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (i) => !(i.id === id && i.size === size && i.color === color)
          );
        } else {
          item.quantity = quantity;
        }
      }
      saveCartToStorage(state.items);
    },
    toggleCart: (state, action) => {
      if (typeof action.payload === 'boolean') {
        state.isOpen = action.payload;
      } else {
        state.isOpen = !state.isOpen;
      }
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    applyPromo: (state, action) => {
      if (!action.payload) {
        state.promoCode = null;
        state.discountPercent = 0;
        state.appliedCoupon = null;
        return;
      }
      if (typeof action.payload === 'object') {
        const c = action.payload.coupon || action.payload;
        state.appliedCoupon = c;
        state.promoCode = (c.code || '').trim().toUpperCase();
        state.discountPercent = c.discountType === 'percentage' ? Number(c.discountValue || 0) : 0;
        return;
      }
      const code = String(action.payload).trim().toUpperCase();
      if (code === 'M4M10' || code === 'WELCOME10' || code === 'ATELIER10' || code === 'OMNIKART10' || code === 'OMNI10') {
        state.promoCode = code;
        state.discountPercent = 10;
        state.appliedCoupon = { code, discountType: 'percentage', discountValue: 10 };
      } else if (code === 'PRIVILEGE20' || code === 'VIP20' || code === 'OMNIKART20' || code === 'OMNI20') {
        state.promoCode = code;
        state.discountPercent = 20;
        state.appliedCoupon = { code, discountType: 'percentage', discountValue: 20 };
      } else {
        state.promoCode = code;
        state.discountPercent = 0;
        state.appliedCoupon = { code, discountType: 'percentage', discountValue: 0 };
      }
    },
    setAppliedCoupon: (state, action) => {
      const coupon = action.payload?.coupon || action.payload;
      if (!coupon) {
        state.appliedCoupon = null;
        state.promoCode = null;
        state.discountPercent = 0;
        return;
      }
      state.appliedCoupon = coupon;
      state.promoCode = coupon.code ? coupon.code.toUpperCase() : null;
      state.discountPercent = coupon.discountType === 'percentage' ? Number(coupon.discountValue || 0) : 0;
    },
    removePromo: (state) => {
      state.promoCode = null;
      state.discountPercent = 0;
      state.appliedCoupon = null;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.appliedCoupon = null;
      state.promoCode = null;
      state.discountPercent = 0;
      saveCartToStorage([]);
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  toggleCart,
  openCart,
  closeCart,
  applyPromo,
  setAppliedCoupon,
  removePromo,
  setCurrency,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
