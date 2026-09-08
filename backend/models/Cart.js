import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required']
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductVariant',
      default: null
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Store reference is required']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    }
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    guestId: {
      type: String,
      default: null,
      trim: true
    },
    items: [cartItemSchema],
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, 'Discount amount cannot be negative']
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: [0, 'Total amount cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

cartSchema.index({ user: 1 });
cartSchema.index({ guestId: 1 });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
