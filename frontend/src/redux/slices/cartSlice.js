import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    // Pre-seed with 1 item as shown in the reference Bag (1) or (2)
    {
      id: 'm4m-01',
      name: 'Double-Breasted Cashmere Greatcoat',
      subtitle: 'Onyx Black / 48 (M)',
      price: 980,
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=85',
      size: '48 (M)',
      color: 'Onyx Black',
      quantity: 1
    }
  ],
  isOpen: false,
  currency: 'USD',
  promoCode: null,
  discountPercent: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, size, color, quantity = 1 } = action.payload;
      const selectedSize = size || (product.sizes && product.sizes[0]) || 'Standard';
      const selectedColor = (typeof color === 'string' ? color : color?.name) || (product.colors && product.colors[0]?.name) || 'Classic';
      const selectedImage = (color && color.image) || (product.images && product.images[0]) || product.image;

      const existingIndex = state.items.findIndex(
        item => item.id === product.id && item.size === selectedSize && item.color === selectedColor
      );

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          subtitle: `${selectedColor} / ${selectedSize}`,
          price: product.price,
          image: selectedImage,
          size: selectedSize,
          color: selectedColor,
          quantity: quantity
        });
      }
      state.isOpen = true;
    },
    removeFromCart: (state, action) => {
      const { id, size, color } = action.payload;
      state.items = state.items.filter(
        item => !(item.id === id && item.size === size && item.color === color)
      );
    },
    updateQuantity: (state, action) => {
      const { id, size, color, quantity } = action.payload;
      const item = state.items.find(
        i => i.id === id && i.size === size && i.color === color
      );
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            i => !(i.id === id && i.size === size && i.color === color)
          );
        } else {
          item.quantity = quantity;
        }
      }
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
      const code = action.payload.trim().toUpperCase();
      if (code === 'M4M10' || code === 'WELCOME10') {
        state.promoCode = code;
        state.discountPercent = 10;
      } else if (code === 'PRIVILEGE20' || code === 'VIP20') {
        state.promoCode = code;
        state.discountPercent = 20;
      } else {
        state.promoCode = null;
        state.discountPercent = 0;
      }
    },
    removePromo: (state) => {
      state.promoCode = null;
      state.discountPercent = 0;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
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
  removePromo,
  setCurrency,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
