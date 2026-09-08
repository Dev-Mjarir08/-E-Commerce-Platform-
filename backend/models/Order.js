import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    shippingAddress: {
      recipientName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      apartment: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    billingAddress: {
      recipientName: String,
      phone: String,
      street: String,
      apartment: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['stripe', 'paypal', 'cod', 'wallet'],
      default: 'cod'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'placed'
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    taxPrice: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative']
    },
    shippingPrice: {
      type: Number,
      default: 0,
      min: [0, 'Shipping price cannot be negative']
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, 'Discount amount cannot be negative']
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative']
    },
    trackingNumber: {
      type: String,
      trim: true,
      default: null
    },
    notes: {
      type: String,
      trim: true
    },
    deliveredAt: {
      type: Date,
      default: null
    },
    cancelledAt: {
      type: Date,
      default: null
    },
    cancellationReason: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
