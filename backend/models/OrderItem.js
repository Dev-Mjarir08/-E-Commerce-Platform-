import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order reference is required']
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Store reference is required']
    },
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
    name: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      default: ''
    },
    sku: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
    },
    trackingNumber: {
      type: String,
      trim: true,
      default: null
    }
  },
  {
    timestamps: true
  }
);

orderItemSchema.index({ order: 1 });
orderItemSchema.index({ store: 1 });
orderItemSchema.index({ product: 1 });

const OrderItem = mongoose.model('OrderItem', orderItemSchema);
export default OrderItem;
